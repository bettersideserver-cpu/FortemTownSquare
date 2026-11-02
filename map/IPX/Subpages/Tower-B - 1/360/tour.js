/* FortmenTownsquare — Tower B retail tour. */
(() => {
    'use strict';
    const scenes = {
        "ethnic": {
                "name": "Ethnic Wear",
                "image": "ethnic"
        },
        "ethnic_1": {
                "name": "Ethnic Wear 2",
                "image": "ethnic_1"
        },
        "kids": {
                "name": "Kids Store",
                "image": "kids"
        },
        "lingirie": {
                "name": "Lingirie",
                "image": "lingirie"
        },
        "salon": {
                "name": "Saloon",
                "image": "salon"
        },
        "home": {
                "name": "Home products",
                "image": "home"
        },
        "western": {
                "name": "Women Western Wear",
                "image": "western"
        },
        "western_1": {
                "name": "Women Western Wear 2",
                "image": "western_1"
        },
        "western_2": {
                "name": "Women Western Wear 3",
                "image": "western_2"
        },
        "B1_8_Balcony": {
                "name": "Saloon — Balcony",
                "image": "B1_8_Balcony"
        },
        "B1_9_Balcony": {
                "name": "Kids Store — Balcony",
                "image": "B1_9_Balcony"
        },
        "B1_10_Balcony": {
                "name": "Women Western Wear — Balcony",
                "image": "B1_10_Balcony"
        },
        "B1_11_Balcony": {
                "name": "Women Western Wear 2 — Balcony",
                "image": "B1_11_Balcony"
        },
        "B1_12_Balcony": {
                "name": "Home products — Balcony",
                "image": "B1_12_Balcony"
        },
        "B1_14_Balcony": {
                "name": "Lingirie — Balcony",
                "image": "B1_14_Balcony"
        },
        "B1_15_Balcony": {
                "name": "Ethnic Wear — Balcony",
                "image": "B1_15_Balcony"
        },
        "B1_16_Balcony": {
                "name": "Ethnic Wear 2 — Balcony",
                "image": "B1_16_Balcony"
        },
        "B1_17_Balcony": {
                "name": "Women Western Wear 3 — Balcony",
                "image": "B1_17_Balcony"
        },
        "B1_18_Balcony": {
                "name": "Women Western Wear 3 — Balcony",
                "image": "B1_18_Balcony"
        }
};
    // MANUAL HOTSPOTS: edit x/y/z to position each marker inside its balcony 360.
    // These are placeholder positions. 'target' is the scene opened on click.
    // Add more objects to a scene's array for additional hotspots, or use [] for none.
    // Edit target (scene ID), or href (page URL), and x/y/z for each button.
    // #360- links are placeholders until you replace them.
    const balconyHotspots = {
        "ethnic": [
                {
                        "label": "360° — Ethnic Wear — Balcony",
                        "target": "B1_15_Balcony",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ],
        "ethnic_1": [
                {
                        "label": "360° — Ethnic Wear 2 — Balcony",
                        "target": "B1_16_Balcony",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ],
        "kids": [
                {
                        "label": "360° — Kids Store — Balcony",
                        "target": "B1_9_Balcony",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ],
        "lingirie": [
                {
                        "label": "360° — Lingirie — Balcony",
                        "target": "B1_14_Balcony",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ],
        "salon": [
                {
                        "label": "360° — Saloon — Balcony",
                        "target": "B1_8_Balcony",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ],
        "home": [
                {
                        "label": "360° — Home products — Balcony",
                        "target": "B1_12_Balcony",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ],
        "western": [
                {
                        "label": "360° — Women Western Wear — Balcony",
                        "target": "B1_10_Balcony",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ],
        "western_1": [
                {
                        "label": "360° — Women Western Wear 2 — Balcony",
                        "target": "B1_11_Balcony",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ],
        "western_2": [
                {
                        "label": "360° — Women Western Wear 3 — Balcony",
                        "target": "B1_17_Balcony",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                },
                {
                        "label": "360° — Women Western Wear 3 — Balcony",
                        "target": "B1_18_Balcony",
                        "x": 5000,
                        "y": 0,
                        "z": 1800
                }
        ],
        "B1_8_Balcony": [
                {
                        "label": "360° — Saloon",
                        "target": "salon",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ],
        "B1_9_Balcony": [
                {
                        "label": "360° — Kids Store",
                        "target": "kids",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ],
        "B1_10_Balcony": [
                {
                        "label": "360° — Women Western Wear",
                        "target": "western",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ],
        "B1_11_Balcony": [
                {
                        "label": "360° — Women Western Wear 2",
                        "target": "western_1",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ],
        "B1_12_Balcony": [
                {
                        "label": "360° — Home products",
                        "target": "home",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ],
        "B1_14_Balcony": [
                {
                        "label": "360° — Lingirie",
                        "target": "lingirie",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ],
        "B1_15_Balcony": [
                {
                        "label": "360° — Ethnic Wear",
                        "target": "ethnic",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ],
        "B1_16_Balcony": [
                {
                        "label": "360° — Ethnic Wear 2",
                        "target": "ethnic_1",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ],
        "B1_17_Balcony": [
                {
                        "label": "360° — Women Western Wear 3",
                        "target": "western_2",
                        "x": 5000,
                        "y": 0,
                        "z": 0
                }
        ],
        "B1_18_Balcony": [
                {
                        "label": "360° — Women Western Wear 3",
                        "target": "western_2",
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
        const destination = new URL('../../Floor/Tower-BF1.html', location.href);
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
        const shopRoom = ({"B1_8_Balcony":"salon","B1_9_Balcony":"kids","B1_10_Balcony":"western","B1_11_Balcony":"western_1","B1_12_Balcony":"home","B1_14_Balcony":"lingirie","B1_15_Balcony":"ethnic","B1_16_Balcony":"ethnic_1","B1_17_Balcony":"western_2","B1_18_Balcony":"western_2"})[room] || room;
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
    goToRoom(hasScene(requestedRoom) ? requestedRoom : "ethnic");
})();
