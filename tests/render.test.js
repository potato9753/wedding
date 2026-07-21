// tests/render.test.js — 순수 포맷/조합 함수 단위 테스트 (node --test, 무프레임워크)
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseDateTime,
  formatKoreanDate,
  formatKoreanDateWithDay,
  formatDotDate,
  formatKoreanTime,
  formatEnglishTime,
  formatCoverDateTime,
  monthMatrix,
  personName,
  combineCoupleNames,
  formatParentName,
  formatParentLine,
  normalizeLines,
  WEEKDAYS_KO,
  WEEKDAYS_EN,
} from "../js/render.js";

// ── parseDateTime ──────────────────────────────────────
test("parseDateTime: 오프셋 포함 문자열의 벽시계 값을 그대로 추출", () => {
  assert.deepEqual(parseDateTime("2026-05-16T13:00:00+09:00"), {
    year: 2026,
    month: 5,
    day: 16,
    hour: 13,
    minute: 0,
    weekday: 6, // 토요일
  });
});

test("parseDateTime: 시간 없는 날짜는 00:00 으로", () => {
  const p = parseDateTime("2026-05-16");
  assert.equal(p.hour, 0);
  assert.equal(p.minute, 0);
  assert.equal(p.weekday, 6);
});

test("parseDateTime: 요일 계산이 타임존과 무관하게 결정적", () => {
  assert.equal(parseDateTime("2026-01-01").weekday, 4); // 목요일
  assert.equal(parseDateTime("2026-12-25").weekday, 5); // 금요일
});

test("parseDateTime: 잘못된 형식이면 throw", () => {
  assert.throws(() => parseDateTime("not-a-date"));
  assert.throws(() => parseDateTime(""));
});

// ── 날짜 포맷 ──────────────────────────────────────────
test("formatKoreanDate", () => {
  assert.equal(formatKoreanDate("2026-05-16T13:00:00+09:00"), "2026년 5월 16일");
});

test("formatKoreanDateWithDay", () => {
  assert.equal(
    formatKoreanDateWithDay("2026-05-16T13:00:00+09:00"),
    "2026년 5월 16일 토요일"
  );
});

test("formatDotDate: 0 패딩", () => {
  assert.equal(formatDotDate("2026-05-16T13:00:00+09:00"), "2026. 05. 16");
  assert.equal(formatDotDate("2026-11-03T09:00:00+09:00"), "2026. 11. 03");
});

// ── 시간 포맷 ──────────────────────────────────────────
test("formatKoreanTime: 정각/분/오전오후/12시 경계", () => {
  assert.equal(formatKoreanTime("2026-05-16T13:00+09:00"), "오후 1시");
  assert.equal(formatKoreanTime("2026-05-16T13:30+09:00"), "오후 1시 30분");
  assert.equal(formatKoreanTime("2026-05-16T09:05+09:00"), "오전 9시 5분");
  assert.equal(formatKoreanTime("2026-05-16T00:00+09:00"), "오전 12시");
  assert.equal(formatKoreanTime("2026-05-16T12:00+09:00"), "오후 12시");
});

test("formatEnglishTime", () => {
  assert.equal(formatEnglishTime("2026-05-16T13:00+09:00"), "PM 1:00");
  assert.equal(formatEnglishTime("2026-05-16T00:30+09:00"), "AM 12:30");
  assert.equal(formatEnglishTime("2026-05-16T12:00+09:00"), "PM 12:00");
});

test("formatCoverDateTime", () => {
  assert.equal(
    formatCoverDateTime("2026-05-16T13:00:00+09:00"),
    "2026. 05. 16. SAT PM 1:00"
  );
});

// ── 이름/혼주 ──────────────────────────────────────────
test("personName: 공백 정리, 없으면 빈 문자열", () => {
  assert.equal(personName({ firstName: "  홍길동  " }), "홍길동");
  assert.equal(personName(null), "");
  assert.equal(personName({}), "");
});

test("combineCoupleNames: 기본 하트, 커스텀 구분자", () => {
  const couple = { groom: { firstName: "홍길동" }, bride: { firstName: "김영희" } };
  assert.equal(combineCoupleNames(couple), "홍길동 ♥ 김영희");
  assert.equal(combineCoupleNames(couple, "&"), "홍길동 & 김영희");
});

test("formatParentName: 생존/작고/빈값", () => {
  assert.equal(formatParentName({ name: "홍부친" }), "홍부친");
  assert.equal(formatParentName({ name: "홍부친", deceased: true }), "故 홍부친");
  assert.equal(formatParentName({ name: "" }), "");
  assert.equal(formatParentName(null), "");
});

test("formatParentLine: 양친 / 한쪽 / 작고 포함", () => {
  const child = { firstName: "홍길동", order: "아들" };
  assert.equal(
    formatParentLine({ father: { name: "홍부친" }, mother: { name: "이모친" } }, child),
    "홍부친 · 이모친의 아들 홍길동"
  );
  assert.equal(
    formatParentLine({ father: { name: "홍부친" }, mother: { name: "" } }, child),
    "홍부친의 아들 홍길동"
  );
  assert.equal(
    formatParentLine(
      { father: { name: "홍부친", deceased: true }, mother: { name: "이모친" } },
      child
    ),
    "故 홍부친 · 이모친의 아들 홍길동"
  );
});

test("formatParentLine: 부모 없으면 관계+이름만", () => {
  assert.equal(
    formatParentLine({}, { firstName: "홍길동", order: "아들" }),
    "아들 홍길동"
  );
});

// ── 유틸 ───────────────────────────────────────────────
test("normalizeLines: 배열 통과 / 문자열 개행 분리", () => {
  assert.deepEqual(normalizeLines(["a", "b"]), ["a", "b"]);
  assert.deepEqual(normalizeLines("a\nb"), ["a", "b"]);
  assert.deepEqual(normalizeLines(null), [""]);
});

test("요일 상수 길이/값", () => {
  assert.equal(WEEKDAYS_KO.length, 7);
  assert.equal(WEEKDAYS_EN.length, 7);
  assert.equal(WEEKDAYS_KO[6], "토");
  assert.equal(WEEKDAYS_EN[6], "SAT");
});

// ── monthMatrix ────────────────────────────────────────
test("monthMatrix: 2026-05 구조 (1~31, 7 배수, 16일=토요일)", () => {
  const flat = monthMatrix(2026, 5).flat();
  assert.equal(flat.length % 7, 0);
  const days = flat.filter((x) => x !== null);
  assert.deepEqual(days, Array.from({ length: 31 }, (_, i) => i + 1));
  assert.equal(flat.indexOf(16) % 7, 6); // 토요일 열
});

test("monthMatrix: 2월 일수 (평년 28 / 윤년 29)", () => {
  assert.equal(monthMatrix(2026, 2).flat().filter((x) => x !== null).length, 28);
  assert.equal(monthMatrix(2024, 2).flat().filter((x) => x !== null).length, 29);
});
