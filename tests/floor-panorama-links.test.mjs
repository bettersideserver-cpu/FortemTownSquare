import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { runInNewContext } from 'node:vm';

for (const tower of ['A', 'B', 'C']) {
    test(`Tower ${tower}: room clicks open the matching floor tour with correct context`, t => {
        for (const floor of [0, 1, 2]) {
            const file = new URL(`../map/IPX/Subpages/Floor/Tower-${tower}F${floor || ''}.html`, import.meta.url);
            const folder = `Tower-${tower}${floor ? (tower === 'A' ? '-' : ' - ') + floor : ''}`;
            const tourSource = readFileSync(new URL(`../${folder}/360/tour.js`, file), 'utf8');
            const sceneDefinition = tourSource.match(/const scenes = (\{[\s\S]*?\n\s*\});/)[1];
            const scenes = runInNewContext('(' + sceneDefinition + ')');
            const dom = new JSDOM(readFileSync(file, 'utf8'), {
                url: `https://example.test/map/IPX/Subpages/Floor/Tower-${tower}F${floor || ''}.html?floor=32`,
                runScripts: 'outside-only'
            });
            t.after(() => dom.window.close());
            const { window } = dom;
            window.sessionStorage.setItem('fortmenTownsquareFloor', '24');
            const script = [...window.document.scripts].find(el => el.textContent.includes('Assign page links to other SVG paths'));
            assert.ok(script);
            window.eval(script.textContent.replace('window.location.href = url.href;', 'window.destination = url.href;'));
            window.dispatchEvent(new window.Event('DOMContentLoaded'));
            const hotspots = window.document.querySelectorAll('.Cutout path[data-page-link]');
            assert.ok(hotspots.length);
            for (const hotspot of hotspots) {
                hotspot.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
                const target = new URL(window.destination);
                assert.equal(decodeURIComponent(target.pathname), `/map/IPX/Subpages/${folder}/360/Typical.html`);
                assert.equal(target.searchParams.get('tower'), tower);
                assert.equal(target.searchParams.get('floor'), String(floor + 1));
                const original = new URL(hotspot.getAttribute('data-page-link'), window.location.href);
                assert.equal(target.searchParams.get('room'), original.searchParams.get('room'));
                if (hotspot.hasAttribute('data-dimensions')) {
                    const room = target.searchParams.get('room');
                    assert.ok(Object.hasOwn(scenes, room), `${hotspot.id} must open a defined interior scene, got ${room}`);
                    assert.ok(!room.endsWith('_Balcony'));
                    if (/salon/i.test(hotspot.id)) assert.equal(room, 'salon');
                    if (/game zone/i.test(hotspot.id)) assert.equal(room, 'game');
                    if (hotspot.id === 'Oud') assert.equal(room, 'udd');
                }
                assert.ok(existsSync(new URL(`../${folder}/360/Typical.html`, file)));
            }
            for (const shop of window.document.querySelectorAll('path[data-dimensions]')) {
                if (/reserved/i.test(shop.id)) continue;
                assert.ok(shop.hasAttribute('data-page-link'), `${shop.id} must have an interior link`);
            }
        }
    });
}
