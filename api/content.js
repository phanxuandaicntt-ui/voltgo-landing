const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const PROJECT_REF = 'gsmmcgdogpsrpidsoulw';

function authorized(req) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Basic ')) return false;
  const [user, pass] = Buffer.from(header.slice(6), 'base64').toString().split(':');
  return user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASSWORD;
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (!ACCESS_TOKEN) return res.status(503).json({ error: 'Server chưa được cấu hình.' });
  const query = async sql => fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, { method:'POST', headers:{ Authorization:`Bearer ${ACCESS_TOKEN}`,'Content-Type':'application/json' }, body:JSON.stringify({ query:sql }) });

  if (req.method === 'GET') {
    const response = await query("select config from public.site_content where id = 'main' limit 1;");
    const rows = await response.json();
    return res.status(response.ok ? 200 : response.status).json(response.ok ? (rows[0]?.config || {}) : rows);
  }
  if (req.method === 'POST' && req.query?.action === 'login') {
    return authorized(req) ? res.status(200).json({ ok: true }) : res.status(401).json({ error: 'Sai tài khoản hoặc mật khẩu.' });
  }
  if (req.method === 'PUT') {
    if (!authorized(req)) return res.status(401).json({ error: 'Phiên đăng nhập không hợp lệ.' });
    const json = JSON.stringify(req.body).replace(/'/g, "''");
    const response = await query(`update public.site_content set config='${json}'::jsonb, updated_at=now() where id='main';`);
    return response.ok ? res.status(200).json({ ok: true }) : res.status(response.status).json(await response.json());
  }
  res.setHeader('Allow', 'GET, POST, PUT');
  return res.status(405).json({ error: 'Method not allowed' });
};
