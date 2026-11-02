import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { JSDOM } from 'jsdom';

for (const folder of ['Tower-A-1','Tower-A-2','Tower-B','Tower-B - 1','Tower-B - 2','Tower-C','Tower-C - 1','Tower-C - 2']) {
    test(`${folder}: direct links, shop selection, individual hotspots and one viewer`, t => {
        const base = new URL(`../map/IPX/Subpages/${folder}/360/`, import.meta.url);
        const html = readFileSync(new URL('Typical.html', base), 'utf8');
        const source = readFileSync(new URL('tour.js', base), 'utf8');
        const scenes = JSON.parse(source.match(/const scenes = (\{[\s\S]*?\n\s*\});/)[1]);
        const spots = JSON.parse(source.match(/const balconyHotspots = (\{[\s\S]*?\n\s*\});/)[1]);
        assert.doesNotMatch(html, /src="[^\"]*RetailTour\.js/);
        assert.equal((html.match(/src="tour\.js\?/g) || []).length, 1);
        const initial = runtime(t, html, source);
        assert.ok(existsSync(new URL(initial.viewer.panorama.src, base)), 'Default scene exists');
        for (const [room, scene] of Object.entries(scenes)) {
            const { window, viewer } = runtime(t, html, source, `?room=${room}`);
            assert.equal(viewer.panorama.src, `images/${scene.image}.webp`);
            assert.equal(window.document.querySelectorAll('.tour-pill.active').length, 1);
            assert.equal(viewer.panorama.children.length, spots[room].length);
            if (room.endsWith('_Balcony')) {
                assert.equal(window.document.querySelector(`[data-room="${room}"]`), null);
                assert.ok(existsSync(new URL(viewer.panorama.src, base)));
            }
            for (const [i, spot] of spots[room].entries()) {
                const direct = runtime(t, html, source, `?room=${room}`);
                direct.viewer.panorama.children[i].dispatchEvent(new direct.window.Event('click'));
                assert.equal(direct.viewer.panorama.src, `images/${scenes[spot.target || room].image}.webp`);
            }
        }
    });
}
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

