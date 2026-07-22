import { execSync } from 'child_process';
const root = 'D:/workbuddy/express-news';
const opts = { cwd: root, stdio: 'inherit', encoding: 'utf8' };
execSync('git add -A', opts);
const out = execSync('git commit -m "feat: 43区县动态检索+电商线索+安全事件三视图" --allow-empty', opts);
console.log('commit:', out.toString().trim());
execSync('git push', opts);
const log = execSync('git log --oneline -3', opts);
console.log('log:\n' + log);
