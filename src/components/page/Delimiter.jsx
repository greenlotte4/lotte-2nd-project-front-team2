import React, { useRef, useEffect } from "react";


export default class Delimiter {
    static get toolbox() {
      return {
        icon: "🖼️",
        title: "Delimiter",
      };
    }
  
    static get isReadOnlySupported() {
      return true;
    }
  
    constructor({ data, api }) {
      this.api = api;
      this.data = data || {};
      this.CSS = {
        block: this.api.styles.block,
        wrapper: "ce-delimiter",
        delimiter: "delimiter",
        active: "ce-delimiter--active",
      };
  
      this._element = this.createDelimiter();
    }
  
    createDelimiter() {
      const wrapper = document.createElement("div");
      const delimiter = document.createElement("hr");
  
      wrapper.classList.add(this.CSS.wrapper, this.CSS.block);
      delimiter.classList.add(this.CSS.delimiter);
  
      delimiter.addEventListener("click", () => {
        delimiter.classList.add(this.CSS.active);
        document.addEventListener("keydown", this.handleKeyDown);
      });
  
      document.addEventListener(
        "click",
        (e) => {
          if (!this._element.contains(e.target)) {
            delimiter.classList.remove(this.CSS.active);
            document.removeEventListener("keydown", this.handleKeyDown);
          }
        },
        true
      );
  
      wrapper.appendChild(delimiter);
      this.applyAlignment(delimiter);
  
      return wrapper;
    }
  
    handleKeyDown = (e) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        this.api.blocks.delete();
      }
    };
  
    applyAlignment(element) {
      element.classList.remove("align-left", "align-center");
  
      if (this.data.align === "center") {
        element.classList.add("align-center");
      }
  
      if (this.data.align === "left") {
        element.classList.add("align-left");
      }
    }
  
    render() {
      return this._element;
    }
  
    save() {
      return {
        align: this.data.align || "left",
      };
    }
  }
  