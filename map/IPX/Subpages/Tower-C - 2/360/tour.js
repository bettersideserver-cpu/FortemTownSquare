/* FortmenTownsquare — Tower A retail tour. */
(() => {
    'use strict';
    const scenes = {
       bbq: { name: 'bbq', image: 'bbq' },
    

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
        for (const pill of pills) {
            const active = pill.dataset.room === room;
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
