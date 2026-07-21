// tests/countdown.test.js — D-day/카운트다운/경과일 순수 함수 테스트
import { test } from "node:test";
import assert from "node:assert/strict";
import { dDay, formatDday, countdownParts, elapsedDays } from "../js/countdown.js";

const WED = "2026-05-16T13:00:00+09:00";

test("dDay: 남은/당일/지난 일수 (캘린더 기준)", () => {
  assert.equal(dDay(WED, new Date(2026, 4, 1)), 15); // 5/1 → 15일 남음
  assert.equal(dDay(WED, new Date(2026, 4, 16)), 0); // 당일
  assert.equal(dDay(WED, new Date(2026, 4, 17)), -1); // 하루 지남
  assert.equal(dDay(WED, new Date(2026, 3, 16)), 30); // 4/16 → 30일
});

test("formatDday: D-N / D-DAY / D+N", () => {
  assert.equal(formatDday(30), "D-30");
  assert.equal(formatDday(1), "D-1");
  assert.equal(formatDday(0), "D-DAY");
  assert.equal(formatDday(-3), "D+3");
});

test("countdownParts: 일/시/분/초 분해", () => {
  const target = ((1 * 24 + 2) * 60 + 3) * 60 * 1000 + 4 * 1000; // 1일 2시 3분 4초
  const p = countdownParts(target, 0);
  assert.equal(p.days, 1);
  assert.equal(p.hours, 2);
  assert.equal(p.minutes, 3);
  assert.equal(p.seconds, 4);
  assert.equal(p.done, false);
});

test("countdownParts: 지난 시각이면 0 + done", () => {
  const p = countdownParts(1000, 5000);
  assert.equal(p.total, 0);
  assert.deepEqual([p.days, p.hours, p.minutes, p.seconds], [0, 0, 0, 0]);
  assert.equal(p.done, true);
});

test("elapsedDays: 경과일 (미래는 0으로 클램프)", () => {
  assert.equal(elapsedDays("2020-03-14", new Date(2020, 2, 14)), 0);
  assert.equal(elapsedDays("2020-03-14", new Date(2020, 2, 15)), 1);
  assert.equal(elapsedDays("2020-03-14", new Date(2021, 2, 14)), 365);
  assert.equal(elapsedDays("2030-01-01", new Date(2020, 0, 1)), 0);
});
