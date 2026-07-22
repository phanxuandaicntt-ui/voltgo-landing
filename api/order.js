const SUPABASE_URL = process.env.SUPABASE_URL;
const ANON_KEY = process.env.SUPABASE_ANON_KEY;
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const clean = (value, max=500) => String(value||'').trim().slice(0,max);
const esc = value => clean(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

module.exports = async (req,res) => {
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  const order={full_name:clean(req.body?.full_name,120),phone:clean(req.body?.phone,20),address:clean(req.body?.address),quantity:Math.min(10,Math.max(1,Number(req.body?.quantity)||1)),source:'voltgo-landing'};
  if(order.full_name.length<2||order.phone.length<9||order.address.length<5) return res.status(400).json({error:'Thông tin đặt hàng chưa hợp lệ.'});
  const saved=await fetch(`${SUPABASE_URL}/rest/v1/orders`,{method:'POST',headers:{apikey:ANON_KEY,Authorization:`Bearer ${ANON_KEY}`,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(order)});
  if(!saved.ok) return res.status(502).json({error:'Không thể lưu đơn hàng.'});
  let notified=false;
  if(TELEGRAM_TOKEN&&TELEGRAM_CHAT_ID){
    const total=(215000*order.quantity).toLocaleString('vi-VN');
    const text=`<b>🔔 ĐƠN HÀNG VOLTGO MỚI</b>\n\n👤 <b>Khách hàng:</b> ${esc(order.full_name)}\n📞 <b>Điện thoại:</b> <code>${esc(order.phone)}</code>\n📍 <b>Địa chỉ:</b> ${esc(order.address)}\n📦 <b>Số lượng:</b> ${order.quantity}\n💰 <b>Tạm tính:</b> ${total}đ\n\n🕐 ${new Date().toLocaleString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh'})}`;
    const sent=await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:TELEGRAM_CHAT_ID,text,parse_mode:'HTML'})});notified=sent.ok;
  }
  return res.status(200).json({ok:true,notified});
};
