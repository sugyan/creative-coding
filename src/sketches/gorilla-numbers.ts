import "./globals";
import "p5/lib/addons/p5.sound";
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
    private _isDeleted = false;
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
      if (this._isDeleted) {
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
      this._isDeleted = true;
    }
    public get isDeleted(): boolean {
      return this._isDeleted;
    }
  }
  function reset() {
    const [w, h] = [p.width, p.height];
    const l = p.min(w, h);
    const textSize = l / 8.0;
    const bbox = font.textBounds(" 0123456789 ", 0, 0, textSize);
    const [bw, bh] = [bbox["w"] / 12.0, bbox["h"]];
    p.textFont(font);
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
    state.reset();
  }
  const state = new State();
  const digits: Digit[] = [];
  let font: p5.Font;
  let ok: p5.SoundFile;
  let ng: p5.SoundFile;
  p.preload = () => {
    font = p.loadFont("/assets/fonts/Courier New.ttf");
    ok = p.loadSound("/assets/sounds/ok.mp3");
    ng = p.loadSound("/assets/sounds/ng.mp3");
  };
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    reset();
  };
  p.draw = () => {
    p.background(0, 0, 0);
    digits.forEach((digit) => digit.draw());
  };
  p.touchMoved = () => {
    return false;
  };
  p.touchEnded = () => {
    digits
      .filter((d) => !d.isDeleted && d.isHit([p.mouseX, p.mouseY], 0.2))
      .forEach((d) => {
        if (d.num === state.target) {
          ok.play(0, 1, 0.5);
          d.delete();
          state.nextTarget();
          if (state.target > 9) {
            reset();
          }
        } else {
          ng.play(0, 1, 0.5);
        }
      });
  };
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    reset();
  };
};

export default sketch;
