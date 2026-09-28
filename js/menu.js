// ============================================================
//  menu.js — 메뉴 코스 (영수증/주문서 스타일)
// ------------------------------------------------------------
//  * [data-menu] 컨테이너에 코스별 아이템·추가 희망 메뉴·외부 링크를 렌더합니다.
//  * config.menu 가 없거나 courses 가 비어 있으면 #menu 섹션을 숨깁니다.
//  * 가격은 일부러 표시하지 않습니다 (qty 만 "× n" 으로 표시).
// ============================================================

function buildItemRow(item) {
  const row = document.createElement("li");
  row.className = "menu-item";
  row.textContent = item.qty > 1 ? `${item.name} × ${item.qty}` : item.name;
  return row;
}

function buildCourse(course) {
  const card = document.createElement("div");
  card.className = "menu-course";

  const phase = document.createElement("p");
  phase.className = "menu-course__phase";
  phase.textContent = course.phase;
  card.appendChild(phase);

  const list = document.createElement("ul");
  list.className = "menu-course__list";
  (Array.isArray(course.items) ? course.items : []).forEach((item) => {
    if (item && item.name) list.appendChild(buildItemRow(item));
  });
  card.appendChild(list);

  return card;
}

/** 네이버(장소 검색)·캐치테이블 링크로 이동하는 펼치기(<details>) 블록 */
function buildLinksDetails(config) {
  const mapQuery = config?.directions?.mapQuery;
  const catchtable = config?.menu?.links?.catchtable;

  const links = [];
  if (mapQuery) {
    links.push({ label: "네이버에서 메뉴 더 보기", url: `https://map.naver.com/p/search/${encodeURIComponent(mapQuery)}` });
  }
  if (catchtable) {
    links.push({ label: "캐치테이블에서 메뉴 보기", url: catchtable });
  }
  if (!links.length) return null;

  const details = document.createElement("details");
  details.className = "menu-links";
  const summary = document.createElement("summary");
  summary.textContent = "추천메뉴 · 전체 메뉴판 더 보기";
  details.appendChild(summary);

  const nav = document.createElement("div");
  nav.className = "menu-links__nav";
  links.forEach(({ label, url }) => {
    const a = document.createElement("a");
    a.className = "map-links__btn";
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = label;
    nav.appendChild(a);
  });
  details.appendChild(nav);
  return details;
}

export function renderMenu(config, root = document) {
  const section = root.querySelector("#menu");
  const host = root.querySelector("[data-menu]");
  const menu = config?.menu || {};
  const courses = Array.isArray(menu.courses) ? menu.courses.filter((c) => c && c.items?.length) : [];

  if (!courses.length) {
    if (section) section.hidden = true;
    return;
  }
  if (!host) return;

  host.textContent = "";

  if (menu.note) {
    const note = document.createElement("p");
    note.className = "menu-note";
    note.textContent = menu.note;
    host.appendChild(note);
  }

  const ticket = document.createElement("div");
  ticket.className = "menu-ticket";
  courses.forEach((course) => ticket.appendChild(buildCourse(course)));
  host.appendChild(ticket);

  const wishlist = Array.isArray(menu.wishlist) ? menu.wishlist.filter(Boolean) : [];
  if (wishlist.length) {
    const wishBox = document.createElement("div");
    wishBox.className = "menu-wishlist";
    const title = document.createElement("p");
    title.className = "menu-wishlist__title";
    title.textContent = "+ 더 먹고 싶은 메뉴";
    wishBox.appendChild(title);
    const ul = document.createElement("ul");
    wishlist.forEach((w) => {
      const li = document.createElement("li");
      li.textContent = w;
      ul.appendChild(li);
    });
    wishBox.appendChild(ul);
    host.appendChild(wishBox);
  }

  const linksDetails = buildLinksDetails(config);
  if (linksDetails) host.appendChild(linksDetails);
}

export default renderMenu;
