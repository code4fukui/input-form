import { Day, Time } from "https://js.sabae.cc/DateTime.js";
import { WAREKI, WAREKI_ID, WAREKI_FIRST_YEAR, WAREKI_JA } from "https://code4fukui.github.io/day-es/WAREKI.js";
import { KanaValidator } from "https://code4fukui.github.io/input-kana/KanaValidator.js";
import { AlphaValidator } from "https://code4fukui.github.io/input-alpha/AlphaValidator.js";
import { TelephoneValidator } from "https://code4fukui.github.io/input-telephone/TelephoneValidator.js";
import { TelephoneExtValidator } from "https://code4fukui.github.io/input-telephone/TelephoneExtValidator.js";
import { FloatValidator } from "https://code4fukui.github.io/input-float/FloatValidator.js";

export const trim = (s) => {
  if (s === null || s === undefined) {
    return "";
  }
  if (Array.isArray(s) || typeof s == "object") {
    s = JSON.stringify(s);
  }
  if (Number.isNaN(s)) {
    return "";
  }
  if (typeof s == "integer") {
    s = s.toString();
  } else if (typeof s != "string") {
    s = s.toString();
  }
  s = s.replace(/^\s+/g, "");
  s = s.replace(/^　+/g, "");
  s = s.replace(/\s+$/g, "");
  s = s.replace(/　+$/g, "");
  return s;
};

class VocabularyValidator {
  // input
  //   vocab: [ { vocab, limit, type }]
  //   data: [ { name_ja, value }]
  // output
  //   data
  static validate(vocab, data) {
    if (data == null || typeof data != "object") {
      return this.validateSingle(vocab, data);
    }
    const res = {};
    for (const name in data) {
      const v = vocab.find(v => v.name_ja == name);
      const newv = this.validateSingle(v, data[name]);
      res[name] = newv.value;
    }
    return res;
  }
  // input
  //   vocab: [ { vocab, limit, type }]
  //   data: { name: value }
  // output
  //   data: { name: { value, other } }
  static migrate(vocab, data) {
    const res = {};
    for (const name in data) {
      const v = vocab.find(v => v.name_ja == name);
      const newv = this.validateSingle(v, data[name]);
      res[name] = newv;
    }
    return res;
  }

  // input:
  //  vocab { name_ja, type, limit, count }
  // response { value, other }
  static validateSingle(vocab, value) {
    if (!vocab || !vocab.type) {
      return null;
    }
    switch (vocab.type) {
      case "number":
        return this.validateNumber(vocab, value);
      case "string":
        return this.validateString(vocab, value, { singleline: true });
      case "postalcode":
        return this.validatePostalCode(vocab, value);
      case "text":
        return this.validateString(vocab, value);
      case "date":
        return this.validateDate(vocab, value);
      case "time":
        return this.validateTime(vocab, value);
      case "kana":
        return this.validateKana(vocab, value);
      case "alpha":
        return this.validateAlpha(vocab, value);
      case "telephone":
        return this.validateTelephone(vocab, value);
      case "telephone-ext":
        return this.validateTelephoneExt(vocab, value);
      case "lat":
        return this.validateLat(vocab, value);
      case "lng":
        return this.validateLng(vocab, value);
      case "poicode":
        return this.validatePOICode(vocab, value);
      case "industrycode":
        return this.validateIndustryCode(vocab, value);
      case "lang":
        return this.validateLangCode(vocab, value);
      case "week":
        return this.validateWeek(vocab, value);
    }
    if (vocab.type.startsWith("string[")) {
      return this.validateString(vocab, value, { singleline: true });
    } else if (vocab.type.startsWith("enum[")) {
      return this.validateEnum(vocab, value);
    }
    throw new Error("validator didn't support yet! " + vocab.type)
  }
  static validateNumber(vocab, value) {
    value = trim(value);
    if (!value) {
      return { value: "" };
    }
    const v = value.replace(/,/g, "");
    const n = parseInt(v);
    if (isNaN(n)) {
      return { value: null, other: value };
    }
    if (n.toString() == v) {
      if (v.length > vocab.limit) {
        return { value: "", other: value };
      }
      return { value: n.toString() };
    }
    if (vocab.limit && v.length > vocab.limit) {
      return { value: "", other: value };
    }
    return { value: n.toString(), other: value };
  }
  static validateString(vocab, value, opt = {}) {
    value = trim(value);
    if (!value) {
      return { value: "" };
    }
    const n = value.indexOf("\n");
    if (opt.singleline && n >= 0) {
      const s = trim(value.substring(0, n));
      if (vocab.limit && s.length > vocab.limit) {
        return { value: s.substring(0, vocab.limit), other: s.substring(vocab.limit) };
      }
      return { value: s, other: value.substring(n + 1) };
    }
    if (vocab.limit && value.length > vocab.limit) {
      return { value: value.substring(0, vocab.limit), other: value.substring(vocab.limit) };
    }
    return { value: value };
  }
  static validateFixedNumber(vocab, value, beam) {
    if (vocab.limit && vocab.limit != beam) {
      return { value: "", other: value };
    }
    value = trim(value);
    if (!value) {
      return { value: "" };
    }
    const num = [];
    const numc = "0123456789０１２３４５６７８９〇一ニ三四五六七八九";
    let isbr = false;
    for (const c of value) {
      const n = numc.indexOf(c);
      if (n >= 0) {
        num.push(n % 10);
        if (num.length > beam) {
          if (!isbr) {
            return { value: "", other: value };
          }
          break;
        }
        isbr = false;
      } else {
        isbr = true;
      }
    }
    const snum = num.join("").substring(0, 7);
    if (snum.length != beam) {
      return { value: "", other: value };
    }
    if (snum != value) {
      return { value: snum, other: value };
    }
    return { value: snum };
  }
  static validatePostalCode(vocab, value) {
    return this.validateFixedNumber(vocab, value, 7);
  }
  static parseNums(value) {
    const nums = [];
    let num = [];
    const numc = "0123456789０１２３４５６７８９〇一ニ三四五六七八九";
    let isbr = false;
    for (const c of value) {
      const n = numc.indexOf(c);
      if (n >= 0) {
        num.push(n % 10);
        isbr = false;
      } else {
        isbr = true;
        if (num.length) {
          nums.push(num.join(""));
        }
        num = [];
      }
    }
    if (num.length > 0) {
      nums.push(num.join(""));
    }
    return nums;
  }
  static parseWarekiOffset(value) {
    for (const wa in WAREKI_JA) {
      if (value.indexOf(wa) >= 0) {
        return WAREKI_JA[wa] - 1;
      }
    }
    for (const wa in WAREKI) {
      if (value.indexOf(wa) >= 0) {
        return WAREKI[wa] - 1;
      }
    }
    for (let i = 0; i < WAREKI_ID.length; i++) {
      const wa = WAREKI_ID[i];
      if (value.indexOf(wa) >= 0) {
        return WAREKI_FIRST_YEAR[i] - 1;
      }
    }
    return 0;
  }
  static validateDate(vocab, value) {
    value = trim(value);
    if (!value) {
      return { value: "" };
    }
    if (vocab.limit && vocab.limit != 10) {
      return { value: "", other: value };
    }
    const waoff = this.parseWarekiOffset(value.substring(0, 10));
    const nums = this.parseNums(value.replace(/元/, "1"));
    if (nums.length < 3) {
      return { value: "", other: value };
    }
    try {
      const d = new Day(parseInt(nums[0]) + waoff, nums[1], nums[2]);
      if (d.year < 1 || d.year > 9999) {
        return { value: "", other: value };
      }
      const s = new Day(parseInt(nums[0]) + waoff, nums[1], nums[2]).toString();
      if (s.length != value.length) {
        return { value: s, other: value };
      }
      return { value: s };
    } catch (e) {
    }
    return { value: "", other: value };
  }
  static validateTime(vocab, value) {
    value = trim(value);
    if (!value) {
      return { value: "" };
    }
    if (vocab.limit && vocab.limit != 5) {
      return { value: "", other: value };
    }
    const nums = this.parseNums(value);
    if (nums.length < 2) {
      return { value: "", other: value };
    }
    try {
      const t = new Time(parseInt(nums[0]), parseInt(nums[1]));
      if (t.hour < 0 || t.hour > 23 || t.min < 0 || t.min > 59) {
        return { value: "", other: value };
      }
      const s = t.toString();
      if (s.length != value.length) {
        return { value: s, other: value };
      }
      return { value: s };
    } catch (e) {
    }
    return { value: "", other: value };
  }
  static validateChars(vocab, value, validator) {
    value = trim(value);
    if (!value) {
      return { value: "" };
    }
    const res = [];
    for (const c of value) {
      if (validator.isValid(c)) {
        res.push(validator.normalize(c));
      }
    }
    const s = res.join("");
    if (vocab.limit && s.length >= vocab.limit) {
      return { value: s.substring(0, vocab.limit), other: value };
    }
    if (s.length != value.length) {
      return { value: s, other: value };
    }
    return { value: s };
  }
  static validateKana(vocab, value) {
    return this.validateChars(vocab, value, new KanaValidator());
  }
  static validateAlpha(vocab, value) {
    return this.validateChars(vocab, value, new AlphaValidator());
  }
  static validateTelephone(vocab, value) {
    return this.validateChars(vocab, value, new TelephoneValidator());
  }
  static validateTelephoneExt(vocab, value) {
    return this.validateChars(vocab, value, new TelephoneExtValidator());
  }
  static validateFloat(vocab, value, min, max) {
    const res = this.validateChars(vocab, value, new FloatValidator());
    if (!res.value) {
      return res;
    }
    const n = parseFloat(res.value);
    if (n > max || n < min) {
      return { value: "", other: value };
    }
    const s = n.toString();
    if (s.length != value.length) {
      return { value: s, other: value };
    }
    return { value: s };
  }
  static validateLat(vocab, value) {
    return this.validateFloat(vocab, value, -90, 90);
  }
  static validateLng(vocab, value) {
    return this.validateFloat(vocab, value, -180, 180);
  }
  static validateLGCode(vocab, value) {
    return this.validateFixedNumber(vocab, value, 6);
  }
  static validateIndustryCode(vocab, value) {
    return this.validateAlpha(vocab, value);
  }
  static validatePOICode(vocab, value) {
    return this.validateFixedNumber(vocab, value, 4);
  }
  static validateLangCode(vocab, value) {
    return this.validateAlpha(vocab, value);
  }
  static validateWeek(vocab, value) {
    const week = "月火水木金土日";
    const res = [];
    for (const c of value) {
      if (week.indexOf(c) >= 0) {
        res.push(c);
      }
    }
    const s = res.join("");
    if (vocab.limit && s.length >= vocab.limit) {
      return { value: s.substring(0, vocab.limit), other: s.substring(vocab.limit) };
    }
    if (s != value) {
      return { value: s, other: value };
    }
    return { value: s };
  }
  static validateEnum(vocab, value) {
    if (!value) {
      return { value: "" };
    }
    const sels = vocab.type.substring("enum[".length, vocab.type.length - 1).split(",");
    const n = sels.indexOf(value);
    if (n == -1) {
      return { value: "", other: value };
    }
    return { value };
  }
}

export { VocabularyValidator };
