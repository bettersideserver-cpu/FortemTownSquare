/* FortmenTownsquare — Tower A retail tour. */
(() => {
    'use strict';
    const scenes = {
        restaurant: { name: 'restaurant', image: 'restaurant' },
       cosmetic: { name: 'cosmetic', image: 'cosmetic' },
      men_1: { name: 'men_1', image: 'men_1' },
        men_2: { name: 'men_2', image: 'men_2' },
         women_1: { name: 'women_1', image: 'women_1' },
          women_2: { name: 'women_2', image: 'women_2' },




            AG_1_Balcony: { name: 'AG_1_Balcony', image: 'AG_1_Balcony' },
            AG_2_Balcony: { name: 'AG_2_Balcony', image: 'AG_2_Balcony' },
               AG_4_Balcony: { name: 'AG_4_Balcony', image: 'AG_4_Balcony' },
                  AG_5_Balcony: { name: 'AG_5_Balcony', image: 'AG_5_Balcony' },
                   AG_6_Balcony: { name: 'AG_6_Balcony', image: 'AG_6_Balcony' },
                   AG_7_Balcony: { name: 'AG_7_Balcony', image: 'AG_7_Balcony' },




         //Balcony
        //  w: { name: 'western_1', image: 'western_1' },
     
    };
    // MANUAL HOTSPOTS: edit x/y/z to position each marker inside its balcony 360.
    // These are placeholder positions. 'target' is the scene opened on click.
    // Add more objects to a scene's array for additional hotspots, or use [] for none.
    const balconyHotspots = {
        // Interior 360 buttons: set each target and x/y/z independently.
        restaurant: [{ label: '360° — Anchor Restaurant balcony', target: 'AG_1_Balcony', x: 5000, y: 0, z: 0 }],
        cosmetic: [{ label: '360° — Cosmetic-Hub balcony', target: 'AG_2_Balcony', x: 5000, y: 0, z: 0 }],
        men_1: [{ label: '360° — Retail Men 1 balcony', target: 'AG_4_Balcony', x: 5000, y: 0, z: 0 }],
        men_2: [{ label: '360° — Retail Men 2 balcony', target: 'AG_5_Balcony', x: 5000, y: 0, z: 0 }],
        women_1: [{ label: '360° — Retail Women 1 balcony', target: 'AG_6_Balcony', x: 5000, y: 0, z: 0 }],
        women_2: [{ label: '360° — Retail Women 2 balcony', target: 'AG_7_Balcony', x: 5000, y: 0, z: 0 }],
        AG_1_Balcony: [{ label: 'Enter Anchor Restaurant', target: 'restaurant', x: 5000, y: 0, z: 0 }],
        AG_2_Balcony: [{ label: 'Enter Cosmetic-Hub', target: 'cosmetic', x: 5000, y: 0, z: 0 }],
        AG_4_Balcony: [{ label: 'Enter Retail Men 1', target: 'men_1', x: 5000, y: 0, z: 0 }],
        AG_5_Balcony: [{ label: 'Enter Retail Men 2', target: 'men_2', x: 5000, y: 0, z: 0 }],
        AG_6_Balcony: [{ label: 'Enter Retail Women 1', target: 'women_1', x: 5000, y: 0, z: 0 }],
        AG_7_Balcony: [{ label: 'Enter Retail Women 2', target: 'women_2', x: 5000, y: 0, z: 0 }]
    };
    const params = new URLSearchParams(location.search);
    const status = document.getElementById('tourStatus');
    const pills = [...document.querySelectorAll('.tour-pill[data-room]')];
    const hasScene = room => Object.hasOwn(scenes, room);
    let currentRoom = '';
    const roomHistory = [];
    let viewer;

    function showStatus(message) {
        status.textContent = message;
        status.hidden = !message;
    }
    document.getElementById('floorMapBtn').addEventListener('click', () => {
        const destination = new URL('../../Floor/Tower-AF.html', location.href);
        for (const key of ['floor', 'unit']) {
            const value = params.get(key) || sessionStorage.getItem(key === 'floor' ? 'selectedFloor' : 'selectedUnit');
            if (value) destination.searchParams.set(key, value);
        }
        destination.searchParams.set('tower', 'A');
        location.href = destination.href;
    });
    document.getElementById('backBtn').addEventListener('click', () => {
        if (roomHistory.length > 1) {
            roomHistory.pop();
            goToRoom(roomHistory.at(-1), false);
        } else if (history.length > 1) {
            history.back();
        } else {
            location.href = '../../Tower_A.html';
        }
    });
    const nav = document.getElementById('tourNav');
    const left = document.getElementById('scrollArrowLeft');
    const right = document.getElementById('scrollArrow');
    function updateArrows() {
        left.classList.toggle('hidden', nav.scrollLeft <= 6);
        right.classList.toggle('hidden', nav.scrollLeft + nav.clientWidth >= nav.scrollWidth - 6);
    }
    for (const [button, direction] of [[left, -1], [right, 1]]) {
        button.addEventListener('click', () => nav.scrollBy({ left: direction * Math.max(220, nav.clientWidth * 0.55), behavior: 'smooth' }));
    }
    nav.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    window.addEventListener('load', updateArrows);
    requestAnimationFrame(updateArrows);

    try {
        viewer = new PANOLENS.Viewer({ container: document.getElementById('viewer'), controlBar: false });
    } catch (error) {
        showStatus('The 360° viewer could not start. Please reload with WebGL enabled.');
        console.error('Unable to start the Tower A tour:', error);
        return;
    }
    viewer.camera.fov = 100;
    viewer.camera.updateProjectionMatrix();
    const panoramas = {};
    for (const [key, scene] of Object.entries(scenes)) {
        const panorama = new PANOLENS.ImagePanorama(`images/${scene.image}.webp`);
        panorama.fadeDuration = 400;
        let usingJpg = false;
        let upgrading = false;
        panorama.addEventListener('error', () => {
            if (!usingJpg) {
                usingJpg = true;
                panorama.load(`images/${scene.image}.jpg`);
            } else if (currentRoom === key) {
                showStatus(`${scene.name} could not load. Please choose another view or reload.`);
            }
        });
        panorama.addEventListener('load', () => {
            if (currentRoom === key) showStatus('');
            if (usingJpg || upgrading) return;
            upgrading = true;
            new THREE.TextureLoader().load(`images/${scene.image}.jpg`, texture => {
                if (!panorama.material) { texture.dispose(); return; }
                const preview = panorama.material.map;
                if (preview) {
                    for (const property of ['encoding', 'flipY', 'wrapS', 'wrapT', 'minFilter', 'magFilter', 'anisotropy']) {
                        texture[property] = preview[property];
                    }
                }
                texture.needsUpdate = true;
                panorama.material.map = texture;
                panorama.material.needsUpdate = true;
                preview?.dispose();
            }, undefined, () => { /* Keep the WebP preview if the JPG is unavailable. */ });
        });
        panoramas[key] = panorama;
        viewer.add(panorama);
    }
    const hotspotIcon = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><circle cx="64" cy="64" r="59" fill="#2F4539" stroke="#d9c89f" stroke-width="3"/><text x="64" y="68" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="34" fill="white">360°</text><path d="M35 84 Q64 105 93 84 M84 84 H93 V93" fill="none" stroke="#d9c89f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    );
    for (const [room, hotspots] of Object.entries(balconyHotspots)) {
        for (const { label, target, x, y, z } of hotspots) {
            if (!hasScene(target)) continue;
            const hotspot = new PANOLENS.Infospot(300, hotspotIcon);
            hotspot.position.set(x, y, z);
            hotspot.addHoverText(label);
            hotspot.addEventListener('click', () => goToRoom(target));
            panoramas[room].add(hotspot);
        }
    }
    function goToRoom(room, remember = true) {
        if (!hasScene(room) || room === currentRoom) return;
        currentRoom = room;
        if (remember) roomHistory.push(room);
        const panorama = panoramas[room];
        showStatus(panorama.loaded ? '' : `Loading ${scenes[room].name}…`);
        viewer.setPanorama(panorama);
        viewer.tweenControlCenter(new THREE.Vector3(5000, 0, 0), 0);
        viewer.camera.fov = 100;
        viewer.camera.updateProjectionMatrix();
        document.getElementById('cardName').textContent = scenes[room].name;
        document.getElementById('roomInfoCard').classList.add('visible');
        // Balcony views belong to the same shop as their interior panorama.
        const shopRoom = ({
            AG_1_Balcony: 'restaurant', AG_2_Balcony: 'cosmetic',
            AG_4_Balcony: 'men_1', AG_5_Balcony: 'men_2',
            AG_6_Balcony: 'women_1', AG_7_Balcony: 'women_2'
        })[room] || room;
        for (const pill of pills) {
            const active = pill.dataset.room === shopRoom;
            pill.classList.toggle('active', active);
            pill.setAttribute('aria-pressed', String(active));
        }
        window.FortmenTownsquareAnalytics?.trackRoom(room, { tower: 'A' });
        window.dispatchEvent(new CustomEvent('fortmen-townsquare:panorama-change', { detail: { room, tower: 'A' } }));
    }
    for (const pill of pills) pill.addEventListener('click', () => goToRoom(pill.dataset.room));
    const requestedRoom = params.get('room') === 'restaurent' ? 'restaurant' : params.get('room');
    goToRoom(hasScene(requestedRoom) ? requestedRoom : 'cosmetic');
})();
