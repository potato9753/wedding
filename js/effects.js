// ============================================================
//  effects.js — 화면 연출 (떨어지는 입자 · 커버 인트로 · 스크롤 인디케이터)
// ------------------------------------------------------------
//  * 외부 라이브러리 없음. prefers-reduced-motion 존중.
//  * 탭이 비활성이면 애니메이션을 멈춰 배터리/성능 절약.
// ============================================================

function prefersReduced() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** 화면에 은은하게 떨어지는 입자(꽃잎/눈) 캔버스 오버레이 */
export function initFalling(config) {
  const kind = config?.effects?.falling || "none";
  if (kind === "none" || prefersReduced()) return;
  if (typeof document === "undefined") return;

  const canvas = document.createElement("canvas");
  canvas.className = "fx-falling";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const count = Math.max(6, Math.min(28, config?.effects?.intensity || 16));
  const isSnow = kind === "snow";
  const palette = isSnow
    ? ["rgba(255,255,255,0.9)", "rgba(244,247,250,0.8)"]
    : ["rgba(232,201,207,0.72)", "rgba(243,227,208,0.72)", "rgba(228,210,214,0.66)"];

  let w = 0;
  let h = 0;

  function seed(p, initial) {
    p.x = Math.random() * w;
    p.y = initial ? Math.random() * h : -10 - Math.random() * 40;
    p.size = isSnow ? 2 + Math.random() * 3 : 5 + Math.random() * 6;
    p.speed = (isSnow ? 0.35 : 0.5) + Math.random() * (isSnow ? 0.7 : 1.1);
    p.sway = 0.4 + Math.random() * 1.2;
    p.phase = Math.random() * Math.PI * 2;
    p.rot = Math.random() * Math.PI;
    p.vr = (Math.random() - 0.5) * 0.02;
    p.color = palette[(Math.random() * palette.length) | 0];
    return p;
  }

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();

  const particles = Array.from({ length: count }, () => seed({}, true));

  let raf = null;
  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.y += p.speed;
      p.phase += 0.01;
      p.x += Math.sin(p.phase) * p.sway * 0.3;
      p.rot += p.vr;
      if (p.y - p.size > h) seed(p, false);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      if (isSnow) {
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      } else {
        ctx.ellipse(0, 0, p.size * 0.55, p.size, 0, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.restore();
    }
    raf = requestAnimationFrame(frame);
  }
  frame();

  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    } else if (!raf) {
      frame();
    }
  });
}

/** 커버 스크롤 인디케이터: 스크롤을 시작하면 사라짐 */
export function initCover(root = document) {
  const indicator = root.querySelector("[data-scroll-indicator]");
  if (!indicator) return;
  const onScroll = () => {
    if (window.scrollY > 40) {
      indicator.classList.add("is-hidden");
      window.removeEventListener("scroll", onScroll);
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
}

export function initEffects(config, root = document) {
  initCover(root);
  initFalling(config);
}
