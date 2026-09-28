// meeting-main.js — 상견례 초대장 초기화 · 와이어링 (main.js 의 축소판)
import { MEETING_CONFIG } from "./meeting-config.js?v=202609281448";
import { renderInvitation } from "./render.js?v=202609281448";
import { renderFamily } from "./family.js?v=202609281448";
import { renderCoverCollage } from "./cover-collage.js?v=202609281448";
import { renderMenu } from "./menu.js?v=202609281448";
import { initReveal } from "./reveal.js?v=202609281448";
import { initGallery } from "./gallery.js?v=202609281448";
import { initDirections } from "./directions.js?v=202609281448";
import { initAudio } from "./audio.js?v=202609281448";
import { initEffects } from "./effects.js?v=202609281448";

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
  } catch (err) {
    console.error("[meeting] effects 초기화 실패:", err);
  }

  initReveal();

  const yearEl = document.querySelector("[data-footer-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
});
