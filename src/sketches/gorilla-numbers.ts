import p5 from "p5";

interface Bound {
  t: number;
  l: number;
  b: number;
  r: number;
}

const sketch = (p: p5) => {
  class State {
    private _target: number;
    public constructor() {
      this._target = 0;
    }
    public get target() {
      return this._target;
    }
    public nextTarget() {
      this._target++;
    }
    public reset() {
      this._target = 0;
    }
  }
  class Digit {
    readonly num: number;
    readonly x: number;
    readonly y: number;
    readonly bound: Bound;
    private deleted = false;
    public constructor(
      num: number,
      xy: [number, number],
      wh: [number, number]
    ) {
      const bbox = font.textBounds(`${num}`, 0, 0, p.textSize());
      const xOffset = (wh[0] - bbox["w"]) / 2.0;
      const yOffset = (wh[1] - bbox["h"]) / 2.0;
      this.num = num;
      this.x = xy[0] - bbox["x"];
      this.y = xy[1] - bbox["y"] - bbox["h"];
      this.bound = {
        t: xy[1] - yOffset - bbox["h"],
        l: xy[0] - xOffset,
        b: xy[1] + yOffset,
        r: xy[0] + xOffset + bbox["w"],
      };
    }
    public draw() {
      if (this.deleted) {
        return;
      }
      p.fill(255, 255, 255);
      p.noStroke();
      p.text(`${this.num}`, this.x, this.y);
    }
    public isHit([x, y]: [number, number], scale: number = 0.0): boolean {
      const w = this.bound.r - this.bound.l;
      const h = this.bound.b - this.bound.t;
      return (
        this.bound.l - w * scale < x &&
        x < this.bound.r + w * scale &&
        this.bound.t - h * scale < y &&
        y < this.bound.b + h * scale
      );
    }
    public delete() {
      this.deleted = true;
    }
  }
  function reset() {
    const [w, h] = [p.width, p.height];
    const l = p.min(w, h);
    const textSize = l / 8.0;
    const bbox = font.textBounds(" 0123456789 ", 0, 0, textSize);
    const [bw, bh] = [bbox["w"] / 12.0, bbox["h"]];
    p.textSize(textSize);
    digits.splice(0, digits.length);
    [...Array(10).keys()].forEach((num) => {
      while (true) {
        const xoffset = l * 0.05 + (w - l) / 2.0;
        const yoffset = l * 0.05 + (h - l) / 2.0;
        const x = p.random(l * 0.9 - bw) + xoffset;
        const y = p.random(l * 0.9 - bh) + yoffset + bh;
        const digit = new Digit(num, [x, y], [bw, bh]);
        const points = [
          [digit.bound.l, digit.bound.t],
          [digit.bound.l, digit.bound.b],
          [digit.bound.r, digit.bound.t],
          [digit.bound.r, digit.bound.b],
        ];
        if (
          digits.every((d) => points.every(([x, y]) => !d.isHit([x, y], 0.9)))
        ) {
          digits.push(digit);
          return;
        }
      }
    });
  }
  const state = new State();
  const digits: Digit[] = [];
  let font: p5.Font;
  p.preload = () => {
    font = p.loadFont("/assets/fonts/Courier New.ttf");
  };
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textFont(font);
    reset();
  };
  p.draw = () => {
    p.background(0, 0, 0);
    digits.forEach((digit) => digit.draw());
  };
  p.mouseClicked = () => {
    digits.forEach((d) => {
      if (d.isHit([p.mouseX, p.mouseY], 0.1)) {
        if (d.num === state.target) {
          d.delete();
          state.nextTarget();
          if (state.target > 9) {
            reset();
            state.reset();
          }
        }
      }
    });
  };
};

export default sketch;
