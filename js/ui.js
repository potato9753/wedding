// ============================================================
//  ui.js — 토스트 알림 · 클립보드 복사 (여러 섹션 공용)
// ============================================================

/** 화면 하단에 잠깐 뜨는 토스트 메시지 */
export function showToast(message, duration = 1800) {
  let el = document.querySelector(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    document.body.appendChild(el);
  }
  el.textContent = message;
  // 리플로우로 애니메이션 재시작
  void el.offsetWidth;
  el.classList.add("is-visible");
  clearTimeout(el._hideTimer);
  el._hideTimer = setTimeout(() => el.classList.remove("is-visible"), duration);
}

/** 텍스트를 클립보드로 복사 (실패 시 execCommand 폴백). true/false 반환 */
export async function copyToClipboard(text) {
  const value = String(text ?? "");
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    /* 폴백으로 진행 */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = value;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}
