import { CSV } from "https://js.sabae.cc/CSV.js";
import { create } from "https://js.sabae.cc/stdcomp.js";
import { createInputByType } from "./createInputByType.js";
import { InputMulti } from "./input-multi.js";

class InputForm extends HTMLElement {
  constructor(opts) {
    super();
    if (opts) {
      for (const name in opts) {
        if (opts[name] != null) {
          this.setAttribute(name, opts[name]);
        }
      }
    }
    this.init();
  }
  async init() {
    const vocaburl = this.getAttribute("vocab");
    if (!vocaburl) {
      console.log("no vocab attribute");
      return;
    }
    const vocab = CSV.toJSON(await CSV.fetch(vocaburl));
    this.vocab = vocab;
    const data = JSON.parse(this.getAttribute("value"));
    const inps = {};
    for (const v of vocab) {
      if (v.disabled) {
        continue;
      }
      const name = v.name_ja;
      const div = create("div", this);
      /*
      const v = vocab.find(v => v.name_ja == name);
      if (!v) {
        console.log(name);
      }
      */
      const mandatory = v.mandatory == 1 ? " <b>(必須)</b>" : "";

      div.innerHTML = name + mandatory; //.substring(5);
      const type = v.type;
      const inp = v.count > 1 ? new InputMulti({ type, maxlength: v.count }, v) : createInputByType(type, v);
      this.appendChild(inp);
      const val = data ? data[name] || "" : "";
      if (val) {
        inp.value = val;
      }
      if (v.lock == "1") {
        inp.disabled = true;
      }
      inps[name] = inp;
    }
    this.inps = inps;
  }
  get value() {
    const res = {};
    for (const name in this.inps) {
      const inp = this.inps[name];
      res[name] = inp.value;
    }
    return res;
  }
  set value(data) {
    if (data && typeof data == "string") {
      data = JSON.parse(data);
    }
    if (this.inps) {
      for (const name in this.inps) {
        const inp = this.inps[name];
        if (data[name] !== undefined) {
          inp.value = data[name];
        }
      }
    }
    this.setAttribute("value", JSON.stringify(data));
  }
}

customElements.define("input-form", InputForm);

export { InputForm };

/*
    Object.assign(this.style, {
      display: "grid",
      "grid-template-columns": "13em .9fr",
      //"grid-template-columns": "6em 26em",
    });
*/
