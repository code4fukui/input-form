import * as t from "https://deno.land/std/testing/asserts.ts";
import { trim } from "./VocabularyValidator.js";

Deno.test("basic", () => {
  t.assertEquals(trim(" a "), "a");
  t.assertEquals(trim(" abc"), "abc");
  t.assertEquals(trim("abc   "), "abc");
});
Deno.test("enter tab spc", () => {
  t.assertEquals(trim("\n a \t"), "a");
  t.assertEquals(trim(" abc\t\t"), "abc");
  t.assertEquals(trim(" \tabc\n\n\t"), "abc");
});
Deno.test("zenkaku spc", () => {
  t.assertEquals(trim("　 a 　"), "a");
  t.assertEquals(trim(" abc　　"), "abc");
  t.assertEquals(trim("　　abc   "), "abc");
});
Deno.test("null", () => {
  t.assertEquals(trim(null), "");
  t.assertEquals(trim(undefined), "");
  t.assertEquals(trim(NaN), "");
});
Deno.test("num", () => {
  t.assertEquals(trim(13), "13");
  t.assertEquals(trim(0), "0");
});
Deno.test("object", () => {
  t.assertEquals(trim({ a: 3 }), `{"a":3}`);
});
Deno.test("array", () => {
  t.assertEquals(trim([1, 2, 3]), `[1,2,3]`);
});
