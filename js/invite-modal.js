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
  const intro = root.querySelector(".intro");
  if (!modal || typeof window === "undefined") return;

  const reduced = prefersReduced();

  const show = () => {
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => modal.classList.add("is-visible"));
    if (!reduced) modal.focus({ preventScroll: true });
  };

  // 초대장을 닫으면 그때 인트로 문구가 시작됨
  const startIntro = () => {
    if (!intro) return;
    if (reduced) {
      intro.style.display = "none"; // 리듀스모션이면 문구 자체를 건너뜀
      return;
    }
    intro.classList.add("is-playing");
    setTimeout(() => {
      intro.style.display = "none";
    }, 3000); // fx-intro-out 종료(2.1s 지연 + 0.9s) 이후 정리
  };

  const hide = () => {
    modal.classList.remove("is-visible");
    modal.setAttribute("aria-hidden", "true");
    const finish = () => {
      modal.hidden = true;
      startIntro();
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

  show(); // 초대장이 가장 먼저 뜸
}

export default initInviteModal;
