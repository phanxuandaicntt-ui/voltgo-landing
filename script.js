const EDITABLE_SELECTOR = 'h1,h2,h3,p,summary,li,.btn,.kicker,.eyebrow,.announcement,.quick-benefits article,.stats article,.check-list span,.order-summary,.mobile-bar div';
let siteConfig = { texts: {}, theme: {}, media: {} };

function editableFields() {
  return [...document.querySelectorAll(EDITABLE_SELECTOR)].filter(el => !el.closest('form') && !el.matches('.form-note'));
}
function applyTheme(theme = {}) {
  const root = document.documentElement;
  const defaults = { bg:'#070b14', card:'#111827', blue:'#38bdf8', orange:'#ff7a00', yellow:'#ffb800' };
  Object.entries({ ...defaults, ...theme }).forEach(([key,value]) => root.style.setProperty(`--${key}`, value));
}
function applyMedia(media = {}) {
  const stage = document.querySelector('.product-stage');
  if (!stage) return;
  let custom = stage.querySelector('.cms-media');
  if (!media.url) { if (custom) custom.remove(); stage.classList.remove('has-cms-media'); return; }
  if (custom) custom.remove();
  custom = document.createElement(media.type === 'video' ? 'video' : 'img');
  custom.className = 'cms-media'; custom.src = media.url;
  if (media.type === 'video') { custom.controls = true; custom.autoplay = true; custom.muted = true; custom.loop = true; custom.playsInline = true; }
  else custom.alt = 'Sản phẩm VoltGo';
  stage.appendChild(custom); stage.classList.add('has-cms-media');
}
function applyConfig(config) {
  siteConfig = { texts:{}, theme:{}, media:{}, ...config };
  editableFields().forEach((el,index) => { if (siteConfig.texts[index] != null) el.innerHTML = siteConfig.texts[index]; });
  applyTheme(siteConfig.theme); applyMedia(siteConfig.media);
}
async function loadSiteContent() {
  try { const response = await fetch('/api/content'); if (response.ok) applyConfig(await response.json()); } catch (_) {}
  if (new URLSearchParams(location.search).has('editor')) {
    document.body.classList.add('editor-preview');
    const fields = editableFields().map((el,index)=>({ index, tag:el.tagName.toLowerCase(), html:el.innerHTML, text:el.textContent.trim() }));
    parent.postMessage({ type:'voltgo-fields', fields }, '*');
  }
}
window.addEventListener('message', event => {
  if (event.data?.type === 'voltgo-update') { const el=editableFields()[event.data.index]; if(el) el.innerHTML=event.data.html; }
  if (event.data?.type === 'voltgo-theme') applyTheme(event.data.theme);
  if (event.data?.type === 'voltgo-media') applyMedia(event.data.media);
});
loadSiteContent();

const form = document.querySelector('#orderForm');
const statusBox = document.querySelector('#formStatus');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = form.querySelector('button');
  const data = Object.fromEntries(new FormData(form));
  button.disabled = true;
  button.textContent = 'ĐANG GỬI ĐƠN...';
  statusBox.className = '';
  statusBox.textContent = '';

  try {
    if (!window.APP_CONFIG?.supabaseUrl || !window.APP_CONFIG?.supabaseAnonKey) {
      throw new Error('Hệ thống nhận đơn đang được cấu hình. Vui lòng thử lại sau.');
    }
    const response = await fetch(`${window.APP_CONFIG.supabaseUrl}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        apikey: window.APP_CONFIG.supabaseAnonKey,
        Authorization: `Bearer ${window.APP_CONFIG.supabaseAnonKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({ ...data, quantity: Number(data.quantity), source: 'voltgo-landing' })
    });
    if (!response.ok) throw new Error('Không thể gửi đơn lúc này. Vui lòng thử lại.');
    form.reset();
    statusBox.className = 'status success';
    statusBox.textContent = '✓ Đặt hàng thành công! Chúng tôi sẽ sớm liên hệ xác nhận.';
  } catch (error) {
    statusBox.className = 'status error';
    statusBox.textContent = error.message;
  } finally {
    button.disabled = false;
    button.textContent = 'HOÀN TẤT ĐẶT HÀNG — NHẬN ƯU ĐÃI';
  }
});
