import p5 from "p5";

const sketch = (p: p5) => {
  class Digit {
    private x: number;
    private y: number;
    private num: number;
    public constructor(num: number, xy: [number, number]) {
      this.num = num;
      this.x = xy[0];
      this.y = xy[1];
    }
    public draw() {
      p.fill(255, 255, 255);
      p.textFont("monospace");
      p.text(
        `${this.num}`,
        this.x + p.noise(this.x + p.millis() / 500) * 10,
        this.y + p.noise(this.y + p.millis() / 500) * 10
      );
    }
    public isHit(
      [x, y]: [number, number],
      [w, h]: [number, number],
      s: number
    ): boolean {
      return p.abs(this.x - x) < w * s && p.abs(this.y - y) < h * s;
    }
  }
  function reset() {
    const [w, h] = [p.width, p.height];
    const l = p.min(w, h);
    const textSize = l / 8.0;
    p.textSize(textSize);
    digits.splice(0, digits.length);
    [...Array(10).keys()].forEach((num) => {
      const bbox = font.textBounds(`${num}`, 0, 0, textSize);
      const [bw, bh] = [bbox["w"], bbox["h"]];
      while (true) {
        const xoffset = l * 0.05 + (w - l) / 2.0;
        const yoffset = l * 0.05 + (h - l) / 2.0;
        const x = p.random(l * 0.9 - bw) + xoffset;
        const y = p.random(l * 0.9 - bh) + yoffset + bh;
        if (digits.every((d) => !d.isHit([x, y], [bw, bh], 2.5))) {
          digits.push(new Digit(num, [x, y]));
          return;
        }
      }
    });
  }
  let font: p5.Font;
  const digits = [];
  p.preload = () => {
    font = p.loadFont("/assets/fonts/Courier New.ttf");
  };
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    reset();
  };
  p.draw = () => {
    p.background(0, 0, 0);
    digits.forEach((digit) => digit.draw());
  };
};

export default sketch;
