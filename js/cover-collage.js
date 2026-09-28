// ============================================================
//  cover-collage.js — 커버 사진 콜라주 (상견례: 대표 사진 1장 대신
//  여러 장을 흩뿌린 폴라로이드 무드보드로 구성)
// ------------------------------------------------------------
//  * [data-cover-collage] 컨테이너에 config.cover.collage 배열을 렌더합니다.
//  * 배치·회전은 CSS(:nth-child)가 담당 — 사진 개수가 바뀌면 CSS도 함께 조정하세요.
// ============================================================

export function renderCoverCollage(config, root = document) {
  const host = root.querySelector("[data-cover-collage]");
  if (!host) return;
  const items = Array.isArray(config?.cover?.collage)
    ? config.cover.collage.filter((p) => p && p.src)
    : [];
  host.textContent = "";
  if (!items.length) return;

  items.forEach((item, i) => {
    const fig = document.createElement("figure");
    fig.className = "cover-collage__item";
    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.alt || "";
    img.loading = i === 0 ? "eager" : "lazy";
    img.decoding = "async";
    img.setAttribute("data-zoom", "");
    fig.appendChild(img);
    host.appendChild(fig);
  });
}

export default renderCoverCollage;
