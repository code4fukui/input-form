import { create } from "https://js.sabae.cc/stdcomp.js";
import { createInputByType } from "./createInputByType.js";

class InputMulti extends HTMLElement {
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
    this.innerHTML = "";
    const type = this.getAttribute("type");
    const inp = createInputByType(type);
    this.appendChild(inp);
    const btns = create("div", this);
    const btnp = create("button", btns);
    btnp.textContent = "+";
    const btnm = create("button", btns);
    btnm.textContent = "-";
    const addInp = () => {
      const inp = createInputByType(type);
      this.insertBefore(inp, btns);
      return inp;
    };
    btnp.onclick = () => {
      if (this.children.length <= parseInt(this.getAttribute("maxlength"))) {
        addInp();
      }
    };
    btnm.onclick = () => {
      if (this.children.length <= 2) {
        return;
      }
      const inp = this.children[this.children.length - 2];
      this.removeChild(inp);
    };

    // set data
    const data = JSON.parse(this.getAttribute("data"));
    if (data && data.length > 0) {
      inp.value = data[0];
      for (let i = 1; i < data.length; i++) {
        const inp = addInp();
        inp.value = data[i];
      }
    }
  }
  get value() {
    const inps = this.children;
    const res = [];
    for (let i = 0; i < inps.length - 1; i++) {
      const inp = inps[i];
      res.push(inp.value);
    }
    return res;
  }
  set value(data) {
    if (!data) {
      return;
    }
    if (!Array.isArray(data)) {
      console.log("data must be an array");
      return;
    }
    const data2 = [];
    const len = Math.min(data.length, parseInt(this.getAttribute("maxlength")));
    for (let i = 0; i < len; i++) {
      data2.push(data[i]);
    }
    this.setAttribute("data", JSON.stringify(data2));
    this.init();
  }
}

customElements.define("input-multi", InputMulti);

export { InputMulti };
