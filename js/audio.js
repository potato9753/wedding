// ============================================================
//  audio.js — 배경음악 토글 (자가호스팅)
// ------------------------------------------------------------
//  * 자동재생은 브라우저 정책상 제한 → 사용자가 토글로 재생.
//  * src 가 없거나 파일 로드 실패 시 토글 버튼을 숨깁니다.
// ============================================================

export function initAudio(config, root = document) {
  const toggle = root.querySelector("[data-bgm-toggle]");
  if (!toggle) return;

  const bgm = config?.bgm || {};
  if (!bgm.enabled || !bgm.src) {
    toggle.hidden = true;
    return;
  }

  const audio = new Audio(bgm.src);
  audio.loop = bgm.loop !== false;
  audio.preload = "metadata";

  let available = true;
  audio.addEventListener("error", () => {
    available = false;
    toggle.hidden = true; // 파일 없음/로드 실패 → 토글 숨김
  });

  let playing = false;
  const setPlaying = (p) => {
    playing = p;
    toggle.setAttribute("aria-pressed", String(p));
    toggle.classList.toggle("is-playing", p);
  };

  // 재생 유도: 파일이 있으면 토글을 은은히 강조하고, 첫 사용자 제스처에 재생 시도
  const stopHint = () => toggle.classList.remove("is-hint");
  toggle.classList.add("is-hint");

  const gestureEvents = ["pointerdown", "touchstart", "keydown", "scroll"];
  const onFirstGesture = async () => {
    gestureEvents.forEach((e) => window.removeEventListener(e, onFirstGesture));
    if (!available || playing) return;
    try {
      await audio.play();
      setPlaying(true);
      stopHint();
    } catch {
      /* 정책상 실패 시 토글로 수동 재생 */
    }
  };
  gestureEvents.forEach((e) =>
    window.addEventListener(e, onFirstGesture, { passive: true })
  );

  toggle.addEventListener("click", async () => {
    stopHint();
    if (!available) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        /* 자동재생 정책 등으로 실패 시 무시 */
      }
    }
  });
}
