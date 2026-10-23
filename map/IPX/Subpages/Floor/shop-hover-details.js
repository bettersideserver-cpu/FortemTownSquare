/* Shop values are editable on each SVG: data-dimensions and data-area. */
(function () {
    function init() {
        const shapes = document.querySelectorAll('#availableOffLayer [id][data-dimensions][data-area]');
        if (!shapes.length) return;

        const tip = document.createElement('div');
        tip.id = 'shopDetailsTooltip';
        tip.setAttribute('role', 'tooltip');
        tip.hidden = true;
        const name = document.createElement('strong');
        name.className = 'shop-details-name';
        const dimensions = document.createElement('div');
        const area = document.createElement('div');
        tip.append(name, dimensions, area);
        document.body.appendChild(tip);

        function hide() { tip.hidden = true; }
        function move(event) {
            if (tip.hidden) return;
            const gap = 14;
            const x = event.clientX + gap + tip.offsetWidth > innerWidth - 8
                ? event.clientX - tip.offsetWidth - gap : event.clientX + gap;
            const y = event.clientY + gap + tip.offsetHeight > innerHeight - 8
                ? event.clientY - tip.offsetHeight - gap : event.clientY + gap;
            tip.style.left = Math.max(8, x) + 'px';
            tip.style.top = Math.max(8, y) + 'px';
        }
        shapes.forEach(shape => {
            shape.addEventListener('pointerenter', event => {
                name.textContent = shape.getAttribute('data-name') || shape.id.replace(/_/g, ' ').trim();
                dimensions.textContent = 'L \u00d7 B: ' + shape.dataset.dimensions;
                area.textContent = 'Total area: ' + shape.dataset.area;
                tip.hidden = false;
                move(event);
            });
            shape.addEventListener('pointermove', move);
            shape.addEventListener('pointerleave', hide);
            shape.addEventListener('click', hide);
        });
        window.addEventListener('pagehide', hide);
        window.addEventListener('pageshow', hide);
        window.addEventListener('resize', hide);
        window.addEventListener('scroll', hide, true);
        document.getElementById('hhAvailableToggle')?.addEventListener('change', hide);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
