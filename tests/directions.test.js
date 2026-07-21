// tests/directions.test.js — 지도앱 딥링크 생성 함수 테스트
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildMapLinks } from "../js/directions.js";

test("buildMapLinks: 검색어 기반 4종 생성", () => {
  const u = buildMapLinks("더컨벤션 송파문정");
  const q = encodeURIComponent("더컨벤션 송파문정");
  assert.equal(u.naver, `https://map.naver.com/p/search/${q}`);
  assert.equal(u.kakao, `https://map.kakao.com/link/search/${q}`);
  assert.equal(u.tmap, `tmap://search?name=${q}`);
  assert.equal(u.google, `https://www.google.com/maps/search/?api=1&query=${q}`);
});

test("buildMapLinks: 명시 URL 우선", () => {
  const u = buildMapLinks("X", { naver: "https://naver.example/place/1" });
  assert.equal(u.naver, "https://naver.example/place/1");
  // 나머지는 검색어로 생성
  assert.ok(u.kakao.includes(encodeURIComponent("X")));
});

test("buildMapLinks: 검색어/URL 모두 없으면 빈 문자열", () => {
  const u = buildMapLinks("", {});
  assert.equal(u.naver, "");
  assert.equal(u.kakao, "");
  assert.equal(u.tmap, "");
  assert.equal(u.google, "");
});
