// ============================================================
//  contact.js — 연락 / RSVP (저장 없음: 전화·문자·카톡 링크아웃)
// ------------------------------------------------------------
//  * digits 만 순수 함수(테스트 대상). 나머지는 브라우저 전용.
//  * 연락 정보가 하나도 없으면 #contact 섹션을 숨깁니다.
// ============================================================

/** 전화/문자 링크용 숫자만 추출 (+ 유지) */
export function digits(value) {
  return String(value || "").replace(/[^0-9+]/g, "");
}

function linkButton(href, label, { external = false, variant = "" } = {}) {
  const a = document.createElement("a");
  a.className = "contact-btn" + (variant ? ` ${variant}` : "");
  a.href = href;
  a.textContent = label;
  if (external) {
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  }
  return a;
}

export function initContact(config, root = document) {
  const section = root.querySelector("#contact");
  const host = root.querySelector("[data-contact]");
  const c = config?.contact || {};
  const sides = [
    ["신랑", c.groom],
    ["신부", c.bride],
  ];
  const hasAny = sides.some(([, s]) => s && (s.tel || s.sms || s.kakao));
  if (!hasAny) {
    if (section) section.hidden = true;
    return;
  }

  const msgEl = root.querySelector("[data-rsvp-message]");
  if (msgEl && c.rsvpMessage) msgEl.textContent = c.rsvpMessage;

  if (!host) return;
  host.textContent = "";
  sides.forEach(([role, s]) => {
    if (!s || (!s.tel && !s.sms && !s.kakao)) return;
    const card = document.createElement("div");
    card.className = "contact-card";

    const name = document.createElement("p");
    name.className = "contact-card__role";
    name.textContent = s.label || role;
    card.appendChild(name);

    const actions = document.createElement("div");
    actions.className = "contact-card__actions";
    if (s.tel) actions.appendChild(linkButton(`tel:${digits(s.tel)}`, "전화", { variant: "contact-btn--call" }));
    if (s.sms) actions.appendChild(linkButton(`sms:${digits(s.sms)}`, "문자"));
    if (s.kakao) actions.appendChild(linkButton(s.kakao, "카카오톡", { external: true }));
    card.appendChild(actions);

    host.appendChild(card);
  });
}
