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

/**
 * 갤러리 초기화: [data-gallery] 에 "스와이프 메인 캐러셀 + 전체 썸네일 인디케이터" 렌더.
 *  - 메인을 좌우로 밀면(스크롤 스냅) 한 장씩 넘어감 → 아래 썸네일 하이라이트 이동
 *  - 썸네일 전부 한 줄에 보임(사진 개수 한눈에), 탭하면 해당 사진으로 이동
 *  - 메인 탭 → 라이트박스(전체화면, 스와이프/키보드)
 */
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

  let current = 0;

  // 메인 캐러셀 (액자 + 가로 스크롤 스냅 뷰포트)
  const frame = document.createElement("div");
  frame.className = "gallery__frame";
  const viewport = document.createElement("div");
  viewport.className = "gallery__viewport";
  const slides = [];
  images.forEach((image, i) => {
    const slide = document.createElement("button");
    slide.type = "button";
    slide.className = "gallery__slide";
    slide.setAttribute("aria-label", `사진 ${i + 1} 크게 보기`);
    const im = document.createElement("img");
    im.className = "gallery__slide-img gallery__img";
    im.src = image.src;
    im.alt = image.alt || `웨딩 사진 ${i + 1}`;
    im.loading = i === 0 ? "eager" : "lazy";
    im.decoding = "async";
    if (im.complete) im.classList.add("is-loaded");
    else im.addEventListener("load", () => im.classList.add("is-loaded"), { once: true });
    slide.appendChild(im);
    slide.addEventListener("click", () => open(i));
    viewport.appendChild(slide);
    slides.push(slide);
  });
  frame.appendChild(viewport);
  host.appendChild(frame);

  // 현재 위치 표시 (n / 전체)
  const count = document.createElement("p");
  count.className = "gallery__count";
  host.appendChild(count);

  // 전체 썸네일 (한 줄에 모두 보임 = 개수 한눈에)
  const strip = document.createElement("div");
  strip.className = "gallery__thumbs";
  const thumbs = [];
  images.forEach((image, i) => {
    const t = document.createElement("button");
    t.type = "button";
    t.className = "gallery__thumb";
    t.setAttribute("aria-label", `${i + 1}번 사진 보기`);
    const im = document.createElement("img");
    im.className = "gallery__img";
    im.src = image.src;
    im.alt = image.alt || `웨딩 사진 ${i + 1}`;
    im.loading = "lazy";
    im.decoding = "async";
    if (im.complete) im.classList.add("is-loaded");
    else im.addEventListener("load", () => im.classList.add("is-loaded"), { once: true });
    t.appendChild(im);
    t.addEventListener("click", () => goTo(i, true));
    strip.appendChild(t);
    thumbs.push(t);
  });
  host.appendChild(strip);

  // 라이트박스 (body 에 부착)
  const lb = buildLightbox();
  document.body.appendChild(lb.el);

  const slideWidth = () => viewport.clientWidth || 1;

  // 현재 인덱스 표시 갱신 (스크롤/선택 공용)
  function setActive(i) {
    current = wrapIndex(i, images.length);
    thumbs.forEach((t, idx) => t.classList.toggle("is-active", idx === current));
    count.textContent = `${current + 1} / ${images.length}`;
  }

  // 메인을 특정 사진으로 이동 (썸네일 탭 등)
  function goTo(i, smooth) {
    const idx = wrapIndex(i, images.length);
    if (typeof viewport.scrollTo === "function") {
      viewport.scrollTo({ left: idx * slideWidth(), behavior: smooth ? "smooth" : "auto" });
    }
    setActive(idx);
  }

  // 메인 좌우 스크롤 → 현재 사진 갱신 (한 장씩)
  let sTicking = false;
  viewport.addEventListener(
    "scroll",
    () => {
      if (sTicking) return;
      sTicking = true;
      requestAnimationFrame(() => {
        sTicking = false;
        const idx = Math.round(viewport.scrollLeft / slideWidth());
        if (idx !== current) setActive(idx);
      });
    },
    { passive: true }
  );
  if (typeof window !== "undefined") {
    // 회전/리사이즈 시 현재 사진 위치 재정렬
    window.addEventListener("resize", () => goTo(current, false), { passive: true });
  }

  // 라이트박스
  function lbShow(i) {
    setActive(i);
    lb.img.src = images[current].src;
    lb.img.alt = images[current].alt || `웨딩 사진 ${current + 1}`;
    lb.counter.textContent = `${current + 1} / ${images.length}`;
  }
  function open(i) {
    lbShow(i);
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
    goTo(current, false); // 라이트박스에서 넘긴 위치로 메인 동기화
  }
  const next = () => lbShow(current + 1);
  const prev = () => lbShow(current - 1);
  function onKey(e) {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight") next();
    else if (e.key === "ArrowLeft") prev();
  }

  lb.closeBtn.addEventListener("click", close);
  lb.nextBtn.addEventListener("click", (e) => { e.stopPropagation(); next(); });
  lb.prevBtn.addEventListener("click", (e) => { e.stopPropagation(); prev(); });
  lb.el.addEventListener("click", (e) => {
    if (e.target === lb.el || e.target === lb.stage) close();
  });

  // 라이트박스 스와이프 (좌/우)
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

  // 초기 상태
  setActive(0);
}
