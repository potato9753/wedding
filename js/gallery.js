// ============================================================
//  gallery.js — 사진 그리드 + 라이트박스
//  (탭 → 전체화면 뷰어: 이전/다음 · 스와이프 · 키보드 · 닫기)
// ------------------------------------------------------------
//  * wrapIndex 만 순수 함수(테스트 대상). 나머지는 브라우저 전용.
// ============================================================

/** 인덱스를 0..len-1 범위로 순환 (len<=0 이면 0) */
export function wrapIndex(i, len) {
  if (len <= 0) return 0;
  return ((i % len) + len) % len;
}

function makeButton(className, label, glyph) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = className;
  b.setAttribute("aria-label", label);
  b.textContent = glyph;
  return b;
}

function buildLightbox() {
  const el = document.createElement("div");
  el.className = "lightbox";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-modal", "true");
  el.setAttribute("aria-label", "사진 크게 보기");
  el.setAttribute("aria-hidden", "true");

  const stage = document.createElement("div");
  stage.className = "lightbox__stage";
  const img = document.createElement("img");
  img.className = "lightbox__img";
  img.decoding = "async";
  stage.appendChild(img);

  const closeBtn = makeButton("lightbox__close", "닫기", "\u2715");
  const prevBtn = makeButton("lightbox__nav lightbox__prev", "이전 사진", "\u2039");
  const nextBtn = makeButton("lightbox__nav lightbox__next", "다음 사진", "\u203A");
  const counter = document.createElement("p");
  counter.className = "lightbox__counter";

  el.append(closeBtn, prevBtn, stage, nextBtn, counter);
  return { el, stage, img, closeBtn, prevBtn, nextBtn, counter };
}

/** 갤러리 초기화: [data-gallery] 에 그리드 렌더 + 라이트박스 연결 */
export function initGallery(config, root = document) {
  const host = root.querySelector("[data-gallery]");
  if (!host) return;

  const images = Array.isArray(config?.gallery?.images) ? config.gallery.images : [];
  host.textContent = "";

  if (!images.length) {
    const empty = document.createElement("p");
    empty.className = "gallery__empty";
    empty.textContent = "사진 준비 중입니다.";
    host.appendChild(empty);
    return;
  }

  // 썸네일 그리드
  const grid = document.createElement("div");
  grid.className = "gallery__grid";
  images.forEach((image, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "gallery__item";
    btn.setAttribute("aria-label", `사진 ${i + 1} 크게 보기`);
    const thumb = document.createElement("img");
    thumb.src = image.src;
    thumb.alt = image.alt || `웨딩 사진 ${i + 1}`;
    thumb.loading = "lazy";
    thumb.decoding = "async";
    btn.appendChild(thumb);
    btn.addEventListener("click", () => open(i));
    grid.appendChild(btn);
  });
  host.appendChild(grid);

  // 라이트박스 (body 에 부착)
  const lb = buildLightbox();
  document.body.appendChild(lb.el);

  let current = 0;

  function show(i) {
    current = wrapIndex(i, images.length);
    const image = images[current];
    lb.img.src = image.src;
    lb.img.alt = image.alt || `웨딩 사진 ${current + 1}`;
    lb.counter.textContent = `${current + 1} / ${images.length}`;
  }
  function open(i) {
    show(i);
    lb.el.classList.add("is-open");
    lb.el.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    document.addEventListener("keydown", onKey);
  }
  function close() {
    lb.el.classList.remove("is-open");
    lb.el.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    document.removeEventListener("keydown", onKey);
  }
  const next = () => show(current + 1);
  const prev = () => show(current - 1);
  function onKey(e) {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight") next();
    else if (e.key === "ArrowLeft") prev();
  }

  lb.closeBtn.addEventListener("click", close);
  lb.nextBtn.addEventListener("click", (e) => { e.stopPropagation(); next(); });
  lb.prevBtn.addEventListener("click", (e) => { e.stopPropagation(); prev(); });
  // 배경(이미지 외부) 탭 시 닫기
  lb.el.addEventListener("click", (e) => {
    if (e.target === lb.el || e.target === lb.stage) close();
  });

  // 스와이프 (좌/우)
  let startX = 0, startY = 0, tracking = false;
  lb.stage.addEventListener("touchstart", (e) => {
    const t = e.changedTouches[0];
    startX = t.clientX; startY = t.clientY; tracking = true;
  }, { passive: true });
  lb.stage.addEventListener("touchend", (e) => {
    if (!tracking) return;
    tracking = false;
    const t = e.changedTouches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next(); else prev();
    }
  }, { passive: true });
}
