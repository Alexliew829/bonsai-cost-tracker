// pages/api/saveBonsai.js
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}
const db = getFirestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只接受 POST 请求' });
  }

  const data = req.body;

  // 自动补上 timestamp 字段（可作为记录时间）
  data.timestamp = new Date().toISOString();

  try {
    await db.collection('bonsai_records').add(data);
    res.status(200).json({ success: true, message: '已成功储存资料' });
  } catch (err) {
    console.error('储存错误', err);
    res.status(500).json({ success: false, error: '储存失败' });
  }
}
