/* FortmenTownsquare — Tower B retail tour. */
(() => {
    'use strict';
    const scenes = {
        "apple": {
                "name": "Apple Store/ Sports MBD",
                "image": "apple"
        },
        "skincare": {
                "name": "Women's Skincare",
                "image": "skincare"
        },
        "cafe": {
                "name": "Cafe",
                "image": "cafe"
        },
        "pizza": {
                "name": "Pizza Express",
                "image": "pizza"
        },
        "udd": {
                "name": "Oud Store",
                "image": "udd"
        },
        "sunglass": {
                "name": "Sunglass Store",
                "image": "sunglass"
        },
        "south": {
                "name": "South Indian",
                "image": "south"
        },
        "tea": {
                "name": "Tea",
                "image": "tea"
        },
        "pan": {
                "name": "Pan Area",
                "image": "pan"
        },
        "north": {
                "name": "North Indian",
                "image": "north"
        },
        "BG_8_Balcony": {
                "name": "Apple Store/ Sports MBD — Balcony",
                "image": "BG_8_Balcony"
        },
        "BG_9_Balcony": {
                "name": "Women's Skincare — Balcony",
                "image": "BG_9_Balcony"
        },
        "BG_10_Balcony": {
                "name": "Cafe — Balcony",
                "image": "BG_10_Balcony"
        },
        "BG_11_Balcony": {
                "name": "Oud Store — Balcony",
                "image": "BG_11_Balcony"
        },
        "BG_12_Balcony": {
                "name": "Pizza Express — Balcony",
                "image": "BG_12_Balcony"
        },
        "BG_13_Balcony": {
                "name": "Sunglass Store — Balcony",
                "image": "BG_13_Balcony"
        },
        "BG_14_Balcony": {
                "name": "South Indian — Balcony",
                "image": "BG_14_Balcony"
        },
        "BG_15_Balcony": {
                "name": "Tea — Balcony",
                "image": "BG_15_Balcony"
        },
        "BG_16_Balcony": {
                "name": "Pan Area — Balcony",
                "image": "BG_16_Balcony"
        },
        "BG_17_Balcony": {
                "name": "North Indian — Balcony",
                "image": "BG_17_Balcony"
        }
};
    // MANUAL HOTSPOTS: edit x/y/z to position each marker inside its balcony 360.
    // These are placeholder positions. 'target' is the scene opened on click.
    // Add more objects to a scene's array for additional hotspots, or use [] for none.
    // Edit target (scene ID), or href (page URL), and x/y/z for each button.
    // #360- links are placeholders until you replace them.
    const balconyHotspots = {
        "apple": [
                {
                        "label": "360° — Apple Store/ Sports MBD — Balcony",
                        "target": "BG_8_Balcony",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ],
        "skincare": [
                {
                        "label": "360° — Women's Skincare — Balcony",
                        "target": "BG_9_Balcony",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ],
        "cafe": [
                {
                        "label": "360° — Cafe — Balcony",
                        "target": "BG_10_Balcony",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ],
        "pizza": [
                {
                        "label": "360° — Pizza Express — Balcony",
                        "target": "BG_12_Balcony",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ],
        "udd": [
                {
                        "label": "360° — Oud Store — Balcony",
                        "target": "BG_11_Balcony",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ],
        "sunglass": [
                {
                        "label": "360° — Sunglass Store — Balcony",
                        "target": "BG_13_Balcony",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ],
        "south": [
                {
                        "label": "360° — South Indian — Balcony",
                        "target": "BG_14_Balcony",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ],
        "tea": [
                {
                        "label": "360° — Tea — Balcony",
                        "target": "BG_15_Balcony",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ],
        "pan": [
                {
                        "label": "360° — Pan Area — Balcony",
                        "target": "BG_16_Balcony",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ],
        "north": [
                {
                        "label": "360° — North Indian — Balcony",
                        "target": "BG_17_Balcony",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ],
        "BG_8_Balcony": [
                {
                        "label": "360° — Apple Store/ Sports MBD",
                        "target": "apple",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ],
        "BG_9_Balcony": [
                {
                        "label": "360° — Women's Skincare",
                        "target": "skincare",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ],
        "BG_10_Balcony": [
                {
                        "label": "360° — Cafe",
                        "target": "cafe",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ],
        "BG_11_Balcony": [
                {
                        "label": "360° — Oud Store",
                        "target": "udd",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ],
        "BG_12_Balcony": [
                {
                        "label": "360° — Pizza Express",
                        "target": "pizza",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ],
        "BG_13_Balcony": [
                {
                        "label": "360° — Sunglass Store",
                        "target": "sunglass",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ],
        "BG_14_Balcony": [
                {
                        "label": "360° — South Indian",
                        "target": "south",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ],
        "BG_15_Balcony": [
                {
                        "label": "360° — Tea",
                        "target": "tea",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ],
        "BG_16_Balcony": [
                {
                        "label": "360° — Pan Area",
                        "target": "pan",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ],
        "BG_17_Balcony": [
                {
                        "label": "360° — North Indian",
                        "target": "north",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ]
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
        const destination = new URL('../../Floor/Tower-BF.html', location.href);
        for (const key of ['floor', 'unit']) {
            const value = params.get(key) || sessionStorage.getItem(key === 'floor' ? 'selectedFloor' : 'selectedUnit');
            if (value) destination.searchParams.set(key, value);
        }
        destination.searchParams.set('tower', 'B');
        location.href = destination.href;
    });
    document.getElementById('backBtn').addEventListener('click', () => {
        if (roomHistory.length > 1) {
            roomHistory.pop();
            goToRoom(roomHistory.at(-1), false);
        } else if (history.length > 1) {
            history.back();
        } else {
            location.href = '../../Tower_B.html';
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
        console.error('Unable to start the Tower B tour:', error);
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
        for (const { label, target, href, x, y, z } of hotspots) {
            if (!href && !hasScene(target)) continue;
            const hotspot = new PANOLENS.Infospot(300, hotspotIcon);
            hotspot.position.set(x, y, z);
            hotspot.addHoverText(label);
            hotspot.addEventListener('click', () => {
                if (href) { if (!href.startsWith('#360-')) location.href = href; }
                else goToRoom(target);
            });
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
        const shopRoom = ({"BG_8_Balcony":"apple","BG_9_Balcony":"skincare","BG_10_Balcony":"cafe","BG_11_Balcony":"udd","BG_12_Balcony":"pizza","BG_13_Balcony":"sunglass","BG_14_Balcony":"south","BG_15_Balcony":"tea","BG_16_Balcony":"pan","BG_17_Balcony":"north"})[room] || room;
        for (const pill of pills) {
            const active = pill.dataset.room === shopRoom;
            pill.classList.toggle('active', active);
            pill.setAttribute('aria-pressed', String(active));
        }
        window.FortmenTownsquareAnalytics?.trackRoom(room, { tower: 'B' });
        window.dispatchEvent(new CustomEvent('fortmen-townsquare:panorama-change', { detail: { room, tower: 'B' } }));
    }
    for (const pill of pills) pill.addEventListener('click', () => goToRoom(pill.dataset.room));
    const requestedRoom = params.get('room') === 'restaurent' ? 'restaurant' : params.get('room');
    goToRoom(hasScene(requestedRoom) ? requestedRoom : "apple");
})();
