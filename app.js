const STORAGE_KEY = 'recitation-counter-v1';
const $ = (selector) => document.querySelector(selector);
const today = () => new Date().toISOString().slice(0, 10);
let records = readRecords();

$('#date').value = today();

function readRecords() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function saveRecords() { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); render(); }
function dateLabel(value) { return new Intl.DateTimeFormat('zh-CN', { year:'numeric', month:'long', day:'numeric', weekday:'short' }).format(new Date(`${value}T12:00:00`)); }
function escapeHtml(text) { const node = document.createElement('span'); node.textContent = text; return node.innerHTML; }
function mergeRecord(sutra, date, count, exceptId = null) {
  const existing = records.find(r => r.sutra === sutra && r.date === date && r.id !== exceptId);
  if (existing) { existing.count += count; return true; }
  records.push({ id: crypto.randomUUID(), sutra, date, count }); return false;
}
function render() {
  const names = [...new Set(records.map(r => r.sutra))].sort((a,b) => a.localeCompare(b, 'zh-CN'));
  $('#sutra-options').innerHTML = names.map(name => `<option value="${escapeHtml(name)}"></option>`).join('');
  const summary = Object.values(records.reduce((out, r) => { (out[r.sutra] ??= {sutra:r.sutra,count:0,days:0, dates:new Set()}).count += r.count; out[r.sutra].dates.add(r.date); out[r.sutra].days = out[r.sutra].dates.size; return out; }, {})).sort((a,b) => b.count-a.count || a.sutra.localeCompare(b.sutra, 'zh-CN'));
  $('#overall-total').textContent = `${records.reduce((sum,r) => sum+r.count,0)} 次`;
  $('#summary-list').innerHTML = summary.length ? summary.map(s => `<article class="summary-item"><div><h3>${escapeHtml(s.sutra)}</h3><p>共 ${s.days} 天记录</p></div><span class="count">${s.count} 次</span></article>`).join('') : '<div class="empty">还没有记录。先写下今天的一次念诵吧。</div>';
  const order = [...records].sort((a,b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  $('#history-list').innerHTML = order.length ? order.map(r => `<article class="history-item"><div><h3>${escapeHtml(r.sutra)}</h3><p>${dateLabel(r.date)}</p></div><div class="history-actions"><span class="count">${r.count} 次</span><button class="icon-button" data-edit="${r.id}" aria-label="修改 ${escapeHtml(r.sutra)}">修改</button><button class="icon-button danger" data-delete="${r.id}" aria-label="删除 ${escapeHtml(r.sutra)}">删除</button></div></article>`).join('') : '<div class="empty">明细会在这里出现。</div>';
}

$('#entry-form').addEventListener('submit', event => {
  event.preventDefault();
  const sutra = $('#sutra').value.trim(); const date = $('#date').value; const count = Number($('#count').value);
  if (!sutra || !date || !Number.isInteger(count) || count < 1) return;
  const merged = mergeRecord(sutra, date, count); saveRecords();
  $('#form-note').textContent = merged ? `已累加到「${sutra}」${dateLabel(date)}的记录。` : '已记录。';
  $('#count').value = 1; $('#sutra').focus();
});

$('#history-list').addEventListener('click', event => {
  const id = event.target.dataset.edit || event.target.dataset.delete; if (!id) return;
  const record = records.find(r => r.id === id); if (!record) return;
  if (event.target.dataset.delete) { if (confirm(`删除「${record.sutra}」这条记录？`)) { records = records.filter(r => r.id !== id); saveRecords(); } return; }
  $('#edit-id').value=record.id; $('#edit-sutra').value=record.sutra; $('#edit-date').value=record.date; $('#edit-count').value=record.count; $('#edit-dialog').showModal();
});

$('#edit-form').addEventListener('submit', event => {
  event.preventDefault(); const id=$('#edit-id').value, old=records.find(r=>r.id===id), sutra=$('#edit-sutra').value.trim(), date=$('#edit-date').value, count=Number($('#edit-count').value);
  if (!old || !sutra || !date || !Number.isInteger(count) || count<1) return;
  records=records.filter(r=>r.id!==id); mergeRecord(sutra,date,count,id); saveRecords(); $('#edit-dialog').close();
});
$('#clear-all').addEventListener('click', () => { if (records.length && confirm('确定清空所有念诵记录吗？此操作无法撤销。')) { records=[]; saveRecords(); } });
$('#export-data').addEventListener('click', () => { const blob=new Blob([JSON.stringify({version:1, exportedAt:new Date().toISOString(), records},null,2)],{type:'application/json'}); const link=document.createElement('a'); link.href=URL.createObjectURL(blob); link.download=`念诵记备份-${today()}.json`; link.click(); URL.revokeObjectURL(link.href); });
$('#import-data').addEventListener('change', async event => { const file=event.target.files[0]; if (!file) return; try { const data=JSON.parse(await file.text()); if (!Array.isArray(data.records) || !data.records.every(r=>typeof r.sutra==='string' && /^\d{4}-\d{2}-\d{2}$/.test(r.date) && Number.isInteger(r.count) && r.count>0)) throw new Error(); if (!confirm(`导入 ${data.records.length} 条记录？会与现有相同日期和经典自动累加。`)) return; data.records.forEach(r=>mergeRecord(r.sutra.trim(),r.date,r.count)); saveRecords(); alert('导入完成。'); } catch { alert('这个备份文件无法识别。'); } finally { event.target.value=''; } });

if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js'));
render();
