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
 * 갤러리 초기화: [data-gallery] 에 "큰 메인 + 가로 슬라이드 썸네일" 렌더.
 *  - 썸네일 탭/슬라이드 → 선택 사진이 메인에 크게 표시
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

  // 메인 (선택된 사진 크게)
  const main = document.createElement("button");
  main.type = "button";
  main.className = "gallery__main";
  main.setAttribute("aria-label", "선택한 사진 크게 보기");
  const mainImg = document.createElement("img");
  mainImg.className = "gallery__main-img";
  mainImg.decoding = "async";
  main.appendChild(mainImg);
  host.appendChild(main);

  // 가로 슬라이드 썸네일 스트립
  const strip = document.createElement("div");
  strip.className = "gallery__strip";
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
    t.addEventListener("click", () => setMain(i));
    strip.appendChild(t);
    thumbs.push(t);
  });
  host.appendChild(strip);

  // 라이트박스 (body 에 부착)
  const lb = buildLightbox();
  document.body.appendChild(lb.el);

  function centerThumb(el) {
    if (!el || typeof strip.scrollTo !== "function") return;
    const target = (el.offsetLeft || 0) - ((strip.clientWidth || 0) - (el.clientWidth || 0)) / 2;
    strip.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }

  // 메인 사진 교체 + 썸네일 활성 표시 + 가운데 정렬
  function setMain(i, scroll = true) {
    current = wrapIndex(i, images.length);
    const image = images[current];
    mainImg.classList.remove("is-loaded");
    mainImg.src = image.src;
    mainImg.alt = image.alt || `웨딩 사진 ${current + 1}`;
    if (mainImg.complete) mainImg.classList.add("is-loaded");
    else mainImg.addEventListener("load", () => mainImg.classList.add("is-loaded"), { once: true });
    thumbs.forEach((t, idx) => t.classList.toggle("is-active", idx === current));
    if (scroll) centerThumb(thumbs[current]);
  }

  function lbShow(i) {
    setMain(i);
    lb.img.src = images[current].src;
    lb.img.alt = images[current].alt || `웨딩 사진 ${current + 1}`;
    lb.counter.textContent = `${current + 1} / ${images.length}`;
  }
  function open() {
    lbShow(current);
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
  const next = () => lbShow(current + 1);
  const prev = () => lbShow(current - 1);
  function onKey(e) {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight") next();
    else if (e.key === "ArrowLeft") prev();
  }

  main.addEventListener("click", open);
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

  // 초기 선택 (페이지 스크롤 이동 없이)
  setMain(0, false);
}
