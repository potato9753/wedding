// ============================================================
//  family.js — 상견례용 양가 가족 소개 (부모님 · 형제자매 + 추억 사진)
// ------------------------------------------------------------
//  * [data-family] 컨테이너에 신랑측/신부측 그룹을 렌더합니다.
//  * config.family 가 없거나 비어 있으면 #family 섹션을 숨깁니다.
//  * 사진 카테고리(recent/past/pet) 는 src 가 비어 있으면
//    "사진 준비중" placeholder 로 표시됩니다 (요청용 샘플 화면 용도).
// ============================================================

function buildMemberCard(relation, name) {
  const card = document.createElement("div");
  card.className = "profile-card family-card";

  const role = document.createElement("p");
  role.className = "profile-card__role";
  role.textContent = relation;
  card.appendChild(role);

  const nameEl = document.createElement("p");
  nameEl.className = "profile-card__name";
  nameEl.textContent = name;
  card.appendChild(nameEl);

  return card;
}

function buildMembersGrid(members) {
  const grid = document.createElement("div");
  grid.className = "profile family-group__grid";
  members.forEach((m) => grid.appendChild(buildMemberCard(m.relation, m.name)));
  return grid;
}

/** 사진 한 장 카드: src 있으면 이미지, 없으면 "사진 준비중" placeholder
 *  photo.focus 를 주면 object-position 으로 써서 원하는 부분이 안 잘리게 조정할 수 있어요 (예: "center 20%").
 */
function buildPhotoCard(photo) {
  const card = document.createElement("figure");
  card.className = "family-photo";

  if (photo && photo.src) {
    const img = document.createElement("img");
    img.className = "family-photo__img";
    img.src = photo.src;
    img.alt = photo.caption || "";
    img.loading = "lazy";
    if (photo.focus) img.style.objectPosition = photo.focus;
    card.appendChild(img);
  } else {
    const ph = document.createElement("div");
    ph.className = "family-photo__img placeholder";
    ph.textContent = "사진 준비중";
    card.appendChild(ph);
  }

  if (photo && photo.caption) {
    const cap = document.createElement("figcaption");
    cap.className = "family-photo__caption";
    cap.textContent = photo.caption;
    card.appendChild(cap);
  }
  return card;
}

function buildPhotoRow(label, photos) {
  const row = document.createElement("div");
  row.className = "family-photos-row";

  const heading = document.createElement("p");
  heading.className = "family-photos-row__label";
  heading.textContent = label;
  row.appendChild(heading);

  const grid = document.createElement("div");
  grid.className = "family-photos-row__grid";
  photos.forEach((p) => grid.appendChild(buildPhotoCard(p)));
  row.appendChild(grid);

  return row;
}

/** "우리 가족" 사진들(최근 가족사진 + 반려동물)을 한 묶음으로 —
 *  균등한 그리드 대신 첫 장을 크게, 나머지를 작게 섞어서 자유롭게 배치합니다.
 */
function buildFamilyCollage(label, photos) {
  const row = document.createElement("div");
  row.className = "family-photos-row";

  const heading = document.createElement("p");
  heading.className = "family-photos-row__label";
  heading.textContent = label;
  row.appendChild(heading);

  const grid = document.createElement("div");
  grid.className = "family-collage";
  photos.forEach((p) => grid.appendChild(buildPhotoCard(p)));
  row.appendChild(grid);

  return row;
}

function buildSideGroup(label, side) {
  const group = document.createElement("div");
  group.className = "family-group";

  const heading = document.createElement("p");
  heading.className = "family-group__label";
  heading.textContent = label;
  group.appendChild(heading);

  const members = Array.isArray(side.members) ? side.members.filter((m) => m && m.name) : [];
  if (members.length) group.appendChild(buildMembersGrid(members));

  const photos = side.photos || {};
  // 최근 가족사진 + 반려동물을 한 묶음(콜라주)으로, 그 다음 본인 어린 시절(소개 문구 포함)
  const recentPhotos = Array.isArray(photos.recent) ? photos.recent : photos.recent ? [photos.recent] : [];
  const familyPhotos = [...recentPhotos, ...(photos.pet ? [photos.pet] : [])];
  if (familyPhotos.length) group.appendChild(buildFamilyCollage("우리 가족", familyPhotos));
  if (photos.past) group.appendChild(buildPhotoRow("그때 우리", [photos.past]));

  return group;
}

export function renderFamily(config, root = document) {
  const section = root.querySelector("#family");
  const host = root.querySelector("[data-family]");
  const family = config?.family || {};
  const groom = family.groom || {};
  const bride = family.bride || {};
  const hasGroom = Array.isArray(groom.members) && groom.members.some((m) => m && m.name);
  const hasBride = Array.isArray(bride.members) && bride.members.some((m) => m && m.name);

  if (!hasGroom && !hasBride) {
    if (section) section.hidden = true;
    return;
  }
  if (!host) return;

  host.textContent = "";
  if (hasGroom) host.appendChild(buildSideGroup("신랑 가족", groom));
  if (hasBride) host.appendChild(buildSideGroup("신부 가족", bride));
}

export default renderFamily;
