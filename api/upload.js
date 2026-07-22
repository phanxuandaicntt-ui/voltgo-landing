const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

function authorized(req) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Basic ')) return false;
  const [user, pass] = Buffer.from(header.slice(6), 'base64').toString().split(':');
  return user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASSWORD;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!authorized(req)) return res.status(401).json({ error: 'Không có quyền tải lên.' });
  const name = String(req.headers['x-file-name'] || 'media').replace(/[^a-zA-Z0-9._-]/g, '-');
  const path = `${Date.now()}-${name}`;
  let body;
  if (Buffer.isBuffer(req.body)) body = req.body;
  else if (typeof req.body === 'string') body = Buffer.from(req.body);
  else { const chunks = []; for await (const chunk of req) chunks.push(chunk); body = Buffer.concat(chunks); }
  if (!body.length || body.length > 4 * 1024 * 1024) return res.status(400).json({ error: 'Tệp phải nhỏ hơn 4MB.' });
  const response = await fetch(`${SUPABASE_URL}/storage/v1/object/site-media/${path}`, {
    method: 'POST', headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': req.headers['content-type'] || 'application/octet-stream', 'x-upsert': 'true' }, body
  });
  if (!response.ok) return res.status(response.status).json(await response.json());
  return res.status(200).json({ url: `${SUPABASE_URL}/storage/v1/object/public/site-media/${path}` });
};
