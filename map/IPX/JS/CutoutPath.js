// FortmenTownsquare floor navigation: use the displayed floor name first.
(function () {
  const paths = document.querySelectorAll(".Cutout path[data-link]");

  // Back/forward navigation can restore the DOM with the clicked floor selected.
  function clearSelection() {
    paths.forEach((path) => path.classList.remove("selected"));
  }

  window.addEventListener("pagehide", clearSelection);
  window.addEventListener("pageshow", clearSelection);

  paths.forEach((path) => {
    path.style.pointerEvents = "all";
    path.style.cursor = "pointer";

    path.addEventListener("click", () => {
      const name = path.getAttribute("data-name") || "";
      const link = path.getAttribute("data-link") || "";

      // Example: "12_Floor_24" -> 24; "Floor_08" -> 8
      const nameMatch = name.match(/(?:^|_)Floor[_ -]?(\d+)$/i);
      const floor = nameMatch ? Number(nameMatch[1])
        : Number(path.getAttribute("floorNumber") || path.getAttribute("floornumber"));

      const target = new URL(link, window.location.href);
      const filename = target.pathname.split('/').pop();
      // Retail floor plans use Tower-AF/BF/CF; older plans use numeric names.
      const retailMatch = filename.match(/^Tower-([ABC])F\.html$/i);
      const legacyMatch = filename.match(/^Tower[-_]?(C-12-A|[A-Z]|\d+A?)\.html$/i);
      let tower = retailMatch?.[1] || legacyMatch?.[1] || "";
      if (tower.toUpperCase() === 'C-12-A') tower = '12A';

      // Fallback for names like "12_Floor_24"
      if (!tower) {
        const towerMatch = name.match(/^(.+?)_Floor[_ -]?\d+$/i);
        if (towerMatch) tower = towerMatch[1];
      }

      tower = String(tower).replace(/^Tower[-_ ]?/i, "").trim().toUpperCase();

      if (!tower || !Number.isInteger(floor) || floor < 1 || floor > 32) {
        console.warn("Floor navigation stopped:", { name, link, tower, floor });
        return;
      }

      sessionStorage.setItem("selectedTower", tower);
      sessionStorage.setItem("selectedFloor", String(floor));
      sessionStorage.setItem("fortmenTownsquareTower", tower);
      sessionStorage.setItem("fortmenTownsquareFloor", String(floor));

      paths.forEach((p) => p.classList.remove("selected"));
      path.classList.add("selected");

      target.searchParams.set("tower", tower);
      target.searchParams.set("floor", String(floor));

      window.location.href = target.href;
    });
  });
})();
