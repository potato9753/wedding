// ============================================================
//  share.js — 공유 (Web Share API + 링크 복사). Kakao SDK 미사용.
// ============================================================
import { showToast, copyToClipboard } from "./ui.js?v=202607220935";

export function initShare(config, root = document) {
  const shareBtn = root.querySelector("[data-share]");
  const copyBtn = root.querySelector("[data-copy-link]");
  const url =
    config?.meta?.url || (typeof location !== "undefined" ? location.href : "");
  const title = config?.meta?.title || document.title;
  const text = config?.share?.text || "";

  const copyLink = async () => {
    const ok = await copyToClipboard(url);
    showToast(ok ? "청첩장 링크가 복사되었어요" : "복사에 실패했어요");
  };

  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";
  if (shareBtn) {
    if (canShare) {
      shareBtn.addEventListener("click", async () => {
        try {
          await navigator.share({ title, text, url });
        } catch {
          /* 사용자 취소 등은 무시 */
        }
      });
    } else {
      // Web Share 미지원 시 링크 복사로 대체
      shareBtn.addEventListener("click", copyLink);
    }
  }
  if (copyBtn) copyBtn.addEventListener("click", copyLink);
}
