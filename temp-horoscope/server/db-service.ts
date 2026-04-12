import sqlite3 from 'sqlite3';
import path from 'path';
import { promisify } from 'util';

// 静态单例
let db: sqlite3.Database | null = null;
let dbRun: Function;
let dbGet: Function;
let dbAll: Function;
let dbExec: Function;

async function initializeDatabase(): Promise<void> {
  if (db) return;

  const dbPath = path.join(process.cwd(), 'dev.db');
  db = new sqlite3.Database(dbPath);

  dbRun = promisify(db.run.bind(db));
  dbGet = promisify(db.get.bind(db));
  dbAll = promisify(db.all.bind(db));
  dbExec = promisify(db.exec.bind(db));

  await initializeTables();
}

async function initializeTables(): Promise<void> {
  // 表已在init-db.ts中创建，这里不需要重复创建
  console.log('Database ready');
}

export async function getDb(): Promise<{ run: Function; get: Function; all: Function; exec: Function }> {
  if (!db) {
    await initializeDatabase();
  }
  return { run: dbRun, get: dbGet, all: dbAll, exec: dbExec };
}

// 星座相关方法
export async function getZodiacInfo(zodiacName: string): Promise<any> {
  const dbApi = await getDb();
  return await dbApi.get('SELECT * FROM ZodiacSign WHERE name = ?', [zodiacName]);
}

// 运势相关方法
export async function getTodayFortune(zodiac: string, date: string): Promise<any> {
  const dbApi = await getDb();
  return await dbApi.get(
    'SELECT * FROM FortuneContent WHERE zodiac = ? AND date = ?',
    [zodiac, date]
  );
}

export async function createFortuneContent(data: {
  date: string;
  zodiac: string;
  content: any;
  aiRefined?: boolean;
}): Promise<void> {
  const dbApi = await getDb();
  await dbApi.run(
    `INSERT OR REPLACE INTO FortuneContent (id, date, zodiac, content, aiRefined)
     VALUES (?, ?, ?, ?, ?)`,
    [`${data.date}_${data.zodiac}`, data.date, data.zodiac, JSON.stringify(data.content), data.aiRefined ? 1 : 0]
  );
}

// 模板相关方法
export async function getFortuneTemplates(zodiac: string, category?: string): Promise<any[]> {
  const dbApi = await getDb();
  if (category) {
    return await dbApi.all(
      'SELECT * FROM FortuneTemplate WHERE zodiac = ? AND category = ? AND isActive = 1',
      [zodiac, category]
    );
  } else {
    return await dbApi.all(
      'SELECT * FROM FortuneTemplate WHERE zodiac = ? AND isActive = 1',
      [zodiac]
    );
  }
}

export async function createFortuneTemplate(data: {
  zodiac: string;
  category: string;
  content: string;
  weight?: number;
}): Promise<void> {
  const dbApi = await getDb();
  const templateId = `${data.zodiac}_${data.category}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

  await dbApi.run(
    `INSERT OR IGNORE INTO FortuneTemplate (id, zodiac, category, content, weight)
     VALUES (?, ?, ?, ?, ?)`,
    [templateId, data.zodiac, data.category, data.content, data.weight || 1]
  );
}

// 订单相关方法
export async function createTipOrder(data: {
  orderId: string;
  amount: number;
  currency?: string;
  isAnonymous?: boolean;
  metadata?: any;
}): Promise<string> {
  const dbApi = await getDb();
  const id = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  await dbApi.run(
    `INSERT INTO TipOrder (id, orderId, amount, currency, isAnonymous, metadata)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, data.orderId, data.amount, data.currency || 'CNY', data.isAnonymous ? 1 : 0, JSON.stringify(data.metadata || {})]
  );

  return id;
}

export async function updateOrderStatus(orderId: string, status: string, token?: string): Promise<void> {
  const dbApi = await getDb();
  let query = 'UPDATE TipOrder SET status = ?, updatedAt = CURRENT_TIMESTAMP';
  const params: any[] = [status];

  if (token) {
    query += ', token = ?';
    params.push(token);
  }

  query += ' WHERE orderId = ?';
  params.push(orderId);

  await dbApi.run(query, params);
}

export async function getOrderByOrderId(orderId: string): Promise<any> {
  const dbApi = await getDb();
  return await dbApi.get('SELECT * FROM TipOrder WHERE orderId = ?', [orderId]);
}

// 分享卡片相关方法
export async function createShareCard(data: {
  token: string;
  orderId: string;
  imageUrl: string;
  expiresAt: Date;
}): Promise<void> {
  const dbApi = await getDb();
  await dbApi.run(
    `INSERT INTO ShareCard (token, orderId, imageUrl, expiresAt)
     VALUES (?, ?, ?, ?)`,
    [data.token, data.orderId, data.imageUrl, data.expiresAt.toISOString()]
  );
}

export async function incrementCardView(token: string): Promise<void> {
  const dbApi = await getDb();
  await dbApi.run(
    'UPDATE ShareCard SET viewCount = viewCount + 1 WHERE token = ?',
    [token]
  );
}

export async function getShareCard(token: string): Promise<any> {
  const dbApi = await getDb();
  return await dbApi.get('SELECT * FROM ShareCard WHERE token = ?', [token]);
}

// Service object wrapper
export const dbService = {
  getZodiacInfo,
  getTodayFortune,
  getFortuneTemplates,
  createFortuneContent,
  createTipOrder,
  getOrderByOrderId,
  updateOrderStatus,
  createShareCard,
  incrementCardView,
  getShareCard
};
