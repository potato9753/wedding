// ============================================================
//  invite-modal.js — 커버 위 "초대장" 팝업 카드
// ------------------------------------------------------------
//  * 진입 인트로가 끝날 때쯤 나타나고, 탭하면 닫힙니다.
//  * prefers-reduced-motion: 애니메이션 없이 즉시 표시/닫힘.
// ============================================================

function prefersReduced() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function initInviteModal(root = document) {
  const modal = root.querySelector("[data-invite-modal]");
  if (!modal || typeof window === "undefined") return;

  const reduced = prefersReduced();

  const show = () => {
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => modal.classList.add("is-visible"));
    if (!reduced) modal.focus({ preventScroll: true });
  };

  const hide = () => {
    modal.classList.remove("is-visible");
    modal.setAttribute("aria-hidden", "true");
    const finish = () => {
      modal.hidden = true;
    };
    if (reduced) finish();
    else setTimeout(finish, 400);
  };

  modal.addEventListener("click", hide);
  modal.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
      e.preventDefault();
      hide();
    }
  });

  if (reduced) show();
  else setTimeout(show, 3100); // 인트로(약 3s) 마무리 직후 등장
}

export default initInviteModal;
