// ============================================================
//  directions.js — 오시는 길
//  약도 · 지도앱 딥링크 · 주소 복사 · 교통편 (지도 API 키 없음)
// ------------------------------------------------------------
//  * buildMapLinks 만 순수 함수(테스트 대상). 나머지는 브라우저 전용.
// ============================================================
import { showToast, copyToClipboard } from "./ui.js?v=202607221140";

/**
 * 지도앱 딥링크 4종 생성. 명시 URL(links)이 있으면 우선, 없으면 검색어(query)로 생성.
 * query 가 비어있고 명시 URL도 없으면 "" (버튼 미표시).
 */
export function buildMapLinks(query, links = {}) {
  const q = encodeURIComponent(query || "");
  const has = Boolean(query);
  const pick = (explicit, generated) => (explicit ? explicit : has ? generated : "");
  return {
    naver: pick(links.naver, `https://map.naver.com/p/search/${q}`),
    kakao: pick(links.kakao, `https://map.kakao.com/link/search/${q}`),
    tmap: pick(links.tmap, `tmap://search?name=${q}`),
    google: pick(links.google, `https://www.google.com/maps/search/?api=1&query=${q}`),
  };
}

/** 오시는 길 초기화: 장소·약도·주소복사·지도버튼·교통편 렌더 */
export function initDirections(config, root = document) {
  const d = config?.directions || {};
  const venue = config?.wedding?.venue || {};

  const setText = (sel, txt) => {
    const el = root.querySelector(sel);
    if (el && txt != null) el.textContent = txt;
  };
  setText("[data-venue-name]", venue.name);
  setText("[data-venue-hall]", venue.hall);
  setText("[data-venue-address]", venue.address);

  // 약도 이미지 (경로 있을 때만)
  const mapImg = root.querySelector("[data-sketchmap]");
  if (mapImg) {
    if (d.sketchMap) mapImg.src = d.sketchMap;
    else mapImg.remove();
  }

  // 주소 복사
  const copyBtn = root.querySelector("[data-copy-address]");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const ok = await copyToClipboard(venue.address || "");
      showToast(ok ? "주소가 복사되었어요" : "복사에 실패했어요. 길게 눌러 복사해 주세요");
    });
  }

  // 지도앱 버튼
  const linkHost = root.querySelector("[data-maplinks]");
  if (linkHost) {
    const urls = buildMapLinks(d.mapQuery, d.mapLinks);
    const apps = [
      { key: "naver", label: "네이버지도" },
      { key: "kakao", label: "카카오맵" },
      { key: "tmap", label: "T맵" },
      { key: "google", label: "구글지도" },
    ];
    linkHost.textContent = "";
    apps.forEach(({ key, label }) => {
      if (!urls[key]) return;
      const a = document.createElement("a");
      a.className = "map-links__btn";
      a.href = urls[key];
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = label;
      linkHost.appendChild(a);
    });
  }

  // 교통편
  const transitHost = root.querySelector("[data-transit]");
  if (transitHost) {
    const t = d.transit || {};
    const rows = [
      { label: "지하철", text: t.subway },
      { label: "버스", text: t.bus },
      { label: "자가용", text: t.car },
      { label: "주차", text: t.parking },
    ];
    transitHost.textContent = "";
    rows.forEach(({ label, text }) => {
      if (!text) return;
      const li = document.createElement("li");
      li.className = "transit__row";
      const tag = document.createElement("span");
      tag.className = "transit__label";
      tag.textContent = label;
      const val = document.createElement("span");
      val.className = "transit__text";
      String(text).split("\n").forEach((line, i) => {
        if (i > 0) val.appendChild(document.createElement("br"));
        val.appendChild(document.createTextNode(line));
      });
      li.append(tag, val);
      transitHost.appendChild(li);
    });
  }
}
