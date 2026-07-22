// ============================================================
//  effects.js — 화면 연출 (떨어지는 눈꽃 · 커버 인트로 · 스크롤 인디케이터)
// ------------------------------------------------------------
//  * 외부 라이브러리 없음. prefers-reduced-motion 존중.
//  * 탭이 비활성이면 애니메이션을 멈춰 배터리/성능 절약.
//  * 눈은 6각 결정(눈꽃송이) 스프라이트를 그려 재사용 → 많아도 가벼움.
// ============================================================

function prefersReduced() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** 6각 눈꽃 결정 스프라이트 (variant 로 가지 모양에 변화) */
function makeFlakeSprite(variant) {
  const S = 56;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d");
  g.translate(S / 2, S / 2);
  g.strokeStyle = "rgba(255,255,255,0.96)";
  g.lineWidth = Math.max(1, S * 0.03);
  g.lineCap = "round";
  g.lineJoin = "round";
  g.shadowColor = "rgba(150,168,190,0.55)"; // 밝은 배경에서도 보이도록 쿨 헤일로
  g.shadowBlur = S * 0.07;

  const R = S * 0.4;
  // variant 별 가지 위치/길이
  const branches = variant === 0
    ? [[0.55, 0.22, 0.16], [0.8, 0.16, 0.11]]
    : [[0.48, 0.2, 0.16], [0.72, 0.17, 0.12], [0.9, 0.1, 0.08]];

  for (let i = 0; i < 6; i++) {
    g.save();
    g.rotate((i * Math.PI) / 3);
    g.beginPath();
    g.moveTo(0, 0);
    g.lineTo(0, -R); // 팔
    for (const [t, spread, up] of branches) {
      const by = -R * t;
      g.moveTo(0, by);
      g.lineTo(-R * spread, by - R * up);
      g.moveTo(0, by);
      g.lineTo(R * spread, by - R * up);
    }
    g.stroke();
    g.restore();
  }
  return c;
}

/** 꽃잎 스프라이트 (petal 모드용) */
function makePetalSprite() {
  const S = 56;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  grad.addColorStop(0, "rgba(236,206,210,0.95)");
  grad.addColorStop(0.7, "rgba(240,222,214,0.6)");
  grad.addColorStop(1, "rgba(240,222,214,0)");
  g.fillStyle = grad;
  g.translate(S / 2, S / 2);
  g.scale(0.62, 1);
  g.beginPath();
  g.arc(0, 0, S / 2, 0, Math.PI * 2);
  g.fill();
  return c;
}

/** 화면에 떨어지는 입자(눈꽃/꽃잎) — 원근감 + 회전 + 반짝임 + 드리프트 */
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
  const count = Math.max(8, Math.min(60, config?.effects?.intensity || 30));
  const isSnow = kind === "snow";
  const sprites = isSnow ? [makeFlakeSprite(0), makeFlakeSprite(1)] : [makePetalSprite()];

  let w = 0;
  let h = 0;

  function seed(p, initial) {
    p.depth = 0.5 + Math.random() * 0.7;
    p.x = Math.random() * w;
    p.y = initial ? Math.random() * h : -30;
    p.size = (isSnow ? 4 : 6) * p.depth + Math.random() * (isSnow ? 4 : 3);
    p.speed = ((isSnow ? 0.3 : 0.45) + Math.random() * (isSnow ? 0.65 : 1.0)) * p.depth;
    p.sway = 0.4 + Math.random() * 1.0;
    p.phase = Math.random() * Math.PI * 2;
    p.baseAlpha = (0.6 + Math.random() * 0.4) * (0.55 + p.depth * 0.35);
    p.twPhase = Math.random() * Math.PI * 2;
    p.rot = Math.random() * Math.PI * 2;
    p.vr = (Math.random() - 0.5) * (isSnow ? 0.012 : 0.02);
    p.sprite = sprites[(Math.random() * sprites.length) | 0];
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
      p.rot += p.vr;
      p.twPhase += 0.03;
      if (p.y - p.size > h + 16) seed(p, false);

      const twinkle = isSnow ? 0.75 + Math.sin(p.twPhase) * 0.25 : 1;
      ctx.globalAlpha = Math.max(0, Math.min(1, p.baseAlpha * twinkle));
      const s = p.size * 2;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.drawImage(p.sprite, -s / 2, -s / 2, s, s);
      ctx.restore();
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
