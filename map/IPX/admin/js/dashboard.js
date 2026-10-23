import { supabase } from './supabase.js';
import { initVisitorDetails, loadVisitorDetails } from './visitor-details.js';
const $=id=>document.getElementById(id);let units=[],apartmentFloors=[],statuses=[];
function toast(t){const e=$('toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),2200)}
async function guard(){if(!supabase){location.href='login.html';return false}const {data:{session}}=await supabase.auth.getSession();if(!session){location.href='login.html';return false}return true}
async function load(){
  const results=await Promise.all([
    supabase.from('status_categories').select('*').eq('active',true).order('sort_order').order('id'),
    supabase.from('apartments').select('*').order('tower').order('floor').order('unit')
  ]);
  if(results[0].error) throw results[0].error;
  if(results[1].error) throw results[1].error;
  statuses=results[0].data||[]; units=results[1].data||[]; apartmentFloors=[];
  renderTowerTabs();renderUnits();renderStatuses();renderMetrics();loadVisitors();loadHoldRequests();
}
function renderMetrics(){const available=statuses.find(s=>s.name.toLowerCase()==='available');$('mTotal').textContent=units.length;$('mAvailable').textContent=available?units.filter(u=>u.status_id===available.id).length:0;$('mOther').textContent=units.length-(+$('mAvailable').textContent)}
function renderUnits(){
  const activeTower=document.querySelector('.tower-tab.active')?.dataset.tower || '9';
  const rows=units.filter(u=>String(u.tower)===String(activeTower)).sort((a,b)=>Number(a.floor)-Number(b.floor)||Number(a.unit)-Number(b.unit));
  $('unitRows').innerHTML=rows.map(u=>`<tr><td>${esc(String(u.floor).padStart(2,'0'))}</td><td>Unit ${esc(u.unit)}</td><td>${esc(u.status)}</td><td>${esc(u.buyer_name)}</td><td>${esc(u.buyer_number)}</td></tr>`).join('') || '<tr><td colspan="5">No apartments found.</td></tr>';
}

function renderTowerTabs(){
  let bar=document.getElementById('towerTabs');
  if(!bar){bar=document.createElement('div');bar.id='towerTabs';bar.className='tower-tabs';const unitsPage=document.getElementById('units');unitsPage?.querySelector('.top')?.after(bar);}
  const towers=['9','10','11','12','12A'];
  bar.innerHTML=towers.map((t,i)=>`<button type="button" class="tower-tab ${i===0?'active':''}" data-tower="${t}">Tower ${t}</button>`).join('');
  bar.querySelectorAll('.tower-tab').forEach(b=>b.onclick=()=>{bar.querySelectorAll('.tower-tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderUnits();});
}
function renderStatuses(){ $('statusList').innerHTML=statuses.map(s=>`<div class="status-row"><span class="swatch" style="background:${safeColor(s.color)}"></span><span>${esc(s.name)}</span></div>`).join('') }
let visitorSignature='';
async function loadVisitors(){
  const {data,error}=await supabase.from('visitors').select('*').order('created_at',{ascending:false});
  if(error){$('visitorRows').innerHTML=`<tr><td colspan="9">${esc(error.message)}</td></tr>`;updateBulkControls('visitors');return;}
  const rows=data||[];
  const signature=rows.map(v=>`${v.id}|${v.created_at}|${v.name||v.first_name||''}|${v.mobile||v.phone||''}|${v.email||''}|${v.city||''}`).join('||');
  if(signature===visitorSignature)return;
  const selected=new Set([...document.querySelectorAll('.visitor-check:checked')].map(x=>String(x.dataset.id)));
  visitorSignature=signature;
  $('visitorRows').innerHTML=rows.map(v=>`<tr><td class="check-col"><input type="checkbox" class="visitor-check" data-id="${escAttr(v.id)}" ${selected.has(String(v.id))?'checked':''}></td><td>${esc(v.name||`${v.first_name||''} ${v.last_name||''}`)}</td><td>${esc(v.mobile||v.phone||'')}</td><td>${esc(v.email||'')}</td><td>${esc(v.city||'')}</td><td>${v.created_at?new Date(v.created_at).toLocaleString():''}</td></tr>`).join('')||'<tr><td colspan="6">No visitors yet.</td></tr>';
  updateBulkControls('visitors');
  if(document.getElementById('visitors')?.classList.contains('active') && rows.length>0) toast('Visitor list updated');
}

let visitorRefreshTimer=null;
let visitorRefreshBusy=false;
async function refreshVisitorsLive(){
  if(visitorRefreshBusy)return;
  visitorRefreshBusy=true;
  try{
    await loadVisitors();
  }finally{
    visitorRefreshBusy=false;
  }
}
function startVisitorLiveRefresh(){
  if(visitorRefreshTimer)clearInterval(visitorRefreshTimer);
  visitorRefreshTimer=setInterval(refreshVisitorsLive,3000);
}

async function loadHoldRequests(){
  const {data,error}=await supabase.from('hold_requests').select('*').order('created_at',{ascending:false});
  if(error){$('holdRequestRows').innerHTML=`<tr><td colspan="10">${esc(error.message)}</td></tr>`;updateBulkControls('holdRequests');return;}
  window.__holdRequests=data||[];
  $('holdRequestRows').innerHTML=(data||[]).map(r=>`<tr><td class="check-col"><input type="checkbox" class="hold-check" data-id="${escAttr(r.id)}"></td><td>${esc(r.tower?`Tower ${r.tower}`:'')}</td><td>${r.floor?esc(String(r.floor).padStart(2,'0')):esc(r.floor_number||'')}</td><td>${r.unit?esc('Unit '+r.unit):esc(r.unit_number||'')}</td><td><strong>${esc(r.apartment_detail||'')}</strong></td><td>${esc(r.visitor_name||'')}</td><td>${esc(r.visitor_mobile||'')}</td><td>${esc(r.visitor_email||'')}</td><td>${esc(r.status)}</td><td>${r.created_at?new Date(r.created_at).toLocaleString():''}</td></tr>`).join('')||'<tr><td colspan="10">No hold requests yet.</td></tr>';
  $('selectAllHoldRequests').checked=false;updateBulkControls('holdRequests');
}

function updateBulkControls(type){
  const isVisitors=type==='visitors';
  const checks=[...document.querySelectorAll(isVisitors?'.visitor-check:checked':'.hold-check:checked')];
  const all=[...document.querySelectorAll(isVisitors?'.visitor-check':'.hold-check')];
  const btn=$(isVisitors?'deleteVisitors':'deleteHoldRequests');
  const selectAll=$(isVisitors?'selectAllVisitors':'selectAllHoldRequests');
  if(btn) btn.disabled=checks.length===0;
  if(selectAll){selectAll.checked=all.length>0 && checks.length===all.length;selectAll.indeterminate=checks.length>0 && checks.length<all.length;}
}

async function deleteSelected(type){
  const isVisitors=type==='visitors';
  const selector=isVisitors?'.visitor-check:checked':'.hold-check:checked';
  const ids=[...document.querySelectorAll(selector)].map(x=>x.dataset.id).filter(Boolean);
  if(!ids.length)return;
  const label=isVisitors?'visitor':'hold request';
  if(!confirm(`Delete ${ids.length} selected ${label}${ids.length===1?'':'s'}? This cannot be undone.`))return;
  const table=isVisitors?'visitors':'hold_requests';
  const {error}=await supabase.from(table).delete().in('id',ids);
  if(error){toast(error.message);return;}
  toast(`${ids.length} ${label}${ids.length===1?'':'s'} deleted`);
  if(isVisitors) await loadVisitors(); else await loadHoldRequests();
}

$('selectAllVisitors').onchange=()=>{document.querySelectorAll('.visitor-check').forEach(c=>c.checked=$('selectAllVisitors').checked);updateBulkControls('visitors')};
$('selectAllHoldRequests').onchange=()=>{document.querySelectorAll('.hold-check').forEach(c=>c.checked=$('selectAllHoldRequests').checked);updateBulkControls('holdRequests')};
$('visitorRows').onchange=e=>{if(e.target.classList.contains('visitor-check'))updateBulkControls('visitors')};
$('holdRequestRows').onchange=e=>{if(e.target.classList.contains('hold-check'))updateBulkControls('holdRequests')};
$('deleteVisitors').onclick=()=>deleteSelected('visitors');
$('deleteHoldRequests').onclick=()=>deleteSelected('holdRequests');

function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function escAttr(v){return esc(v)}
function safeColor(c){return /^#[0-9a-f]{6}$/i.test(c||'')?c:'#22c55e'}


if (supabase) {
initVisitorDetails();
document.querySelectorAll('.nav button').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('.nav button').forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  $(b.dataset.page).classList.add('active');
  if(b.dataset.page==='visitors')loadVisitors();
  if(b.dataset.page==='holdRequests')loadHoldRequests();
  if(b.dataset.page==='visitorDetails')loadVisitorDetails();
});
$('logout').onclick=async()=>{await supabase.auth.signOut();location.href='login.html'};
}
(async()=>{if(await guard()){startVisitorLiveRefresh();await load();}})();
