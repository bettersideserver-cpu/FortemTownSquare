import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const root = new URL('../map/IPX/Subpages/Floor/', import.meta.url);
const shared = readFileSync(new URL('available-toggle.js', root), 'utf8');
const tooltip = readFileSync(new URL('shop-hover-details.js', root), 'utf8');

for (const tower of ['A', 'B', 'C']) {
    test(`Tower ${tower}: every shop shows editable dimensions and area in one tooltip`, t => {
        for (const floor of ['', '1', '2']) {
            const html = readFileSync(new URL(`Tower-${tower}F${floor}.html`, root), 'utf8');
            const dom = new JSDOM(html, { url: `https://example.test/Tower-${tower}F${floor}.html`, runScripts: 'outside-only' });
            t.after(() => dom.window.close());
            const { window } = dom;
            const doc = window.document;
            assert.ok(doc.body.hasAttribute('data-shop-details'));
            assert.ok(doc.querySelector('script[src="shop-hover-details.js?v=1"]'));
            assert.ok(!html.includes("tooltip.id = 'availableOffTooltip'"));
            window.eval(shared);
            window.eval(tooltip);
            const apartmentTooltip = [...doc.scripts].find(script => script.textContent.includes("const bhk = path.getAttribute('data-bhk')"));
            if (apartmentTooltip) window.eval(apartmentTooltip.textContent);
            doc.dispatchEvent(new window.Event('DOMContentLoaded'));
            const tip = doc.getElementById('shopDetailsTooltip');
            assert.ok(tip.hidden);
            assert.equal(doc.querySelectorAll('#hhRoomTooltip, #availableOffTooltip').length, 0);
            const shops = doc.querySelectorAll('#availableOffLayer path[id]');
            assert.ok(shops.length);
            for (const shop of shops) {
                assert.equal(shop.dataset.dimensions, 'XX ft x XX ft');
                assert.equal(shop.dataset.area, 'XXXX sq ft');
                shop.dispatchEvent(new window.MouseEvent('pointerenter', { clientX: 100, clientY: 100 }));
                shop.dispatchEvent(new window.MouseEvent('mouseenter', { clientX: 100, clientY: 100 }));
                assert.equal(tip.hidden, false);
                assert.equal(doc.querySelectorAll('#aptTooltip.visible').length, 0);
                assert.ok(tip.textContent.includes('L \u00d7 B: XX ft x XX ft'));
                assert.ok(tip.textContent.includes('Total area: XXXX sq ft'));
                shop.dispatchEvent(new window.MouseEvent('pointerleave'));
                assert.equal(tip.hidden, true);
            }
            const shop = shops[0];
            shop.dataset.dimensions = '20 ft x 30 ft';
            shop.dataset.area = '600 sq ft';
            shop.dispatchEvent(new window.MouseEvent('pointerenter'));
            assert.ok(tip.textContent.includes('L \u00d7 B: 20 ft x 30 ft'));
            assert.ok(tip.textContent.includes('Total area: 600 sq ft'));
            window.dispatchEvent(new window.PageTransitionEvent('pagehide', { persisted: true }));
            assert.equal(tip.hidden, true);
        }
    });
}
