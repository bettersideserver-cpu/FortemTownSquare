/* Shop dimensions are editable in PanoramaDimensions.js. */
(() => {
    const card = document.getElementById('roomInfoCard');
    if (!card) return;
    const folder = decodeURIComponent(location.pathname).split('/').slice(-3, -2)[0];
    const dimensions = document.createElement('div');
    dimensions.className = 'panorama-dimensions';
    const caption = document.createElement('span');
    caption.className = 'panorama-dimensions-label';
    caption.textContent = 'Shop dimensions · L × B';
    const value = document.createElement('span');
    value.className = 'panorama-dimensions-value';
    dimensions.append(caption, value);
    card.append(dimensions);
    function update() {
        const selected = document.querySelector('.tour-pill.active[data-room]');
        if (!selected) return;
        document.getElementById('cardName').textContent = selected.textContent.trim();
        const raw = window.panoramaDimensions?.[folder]?.[selected.dataset.room] || 'XX ft x XX ft';
        value.textContent = raw.replace(/\s+x\s+/gi, ' × ');
    }
    window.addEventListener('fortmen-townsquare:panorama-change', update);
    update();
})();
