// main.js — 초기화 · 와이어링
//  이후 태스크에서 gallery / audio / share 등을 연결합니다.
import { WEDDING_CONFIG } from "./config.js";
import { renderInvitation } from "./render.js";
import { initReveal } from "./reveal.js";
import { startCountdown, dDay, formatDday, elapsedDays } from "./countdown.js";

document.addEventListener("DOMContentLoaded", () => {
  const config = WEDDING_CONFIG;

  // config → DOM 렌더
  try {
    renderInvitation(config);
  } catch (err) {
    console.error("[wedding] render 실패:", err);
  }

  // D-day 배지 + 실시간 카운트다운
  const iso = config?.wedding?.datetime;
  if (iso) {
    const ddayEl = document.querySelector("[data-dday]");
    if (ddayEl) ddayEl.textContent = formatDday(dDay(iso));
    startCountdown(document.querySelector("[data-countdown]"), iso);
  }

  // "함께한 시간" 카운터 (푸터)
  const counterEl = document.querySelector("[data-counter]");
  const since = config?.relationship?.since;
  if (counterEl && since) {
    const days = elapsedDays(since);
    const label = config?.relationship?.label || "함께한 지";
    counterEl.textContent = `${label} ${days.toLocaleString("ko-KR")}일`;
  }

  // 스크롤 등장 애니메이션
  initReveal();

  // 푸터 연도 (현재 연도)
  const yearEl = document.querySelector("[data-footer-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
});
