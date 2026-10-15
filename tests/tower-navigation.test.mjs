import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const source = readFileSync(new URL('../map/IPX/JS/CutoutPath.js', import.meta.url), 'utf8')
    .replace('window.location.href = target.href;', 'window.destination = target.href;');
const tooltipSource = readFileSync(new URL('../map/IPX/JS/FloorTIP.js', import.meta.url), 'utf8');

function page(t, html, file = 'Tower_B.html') {
    const dom = new JSDOM(html, {
        url: `https://example.test/preview/map/IPX/Subpages/${file}`,
        runScripts: 'outside-only'
    });
    t.after(() => dom.window.close());
    dom.window.eval(source);
    return dom.window;
}

for (const tower of ['A', 'B', 'C']) {
    test(`Tower ${tower}: every active SVG floor opens its existing plan with correct context`, t => {
        const file = `Tower_${tower}.html`;
        const fileURL = new URL(`../map/IPX/Subpages/${file}`, import.meta.url);
        const window = page(t, readFileSync(fileURL, 'utf8'), file);
        const paths = window.document.querySelectorAll('.Cutout path[data-link]');
        assert.equal(paths.length, 3);
        for (const path of paths) {
            path.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
            const target = new URL(window.destination);
            const floor = String(Number(path.getAttribute('floorNumber') || path.getAttribute('floornumber')));
            const suffix = floor === '1' ? '' : String(Number(floor) - 1);
            assert.equal(path.getAttribute('data-name'), ['Ground Floor', 'First Floor', 'Second Floor'][Number(floor) - 1]);
            assert.equal(path.getAttribute('data-link'), `Floor/Tower-${tower}F${suffix}.html`);
            assert.equal(target.pathname, `/preview/map/IPX/Subpages/Floor/Tower-${tower}F${suffix}.html`);
            assert.equal(target.searchParams.get('floor'), floor);
            assert.equal(target.searchParams.get('tower'), tower);
            assert.equal(window.sessionStorage.getItem('selectedTower'), tower);
            assert.equal(window.sessionStorage.getItem('selectedFloor'), floor);
            assert.equal(window.document.querySelectorAll('.Cutout path.selected').length, 1);
            assert.ok(existsSync(new URL(`Floor/Tower-${tower}F${suffix}.html`, fileURL)));
        }
    });
}

test('Numeric and 12A plans keep the displayed floor and existing query parameters', t => {
    for (const [filename, tower] of [['Tower-12.html', '12'], ['Tower-C-12-A.html', '12A']]) {
        const window = page(t, `<div class="Cutout"><svg><path data-name="${tower}_Floor_24" floorNumber="09" data-link="Floor/${filename}?unit=2#plan" /></svg></div>`);
        window.document.querySelector('path').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
        const target = new URL(window.destination);
        assert.equal(target.searchParams.get('tower'), tower);
        assert.equal(target.searchParams.get('floor'), '24');
        assert.equal(target.searchParams.get('unit'), '2');
        assert.equal(target.hash, '#plan');
    }
});

test('Returning to a cached tower clears the floor highlight and tooltip and allows another choice', t => {
    const window = page(t, `<div id="floorTip" aria-hidden="true"></div>
        <div class="Cutout"><svg>
        <path data-name="Floor_1" data-link="Floor/Tower-BF.html" />
        <path data-name="Floor_2" data-link="Floor/Tower-BF.html" />
        </svg></div>`);
    window.eval(tooltipSource);
    window.dispatchEvent(new window.Event('DOMContentLoaded'));
    const [first, second] = window.document.querySelectorAll('.Cutout path');
    const tip = window.document.getElementById('floorTip');

    for (const event of ['pagehide', 'pageshow']) {
        first.dispatchEvent(new window.MouseEvent('mouseenter', { clientX: 100, clientY: 100 }));
        first.dispatchEvent(new window.MouseEvent('click'));
        assert.ok(first.classList.contains('selected'));
        assert.equal(tip.getAttribute('aria-hidden'), 'false');

        window.dispatchEvent(new window.PageTransitionEvent(event, { persisted: true }));
        assert.equal(window.document.querySelectorAll('.Cutout path.selected').length, 0);
        assert.equal(tip.classList.contains('is-visible'), false);
        assert.equal(tip.getAttribute('aria-hidden'), 'true');
        assert.equal(window.sessionStorage.getItem('selectedFloor'), '1');
    }

    second.dispatchEvent(new window.MouseEvent('mouseenter', { clientX: 100, clientY: 100 }));
    assert.equal(tip.textContent, 'Floor_2');
    assert.equal(tip.getAttribute('aria-hidden'), 'false');
    second.dispatchEvent(new window.MouseEvent('click'));
    assert.equal(new URL(window.destination).searchParams.get('floor'), '2');
});
