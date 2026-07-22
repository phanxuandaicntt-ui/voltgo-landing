const $ = (s) => document.querySelector(s);
let auth = sessionStorage.getItem('voltgo_admin_auth') || '';
let config = { texts: {}, theme: {}, media: {} };
let fields = [];
const toast = (message, error = false) => { const el = $('#toast'); el.textContent = message; el.style.background = error ? '#7f1d1d' : '#064e3b'; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 2600); };
const api = async (url, options = {}) => { const res = await fetch(url, { ...options, headers: { ...(options.headers || {}), ...(auth ? { Authorization: `Basic ${auth}` } : {}) } }); const data = await res.json().catch(() => ({})); if (!res.ok) throw new Error(data.error || 'Có lỗi xảy ra.'); return data; };

$('#loginForm').addEventListener('submit', async e => {
  e.preventDefault(); const data = new FormData(e.currentTarget); auth = btoa(`${data.get('username')}:${data.get('password')}`);
  try { await api('/api/content?action=login', { method: 'POST' }); sessionStorage.setItem('voltgo_admin_auth', auth); start(); } catch (err) { auth = ''; $('#loginStatus').textContent = err.message; }
});
$('#logout').onclick = () => { sessionStorage.removeItem('voltgo_admin_auth'); location.reload(); };

async function start() {
  $('#loginView').classList.add('hidden'); $('#dashboard').classList.remove('hidden');
  try { config = { texts: {}, theme: {}, media: {}, ...(await api('/api/content')) }; } catch { toast('Không thể tải cấu hình', true); }
  syncControls();
}
if (auth) api('/api/content?action=login', { method: 'POST' }).then(start).catch(() => { auth = ''; sessionStorage.removeItem('voltgo_admin_auth'); });

document.querySelectorAll('.sidebar nav button').forEach(btn => btn.onclick = () => {
  document.querySelectorAll('.sidebar nav button,.tab').forEach(x => x.classList.remove('active')); btn.classList.add('active'); $(`#tab-${btn.dataset.tab}`).classList.add('active'); $('.sidebar').classList.remove('open');
});
$('#menuBtn').onclick = () => $('.sidebar').classList.toggle('open');
$('#previewBtn').onclick = () => open('/','_blank');
document.querySelectorAll('.devices button').forEach(btn => btn.onclick = () => { document.querySelectorAll('.devices button').forEach(x=>x.classList.remove('active')); btn.classList.add('active'); $('#siteFrame').style.width = btn.dataset.width === '100%' ? '100%' : `${btn.dataset.width}px`; });

window.addEventListener('message', e => {
  if (e.data?.type === 'voltgo-fields') { fields = e.data.fields; renderFields(); }
});
function renderFields(filter = '') {
  const list = $('#contentList'); list.innerHTML = '';
  fields.filter(f => f.text.toLowerCase().includes(filter.toLowerCase())).forEach(field => {
    const item = document.createElement('div'); item.className = 'content-item';
    item.innerHTML = `<small>${field.tag} · #${field.index + 1}</small><div class="excerpt"></div><textarea></textarea>`;
    item.querySelector('.excerpt').textContent = field.text; const area = item.querySelector('textarea'); area.value = config.texts[field.index] ?? field.html;
    item.onclick = e => { if (e.target === area) return; document.querySelectorAll('.content-item').forEach(x=>x.classList.remove('active')); item.classList.add('active'); area.focus(); };
    area.oninput = () => { config.texts[field.index] = area.value; item.querySelector('.excerpt').textContent = area.value.replace(/<[^>]+>/g,' '); $('#siteFrame').contentWindow.postMessage({ type:'voltgo-update', index:field.index, html:area.value }, '*'); dirty(); };
    list.appendChild(item);
  });
}
$('#searchInput').oninput = e => renderFields(e.target.value);
function syncControls() {
  const t = config.theme || {}; $('#colorBg').value=t.bg||'#070b14'; $('#colorCard').value=t.card||'#111827'; $('#colorBlue').value=t.blue||'#38bdf8'; $('#colorOrange').value=t.orange||'#ff7a00'; $('#colorYellow').value=t.yellow||'#ffb800';
  $('#mediaUrl').value=config.media?.url||''; $('#mediaType').value=config.media?.type||'image'; showMedia();
}
function dirty(){ $('#saveState').textContent='● Chưa lưu'; $('#saveState').style.color='#fbbf24'; }
$('#applyTheme').onclick=()=>{config.theme={bg:$('#colorBg').value,card:$('#colorCard').value,blue:$('#colorBlue').value,orange:$('#colorOrange').value,yellow:$('#colorYellow').value}; $('#siteFrame').contentWindow.postMessage({type:'voltgo-theme',theme:config.theme},'*');dirty();toast('Đã áp dụng vào bản xem trước');};
$('#resetTheme').onclick=()=>{config.theme={};syncControls();$('#siteFrame').contentWindow.postMessage({type:'voltgo-theme',theme:{}},'*');dirty();};
function showMedia(){const p=$('#mediaPreview'),m=config.media||{};p.innerHTML=m.url?(m.type==='video'?`<video src="${m.url}" controls></video>`:`<img src="${m.url}" alt="Media sản phẩm">`):'<span>Chưa chọn media tùy chỉnh</span>';}
$('#mediaFile').onchange=async e=>{const file=e.target.files[0];if(!file)return;toast('Đang tải tệp lên...');try{const data=await api('/api/upload',{method:'POST',headers:{'Content-Type':file.type,'X-File-Name':file.name},body:file});$('#mediaUrl').value=data.url;$('#mediaType').value=file.type.startsWith('video')?'video':'image';toast('Tải lên thành công');}catch(err){toast(err.message,true);}};
$('#applyMedia').onclick=()=>{config.media={url:$('#mediaUrl').value.trim(),type:$('#mediaType').value};showMedia();$('#siteFrame').contentWindow.postMessage({type:'voltgo-media',media:config.media},'*');dirty();};
$('#removeMedia').onclick=()=>{config.media={};syncControls();$('#siteFrame').contentWindow.postMessage({type:'voltgo-media',media:{}},'*');dirty();};
$('#saveBtn').onclick=async()=>{const btn=$('#saveBtn');btn.disabled=true;btn.textContent='ĐANG LƯU...';try{await api('/api/content',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(config)});$('#saveState').textContent='● Đã đồng bộ';$('#saveState').style.color='#34d399';toast('Đã xuất bản thay đổi thành công');}catch(err){toast(err.message,true);}finally{btn.disabled=false;btn.textContent='LƯU THAY ĐỔI';}};
