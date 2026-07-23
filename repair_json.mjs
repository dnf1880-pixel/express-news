// repair_json.mjs — 修复 search-results-*.json 中字符串值内未转义的引号
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ARCHIVE = join(process.cwd(), 'archive');

function repairJsonLike(text) {
  let out = '';
  let i = 0;
  let inString = false;
  let escape = false;
  while (i < text.length) {
    const ch = text[i];
    if (inString) {
      if (escape) {
        out += ch;
        escape = false;
      } else if (ch === '\\') {
        out += ch;
        escape = true;
      } else if (ch === '"') {
        // 可能是字符串结束，也可能是内部未转义引号
        let j = i + 1;
        while (j < text.length && /\s/.test(text[j])) j++;
        const next = text[j];
        // 如果下一个是结构符号，视为字符串结束；否则转义
        if (next === ':' || next === ',' || next === '}' || next === ']' || j >= text.length) {
          out += ch;
          inString = false;
        } else {
          out += '\\"';
        }
      } else {
        out += ch;
      }
    } else {
      out += ch;
      if (ch === '"') inString = true;
    }
    i++;
  }
  return out;
}

const files = readdirSync(ARCHIVE).filter(f => f.startsWith('search-results-') && f.endsWith('.json'));
for (const f of files) {
  const path = join(ARCHIVE, f);
  const text = readFileSync(path, 'utf8');
  try {
    JSON.parse(text);
    console.log(`${f}: valid`);
  } catch (e) {
    const fixed = repairJsonLike(text);
    try {
      JSON.parse(fixed);
      writeFileSync(path, fixed, 'utf8');
      console.log(`${f}: repaired`);
    } catch (e2) {
      console.error(`${f}: repair failed`, e2.message);
    }
  }
}
