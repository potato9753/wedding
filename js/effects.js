// ============================================================
//  effects.js — 화면 연출
//  떨어지는 눈꽃(원근 심도) · 커버 인트로 · 스크롤 인디케이터 · 카운트업
// ------------------------------------------------------------
//  * 외부 라이브러리 없음. prefers-reduced-motion 존중.
//  * 탭 비활성 시 정지. 스프라이트 재사용 + 사전 블러로 심도 표현.
// ============================================================

function prefersReduced() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** 6각 눈꽃 결정 스프라이트 (variant 로 가지 모양 변화) */
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
  g.shadowColor = "rgba(150,168,190,0.55)";
  g.shadowBlur = S * 0.07;
  const R = S * 0.4;
  const branches = variant === 0
    ? [[0.55, 0.22, 0.16], [0.8, 0.16, 0.11]]
    : [[0.48, 0.2, 0.16], [0.72, 0.17, 0.12], [0.9, 0.1, 0.08]];
  for (let i = 0; i < 6; i++) {
    g.save();
    g.rotate((i * Math.PI) / 3);
    g.beginPath();
    g.moveTo(0, 0);
    g.lineTo(0, -R);
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

/** 스프라이트를 사전 블러 (심도용). ctx.filter 미지원 시 원본 반환. */
function blurredSprite(src, radius) {
  const c = document.createElement("canvas");
  c.width = c.height = src.width;
  const g = c.getContext("2d");
  if ("filter" in g) g.filter = `blur(${radius}px)`;
  g.drawImage(src, 0, 0);
  return c;
}

/** 화면에 떨어지는 입자(눈꽃/꽃잎) — 원근 심도 + 회전 + 반짝임 + 드리프트 */
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
  const count = Math.max(8, Math.min(70, config?.effects?.intensity || 30));
  const isSnow = kind === "snow";

  const sharp = isSnow ? [makeFlakeSprite(0), makeFlakeSprite(1)] : [makePetalSprite()];
  const soft = sharp.map((s) => blurredSprite(s, 1.6)); // 먼 입자 (심도)
  const bokeh = blurredSprite(sharp[0], 4.5); // 가까운 큰 보케 입자

  let w = 0;
  let h = 0;

  function seed(p, initial) {
    const isBokeh = isSnow && Math.random() < 0.12;
    p.depth = isBokeh ? 1.05 + Math.random() * 0.55 : 0.5 + Math.random() * 0.7;
    p.x = Math.random() * w;
    p.y = initial ? Math.random() * h : -30;
    const base = isSnow ? 4 : 6;
    p.size = base * p.depth + Math.random() * (isSnow ? 4 : 3);
    if (isBokeh) p.size *= 1.9;
    p.speed = ((isSnow ? 0.3 : 0.45) + Math.random() * (isSnow ? 0.65 : 1.0)) * p.depth;
    p.sway = 0.4 + Math.random() * 1.0;
    p.phase = Math.random() * Math.PI * 2;
    p.baseAlpha = (0.6 + Math.random() * 0.4) * (0.55 + p.depth * 0.35);
    if (isBokeh) p.baseAlpha *= 0.45;
    p.twPhase = Math.random() * Math.PI * 2;
    p.rot = Math.random() * Math.PI * 2;
    p.vr = (Math.random() - 0.5) * (isSnow ? 0.012 : 0.02);
    if (!isSnow) p.sprite = sharp[0];
    else if (isBokeh) p.sprite = bokeh;
    else if (p.depth < 0.78) p.sprite = soft[(Math.random() * soft.length) | 0];
    else p.sprite = sharp[(Math.random() * sharp.length) | 0];
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
      if (p.y - p.size > h + 20) seed(p, false);
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

/** 지정 좌표에서 눈꽃이 팡 터지는 버스트 */
function snowBurst(cx, cy) {
  if (prefersReduced()) return;
  const N = 12;
  for (let i = 0; i < N; i++) {
    const el = document.createElement("span");
    el.className = "fx-burst";
    const size = 8 + Math.random() * 10;
    el.style.width = el.style.height = size + "px";
    el.style.left = cx - size / 2 + "px";
    el.style.top = cy - size / 2 + "px";
    document.body.appendChild(el);
    const ang = (Math.PI * 2 * i) / N + (Math.random() - 0.5) * 0.6;
    const dist = 45 + Math.random() * 70;
    const dx = Math.cos(ang) * dist;
    const dy = Math.sin(ang) * dist + 24;
    const rot = (Math.random() * 2 - 1) * 220;
    requestAnimationFrame(() => {
      el.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
      el.style.opacity = "0";
    });
    setTimeout(() => el.remove(), 950);
  }
}

/** 커버 스크롤 인디케이터 + 하트 탭 눈꽃 버스트 */
export function initCover(root = document) {
  const indicator = root.querySelector("[data-scroll-indicator]");
  if (indicator) {
    const onScroll = () => {
      if (window.scrollY > 40) {
        indicator.classList.add("is-hidden");
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  const heart = root.querySelector(".cover__heart");
  if (heart) {
    heart.style.cursor = "pointer";
    heart.addEventListener("click", () => {
      const r = heart.getBoundingClientRect();
      snowBurst(r.left + r.width / 2, r.top + r.height / 2);
    });
  }
}

/** 섹션 제목을 글자 단위로 분리 (등장 시 스태거 애니메이션용) */
export function initTitleStagger(root = document) {
  root.querySelectorAll(".section__title").forEach((title) => {
    const text = title.textContent;
    title.textContent = "";
    [...text].forEach((ch, i) => {
      const span = document.createElement("span");
      span.className = "ch";
      span.textContent = ch === " " ? "\u00A0" : ch;
      span.style.animationDelay = (i * 0.035).toFixed(3) + "s";
      title.appendChild(span);
    });
  });
}

/** 상단 스크롤 진행 바 */
export function initScrollProgress() {
  if (typeof document === "undefined") return;
  const bar = document.createElement("div");
  bar.className = "fx-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    bar.style.transform = `scaleX(${p})`;
    ticking = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", update, { passive: true });
  update();
}

/**
 * 숫자 카운트업 — 요소가 화면에 들어오면 0→target 로 증가.
 * @param {Element} el 대상
 * @param {number} target 목표 값(양의 정수)
 * @param {(n:number)=>string} format 표시 포맷
 */
export function countUp(el, target, format, duration = 1500) {
  if (!el) return;
  if (prefersReduced() || !(target > 0)) {
    el.textContent = format(target);
    return;
  }
  const run = () => {
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = format(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  el.textContent = format(0);
  if (typeof IntersectionObserver === "undefined") {
    run();
    return;
  }
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          run();
          obs.disconnect();
        }
      });
    },
    { threshold: 0.4 }
  );
  io.observe(el);
}

export function initEffects(config, root = document) {
  initCover(root);
  initFalling(config);
  initTitleStagger(root);
  initScrollProgress();
}
