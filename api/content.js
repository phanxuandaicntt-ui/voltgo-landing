const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

function authorized(req) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Basic ')) return false;
  const [user, pass] = Buffer.from(header.slice(6), 'base64').toString().split(':');
  return user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASSWORD;
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (!SUPABASE_URL || !SERVICE_KEY) return res.status(503).json({ error: 'Server chưa được cấu hình.' });
  const headers = { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json' };

  if (req.method === 'GET') {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/site_content?id=eq.main&select=config`, { headers });
    const rows = await response.json();
    return res.status(response.ok ? 200 : response.status).json(response.ok ? (rows[0]?.config || {}) : rows);
  }
  if (req.method === 'POST' && req.query?.action === 'login') {
    return authorized(req) ? res.status(200).json({ ok: true }) : res.status(401).json({ error: 'Sai tài khoản hoặc mật khẩu.' });
  }
  if (req.method === 'PUT') {
    if (!authorized(req)) return res.status(401).json({ error: 'Phiên đăng nhập không hợp lệ.' });
    const response = await fetch(`${SUPABASE_URL}/rest/v1/site_content?id=eq.main`, {
      method: 'PATCH', headers: { ...headers, Prefer: 'return=minimal' }, body: JSON.stringify({ config: req.body, updated_at: new Date().toISOString() })
    });
    return response.ok ? res.status(200).json({ ok: true }) : res.status(response.status).json(await response.json());
  }
  res.setHeader('Allow', 'GET, POST, PUT');
  return res.status(405).json({ error: 'Method not allowed' });
};
