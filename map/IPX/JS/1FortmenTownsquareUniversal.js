/* Shared apartment context and navigation. */
(function(){
  'use strict';
  const context=()=>{
    const p=new URLSearchParams(location.search);
    const tower=p.get('tower')||sessionStorage.getItem('selectedTower')||sessionStorage.getItem('fortmenTownsquareTower')||'';
    const floorRaw=p.get('floor')||sessionStorage.getItem('selectedFloor')||sessionStorage.getItem('fortmenTownsquareFloor')||'';
    const unitRaw=p.get('unit')||sessionStorage.getItem('selectedUnit')||'';
    const floor=Number(floorRaw);
    const unit=Number(unitRaw);
    return {tower:String(tower||'').trim(),floor:(floor>=1&&floor<=32)?floor:null,unit:[1,2].includes(unit)?unit:null};
  };
  function setContext(tower,floor,unit){
    if(tower) {sessionStorage.setItem('selectedTower',String(tower));sessionStorage.setItem('fortmenTownsquareTower',String(tower));}
    if(floor) {sessionStorage.setItem('selectedFloor',String(floor));sessionStorage.setItem('fortmenTownsquareFloor',String(floor));}
    if(unit) sessionStorage.setItem('selectedUnit',String(unit));
  }

  // Tower overview pages: derive real tower/floor from SVG data-name and route correctly.
  function wireTowerOverview(){
    const file=location.pathname.split('/').pop(); if(!/^Tower_[ABC]\.html$/i.test(file))return;
    document.addEventListener('click',e=>{
      const path=e.target.closest?.('.Cutout path[data-link][data-name]'); if(!path)return;
      const name=path.getAttribute('data-name')||'';
      const m=name.match(/^(9|10|11|12A|12)?_?Floor_(\d+)$/i); if(!m)return;
      let tower=(m[1]||'11').toUpperCase(); if(tower==='12A')tower='12A';
      const floor=Number(m[2]);
      const target=path.getAttribute('data-link'); if(!target)return;
      e.preventDefault();e.stopImmediatePropagation();
      setContext(tower,floor,null);
      const u=new URL(target,location.href);u.searchParams.set('tower',tower);u.searchParams.set('floor',String(floor));
      location.href=u.href;
    },true);
  }

  function wireFloorApartmentNavigation(){
    if(!/\/Floor\//i.test(location.pathname))return;
    const file=location.pathname.split('/').pop();
    const tower=({'Tower-9.html':'9','Tower-10.html':'10','Tower-11.html':'11','Tower-12.html':'12','Tower-C-12-A.html':'12A'})[file]||'';
    const p=new URLSearchParams(location.search);const floor=Number(p.get('floor')||sessionStorage.getItem('selectedFloor')||1);
    document.addEventListener('click',e=>{
      const path=e.target.closest?.('.Cutout path[data-link]');if(!path)return;
      const id=(path.id||'').replace(/[^a-z0-9]/gi,'').toLowerCase();let unit=null;
      if(id==='appartment1')unit=1;if(id==='appartment2')unit=2;if(!unit)return;
      const target=path.getAttribute('data-link');if(!target)return;
      e.preventDefault();e.stopImmediatePropagation();
      setContext(tower,floor,unit);
      const u=new URL(target,location.href);u.searchParams.set('tower',tower);u.searchParams.set('floor',String(floor));u.searchParams.set('unit',String(unit));
      location.href=u.href;
    },true);
  }


  function init(){ window.FortmenTownsquareContext=context; wireTowerOverview(); wireFloorApartmentNavigation(); }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
