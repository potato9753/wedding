// meeting-main.js — 상견례 초대장 초기화 · 와이어링 (main.js 의 축소판)
import { MEETING_CONFIG } from "./meeting-config.js?v=202609302234";
import { renderInvitation } from "./render.js?v=202609302234";
import { renderFamily } from "./family.js?v=202609302234";
import { renderCoverCollage } from "./cover-collage.js?v=202609302234";
import { renderMenu } from "./menu.js?v=202609302234";
import { initReveal } from "./reveal.js?v=202609302234";
import { initGallery } from "./gallery.js?v=202609302234";
import { initDirections } from "./directions.js?v=202609302234";
import { initAudio } from "./audio.js?v=202609302234";
import { initEffects, initBackToTop } from "./effects.js?v=202609302234";
import { initInviteModal } from "./invite-modal.js?v=202609302234";
import { initTapZoom } from "./tap-zoom.js?v=202609302234";

if (typeof history !== "undefined" && "scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

document.addEventListener("DOMContentLoaded", () => {
  const config = MEETING_CONFIG;

  try {
    renderInvitation(config);
    renderFamily(config);
    renderCoverCollage(config);
    renderMenu(config);
  } catch (err) {
    console.error("[meeting] render 실패:", err);
  }

  try {
    initGallery(config);
  } catch (err) {
    console.error("[meeting] gallery 초기화 실패:", err);
  }

  try {
    initDirections(config);
  } catch (err) {
    console.error("[meeting] directions 초기화 실패:", err);
  }

  try {
    initAudio(config);
  } catch (err) {
    console.error("[meeting] 인터랙션 초기화 실패:", err);
  }

  try {
    initEffects(config);
    initBackToTop();
  } catch (err) {
    console.error("[meeting] effects 초기화 실패:", err);
  }

  try {
    initTapZoom();
  } catch (err) {
    console.error("[meeting] tap-zoom 초기화 실패:", err);
  }

  initReveal();

  try {
    initInviteModal();
  } catch (err) {
    console.error("[meeting] 초대장 팝업 초기화 실패:", err);
  }

  const yearEl = document.querySelector("[data-footer-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
});
