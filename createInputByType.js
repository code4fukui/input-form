import { create } from "https://js.sabae.cc/stdcomp.js";
import { InputLGCode } from "https://code4fukui.github.io/input-lgcode/input-lgcode.js";
import { InputGeo3x3 } from "https://code4fukui.github.io/input-geo3x3/input-geo3x3.js";
import { InputForm } from "./input-form.js";

export const createInputByType = (type) => {
  if (type.startsWith("enum[")) {
    const vals = type.substring(5, type.length - 1).split(",");
    const sel = create("select", this);
    //const vals = JSON.parse(val);
    for (const d of vals) {
      const opt = create("option", sel);
      opt.textContent = d;
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
    return new InputLGCode();
  } else if (type == "industorycode") {
    return new InputIndustoryCode();
  } else if (type == "geo3x3") {
    return new InputGeo3x3(34.57346388686853, 135.48292948058597);
  } else {
    return create("input", this);
  }
};
