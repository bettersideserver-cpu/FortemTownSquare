import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const base = new URL('../map/IPX/Subpages/Floor/', import.meta.url);
const source = readFileSync(new URL('available-toggle.js', base), 'utf8')
    .replaceAll('location.href = u.href;', 'window.destination = u.href;');
const labels = ['GROUND FLOOR', 'FIRST FLOOR', 'SECOND FLOOR'];

for (const tower of ['A', 'B', 'C']) {
    test(`Tower ${tower}: all three plans offer and open the matching floor files`, t => {
        for (let current = 0; current < 3; current++) {
            const file = `Tower-${tower}F${current || ''}.html`;
            const html = readFileSync(new URL(file, base), 'utf8');
            const dom = new JSDOM(html, {
                url: `https://example.test/preview/map/IPX/Subpages/Floor/${file}?floor=32&tower=12A`,
                runScripts: 'outside-only'
            });
            t.after(() => dom.window.close());
            const { window } = dom;
            window.sessionStorage.setItem('selectedFloor', '24');
            window.eval(source);
            window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
            const doc = window.document;
            assert.equal(doc.getElementById('hhFloorLabel').textContent, labels[current]);
            assert.equal(window.sessionStorage.getItem('selectedFloor'), String(current + 1));
            assert.equal(window.sessionStorage.getItem('selectedTower'), tower);
            const options = [...doc.querySelectorAll('.hhFloorOption')];
            assert.deepEqual(options.map(option => option.textContent), labels);
            assert.equal(options[current].getAttribute('aria-selected'), 'true');
            assert.ok(existsSync(new URL(doc.getElementById('mainImage').getAttribute('src'), base)));
            doc.getElementById('hhFloorSelect').click();
            assert.equal(doc.getElementById('hhFloorMenu').hidden, false);
            options.forEach((option, index) => {
                option.click();
                const target = new URL(window.destination);
                const targetFile = `Tower-${tower}F${index || ''}.html`;
                assert.ok(target.pathname.endsWith('/' + targetFile));
                assert.ok(existsSync(new URL(targetFile, base)));
                assert.equal(target.searchParams.get('tower'), tower);
                assert.equal(target.searchParams.get('floor'), String(index + 1));
            });
        }
    });
}
