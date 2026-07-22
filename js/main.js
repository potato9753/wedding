// main.js — 초기화 · 와이어링
//  이후 태스크에서 gallery / audio / share 등을 연결합니다.
import { WEDDING_CONFIG } from "./config.js?v=202607220947";
import { renderInvitation } from "./render.js?v=202607220947";
import { initReveal } from "./reveal.js?v=202607220947";
import { startCountdown, dDay, formatDday, elapsedDays } from "./countdown.js?v=202607220947";
import { initGallery } from "./gallery.js?v=202607220947";
import { initDirections } from "./directions.js?v=202607220947";
import { initContact } from "./contact.js?v=202607220947";
import { initAccounts } from "./accounts.js?v=202607220947";
import { initShare } from "./share.js?v=202607220947";
import { initAudio } from "./audio.js?v=202607220947";
import { initEffects } from "./effects.js?v=202607220947";

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

  // 갤러리 그리드 + 라이트박스
  try {
    initGallery(config);
  } catch (err) {
    console.error("[wedding] gallery 초기화 실패:", err);
  }

  // 오시는 길 (약도 · 지도앱 · 주소복사 · 교통편)
  try {
    initDirections(config);
  } catch (err) {
    console.error("[wedding] directions 초기화 실패:", err);
  }

  // 연락/RSVP · 계좌 · 공유 · 배경음악
  try {
    initContact(config);
    initAccounts(config);
    initShare(config);
    initAudio(config);
  } catch (err) {
    console.error("[wedding] 인터랙션 초기화 실패:", err);
  }

  // 화면 연출 (떨어지는 입자 · 커버 인트로 · 스크롤 인디케이터)
  try {
    initEffects(config);
  } catch (err) {
    console.error("[wedding] effects 초기화 실패:", err);
  }

  // 스크롤 등장 애니메이션
  initReveal();

  // 푸터 연도 (현재 연도)
  const yearEl = document.querySelector("[data-footer-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
});
