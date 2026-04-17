const { execSync } = require("child_process");
const { existsSync, renameSync, rmSync } = require("fs");
const { join } = require("path");

const apiDir = join(process.cwd(), "app", "api");
const apiBackupDir = join(process.cwd(), "app", "_api_backup");
const nextDir = join(process.cwd(), ".next");

try {
  // 1. 清理缓存，避免 Turbopack 类型检查引用已移除的 API 路由
  if (existsSync(nextDir)) {
    console.log("Cleaning .next cache...");
    rmSync(nextDir, { recursive: true, force: true });
  }

  // 2. 准备静态 API JSON
  console.log("Preparing static API...");
  execSync("npx tsx scripts/prepare-static-api.ts", { stdio: "inherit" });

  // 3. 临时移除 API 路由（静态导出不支持）
  if (existsSync(apiDir)) {
    console.log("Temporarily excluding API routes for static export...");
    renameSync(apiDir, apiBackupDir);
  }

  // 4. 运行静态导出构建
  console.log("Running static export build...");
  execSync("cross-env STATIC_EXPORT=true npm run build", { stdio: "inherit" });

  console.log("Cloudflare Pages build completed.");
} catch (err) {
  console.error("Build failed:", err);
  process.exit(1);
} finally {
  // 5. 恢复 API 路由
  if (existsSync(apiBackupDir)) {
    console.log("Restoring API routes...");
    renameSync(apiBackupDir, apiDir);
  }
}
