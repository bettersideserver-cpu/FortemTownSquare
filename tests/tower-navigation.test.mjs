import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const source = readFileSync(new URL('../map/IPX/JS/CutoutPath.js', import.meta.url), 'utf8')
    .replace('window.location.href = target.href;', 'window.destination = target.href;');

function page(t, html, file = 'Tower_B.html') {
    const dom = new JSDOM(html, {
        url: `https://example.test/preview/map/IPX/Subpages/${file}`,
        runScripts: 'outside-only'
    });
    t.after(() => dom.window.close());
    dom.window.eval(source);
    return dom.window;
}

for (const tower of ['B', 'C']) {
    test(`Tower ${tower}: every active SVG floor opens its existing plan with correct context`, t => {
        const file = `Tower_${tower}.html`;
        const fileURL = new URL(`../map/IPX/Subpages/${file}`, import.meta.url);
        const window = page(t, readFileSync(fileURL, 'utf8'), file);
        const paths = window.document.querySelectorAll('.Cutout path[data-link]');
        assert.equal(paths.length, 3);
        for (const path of paths) {
            path.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
            const target = new URL(window.destination);
            assert.equal(target.pathname, `/preview/map/IPX/Subpages/Floor/Tower-${tower}F.html`);
            const floor = path.getAttribute('data-name').match(/Floor_(\d+)/)[1];
            assert.equal(target.searchParams.get('floor'), floor);
            assert.equal(target.searchParams.get('tower'), tower);
            assert.equal(window.sessionStorage.getItem('selectedTower'), tower);
            assert.equal(window.sessionStorage.getItem('selectedFloor'), floor);
            assert.equal(window.document.querySelectorAll('.Cutout path.selected').length, 1);
            assert.ok(existsSync(new URL(path.getAttribute('data-link'), fileURL)));
        }
    });
}

test('Numeric and 12A plans keep the displayed floor and existing query parameters', t => {
    for (const [filename, tower] of [['Tower-12.html', '12'], ['Tower-C-12-A.html', '12A'], ['Tower-AF.html', 'A']]) {
        const window = page(t, `<div class="Cutout"><svg><path data-name="${tower}_Floor_24" floorNumber="09" data-link="Floor/${filename}?unit=2#plan" /></svg></div>`);
        window.document.querySelector('path').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
        const target = new URL(window.destination);
        assert.equal(target.searchParams.get('tower'), tower);
        assert.equal(target.searchParams.get('floor'), '24');
        assert.equal(target.searchParams.get('unit'), '2');
        assert.equal(target.hash, '#plan');
    }
});
