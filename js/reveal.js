// reveal.js — 스크롤 등장 애니메이션 (Intersection Observer 공통 유틸)
//  * JS 활성 시에만 요소를 숨겼다가 뷰포트 진입 시 나타냅니다.
//    (JS 미동작/구형 브라우저에서는 항상 보이도록 → 접근성/견고성)
//  * prefers-reduced-motion 사용자는 애니메이션 없이 즉시 표시.

export function initReveal(root = document) {
  const els = Array.from(root.querySelectorAll("[data-reveal]"));
  if (!els.length) return;

  // JS 활성 표시 → CSS가 초기(숨김) 상태를 적용
  document.documentElement.classList.add("js-reveal");

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced || typeof IntersectionObserver === "undefined") {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  els.forEach((el) => observer.observe(el));
}
