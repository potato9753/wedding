// ============================================================
//  effects.js — 화면 연출 (떨어지는 입자 · 커버 인트로 · 스크롤 인디케이터)
// ------------------------------------------------------------
//  * 외부 라이브러리 없음. prefers-reduced-motion 존중.
//  * 탭이 비활성이면 애니메이션을 멈춰 배터리/성능 절약.
//  * 입자는 소프트 글로우 스프라이트를 drawImage 로 재사용 → 많아도 가벼움.
// ============================================================

function prefersReduced() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** 입자 소프트 글로우 스프라이트 1회 생성 (눈: 원형 글로우 / 꽃잎: 타원 글로우) */
function makeSprite(isSnow) {
  const S = 64;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  if (isSnow) {
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.45, "rgba(249,251,253,0.95)");
    grad.addColorStop(0.75, "rgba(205,214,226,0.55)"); // 쿨 그레이 링 → 밝은 배경에서도 보임
    grad.addColorStop(1, "rgba(205,214,226,0)");
    g.fillStyle = grad;
    g.beginPath();
    g.arc(S / 2, S / 2, S / 2, 0, Math.PI * 2);
    g.fill();
  } else {
    grad.addColorStop(0, "rgba(236,206,210,0.95)");
    grad.addColorStop(0.7, "rgba(240,222,214,0.6)");
    grad.addColorStop(1, "rgba(240,222,214,0)");
    g.fillStyle = grad;
    g.save();
    g.translate(S / 2, S / 2);
    g.scale(0.62, 1);
    g.beginPath();
    g.arc(0, 0, S / 2, 0, Math.PI * 2);
    g.fill();
    g.restore();
  }
  return c;
}

/** 화면에 떨어지는 입자(눈/꽃잎) — 원근감 + 반짝임 + 좌우 드리프트 */
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
  const count = Math.max(8, Math.min(60, config?.effects?.intensity || 28));
  const isSnow = kind === "snow";
  const sprite = makeSprite(isSnow);

  let w = 0;
  let h = 0;

  function seed(p, initial) {
    p.depth = 0.5 + Math.random() * 0.7; // 원근감(0.5=멀리, ~1.2=가까이)
    p.x = Math.random() * w;
    p.y = initial ? Math.random() * h : -24;
    p.size = (isSnow ? 3 : 6) * p.depth + Math.random() * 3;
    p.speed = ((isSnow ? 0.3 : 0.45) + Math.random() * (isSnow ? 0.7 : 1.0)) * p.depth;
    p.sway = 0.4 + Math.random() * 1.0;
    p.phase = Math.random() * Math.PI * 2;
    p.baseAlpha = (0.55 + Math.random() * 0.45) * (0.5 + p.depth * 0.4);
    p.twPhase = Math.random() * Math.PI * 2;
    p.rot = Math.random() * Math.PI;
    p.vr = (Math.random() - 0.5) * 0.01;
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
      p.phase += 0.008;
      p.x += Math.sin(p.phase) * p.sway * 0.4;
      p.twPhase += 0.03;
      if (p.y - p.size > h + 12) seed(p, false);

      const twinkle = isSnow ? 0.75 + Math.sin(p.twPhase) * 0.25 : 1;
      ctx.globalAlpha = Math.max(0, Math.min(1, p.baseAlpha * twinkle));
      const s = p.size * 2;
      if (isSnow) {
        ctx.drawImage(sprite, p.x - s / 2, p.y - s / 2, s, s);
      } else {
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.drawImage(sprite, -s / 2, -s / 2, s, s);
        ctx.restore();
      }
    }
    ctx.globalAlpha = 1;
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
