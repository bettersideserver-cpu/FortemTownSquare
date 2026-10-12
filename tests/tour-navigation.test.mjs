import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const tourURL = new URL('../map/IPX/Subpages/Tower-A/360/Typical.html', import.meta.url);
const retailHTML = readFileSync(tourURL, 'utf8');
const retailJS = readFileSync(new URL('../../../JS/RetailTour.js', tourURL), 'utf8');
const secondTourURL = new URL('../map/IPX/Subpages/Tower-10-12-copy/360/Typical.html', import.meta.url);
const secondHTML = readFileSync(secondTourURL, 'utf8');

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

test('Tower A starts in an existing retail scene and every uploaded-image jumpbar button works', t => {
    const { window, viewer } = runtime(t, retailHTML, retailJS);
    assert.equal(viewer.panorama.src, 'images/cosmetic.webp');
    for (const button of window.document.querySelectorAll('[data-room]:not([data-room="restaurant"])')) {
        button.click();
        assert.equal(viewer.panorama.src, `images/${button.dataset.room}.webp`);
        assert.ok(existsSync(new URL(viewer.panorama.src, tourURL)));
        assert.ok(existsSync(new URL(viewer.panorama.src.replace('.webp', '.jpg'), tourURL)));
        assert.equal(window.document.querySelectorAll('.tour-pill.active').length, 1);
        assert.equal(button.getAttribute('aria-pressed'), 'true');
        assert.equal(window.document.getElementById('cardName').textContent, button.textContent);
        assert.equal(window.document.querySelector('form, #holdOverlay, #hhRequiredVisitorGate'), null);
    }
});

test('Restaurant stays selectable and uses the image filenames reserved for upload', t => {
    const { window, viewer } = runtime(t, retailHTML, retailJS);
    const button = window.document.querySelector('[data-room="restaurant"]');
    assert.equal(button.disabled, false);
    button.click();
    assert.equal(viewer.panorama.src, 'images/restaurant.webp');
    viewer.panorama.dispatchEvent(new window.Event('error'));
    assert.equal(viewer.panorama.src, 'images/restaurant.jpg');
    viewer.panorama.dispatchEvent(new window.Event('error'));
    assert.match(window.document.getElementById('tourStatus').textContent, /could not load/);
    window.document.querySelector('[data-room="men_1"]').click();
    assert.equal(viewer.panorama.src, 'images/men_1.webp');
});

test('Direct scene links, invalid links, and Back remain consistent after rapid jumpbar clicks', t => {
    const { window, viewer } = runtime(t, retailHTML, retailJS, '?room=women_2');
    assert.equal(viewer.panorama.src, 'images/women_2.webp');
    for (const room of ['men_1', 'men_2', 'men_2', 'cosmetic']) window.document.querySelector(`[data-room="${room}"]`).click();
    for (const room of ['men_2', 'men_1', 'women_2']) {
        window.document.getElementById('backBtn').click();
        assert.equal(viewer.panorama.src, `images/${room}.webp`);
    }
    assert.equal(runtime(t, retailHTML, retailJS, '?room=lobby').viewer.panorama.src, 'images/cosmetic.webp');
    assert.equal(runtime(t, retailHTML, retailJS, '?room=constructor').viewer.panorama.src, 'images/cosmetic.webp');
    assert.equal(runtime(t, retailHTML, retailJS, '?room=restaurent').viewer.panorama.src, 'images/restaurant.webp');
});

test('A completed preview loads its full-quality JPG and clears loading feedback', t => {
    const { window, viewer, requestedTextures } = runtime(t, retailHTML, retailJS);
    viewer.panorama.dispatchEvent(new window.Event('load'));
    assert.equal(window.document.getElementById('tourStatus').hidden, true);
    assert.deepEqual(requestedTextures, ['images/cosmetic.jpg']);
});

test('Tower-10-12-copy opens Apple by default and all seven existing scenes work from the jumpbar', t => {
    const { window, viewer } = runtime(t, secondHTML, retailJS);
    assert.equal(viewer.panorama.src, 'images/apple.webp');
    for (const button of window.document.querySelectorAll('[data-room]:not([data-room="pan"])')) {
        button.click();
        assert.equal(viewer.panorama.src, `images/${button.dataset.room}.webp`);
        assert.ok(existsSync(new URL(viewer.panorama.src, secondTourURL)));
        assert.ok(existsSync(new URL(viewer.panorama.src.replace('.webp', '.jpg'), secondTourURL)));
        assert.equal(window.document.querySelectorAll('.tour-pill.active').length, 1);
        assert.equal(window.document.getElementById('cardName').textContent, button.textContent);
    }
    window.document.getElementById('backBtn').click();
    assert.equal(viewer.panorama.src, 'images/tea.webp');
    assert.equal(runtime(t, secondHTML, retailJS, '?room=cafe').viewer.panorama.src, 'images/cafe.webp');
    assert.equal(runtime(t, secondHTML, retailJS, '?room=lobby').viewer.panorama.src, 'images/apple.webp');
});

test('Pan Area stays selectable for a future upload and a missing image does not block other scenes', t => {
    const { window, viewer } = runtime(t, secondHTML, retailJS);
    const button = window.document.querySelector('[data-room="pan"]');
    assert.equal(button.disabled, false);
    button.click();
    assert.equal(viewer.panorama.src, 'images/pan.webp');
    viewer.panorama.dispatchEvent(new window.Event('error'));
    assert.equal(viewer.panorama.src, 'images/pan.jpg');
    viewer.panorama.dispatchEvent(new window.Event('error'));
    window.document.querySelector('[data-room="apple"]').click();
    assert.equal(viewer.panorama.src, 'images/apple.webp');
});

for (const route of ['9-12-Typical/Typical.html']) {
    test(`${route}: anonymous visitors can use jumpbar, hotspots and balcony floors without forms`, t => {
        const html = readFileSync(new URL(`../map/IPX/Subpages/${route}`, import.meta.url), 'utf8');
        const parsed = new JSDOM(html);
        const script = [...parsed.window.document.scripts].find(s => s.textContent.includes('new PANOLENS.Viewer(')).textContent;
        parsed.window.close();
        const { window, viewer, flush } = runtime(t, html, script);
        const initial = viewer.panorama;
        window.goToRoom('kitchen'); flush();
        assert.notEqual(viewer.panorama, initial);
        window.goToRoom('lobby'); flush();
        initial.children[0].dispatchEvent(new window.Event('click')); flush();
        assert.notEqual(viewer.panorama, initial);
        window.goToRoom('balcony', null, 'B'); flush();
        const select = window.document.getElementById('balconyFloorSelect');
        select.value = '10'; select.dispatchEvent(new window.Event('change')); flush();
        assert.equal(viewer.panorama.userData.balconyFloor, 10);
        assert.equal(window.document.querySelector('form, #holdOverlay, #holdRequestBtn, #hhRequiredVisitorGate'), null);
    });
}
