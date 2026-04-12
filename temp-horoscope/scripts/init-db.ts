#!/usr/bin/env tsx
import sqlite3 from 'sqlite3';
import path from 'path';
import { promisify } from 'util';

async function initializeDatabase() {
  const dbPath = path.join(process.cwd(), 'dev.db');
  console.log(`Initializing database at: ${dbPath}`);

  // 创建数据库连接
  const db = new sqlite3.Database(dbPath);

  // 将回调函数转换为Promise
  const dbRun = promisify(db.run.bind(db));
  const dbGet = promisify(db.get.bind(db));
  const dbAll = promisify(db.all.bind(db));
  const dbExec = promisify(db.exec.bind(db));

  try {
    // 创建星座枚举表
    await dbExec(`
      CREATE TABLE IF NOT EXISTS ZodiacSign (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        chineseName TEXT NOT NULL,
        startMonth INTEGER NOT NULL,
        startDay INTEGER NOT NULL,
        endMonth INTEGER NOT NULL,
        endDay INTEGER NOT NULL,
        element TEXT NOT NULL,
        color TEXT NOT NULL
      );
    `);

    // 插入星座数据
    const zodiacSigns = [
      { name: 'ARIES', chineseName: '白羊座', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19, element: '火', color: '#FF6B6B' },
      { name: 'TAURUS', chineseName: '金牛座', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20, element: '土', color: '#FFD93D' },
      { name: 'GEMINI', chineseName: '双子座', startMonth: 5, startDay: 21, endMonth: 6, endDay: 21, element: '风', color: '#6BCEBB' },
      { name: 'CANCER', chineseName: '巨蟹座', startMonth: 6, startDay: 22, endMonth: 7, endDay: 22, element: '水', color: '#4D96FF' },
      { name: 'LEO', chineseName: '狮子座', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22, element: '火', color: '#FF8C42' },
      { name: 'VIRGO', chineseName: '处女座', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22, element: '土', color: '#9B5DE5' },
      { name: 'LIBRA', chineseName: '天秤座', startMonth: 9, startDay: 23, endMonth: 10, endDay: 23, element: '风', color: '#00BBF9' },
      { name: 'SCORPIO', chineseName: '天蝎座', startMonth: 10, startDay: 24, endMonth: 11, endDay: 22, element: '水', color: '#F15BB5' },
      { name: 'SAGITTARIUS', chineseName: '射手座', startMonth: 11, startDay: 23, endMonth: 12, endDay: 21, element: '火', color: '#FF6B6B' },
      { name: 'CAPRICORN', chineseName: '摩羯座', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19, element: '土', color: '#94D82D' },
      { name: 'AQUARIUS', chineseName: '水瓶座', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18, element: '风', color: '#5F6CAF' },
      { name: 'PISCES', chineseName: '双鱼座', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20, element: '水', color: '#00C2D7' }
    ];

    for (const sign of zodiacSigns) {
      await new Promise<void>((resolve, reject) => {
        db.run(
          'INSERT OR IGNORE INTO ZodiacSign (name, chineseName, startMonth, startDay, endMonth, endDay, element, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [sign.name, sign.chineseName, sign.startMonth, sign.startDay, sign.endMonth, sign.endDay, sign.element, sign.color],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    }

    // 创建运势内容表
    await dbExec(`
      CREATE TABLE IF NOT EXISTS FortuneContent (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        zodiac TEXT NOT NULL,
        content TEXT NOT NULL,
        aiRefined INTEGER DEFAULT 0,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(date, zodiac)
      );
    `);

    // 创建运势模板表
    await dbExec(`
      CREATE TABLE IF NOT EXISTS FortuneTemplate (
        id TEXT PRIMARY KEY,
        zodiac TEXT NOT NULL,
        category TEXT NOT NULL,
        content TEXT NOT NULL,
        weight INTEGER DEFAULT 1,
        isActive INTEGER DEFAULT 1,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(zodiac, category, content)
      );
    `);

    // 创建打赏订单表
    await dbExec(`
      CREATE TABLE IF NOT EXISTS TipOrder (
        id TEXT PRIMARY KEY,
        orderId TEXT UNIQUE NOT NULL,
        amount REAL NOT NULL,
        currency TEXT DEFAULT 'CNY',
        status TEXT DEFAULT 'PENDING',
        isAnonymous INTEGER DEFAULT 1,
        metadata TEXT,
        token TEXT UNIQUE,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 创建分享卡片表
    await dbExec(`
      CREATE TABLE IF NOT EXISTS ShareCard (
        id TEXT PRIMARY KEY,
        token TEXT UNIQUE NOT NULL,
        orderId TEXT UNIQUE NOT NULL,
        imageUrl TEXT NOT NULL,
        expiresAt TEXT NOT NULL,
        viewCount INTEGER DEFAULT 0,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Database tables created successfully!');

    // 插入一些示例模板
    console.log('Creating sample fortune templates...');

    const sampleTemplates = [
      { zodiac: 'ARIES', category: 'overall', content: '今天白羊座的你充满活力，适合开始新项目。', weight: 2 },
      { zodiac: 'TAURUS', category: 'love', content: '金牛座的爱情运势平稳，适合与伴侣深入沟通。', weight: 1 },
      { zodiac: 'GEMINI', category: 'career', content: '双子座的工作中可能遇到新机会，保持开放心态。', weight: 1 },
      { zodiac: 'CANCER', category: 'health', content: '巨蟹座需要注意饮食健康，避免生冷食物。', weight: 1 },
      { zodiac: 'LEO', category: 'wealth', content: '狮子座财运不错，但需要理性消费。', weight: 1 },
      { zodiac: 'VIRGO', category: 'saying', content: '细节决定成败，认真对待每一件事。', weight: 1 },
    ];

    for (const template of sampleTemplates) {
      const templateId = `${template.zodiac}_${template.category}_${Date.now()}`;
      await new Promise<void>((resolve, reject) => {
        db.run(
          'INSERT OR IGNORE INTO FortuneTemplate (id, zodiac, category, content, weight) VALUES (?, ?, ?, ?, ?)',
          [templateId, template.zodiac, template.category, template.content, template.weight],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    }

    console.log('Sample data inserted!');

  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    // 关闭数据库连接
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('Database connection closed');
      }
    });
  }
}

// 运行初始化
initializeDatabase()
  .then(() => {
    console.log('Database initialization completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });