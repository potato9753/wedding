// ============================================================
//  tap-zoom.js — 사진 탭하면 크게 보기 (커버 콜라주 · 가족 사진 · 대표메뉴)
// ------------------------------------------------------------
//  * data-zoom 이 붙은 <img> 를 탭하면 전체화면 오버레이로 원본을 크게 보여줍니다.
//  * 갤러리(gallery.js)는 자체 라이트박스가 있어 여기서 다루지 않습니다.
// ============================================================

let overlay = null;

function buildOverlay() {
  const el = document.createElement("div");
  el.className = "zoom-view";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-modal", "true");
  el.setAttribute("aria-label", "사진 크게 보기");
  el.setAttribute("aria-hidden", "true");
  const img = document.createElement("img");
  img.className = "zoom-view__img";
  img.decoding = "async";
  el.appendChild(img);
  document.body.appendChild(el);
  el.addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && el.classList.contains("is-open")) close();
  });
  return { el, img };
}

function open(src, alt) {
  if (!overlay) overlay = buildOverlay();
  overlay.img.src = src;
  overlay.img.alt = alt || "";
  overlay.el.classList.add("is-open");
  overlay.el.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}

function close() {
  if (!overlay) return;
  overlay.el.classList.remove("is-open");
  overlay.el.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}

/** [data-zoom] 이 붙은 이미지들에 탭-확대 동작을 연결합니다. */
export function initTapZoom(root = document) {
  const imgs = root.querySelectorAll("img[data-zoom]");
  imgs.forEach((img) => {
    if (img.dataset.zoomBound) return;
    img.dataset.zoomBound = "1";
    img.addEventListener("click", () => open(img.currentSrc || img.src, img.alt));
  });
}

export default initTapZoom;
