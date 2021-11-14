import { create } from "https://js.sabae.cc/stdcomp.js";
import { createInputByType } from "./createInputByType.js";

class InputMulti extends HTMLElement {
  constructor(opts, childopts) {
    super();
    if (opts) {
      for (const name in opts) {
        if (opts[name] != null) {
          this.setAttribute(name, opts[name]);
        }
      }
    }
    this.childopts = childopts;
    this.init();
  }
  async init() {
    this.inps = create("div", this, "inps");
    this.appendChild(this.inps);
    const btns = create("div", this);
    const btnp = create("button", btns);
    btnp.textContent = "+";
    const btnm = create("button", btns);
    btnm.textContent = "-";
    btnp.onclick = () => {
      if (this.inps.children.length < parseInt(this.getAttribute("maxlength"))) {
        this._addInp();
      }
    };
    btnm.onclick = () => {
      if (this.inps.children.length == 0) {
        return;
      }
      const inp = this.inps.children[this.inps.children.length - 1];
      this.inps.removeChild(inp);
    };
    this._setValue();
  }
  _addInp() {
    const type = this.getAttribute("type");
    const inp = createInputByType(type, this.childopts);
    this.inps.appendChild(inp);
    return inp;
  }
  async _setValue() {
    this.inps.innerHTML = "";
    const data = JSON.parse(this.getAttribute("data"));
    //console.log("_sv", data);
    if (data && data.length > 0) {
      for (const d of data) {
        const inp = this._addInp();
        inp.value = d;
      }
    }
  }
  get value() {
    const inps = this.inps.children;
    const res = [];
    for (const inp of inps) {
      res.push(inp.value);
    }
    return res;
  }
  set value(data) {
    if (data && typeof data == "string") {
      data = JSON.parse(data);
    }
    if (data && Array.isArray(data)) {
      const data2 = [];
      const len = Math.min(data.length, parseInt(this.getAttribute("maxlength")));
      for (let i = 0; i < len; i++) {
        data2.push(data[i]);
      }
      this.setAttribute("data", JSON.stringify(data2));
    } else {
      this.setAttribute("data", null);
    }
    this._setValue();
  }
}

customElements.define("input-multi", InputMulti);

export { InputMulti };
