# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个星座运势网站，基于Next.js 16.1.6 (App Router)构建。用户输入生日后，系统判断星座并显示今日运势，支持个性化规则、历史记录和运势分享卡片功能。

## 常用命令

### 开发
```bash
npm run dev           # 启动开发服务器（默认localhost:3000，可指定端口如 -p 3005）
npm run build         # 构建生产版本
npm run start         # 启动生产服务器
npm run lint          # 代码检查
```

### 数据库操作
```bash
npm run db:init          # 初始化SQLite数据库（创建表和示例数据）
npm run db:reset         # 重置数据库（删除并重新初始化）
npm run prisma:generate  # 生成Prisma客户端类型（如果使用Prisma）
npm run prisma:studio    # 打开Prisma Studio数据库管理界面
```

### 数据生成
```bash
npm run generate:daily   # 生成每日运势数据（为12星座生成今日运势）
npm run seed:templates   # 初始化运势模板（添加更多运势模板）
```

### 测试
```bash
curl http://localhost:3005/api/fortune/today?birthday=2000-01-01  # 测试API
```

## 项目架构

### 目录结构
```
temp-horoscope/         # 项目根目录
├── app/                # Next.js App Router页面和API路由
│   ├── api/            # API路由
│   │   ├── fortune/today/route.ts    # 获取今日运势API
│   │   └── share-card/route.ts       # 分享卡片API
│   ├── page.tsx        # 主页（MVP演示页面）
│   ├── layout.tsx      # 根布局
│   ├── history/page.tsx # 历史记录页面
│   ├── analytics/page.tsx # 数据分析页面
│   └── card/[token]/page.tsx # 运势分享卡片页面
├── components/         # React组件
│   ├── ui/button.tsx   # 按钮组件（支持加载状态）
│   ├── BirthdayForm.tsx # 生日输入表单
│   ├── FortuneResult.tsx # 运势结果显示
│   ├── HistoryList.tsx # 历史记录列表组件
│   └── ShareCardPreview.tsx # 分享卡片预览组件
├── lib/               # 工具函数库
│   ├── zodiac.ts      # 星座判断逻辑 ✓ 已完成
│   ├── birthday.ts    # 生日验证和格式化 ✓ 已完成
│   ├── personalization.ts # 个性化规则引擎 ✓ 已完成
│   ├── local-history.ts   # 本地历史记录管理 ✓ 已完成
│   ├── ai-fortune.ts   # AI运势润色服务 ✓ 已完成
│   └── prisma.ts      # Prisma客户端配置（备用）
├── server/            # 服务器端服务
│   ├── db-service.ts      # 数据库访问服务 ✓ 已完成
│   └── share-card-service.ts # 分享卡片服务 ✓ 已完成
├── scripts/           # 脚本文件
│   ├── init-db.ts              # 数据库初始化脚本 ✓ 已完成
│   ├── generate-daily-fortune.ts # 每日运势生成脚本 ✓ 已完成
│   └── seed-template.ts        # 模板初始化脚本 ✓ 已完成
├── prisma/            # 数据库配置
│   ├── schema.prisma  # 数据模型定义
│   └── config.ts      # Prisma配置文件
├── public/            # 静态资源
├── dev.db             # SQLite数据库文件
└── .env.local         # 环境变量配置
```

### 核心模块（已完成✓）

1. **星座判断** (`lib/zodiac.ts`) ✓
   - 国际通用星座日期范围
   - 根据生日计算星座、星座周期天数
   - 星座颜色、元素等信息

2. **运势生成** (`app/api/fortune/today/route.ts`) ✓
   - 基于星座返回运势内容
   - 支持模板化和个性化规则
   - 自动生成或从数据库获取今日运势

3. **个性化规则引擎** (`lib/personalization.ts`) ✓
   - 基于生日生成幸运数字、颜色、速配星座
   - 使用种子算法确保一致性
   - 生成心情建议和个性化建议

4. **历史记录管理** (`lib/local-history.ts`) ✓
   - localStorage存储查询历史
   - 支持增删改查和统计
   - 导出/导入功能

5. **数据库服务** (`server/db-service.ts`) ✓
   - SQLite数据库访问封装
   - 支持所有数据表CRUD操作
   - 星座信息、运势内容、模板、分享卡片管理

6. **分享卡片系统** (`server/share-card-service.ts`) ✓
   - 生成运势分享卡片HTML
   - 卡片统计和验证
   - 星座主题卡片设计

7. **脚本系统** (`scripts/`) ✓
   - 数据库初始化脚本
   - 每日运势生成脚本
   - 模板初始化脚本

### 数据模型 (SQLite)

- **ZodiacSign**: 星座信息表（名称、中文名、日期范围、元素、颜色）
- **FortuneContent**: 每日运势内容（按日期和星座存储JSON格式运势）
- **FortuneTemplate**: 运势模板表（按星座和分类存储模板，支持权重）
- **ShareCard**: 分享卡片（运势分享内容，包含查看次数、过期时间）

数据库文件: `dev.db` (SQLite3)

### 技术栈

- **前端**: Next.js 16.1.6, React 19.2.3, TypeScript, Tailwind CSS v4
- **后端**: Next.js API Routes, SQLite3直接操作（开发）, PostgreSQL（生产计划）
- **数据库**: SQLite3 (开发), 支持迁移到PostgreSQL
- **工具**: date-fns (日期处理), better-sqlite3 (数据库驱动)
- **API**: RESTful API设计, JSON响应格式

## 开发注意事项

### 数据库配置
- 开发环境使用SQLite (`DATABASE_URL="file:./dev.db"`)
- 数据库初始化: 运行 `npm run db:init` 创建表和示例数据
- 数据重置: 运行 `npm run db:reset` 删除并重新初始化数据库
- 生产环境计划迁移到PostgreSQL（需配置环境变量）

### 类型安全
- 项目使用TypeScript严格模式
- Prisma客户端类型会自动生成
- API响应和组件Props都有完整类型定义

### 样式系统
- Tailwind CSS v4 配置在 `tailwind.config.ts`
- 自定义星座颜色主题 (`zodiac.aries`, `zodiac.taurus`等)
- 响应式设计和暗色模式支持

### 环境变量
- 开发配置在 `.env.local`
- 示例配置在 `.env.example`

### 组件约定
- 使用 `@/` 别名导入
- UI组件在 `components/ui/` 目录
- 页面组件在 `app/` 目录
- 服务逻辑在 `server/` 目录

## 故障排除

### 常见问题
1. **端口占用**: 默认端口3000或3005被占用
   - 检查占用进程: `netstat -ano | findstr :3005`
   - 终止占用进程: `taskkill /PID <PID> /F`
   - 使用其他端口: `npm run dev -- -p 3006`
2. **数据库连接**: 确认 `dev.db` 文件存在，或运行 `npm run db:init`
3. **API测试**: 使用 `curl http://localhost:3005/api/fortune/today?birthday=2000-01-01` 测试
4. **类型错误**: 运行 `npx tsc --noEmit` 验证TypeScript错误
5. **构建失败**: 检查组件导入路径，确保使用 `@/` 别名
6. **Prisma相关**: 如果使用Prisma，运行 `npm run prisma:generate`
7. **共享服务错误**: 确保服务器端服务在正确的目录导入

### 构建问题

## 扩展项目

### 添加新功能
1. 在 `lib/` 添加核心逻辑
2. 在 `server/` 添加服务层
3. 在 `app/api/` 添加API路由
4. 在 `components/` 添加UI组件
5. 在 `prisma/schema.prisma` 更新数据模型

### 修改样式
- 更新 `tailwind.config.ts` 中的主题配置
- 全局样式在 `app/globals.css`
- 组件特定样式使用Tailwind类名

### 部署
- 生产环境使用PostgreSQL数据库
- 环境变量需要配置数据库连接字符串
- Vercel部署时配置 `DATABASE_URL` 等环境变量

## 项目状态 (2026-04-09)

### ✅ 已完成的核心功能

1. **数据库系统**
   - SQLite数据库 (`dev.db`) 已初始化
   - 4个数据表: ZodiacSign, FortuneContent, FortuneTemplate, ShareCard
   - 12星座基础数据已插入

2. **服务层** (全部完成)
   - `server/db-service.ts`: 数据库访问服务
   - `server/share-card-service.ts`: 分享卡片服务

3. **工具库** (全部完成)
   - `lib/zodiac.ts`: 星座判断逻辑
   - `lib/birthday.ts`: 生日验证和格式化
   - `lib/personalization.ts`: 个性化规则引擎
   - `lib/local-history.ts`: 本地历史记录管理
   - `lib/ai-fortune.ts`: AI运势润色服务（模拟）

4. **API路由** (全部完成)
   - `GET /api/fortune/today?birthday=YYYY-MM-DD`: 获取今日运势
   - `GET /api/share-card?token=...`: 获取分享卡片

5. **脚本系统** (全部完成)
   - `scripts/init-db.ts`: 数据库初始化脚本
   - `scripts/generate-daily-fortune.ts`: 每日运势生成脚本
   - `scripts/seed-template.ts`: 模板初始化脚本

6. **前端组件** (全部完成)
   - `components/ui/button.tsx`: 通用按钮组件
   - `components/BirthdayForm.tsx`: 生日输入表单
   - `components/FortuneResult.tsx`: 运势结果显示
   - `components/HistoryList.tsx`: 历史记录列表组件
   - `components/ShareCardPreview.tsx`: 分享卡片预览组件
   - `app/page.tsx`: 完整的MVP演示页面
   - `app/history/page.tsx`: 历史记录页面
   - `app/analytics/page.tsx`: 数据分析页面
   - `app/card/[token]/page.tsx`: 运势分享卡片详情页

### ✅ 最近更新 (2026-04-09)

**移除打赏支付模块**
- 删除 `app/tip/` 目录（打赏成功页面）
- 删除 `app/api/tip/` 目录（打赏支付API）
- 删除 `server/tip-service.ts`（打赏支付服务）
- 删除 `components/TipPanel.tsx`（打赏面板组件）
- 修改 `app/page.tsx`: 移除打赏按钮和相关状态
- 修改 `app/card/[token]/page.tsx`: 改为纯运势分享功能
- 修改 `server/share-card-service.ts`: 移除打赏相关字段，改为运势分享数据
- 修改 `components/ShareCardPreview.tsx`: 改为运势分享预览

### ✅ 构建状态
- **构建状态**: ✅ 成功编译，无TypeScript错误
- **构建输出**: 所有页面已生成
  - 静态页面: `/`, `/_not-found`, `/analytics`, `/history`
  - 动态页面: `/api/fortune/today`, `/api/share-card`, `/card/[token]`

### 🚀 当前运行状态
- **开发服务器**: 端口3005（如被占用，请先终止占用进程或使用其他端口）
- **API测试**: `curl http://localhost:3005/api/fortune/today?birthday=2000-01-01`
- **数据库**: SQLite `dev.db` 已就绪

### 📋 待完成项目

#### 功能增强
- AI润色运势内容（接入真实AI服务）
- 用户系统（注册登录，可选）
- 性能优化和缓存策略

#### 部署准备
- 生产数据库迁移到PostgreSQL
- 生产环境变量配置
- 安全性加固

### 🔧 技术支持
- 项目框架已完整搭建
- 所有核心模块类型安全
- 支持热重载开发
- 完整的脚本工具链
- 代码已通过TypeScript严格模式检查

### 📝 最新进展总结 (2026-04-09)

#### 构建成功 ✅
- **TypeScript编译**: 通过严格模式检查
- **所有页面**: 成功生成并渲染
- **API路由**: 正常工作

#### 页面路由完整列表
- **静态页面**: `/`, `/_not-found`, `/analytics`, `/history`
- **动态页面**: `/api/fortune/today`, `/api/share-card`
- **详情页面**: `/card/[token]`

项目现在已完全构建成功，可以正常运行！
