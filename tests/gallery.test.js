// tests/gallery.test.js — 라이트박스 인덱스 순환 함수 테스트
import { test } from "node:test";
import assert from "node:assert/strict";
import { wrapIndex } from "../js/gallery.js";

test("wrapIndex: 범위 내/경계/음수/초과 순환", () => {
  assert.equal(wrapIndex(0, 5), 0);
  assert.equal(wrapIndex(4, 5), 4);
  assert.equal(wrapIndex(5, 5), 0); // 마지막 다음 → 처음
  assert.equal(wrapIndex(-1, 5), 4); // 처음 이전 → 마지막
  assert.equal(wrapIndex(6, 5), 1);
  assert.equal(wrapIndex(-6, 5), 4);
});

test("wrapIndex: 길이 0 이면 0", () => {
  assert.equal(wrapIndex(3, 0), 0);
  assert.equal(wrapIndex(0, 0), 0);
});
