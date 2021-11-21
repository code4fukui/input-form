import * as t from "https://deno.land/std/testing/asserts.ts";
import { VocabularyValidator as VV } from "./VocabularyValidator.js";

Deno.test("number", () => {
  t.assertEquals(VV.validate({ type: "number" }, "134"), { value: "134" });
  t.assertEquals(VV.validate({ type: "number" }, "134あいう"), { value: "134", other: "134あいう" });
  t.assertEquals(VV.validate({ type: "number" }, "あいう"), { value: null, other: "あいう" });
  t.assertEquals(VV.validate({ type: "number", limit: 3 }, "123"), { value: "123" });
  t.assertEquals(VV.validate({ type: "number", limit: 3 }, "1234"), { value: "", other: "1234" });
});
Deno.test("string", () => {
  t.assertEquals(VV.validate({ type: "string" }, "134"), { value: "134" });
  t.assertEquals(VV.validate({ type: "string" }, "134あいう"), { value: "134あいう" });
  t.assertEquals(VV.validate({ type: "string" }, "  134あいう\n\t"), { value: "134あいう" });
  t.assertEquals(VV.validate({ type: "string" }, "あい\nう"), { value: "あい", other: "う" });
  t.assertEquals(VV.validate({ type: "string", limit: 3 }, "123"), { value: "123" });
  t.assertEquals(VV.validate({ type: "string", limit: 3 }, "1234"), { value: "123", other: "4" });
});
Deno.test("text", () => {
  t.assertEquals(VV.validate({ type: "text" }, "134"), { value: "134" });
  t.assertEquals(VV.validate({ type: "text" }, "134あいう"), { value: "134あいう" });
  t.assertEquals(VV.validate({ type: "text" }, "  134あいう\n\t"), { value: "134あいう" });
  t.assertEquals(VV.validate({ type: "text" }, "あい\nう"), { value: "あい\nう" });
  t.assertEquals(VV.validate({ type: "text", limit: 3 }, "123"), { value: "123" });
  t.assertEquals(VV.validate({ type: "text", limit: 3 }, "1234"), { value: "123", other: "4" });
});
Deno.test("postalcode", () => {
  t.assertEquals(VV.validate({ type: "postalcode" }, "1234567"), { value: "1234567" });
  t.assertEquals(VV.validate({ type: "postalcode" }, "134"), { value: "", other: "134" });
  t.assertEquals(VV.validate({ type: "postalcode" }, "134あいう"), { value: "", other: "134あいう" });
  t.assertEquals(VV.validate({ type: "postalcode" }, "123-4567"), { value: "1234567", other: "123-4567" });
  t.assertEquals(VV.validate({ type: "postalcode" }, "〒123-4567"), { value: "1234567", other: "〒123-4567" });
  t.assertEquals(VV.validate({ type: "postalcode" }, "１２３ ４５６７"), { value: "1234567", other: "１２３ ４５６７" });
  t.assertEquals(VV.validate({ type: "postalcode" }, "一ニ三４５６７"), { value: "1234567", other: "一ニ三４５６７" });
  t.assertEquals(VV.validate({ type: "postalcode" }, "〒123-4567 福井県1-1-2"), { value: "1234567", other: "〒123-4567 福井県1-1-2" });
});
Deno.test("illegal", () => {
  t.assertEquals(VV.validate(), null);
  t.assertEquals(VV.validate(null, "123"), null);
  t.assertEquals(VV.validate({ type: "number" }, null), { value: "" });
  t.assertThrows(() => { VV.validate({ type: "x-integer" }, null) });
  t.assertEquals(VV.validate("33", null), null);
});
Deno.test("date", () => {
  t.assertEquals(VV.validate({ type: "date" }, "2021-11-01"), { value: "2021-11-01" });
  t.assertEquals(VV.validate({ type: "date" }, "2021/11/01"), { value: "2021-11-01" });
  t.assertEquals(VV.validate({ type: "date" }, "令和3年11月1日"), { value: "2021-11-01", other: "令和3年11月1日" });
  t.assertEquals(VV.validate({ type: "date" }, "R3/11/01"), { value: "2021-11-01", other: "R3/11/01" });
  t.assertEquals(VV.validate({ type: "date" }, "令和3年11月41日"), { value: "", other: "令和3年11月41日" });
  t.assertEquals(VV.validate({ type: "date" }, "令和３年１１月１日"), { value: "2021-11-01", other: "令和３年１１月１日" });
  t.assertEquals(VV.validate({ type: "date" }, "2001年2月29日"), { value: "", other: "2001年2月29日" });
  t.assertEquals(VV.validate({ type: "date" }, "平成元年11月1日"), { value: "1989-11-01", other: "平成元年11月1日" });
  t.assertEquals(VV.validate({ type: "date" }, "令和元年11月1日"), { value: "2019-11-01", other: "令和元年11月1日" });
});
Deno.test("time", () => {
  t.assertEquals(VV.validate({ type: "time" }, "12:20"), { value: "12:20" });
  t.assertEquals(VV.validate({ type: "time" }, "1:20"), { value: "01:20", other: "1:20" });
  t.assertEquals(VV.validate({ type: "time" }, "２３：３０"), { value: "23:30" });
  t.assertEquals(VV.validate({ type: "time" }, "5時30分"), { value: "05:30" });
  t.assertEquals(VV.validate({ type: "time" }, "24:00"), { value: "", other: "24:00" });
  t.assertEquals(VV.validate({ type: "time" }, "23:90"), { value: "", other: "23:90" });
  t.assertEquals(VV.validate({ type: "time" }, "13:60"), { value: "", other: "13:60" });
});
Deno.test("kana", () => {
  t.assertEquals(VV.validate({ type: "kana" }, "ひらがな"), { value: "ヒラガナ" });
  t.assertEquals(VV.validate({ type: "kana" }, "漢字"), { value: "", other: "漢字" });
  t.assertEquals(VV.validate({ type: "kana" }, "カタカナ"), { value: "カタカナ" });
  t.assertEquals(VV.validate({ type: "kana" }, "ABC"), { value: "", other: "ABC" });
  t.assertEquals(VV.validate({ type: "kana" }, "（カタカナとか）"), { value: "カタカナトカ", other: "（カタカナとか）" });
});
Deno.test("alpha", () => {
  t.assertEquals(VV.validate({ type: "alpha" }, "123ABC!#"), { value: "123ABC!#" });
  t.assertEquals(VV.validate({ type: "alpha" }, "ひらがな"), { value: "", other: "ひらがな" });
  t.assertEquals(VV.validate({ type: "alpha" }, "漢字"), { value: "", other: "漢字" });
  t.assertEquals(VV.validate({ type: "alpha" }, "カタカナAB"), { value: "AB", other: "カタカナAB" });
});
Deno.test("telephone", () => {
  t.assertEquals(VV.validate({ type: "telephone" }, "03-1234-4444"), { value: "03-1234-4444" });
  t.assertEquals(VV.validate({ type: "telephone" }, "(03)1234-4444"), { value: "(03)1234-4444" });
  t.assertEquals(VV.validate({ type: "telephone" }, "０３-１２３４-４４４４"), { value: "03-1234-4444" });
  t.assertEquals(VV.validate({ type: "telephone" }, "03-1234-4444 / 03-0000-0000"), { value: "03-1234-4444 / 03-0000-0000" });
  t.assertEquals(VV.validate({ type: "telephone" }, "電話番号03-1234-4444 / 03-0000-0000"), { value: "03-1234-4444 / 03-0000-0000", other: "電話番号03-1234-4444 / 03-0000-0000" });
});
Deno.test("telephone-ext", () => {
  t.assertEquals(VV.validate({ type: "telephone-ext" }, "03 / 33"), { value: "03 / 33" });
  t.assertEquals(VV.validate({ type: "telephone-ext" }, "内線1234"), { value: "1234", other: "内線1234" });
  t.assertEquals(VV.validate({ type: "telephone-ext" }, "内線１２３４／５"), { value: "1234/5", other: "内線１２３４／５" });
});
Deno.test("lat", () => {
  t.assertEquals(VV.validate({ type: "lat" }, "35.355"), { value: "35.355" });
  t.assertEquals(VV.validate({ type: "lat" }, "緯度-31.334"), { value: "-31.334", other: "緯度-31.334" });
  t.assertEquals(VV.validate({ type: "lat" }, "５５．２３"), { value: "55.23" });
  t.assertEquals(VV.validate({ type: "lat" }, "135.22"), { value: "", other: "135.22" });
});
Deno.test("lng", () => {
  t.assertEquals(VV.validate({ type: "lng" }, "35.355"), { value: "35.355" });
  t.assertEquals(VV.validate({ type: "lng" }, "東経-31.334"), { value: "-31.334", other: "東経-31.334" });
  t.assertEquals(VV.validate({ type: "lng" }, "５５．２３"), { value: "55.23" });
  t.assertEquals(VV.validate({ type: "lng" }, "４５５．２３"), { value: "", other: "４５５．２３" });
});
Deno.test("lang", () => {
  t.assertEquals(VV.validate({ type: "lang" }, "jpn;eng;chi"), { value: "jpn;eng;chi" });
  t.assertEquals(VV.validate({ type: "lang" }, "日本語、英語"), { value: "", other: "日本語、英語" });
});
Deno.test("poicode", () => {
  t.assertEquals(VV.validate({ type: "poicode" }, "1123"), { value: "1123" });
  t.assertEquals(VV.validate({ type: "poicode" }, "ポイ1234"), { value: "1234", other: "ポイ1234" });
});
Deno.test("industrycode", () => {
  t.assertEquals(VV.validate({ type: "industrycode" }, "1123"), { value: "1123" });
  t.assertEquals(VV.validate({ type: "industrycode" }, "ポイ1234"), { value: "1234", other: "ポイ1234" });
});
Deno.test("string[pref]", () => {
  t.assertEquals(VV.validate({ type: "string[pref]" }, "北海道"), { value: "北海道" });
});
Deno.test("enum[,A,B,C]", () => {
  t.assertEquals(VV.validate({ type: "enum[,A,B,C]" }, "A"), { value: "A" });
  t.assertEquals(VV.validate({ type: "enum[,A,B,C]" }, "D"), { value: "", other: "D" });
  t.assertEquals(VV.validate({ type: "enum[,公開,非公開]" }, "公開"), { value: "公開" });
  t.assertEquals(VV.validate({ type: "enum[,公開,非公開]" }, "未公開"), { value: "", other: "未公開" });
});
Deno.test("validate", () => {
  const vocabs = [
    { name_ja: "定員", type: "number" },
    { name_ja: "名称", type: "string" },
  ];
  const data = { 定員: "30人", 名称: "あいうえ" };
  t.assertEquals(VV.validate(vocabs, data), { 定員: "30", 名称: "あいうえ" });
});
Deno.test("migrate", () => {
  const vocabs = [
    { name_ja: "開始日", type: "date" },
    { name_ja: "名称(カナ)", type: "kana" },
  ];
  const data = { 開始日: "2021年1月10日 （雨天順延）", "名称(カナ)": "あいうえ" };
  t.assertEquals(VV.migrate(vocabs, data), {
    開始日: { value: "2021-01-10", other: "2021年1月10日 （雨天順延）" },
    "名称(カナ)": { value: "アイウエ" },
  });
});
