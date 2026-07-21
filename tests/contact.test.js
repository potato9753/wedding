// tests/contact.test.js — 전화/문자 링크용 숫자 정제 함수 테스트
import { test } from "node:test";
import assert from "node:assert/strict";
import { digits } from "../js/contact.js";

test("digits: 숫자와 + 만 남김", () => {
  assert.equal(digits("010-1234-5678"), "01012345678");
  assert.equal(digits("+82 10-1234-5678"), "+821012345678");
  assert.equal(digits("(02) 000-0000"), "020000000");
  assert.equal(digits(""), "");
  assert.equal(digits(null), "");
});
