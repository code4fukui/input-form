import { create } from "https://js.sabae.cc/stdcomp.js";
import { InputLGCode } from "https://code4fukui.github.io/input-lgcode/input-lgcode.js";
import { InputGeo3x3 } from "https://code4fukui.github.io/input-geo3x3/input-geo3x3.js";
import { InputForm } from "./input-form.js";
import { InputImage } from "https://code4fukui.github.io/input-image/input-image.js";
import { SelectIndustryCode } from "https://code4fukui.github.io/IndustryCode/select-industrycode.js";

export const createInputByType = (type, opts) => {
  if (type.startsWith("enum[")) {
    const vals = type.substring(5, type.length - 1).split(",");
    const sel = create("select", this);
    for (const d of vals) {
      const opt = create("option", sel);
      opt.textContent = d;
    }
    return sel;
  } else if (type.startsWith("enumv[")) {
    const vals = type.substring(6, type.length - 1).split(",");
    const sel = create("select", this);
    for (const d of vals) {
      const opt = create("option", sel);
      const n = d.lastIndexOf(":");
      opt.textContent = d.substring(0, n);
      opt.value = d.substring(n + 1);
    }
    return sel;
  } else if (type.startsWith("vocab[")) {
    const vurl = type.substring(6, type.length - 1);
    return new InputForm({ vocab: vurl });
  } else if (type == "datetime") {
    const inp = create("input", this);
    inp.type = "datetime";
    return inp;
  } else if (type == "date") {
    const inp = create("input", this);
    inp.type = "date";
    return inp;
  } else if (type == "time") {
    const inp = create("input", this);
    inp.type = "time";
    return inp;
  } else if (type == "text") {
    return create("textarea", this);
  } else if (type == "lgcode") {
    return new InputLGCode(opts);
  } else if (type == "industrycode") {
    return new SelectIndustryCode(opts);
  } else if (type == "geo3x3") {
    return new InputGeo3x3(34.57346388686853, 135.48292948058597); // todo ues opts
  } else if (type == "image") {
    return new InputImage(opts);
  } else {
    return create("input", this);
  }
};
