// ============================================================
//  render.js — config → DOM 렌더 + 날짜/이름 포맷
// ------------------------------------------------------------
//  * 순수 함수(포맷/조합)는 node --test 로 검증 (아래 tests/).
//  * DOM 주입 함수는 브라우저에서만 호출됩니다.
//    → 모듈 최상위에서 document 에 접근하지 않습니다.
//      (document 는 함수 기본 인자로만 참조 = 호출 시점 평가)
// ============================================================

// ── 상수 ────────────────────────────────────────────────
export const WEEKDAYS_KO = ["일", "월", "화", "수", "목", "금", "토"];
export const WEEKDAYS_EN = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function pad2(n) {
  return String(n).padStart(2, "0");
}

// ── 순수 함수: 날짜/시간 ────────────────────────────────

/**
 * ISO 8601 문자열에서 "벽시계" 구성요소를 추출합니다.
 * 오프셋/타임존과 무관하게 문자열에 적힌 그대로의 연·월·일·시·분을 사용하고,
 * 요일은 해당 날짜로 계산합니다. (달력상 요일은 타임존과 무관 → 결정적)
 *
 * @param {string} iso 예: "2026-05-16T13:00:00+09:00"
 * @returns {{year:number,month:number,day:number,hour:number,minute:number,weekday:number}}
 */
export function parseDateTime(iso) {
  const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2}))?/);
  if (!m) throw new Error(`Invalid datetime: ${iso}`);
  const year = Number(m[1]);
  const month = Number(m[2]); // 1-12
  const day = Number(m[3]);
  const hour = m[4] != null ? Number(m[4]) : 0;
  const minute = m[5] != null ? Number(m[5]) : 0;
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay(); // 0=일
  return { year, month, day, hour, minute, weekday };
}

/** "2026년 5월 16일" */
export function formatKoreanDate(iso) {
  const { year, month, day } = parseDateTime(iso);
  return `${year}년 ${month}월 ${day}일`;
}

/** "2026년 5월 16일 토요일" */
export function formatKoreanDateWithDay(iso) {
  const { weekday } = parseDateTime(iso);
  return `${formatKoreanDate(iso)} ${WEEKDAYS_KO[weekday]}요일`;
}

/** "2026. 05. 16" */
export function formatDotDate(iso) {
  const { year, month, day } = parseDateTime(iso);
  return `${year}. ${pad2(month)}. ${pad2(day)}`;
}

/** 오전/오후 12시간제 한국어: "오후 1시", "오후 1시 30분" */
export function formatKoreanTime(iso) {
  const { hour, minute } = parseDateTime(iso);
  const meridiem = hour < 12 ? "오전" : "오후";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return minute === 0 ? `${meridiem} ${h12}시` : `${meridiem} ${h12}시 ${minute}분`;
}

/** 12시간제 영문 시간: "PM 1:00" */
export function formatEnglishTime(iso) {
  const { hour, minute } = parseDateTime(iso);
  const meridiem = hour < 12 ? "AM" : "PM";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${meridiem} ${h12}:${pad2(minute)}`;
}

/** 커버용 영문 날짜+시간: "2026. 05. 16. SAT PM 1:00" */
export function formatCoverDateTime(iso) {
  const { weekday } = parseDateTime(iso);
  return `${formatDotDate(iso)}. ${WEEKDAYS_EN[weekday]} ${formatEnglishTime(iso)}`;
}

/**
 * 해당 월의 달력 행렬(주 단위, 일요일 시작).
 * 각 주는 길이 7 배열, 날짜(1..말일) 또는 빈칸(null).
 * @param {number} year
 * @param {number} month 1-12
 * @returns {(number|null)[][]}
 */
export function monthMatrix(year, month) {
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay(); // 0=일
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

// ── 순수 함수: 이름/혼주 ────────────────────────────────

/** 사람 객체 → 이름(공백 정리) */
export function personName(person) {
  if (!person) return "";
  return String(person.firstName || "").trim();
}

/** "홍길동 ♥ 김영희" */
export function combineCoupleNames(couple, separator = "♥") {
  const g = personName(couple?.groom);
  const b = personName(couple?.bride);
  return `${g} ${separator} ${b}`;
}

/** 혼주 이름 (deceased 이면 "故 " 접두) */
export function formatParentName(parent) {
  if (!parent || !parent.name) return "";
  const name = String(parent.name).trim();
  return parent.deceased ? `故 ${name}` : name;
}

/**
 * 혼주 라인: "홍부친 · 이모친의 아들 홍길동"
 * 한쪽 부모만 있으면 구분점 없이 표시. 부모가 없으면 "관계 이름"만.
 * @param {{father?:object, mother?:object}} side
 * @param {object} child 신랑/신부 person (order 포함)
 */
export function formatParentLine(side, child) {
  const parents = [formatParentName(side?.father), formatParentName(side?.mother)]
    .filter(Boolean)
    .join(" · ");
  const rel = [(child?.order || "").trim(), personName(child)].filter(Boolean).join(" ");
  return parents ? `${parents}의 ${rel}` : rel;
}

/** 여러 줄 메시지를 문자열 배열로 정규화 (배열이면 그대로, 문자열이면 개행 분리) */
export function normalizeLines(message) {
  if (Array.isArray(message)) return message.map((s) => String(s));
  return String(message ?? "").split("\n");
}

// ============================================================
//  DOM 주입 (브라우저 전용)
// ============================================================

function setText(root, selector, text) {
  const el = root.querySelector(selector);
  if (el && text != null) el.textContent = text;
  return el;
}

/** 여러 줄을 <br> 로 삽입 (빈 문자열은 빈 줄로 간격 형성) */
function setLines(root, selector, message) {
  const el = root.querySelector(selector);
  if (!el) return;
  el.textContent = "";
  normalizeLines(message).forEach((line, i) => {
    if (i > 0) el.appendChild(document.createElement("br"));
    el.appendChild(document.createTextNode(line));
  });
}

/** 문서 메타(title/description/theme-color) 반영 */
export function renderMeta(config, doc = document) {
  const meta = config?.meta || {};
  if (meta.title) doc.title = meta.title;
  const desc = doc.querySelector('meta[name="description"]');
  if (desc && meta.description) desc.setAttribute("content", meta.description);
  const theme = doc.querySelector('meta[name="theme-color"]');
  if (theme && meta.themeColor) theme.setAttribute("content", meta.themeColor);
}

/** 커버: 태그라인 + 대표사진 + 신랑·신부 이름 + 예식 일시 */
export function renderCover(config, root = document) {
  const couple = config?.couple || {};
  const cover = config?.cover || {};
  setText(root, "[data-cover-tagline]", cover.tagline);
  setText(root, "[data-cover-groom]", personName(couple.groom));
  setText(root, "[data-cover-bride]", personName(couple.bride));
  const iso = config?.wedding?.datetime;
  if (iso) setText(root, "[data-cover-date]", formatCoverDateTime(iso));
  // 대표 사진 (경로가 있을 때만 배경으로 채움)
  const photoEl = root.querySelector("[data-cover-photo]");
  if (photoEl && cover.photo) {
    photoEl.style.backgroundImage = `url("${cover.photo}")`;
    photoEl.classList.remove("placeholder");
    photoEl.classList.add("cover__photo--filled");
    photoEl.textContent = "";
  }
}

/** 감성 인용구: 문구 + 출처 */
export function renderQuote(config, root = document) {
  const quote = config?.quote || {};
  setLines(root, "[data-quote-text]", quote.text);
  const author = String(quote.author || "").trim();
  setText(root, "[data-quote-author]", author ? `— ${author}` : "");
}

/** 인사말: 제목 + 문구 */
export function renderGreeting(config, root = document) {
  const greeting = config?.greeting || {};
  setText(root, "[data-greeting-title]", greeting.title);
  setLines(root, "[data-greeting-message]", greeting.message);
}

/** 혼주: 신랑측 / 신부측 라인 ("아버지 · 어머니의 아들 이름") */
export function renderParents(config, root = document) {
  const parents = config?.parents || {};
  const couple = config?.couple || {};
  setText(root, "[data-parents-groom]", formatParentLine(parents.groom, couple.groom));
  setText(root, "[data-parents-bride]", formatParentLine(parents.bride, couple.bride));
}

/** 신랑/신부 소개 카드 1장 생성 (사진·역할·이름·특징) */
function buildProfileCard(role, person) {
  const card = document.createElement("div");
  card.className = "profile-card";

  const photo = document.createElement("div");
  photo.className = "profile-card__photo";
  if (person && person.photo) {
    photo.style.backgroundImage = `url("${person.photo}")`;
    photo.classList.add("profile-card__photo--filled");
  }
  card.appendChild(photo);

  const roleEl = document.createElement("p");
  roleEl.className = "profile-card__role";
  roleEl.textContent = role;
  card.appendChild(roleEl);

  const nameEl = document.createElement("p");
  nameEl.className = "profile-card__name";
  nameEl.textContent = personName(person);
  card.appendChild(nameEl);

  const traits = Array.isArray(person && person.traits)
    ? person.traits.filter(Boolean)
    : [];
  if (traits.length) {
    const ul = document.createElement("ul");
    ul.className = "profile-card__traits";
    traits.forEach((t) => {
      const li = document.createElement("li");
      li.textContent = t;
      ul.appendChild(li);
    });
    card.appendChild(ul);
  }
  return card;
}

/** 신랑·신부 소개: [data-profile] 컨테이너에 두 카드 렌더 */
export function renderProfile(config, root = document) {
  const container = root.querySelector("[data-profile]");
  if (!container) return;
  const couple = config?.couple || {};
  container.textContent = "";
  [
    ["신랑", couple.groom],
    ["신부", couple.bride],
  ].forEach(([role, person]) => {
    if (person) container.appendChild(buildProfileCard(role, person));
  });
}

/** 월 달력 그리드 DOM 생성 (예식일 강조, 일요일 색) */
function buildCalendarGrid(year, month, weddingDay) {
  const grid = document.createElement("div");
  grid.className = "calendar__grid";

  ["일", "월", "화", "수", "목", "금", "토"].forEach((h, i) => {
    const head = document.createElement("div");
    head.className = "calendar__head";
    if (i === 0) head.classList.add("calendar__cell--sun");
    head.textContent = h;
    grid.appendChild(head);
  });

  monthMatrix(year, month).forEach((week) => {
    week.forEach((d, i) => {
      const cell = document.createElement("div");
      cell.className = "calendar__day";
      if (d === null) {
        cell.classList.add("calendar__day--empty");
      } else {
        cell.textContent = String(d);
        if (i === 0) cell.classList.add("calendar__cell--sun");
        if (d === weddingDay) cell.classList.add("calendar__day--wedding");
      }
      grid.appendChild(cell);
    });
  });
  return grid;
}

/** 예식 안내: 일시/장소 텍스트 + 월 달력 그리드 */
export function renderCalendar(config, root = document) {
  const iso = config?.wedding?.datetime;
  if (iso) {
    setText(root, "[data-calendar-date]", `${formatKoreanDateWithDay(iso)} ${formatKoreanTime(iso)}`);
  }
  const venue = config?.wedding?.venue || {};
  setText(root, "[data-calendar-venue]", [venue.name, venue.hall].filter(Boolean).join(" · "));

  const host = root.querySelector("[data-calendar]");
  if (host && iso) {
    const { year, month, day } = parseDateTime(iso);
    host.textContent = "";
    host.appendChild(buildCalendarGrid(year, month, day));
  }
}

/** 푸터: 감사 문구 */
export function renderFooter(config, root = document) {
  setText(root, "[data-footer-thanks]", config?.footer?.thanks);
}

/** 전체 렌더 오케스트레이터 (이후 태스크에서 섹션 렌더 추가) */
export function renderInvitation(config, doc = document) {
  renderMeta(config, doc);
  renderCover(config, doc);
  renderQuote(config, doc);
  renderGreeting(config, doc);
  renderParents(config, doc);
  renderProfile(config, doc);
  renderCalendar(config, doc);
  renderFooter(config, doc);
}
