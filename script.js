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
