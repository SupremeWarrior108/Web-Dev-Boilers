"use strict";
window.addEventListener("DOMContentLoaded", () => {
  const drop = new DropdownMenu("#dummy");
});
class DropdownMenu {
  /**
   * @param el
   */
  constructor(el) {
    var _a, _b, _c;
    this.animations = [];
    this.options = [
      { name: "html", friendlyName: "Html" },
      { name: "css", friendlyName: "Css" },
      { name: "javascript", friendlyName: "JavaScript" },
    ];
    this.selected = "html";
    this.isCollapsing = false;
    this.isExpanding = false;
    this.animActionsCollapse = {
      onfinish: this.onAnimationFinish.bind(this, false),
      oncancel: () => {
        this.isCollapsing = false;
      },
    };
    this.animActionsExpand = {
      onfinish: this.onAnimationFinish.bind(this, true),
      oncancel: () => {
        this.isExpanding = false;
      },
    };
    this.el = document.querySelector(el);
    this.menuButton =
      (_a = this.el) === null || _a === void 0
        ? void 0
        : _a.querySelector("button");
    this.itemList =
      (_b = this.el) === null || _b === void 0
        ? void 0
        : _b.querySelector("[data-items]");
    this.defaultOption();
    document.addEventListener("click", this.outsideToClose.bind(this));
    window.addEventListener("keydown", this.escToClose.bind(this));
    (_c = this.el) === null || _c === void 0
      ? void 0
      : _c.addEventListener("click", this.toggle.bind(this));
    window.addEventListener("keydown", this.kbdAction.bind(this));
  }
  get transDuration() {
    if (this.el) {
      const style = getComputedStyle(this.el);
      const rawDur = style.getPropertyValue("--drop-trans-dur");
      let dur = rawDur.substring(0, rawDur.indexOf("s"));
      const mIndex = dur.indexOf("m");
      if (mIndex > -1) {
        dur = dur.substring(0, mIndex);
        return +dur;
      }
      return +dur * 1e3;
    }
    return 0;
  }
  defaultOption() {
    var _a;
    const buttonEl =
      (_a = this.itemList) === null || _a === void 0
        ? void 0
        : _a.querySelector(`[value="${this.selected}"]`);
    buttonEl === null || buttonEl === void 0
      ? void 0
      : buttonEl.classList.add("drop__btn--selected");
    if (this.menuButton) {
      const optionFound = this.options.find(
        (option) => option.name === this.selected
      );
      this.menuButton.textContent =
        (optionFound === null || optionFound === void 0
          ? void 0
          : optionFound.friendlyName) || "";
    }
  }
  /**
              @param e 
             */
  kbdAction(e) {
    var _a;
    const { key } = e;
    const tabOrArrow =
      key === "Tab" || key === "ArrowUp" || key === "ArrowDown";
    const notAnimating = !this.isExpanding && !this.isCollapsing;
    if (
      notAnimating &&
      ((_a = this.menuButton) === null || _a === void 0
        ? void 0
        : _a.ariaExpanded) === "true" &&
      tabOrArrow
    ) {
      this.navigateOption(e);
    }
  }
  /**
   * @param e Keydown event
   */
  escToClose(e) {
    var _a;
    if (
      e.key === "Escape" &&
      !this.isCollapsing &&
      ((_a = this.menuButton) === null || _a === void 0
        ? void 0
        : _a.ariaExpanded) === "true"
    ) {
      this.toggle(e);
    }
  }
  /**
   * @param e Click event
   */
  outsideToClose(e) {
    var _a;
    let target = e.target;
    let elFound = false;
    if (
      !this.isCollapsing &&
      ((_a = this.menuButton) === null || _a === void 0
        ? void 0
        : _a.ariaExpanded) === "true"
    ) {
      do {
        target = target.parentElement;
        if (target === this.el) {
          elFound = true;
        }
      } while (target);
      if (!elFound) {
        this.toggle(e);
      }
    }
  }
  /**
   * @param e Keydown event
   */
  navigateOption(e) {
    var _a;
    const itemList =
      (_a = this.el) === null || _a === void 0
        ? void 0
        : _a.querySelector("[data-items]");
    const buttonEls =
      itemList === null || itemList === void 0
        ? void 0
        : itemList.querySelectorAll("button");
    const buttons = Array.from(buttonEls || []);
    const buttonsTemp = [...buttons];
    const first = buttonsTemp.shift();
    const last = buttonsTemp.pop();
    const currentItem = document.activeElement;
    const { key, shiftKey } = e;
    const downKey = key === "ArrowDown";
    const upKey = key === "ArrowUp";
    const currentIndex = buttons.indexOf(currentItem);
    if (!buttons.length) {
      e.preventDefault();
    } else if (downKey) {
      e.preventDefault();
      const nextIndex = currentIndex + 1;
      if (nextIndex >= buttons.length) {
        first === null || first === void 0 ? void 0 : first.focus();
        return;
      }
      buttons[nextIndex].focus();
    } else if (upKey) {
      e.preventDefault();
      const prevIndex = currentIndex - 1;
      if (prevIndex < 0) {
        last === null || last === void 0 ? void 0 : last.focus();
        return;
      }
      buttons[prevIndex].focus();
    } else if (
      buttons.length === 1 ||
      ((!(itemList === null || itemList === void 0
        ? void 0
        : itemList.contains(currentItem)) ||
        currentItem === last) &&
        !shiftKey)
    ) {
      e.preventDefault();
      first === null || first === void 0 ? void 0 : first.focus();
    } else if (
      (!(itemList === null || itemList === void 0
        ? void 0
        : itemList.contains(currentItem)) ||
        currentItem === first) &&
      shiftKey
    ) {
      e.preventDefault();
      last === null || last === void 0 ? void 0 : last.focus();
    }
  }
  /**
   * @param e Click event
   */
  toggle(e) {
    var _a, _b;
    e.preventDefault();
    (_a = this.el) === null || _a === void 0
      ? void 0
      : _a.classList.remove("drop--collapsing", "drop--expanding");
    const shouldExpand =
      ((_b = this.menuButton) === null || _b === void 0
        ? void 0
        : _b.ariaExpanded) === "true";
    if (this.isCollapsing || !shouldExpand) {
      this.expand();
    } else if (this.isExpanding || shouldExpand) {
      this.collapse(e);
    }
  }
  expand() {
    var _a, _b;
    if (!this.el || !this.itemList) return;
    this.itemList.style.height = `${this.itemList.offsetHeight}px`;
    (_a = this.menuButton) === null || _a === void 0
      ? void 0
      : _a.setAttribute("aria-expanded", "true");
    this.el.classList.add("drop--expanding");
    this.isExpanding = true;
    this.animations.forEach((anim) => anim.cancel());
    this.animations = [];
    const buttonEls = this.itemList.querySelectorAll("button");
    const buttons = Array.from(buttonEls || []);
    const startHeight = this.itemList.offsetHeight || 0;
    const endHeight =
      ((_b = this.itemList.firstElementChild) === null || _b === void 0
        ? void 0
        : _b.offsetHeight) || 0;
    const itemListAnim = this.itemList.animate(
      { height: [`${startHeight}px`, `${endHeight}px`] },
      {
        duration: this.transDuration,
        easing: "cubic-bezier(0.33,1,0.68,1.33)",
      }
    );
    itemListAnim.onfinish = this.animActionsExpand.onfinish;
    itemListAnim.oncancel = this.animActionsExpand.oncancel;
    this.animations.push(itemListAnim);
    buttons.forEach((button, i) => {
      const buttomAnim = button.animate(
        { transform: ["translateY(100%)", "translateY(0)"] },
        {
          duration: this.transDuration,
          delay: (this.transDuration / 12) * i,
          easing: "cubic-bezier(0.33,1,0.68,1)",
        }
      );
      this.animations.push(buttomAnim);
    });
    this.el.style.setProperty("--drop-flare-dist", `${endHeight}px`);
  }
  /**
   * @param e Click event
   */
  collapse(e) {
    var _a, _b, _c;
    if (!this.el || !this.itemList) return;
    this.el.classList.add("drop--collapsing");
    this.isCollapsing = true;
    this.animations.forEach((anim) => anim.cancel());
    this.animations = [];
    const clickedButton = e.target;
    const buttonEls =
      (_a = this.itemList) === null || _a === void 0
        ? void 0
        : _a.querySelectorAll("button");
    const buttons = Array.from(buttonEls || []);
    const startHeight =
      ((_b = this.itemList) === null || _b === void 0
        ? void 0
        : _b.offsetHeight) || 0;
    const endHeight = 0;
    const easing = "cubic-bezier(0.33,1,0.68,1)";
    const itemListAnim = this.itemList.animate(
      { height: [`${startHeight}px`, `${endHeight}px`] },
      { duration: this.transDuration, easing }
    );
    itemListAnim.onfinish = this.animActionsCollapse.onfinish;
    itemListAnim.oncancel = this.animActionsCollapse.oncancel;
    this.animations.push(itemListAnim);
    buttons.forEach((button, i) => {
      if (clickedButton.value) {
        button.classList.remove("drop__btn--selected");
      }
      const delayInc = this.transDuration / 12;
      const buttomAnim = button.animate(
        { transform: ["translateY(0)", "translateY(100%)"] },
        {
          duration: this.transDuration,
          delay: delayInc * (buttons.length - 1) - delayInc * i,
          easing,
        }
      );
      this.animations.push(buttomAnim);
    });
    if (clickedButton.value) {
      clickedButton.classList.add("drop__btn--selected");
      if (this.menuButton) {
        const optionFound = this.options.find(
          (option) => option.name === clickedButton.value
        );
        this.menuButton.textContent =
          (optionFound === null || optionFound === void 0
            ? void 0
            : optionFound.friendlyName) || "";
      }
    }
    (_c = this.menuButton) === null || _c === void 0 ? void 0 : _c.focus();
    this.el.style.setProperty("--drop-flare-dist", `${endHeight}px`);
  }
  /**
   * @param open Menu should be expanded
   */
  onAnimationFinish(open) {
    var _a, _b;
    if (!this.el || !this.itemList) return;
    (_a = this.menuButton) === null || _a === void 0
      ? void 0
      : _a.setAttribute("aria-expanded", `${open}`);
    this.animations = [];
    this.isCollapsing = false;
    this.isExpanding = false;
    this.itemList.style.height = "";
    (_b = this.el) === null || _b === void 0
      ? void 0
      : _b.classList.remove("drop--collapsing", "drop--expanding");
  }
}
