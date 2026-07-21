// ============================================================
//  countdown.js — D-day 계산 · 실시간 카운트다운 · 경과일
// ------------------------------------------------------------
//  * 순수 함수(dDay/countdownParts/elapsedDays)는 node --test 로 검증.
//  * startCountdown 만 DOM/타이머를 사용(브라우저 전용).
// ============================================================
import { parseDateTime } from "./render.js?v=202607211838";

const DAY_MS = 86400000;

function pad2(n) {
  return String(n).padStart(2, "0");
}

function dateUTC(y, m, d) {
  return Date.UTC(y, m - 1, d);
}

/**
 * 캘린더 날짜 기준 D-day 정수.
 * 양수=남은 일수, 0=당일, 음수=지난 일수.
 * @param {string} targetIso 예식 일시(ISO)
 * @param {Date} now 기준 시각(기본 현재)
 */
export function dDay(targetIso, now = new Date()) {
  const t = parseDateTime(targetIso);
  const target = dateUTC(t.year, t.month, t.day);
  const today = dateUTC(now.getFullYear(), now.getMonth() + 1, now.getDate());
  return Math.round((target - today) / DAY_MS);
}

/** D-day 정수 → 표기 문자열 ("D-30" / "D-DAY" / "D+3") */
export function formatDday(n) {
  if (n > 0) return `D-${n}`;
  if (n === 0) return "D-DAY";
  return `D+${Math.abs(n)}`;
}

/**
 * 실시간 카운트다운 구성요소 (밀리초 기준, 결정적).
 * @param {number} targetMs 목표 시각(ms)
 * @param {number} nowMs 현재 시각(ms)
 */
export function countdownParts(targetMs, nowMs) {
  const total = Math.max(0, targetMs - nowMs);
  return {
    total,
    days: Math.floor(total / DAY_MS),
    hours: Math.floor((total % DAY_MS) / 3600000),
    minutes: Math.floor((total % 3600000) / 60000),
    seconds: Math.floor((total % 60000) / 1000),
    done: targetMs <= nowMs,
  };
}

/**
 * since 날짜부터 기준일까지 경과 일수(양수).
 * @param {string} sinceIso 처음 만난 날 등
 * @param {Date} now 기준 시각(기본 현재)
 */
export function elapsedDays(sinceIso, now = new Date()) {
  const s = parseDateTime(sinceIso);
  const since = dateUTC(s.year, s.month, s.day);
  const today = dateUTC(now.getFullYear(), now.getMonth() + 1, now.getDate());
  return Math.max(0, Math.round((today - since) / DAY_MS));
}

// ── 브라우저 전용: 실시간 카운트다운 ────────────────────

/**
 * 컨테이너에 일/시/분/초 카운트다운을 그리고 1초마다 갱신.
 * @returns {Function} 정지 함수
 */
export function startCountdown(container, targetIso) {
  if (!container) return () => {};
  const targetMs = new Date(targetIso).getTime();

  const units = [
    { key: "days", label: "일" },
    { key: "hours", label: "시" },
    { key: "minutes", label: "분" },
    { key: "seconds", label: "초" },
  ];
  container.textContent = "";
  const nums = {};
  units.forEach((u) => {
    const box = document.createElement("div");
    box.className = "countdown__unit";
    const num = document.createElement("span");
    num.className = "countdown__num";
    const label = document.createElement("span");
    label.className = "countdown__label";
    label.textContent = u.label;
    box.appendChild(num);
    box.appendChild(label);
    container.appendChild(box);
    nums[u.key] = num;
  });

  let timerId = null;
  const tick = () => {
    const p = countdownParts(targetMs, Date.now());
    nums.days.textContent = String(p.days);
    nums.hours.textContent = pad2(p.hours);
    nums.minutes.textContent = pad2(p.minutes);
    nums.seconds.textContent = pad2(p.seconds);
    if (p.done && timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  };
  tick();
  timerId = setInterval(tick, 1000);
  return () => {
    if (timerId) clearInterval(timerId);
  };
}
