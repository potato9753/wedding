// ============================================================
//  tools/bump_version.mjs — 캐시버스팅 버전 스탬프
// ------------------------------------------------------------
//  GitHub Pages 는 커스텀 캐시 헤더를 못 정합니다(모두 max-age=600).
//  카카오 등 인앱 브라우저는 캐시를 오래 잡으므로, 배포마다 CSS/JS URL 에
//  ?v=<버전> 을 붙여 강제로 새로 받게 합니다. (ES 모듈 import 체인까지 스탬프)
//
//  사용법 (배포 직전):
//    node tools/bump_version.mjs
//    git add -A && git commit -m "deploy" && git push ...
// ============================================================
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const now = new Date();
const p = (n) => String(n).padStart(2, "0");
const TOKEN = `${now.getFullYear()}${p(now.getMonth() + 1)}${p(now.getDate())}${p(now.getHours())}${p(now.getMinutes())}`;

function edit(rel, fn) {
  const path = join(root, rel);
  const before = readFileSync(path, "utf8");
  const after = fn(before);
  if (after !== before) {
    writeFileSync(path, after);
    return true;
  }
  return false;
}

// 1) index.html — CSS 링크 + 모듈 진입점(main.js)
edit("index.html", (html) =>
  html
    .replace(/(href=")(css\/[^"?]+\.css)(?:\?v=[^"]*)?(")/g, `$1$2?v=${TOKEN}$3`)
    .replace(/(src=")(js\/main\.js)(?:\?v=[^"]*)?(")/g, `$1$2?v=${TOKEN}$3`)
);

// 2) js/*.js — 로컬 상대 import 체인 (from "./x.js")
const jsDir = join(root, "js");
for (const file of readdirSync(jsDir)) {
  if (!file.endsWith(".js")) continue;
  edit(join("js", file), (src) =>
    src.replace(
      /(from\s*["']\.\/[^"'?]+\.js)(?:\?v=[^"']*)?(["'])/g,
      `$1?v=${TOKEN}$2`
    )
  );
}

console.log(`[bump] cache-busting version = ${TOKEN}`);
