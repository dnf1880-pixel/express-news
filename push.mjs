#!/usr/bin/env node
// 推送脚本：git add/commit/push，push 失败每 60 秒自动重试（最多 5 次）。
// 用法：node push.mjs [YYYY-MM-DD]
// 退出码：0=推送成功；1=全部重试仍失败（前端已生成，不阻断，下次可补推）。
import { execSync } from 'child_process';

const date = process.argv[2] || new Date().toISOString().slice(0, 10);
const MAX = 5;
const WAIT = 60000; // 1 分钟

function exec(cmd) {
  execSync(cmd, { stdio: 'ignore' });
}
function execOk(cmd) {
  try { execSync(cmd, { stdio: 'ignore' }); return true; }
  catch (e) { return false; }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  // 1. 暂存
  exec('git add -A');

  // 2. 有变更才提交
  let changed = false;
  try { execSync('git diff --cached --quiet', { stdio: 'ignore' }); }
  catch (e) { changed = true; }
  if (changed) {
    try {
      exec(`git commit -m "每日刷新 ${date}"`);
      console.log(`✓ commit: 每日刷新 ${date}`);
    } catch (e) {
      console.log('⚠ commit 失败，继续尝试 push');
    }
  } else {
    console.log('· 无新变更，跳过 commit');
  }

  // 3. push 重试
  let ok = false;
  for (let i = 1; i <= MAX; i++) {
    if (execOk('git push origin main')) {
      ok = true;
      console.log(`✓ push 成功（第 ${i} 次尝试）`);
      break;
    }
    console.log(`✗ push 失败（第 ${i}/${MAX} 次）`);
    if (i < MAX) {
      console.log('· 60 秒后重试…');
      await sleep(WAIT);
    }
  }

  if (!ok) {
    console.log('✗ 全部重试失败，本地提交已保留，下次触发自动补推');
    process.exit(1);
  }
  process.exit(0);
})();
