import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const tourURL = new URL('../map/IPX/Subpages/Tower-A/360/Typical.html', import.meta.url);
const retailHTML = readFileSync(tourURL, 'utf8');
test('Tower A loads only its own panorama controller', () => {
    assert.doesNotMatch(retailHTML, /src="[^\"]*RetailTour\.js/);
    assert.equal((retailHTML.match(/src="tour\.js(?:\?[^\"]*)?"/g) || []).length, 1);
});
function runtime(t, html, source, query = '') {
    const dom = new JSDOM(html, { url: `https://example.test/map/IPX/Subpages/Tower-A/360/Typical.html${query}`, runScripts: 'outside-only' });
    t.after(() => dom.window.close());
    const { window } = dom;
    const timers = [];
    window.setTimeout = callback => timers.push(callback);
    window.requestAnimationFrame = callback => timers.push(callback);
    window.HTMLElement.prototype.scrollBy = function () {};
    let viewer;
    const panoramas = [], requestedTextures = [];
    class Panorama extends window.EventTarget {
        constructor(src) { super(); this.src = src; this.children = []; this.userData = {}; this.position = { set() {} }; panoramas.push(this); }
        add(child) { this.children.push(child); }
        addHoverText() {}
        load(src) { this.src = src; }
    }
    window.PANOLENS = {
        ImagePanorama: Panorama, Infospot: Panorama,
        Viewer: class {
            constructor() { viewer = this; this.camera = { fov: 100, updateProjectionMatrix() {} }; }
            add() {} remove() {}
            setPanorama(panorama) { assert.ok(panorama, 'Every selected scene must exist'); this.panorama = panorama; }
            tweenControlCenter() {}
        }
    };
    window.THREE = {
        MathUtils: { degToRad: value => value * Math.PI / 180 }, Vector3: class {},
        TextureLoader: class { load(src) { requestedTextures.push(src); } }
    };
    window.eval(source);
    const flush = () => { let budget = 1000; while (timers.length) { assert.ok(budget-- > 0); timers.shift()(); } };
    flush();
    return { window, viewer, panoramas, requestedTextures, flush };
}

test('Tower A balcony direct links load existing images without bottom-bar entries and hotspots open interiors', t => {
    const source = readFileSync(new URL('tour.js', tourURL), 'utf8');
    const rooms = { AG_1_Balcony: 'restaurant', AG_2_Balcony: 'cosmetic', AG_4_Balcony: 'men_1', AG_5_Balcony: 'men_2', AG_6_Balcony: 'women_1', AG_7_Balcony: 'women_2' };
    for (const [room, target] of Object.entries(rooms)) {
        const { window, viewer } = runtime(t, retailHTML, source, `?room=${room}`);
        assert.equal(viewer.panorama.src, `images/${room}.webp`);
        assert.ok(existsSync(new URL(viewer.panorama.src, tourURL)));
        assert.ok(existsSync(new URL(`images/${room}.jpg`, tourURL)));
        assert.equal(window.document.querySelector(`[data-room="${room}"]`), null);
        assert.equal(window.document.querySelectorAll('.tour-pill.active').length, 1);
        assert.equal(window.document.querySelector('.tour-pill.active').dataset.room, target);
        assert.equal(window.document.querySelector('.tour-pill.active').getAttribute('aria-pressed'), 'true');
        assert.equal(viewer.panorama.children.length, 1);
        viewer.panorama.children[0].dispatchEvent(new window.Event('click'));
        assert.equal(viewer.panorama.src, `images/${target}.webp`);
        assert.ok(existsSync(new URL(viewer.panorama.src, tourURL)));
        assert.equal(viewer.panorama.children.length, 1);
        viewer.panorama.children[0].dispatchEvent(new window.Event('click'));
        assert.equal(viewer.panorama.src, `images/${room}.webp`);
        viewer.panorama.children[0].dispatchEvent(new window.Event('click'));
        assert.equal(viewer.panorama.src, `images/${target}.webp`);
        window.document.getElementById('backBtn').click();
        assert.equal(viewer.panorama.src, `images/${room}.webp`);
        assert.equal(window.document.querySelector('.tour-pill.active').dataset.room, target);
    }
});

