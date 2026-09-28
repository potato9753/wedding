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

/** 따뜻하게 은은히 떠오르는 빛 입자(웜톤 보케) — 상견례 등 캐주얼한 무드용 */
function makeGlowSprite() {
  const S = 64;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  grad.addColorStop(0, "rgba(255, 221, 173, 0.95)");
  grad.addColorStop(0.45, "rgba(255, 191, 138, 0.55)");
  grad.addColorStop(1, "rgba(255, 191, 138, 0)");
  g.fillStyle = grad;
  g.beginPath();
  g.arc(S / 2, S / 2, S / 2, 0, Math.PI * 2);
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
  const isGlow = kind === "glow";
  const dir = isGlow ? -1 : 1; // glow: 위로 떠오름 / snow·petal: 아래로 떨어짐

  const sharp = isSnow ? [makeFlakeSprite(0), makeFlakeSprite(1)] : isGlow ? [makeGlowSprite()] : [makePetalSprite()];
  const soft = sharp.map((s) => blurredSprite(s, 1.6)); // 먼 입자 (심도)
  const bokeh = blurredSprite(sharp[0], 4.5); // 가까운 큰 보케 입자

  let w = 0;
  let h = 0;

  function seed(p, initial) {
    const isBokeh = isSnow && Math.random() < 0.12;
    p.depth = isBokeh ? 1.05 + Math.random() * 0.55 : 0.5 + Math.random() * 0.7;
    p.x = Math.random() * w;
    p.y = initial ? Math.random() * h : isGlow ? h + 30 : -30;
    const base = isGlow ? 9 : isSnow ? 4 : 6;
    p.size = base * p.depth + Math.random() * (isSnow ? 4 : 3);
    if (isBokeh) p.size *= 1.9;
    p.speed = ((isGlow ? 0.18 : isSnow ? 0.3 : 0.45) + Math.random() * (isGlow ? 0.3 : isSnow ? 0.65 : 1.0)) * p.depth * dir;
    p.sway = 0.4 + Math.random() * 1.0;
    p.phase = Math.random() * Math.PI * 2;
    p.baseAlpha = (0.6 + Math.random() * 0.4) * (0.55 + p.depth * 0.35);
    if (isBokeh) p.baseAlpha *= 0.45;
    if (isGlow) p.baseAlpha *= 0.7;
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
      if (isGlow ? p.y + p.size < -20 : p.y - p.size > h + 20) seed(p, false);
      const twinkle = isSnow || isGlow ? 0.75 + Math.sin(p.twPhase) * 0.25 : 1;
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

/** 커버 패럴럭스: 스크롤 시 대표사진이 천천히 밀리고 커버가 서서히 옅어짐 */
export function initCoverParallax(root = document) {
  if (typeof window === "undefined" || prefersReduced()) return;
  const cover = root.querySelector("#cover");
  if (!cover) return;
  const photo = root.querySelector("[data-cover-photo]");
  let ticking = false;
  const update = () => {
    ticking = false;
    const y = window.scrollY || 0;
    const vh = window.innerHeight || 1;
    if (y > vh) return; // 커버 벗어나면 갱신 불필요
    if (photo) photo.style.backgroundPositionY = `calc(50% + ${y * 0.18}px)`;
    cover.style.opacity = String(Math.max(0.2, 1 - (y / vh) * 0.72));
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
  update();
}

/**
 * D-day 원형 프로그레스 링: 기존 [data-dday] 숫자를 링 가운데로 감싼다.
 * @param {Element} el D-day 텍스트 요소
 * @param {number} progress 0..1 (예: since→wedding 진행률)
 */
export function mountDdayRing(el, progress) {
  if (!el || typeof document === "undefined" || !el.parentNode) return;
  const p = Math.max(0, Math.min(1, Number(progress) || 0));
  const NS = "http://www.w3.org/2000/svg";
  const R = 54;
  const C = 2 * Math.PI * R;

  const ring = document.createElement("div");
  ring.className = "dday-ring";

  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("class", "dday-ring__svg");
  svg.setAttribute("viewBox", "0 0 120 120");
  svg.setAttribute("aria-hidden", "true");

  const track = document.createElementNS(NS, "circle");
  track.setAttribute("class", "dday-ring__track");
  track.setAttribute("cx", "60");
  track.setAttribute("cy", "60");
  track.setAttribute("r", String(R));

  const prog = document.createElementNS(NS, "circle");
  prog.setAttribute("class", "dday-ring__prog");
  prog.setAttribute("cx", "60");
  prog.setAttribute("cy", "60");
  prog.setAttribute("r", String(R));
  prog.setAttribute("stroke-dasharray", String(C));
  prog.setAttribute("stroke-dashoffset", String(C)); // 비어있는 상태에서 시작

  svg.append(track, prog);

  el.parentNode.insertBefore(ring, el);
  ring.append(svg, el); // 숫자를 링 중앙으로 이동

  const fill = () => {
    prog.style.strokeDashoffset = String(C * (1 - p));
  };
  if (prefersReduced() || typeof IntersectionObserver === "undefined") {
    fill();
    return;
  }
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          requestAnimationFrame(fill);
          obs.disconnect();
        }
      });
    },
    { threshold: 0.4 }
  );
  io.observe(ring);
}

/** 우측 플로팅 섹션 내비게이션 점 (활성 표시 + 탭 이동) */
export function initNavDots(root = document) {
  if (typeof document === "undefined") return;
  // cover · footer 는 제목(.section__title)이 없는 섹션이라 여기서만 라벨을 고정합니다.
  // 나머지는 실제 화면에 보이는 섹션 제목을 그대로 읽어와서, 페이지마다(청첩장/상견례) 문구가 달라도 항상 맞습니다.
  const fixedLabels = { cover: "홈", footer: "감사합니다" };
  const sections = Array.from(root.querySelectorAll(".section[id], .footer[id]")).filter(
    (s) => !s.hidden && s.id !== "quote"
  );
  if (sections.length < 3) return;

  const nav = document.createElement("nav");
  nav.className = "nav-dots";
  nav.setAttribute("aria-label", "섹션 바로가기");
  const map = new Map();
  sections.forEach((s) => {
    const dot = document.createElement("a");
    dot.className = "nav-dots__dot";
    dot.href = `#${s.id}`;
    const label = fixedLabels[s.id] || s.querySelector(".section__title")?.textContent || s.id;
    dot.setAttribute("aria-label", label);
    const tip = document.createElement("span");
    tip.className = "nav-dots__tip";
    tip.textContent = label;
    dot.appendChild(tip);
    dot.addEventListener("click", (e) => {
      e.preventDefault();
      s.scrollIntoView({ block: "start" });
    });
    nav.appendChild(dot);
    map.set(s, dot);
  });
  document.body.appendChild(nav);

  if (typeof IntersectionObserver !== "undefined") {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            map.forEach((d) => d.classList.remove("is-active"));
            const dot = map.get(e.target);
            if (dot) dot.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
  }
  // 인트로가 걷힌 뒤 등장
  setTimeout(() => nav.classList.add("is-ready"), prefersReduced() ? 200 : 2400);
}

/** 예식일 셀 탭 → 눈꽃 버스트 + "우리 결혼해요" 말풍선 */
export function initCalendarTap(root = document) {
  const cell = root.querySelector(".calendar__day--wedding");
  if (!cell) return;
  cell.style.cursor = "pointer";
  cell.setAttribute("role", "button");
  cell.setAttribute("tabindex", "0");
  cell.setAttribute("aria-label", "예식일 — 우리 결혼해요");
  const fire = () => {
    const r = cell.getBoundingClientRect();
    snowBurst(r.left + r.width / 2, r.top + r.height / 2);
    showWedTip(r);
  };
  cell.addEventListener("click", fire);
  cell.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fire();
    }
  });
}

let wedTipEl = null;
function showWedTip(rect) {
  if (typeof document === "undefined") return;
  if (wedTipEl) wedTipEl.remove();
  const tip = document.createElement("div");
  tip.className = "wed-tip";
  tip.textContent = "우리 결혼해요 💍";
  document.body.appendChild(tip);
  tip.style.left = `${rect.left + rect.width / 2}px`;
  tip.style.top = `${rect.top}px`;
  wedTipEl = tip;
  requestAnimationFrame(() => tip.classList.add("is-visible"));
  setTimeout(() => {
    tip.classList.remove("is-visible");
    setTimeout(() => {
      tip.remove();
      if (wedTipEl === tip) wedTipEl = null;
    }, 300);
  }, 1800);
}

/** 인트로/커버 CSS 애니메이션을 처음부터 다시 재생 (리플로우 트릭) */
function restartIntro() {
  const els = document.querySelectorAll(
    ".intro, .intro__script, .intro__sub, .cover__eyebrow, .cover__photo, .cover__names, .cover__date, .cover__scroll"
  );
  els.forEach((el) => {
    el.style.animation = "none";
  });
  void document.body.offsetWidth; // 리플로우 → 애니메이션 리셋
  els.forEach((el) => {
    el.style.animation = "";
  });
}

/**
 * 진입/재진입 처리:
 *  - 항상 최상단에서 시작 (브라우저 스크롤 복원 비활성화)
 *  - 뒤로가기 등 bfcache 복원 시 인트로 다시 재생
 */
export function initPageEntry() {
  if (typeof window === "undefined") return;
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
  window.addEventListener("pageshow", (e) => {
    window.scrollTo(0, 0);
    if (e && e.persisted) restartIntro(); // bfcache 복원 → 인트로 재생
  });
}

export function initEffects(config, root = document) {
  initPageEntry();
  initCover(root);
  initCoverParallax(root);
  initFalling(config);
  initTitleStagger(root);
  initScrollProgress();
  initNavDots(root);
  initCalendarTap(root);
}
