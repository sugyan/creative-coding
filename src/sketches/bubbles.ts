import p5 from "p5";

const sketch = (p: p5) => {
  class Bubble {
    public readonly created: number;
    public x: number;
    public y: number;
    public hue: number;
    public readonly size: number;
    private t = 0;
    private readonly dx: number;
    private readonly dy: number;
    private readonly ddy: number;
    public constructor() {
      this.created = p.millis();
      const [h, w] = [p.windowHeight, p.windowWidth];
      const sizeMin = p.max(h, w) * (1 / 10 - 1 / 40);
      const sizeMax = p.max(h, w) * (1 / 10 + 1 / 40);
      this.size = p.random(sizeMin, sizeMax);
      this.x = 0;
      this.y = h;
      const angle = (p.PI / 2) * (p.random() * 0.9) ** 1.5;
      const v = (p.sqrt(h * h + w * w) * p.max(h, w)) / 4000 / this.size;
      this.dx = p.cos(angle) * v;
      this.dy = p.sin(angle) * v;
      this.ddy = (this.dx / w) * 2;
    }
    public draw() {
      // move
      this.t++;
      const millis = p.millis();
      const h = p.windowHeight;
      const n = p.noise(this.created + millis / 1000) - 0.5;
      this.x = 0 + this.dx * this.t + (n * this.size) / 5;
      this.y = h - this.dy * this.t + (n * this.size) / 5;
      this.y -= (this.ddy * this.t * this.t) / 2;
      this.hue = (p.noise(this.t / 300, this.size) * 480 + 300) % 360;
      // draw
      const noiseX = p.noise(this.created + 0 + millis / 300);
      const noiseY = p.noise(this.created + 1 + millis / 300);
      const noiseA = p.noise(this.created + 2 + millis / 300);
      p.push();
      p.translate(this.x, this.y);
      // body
      p.push();
      p.rotate((noiseA * 2 - 1) * p.PI);
      const weight = this.size / 25;
      p.fill(p.colorMode(p.RGB).color(0xff, 0xff, 0xff, 0x08));
      p.strokeWeight(weight);
      p.colorMode(p.HSB);
      for (let i = 0; i <= 15; i++) {
        p.stroke(p.color(this.hue, 100, 100, 0.2 - i / 30));
        p.ellipse(
          0,
          0,
          this.size * (1 + 0.3 * (noiseX - 0.5)) - i * weight * 2,
          this.size * (1 + 0.3 * (noiseY - 0.5)) - i * weight * 2
        );
      }
      p.pop();
      // reflection of light
      p.translate(-this.size * 0.2, -this.size * 0.2);
      p.rotate((p.PI / 4) * (0.5 + noiseA));
      p.noStroke();
      p.colorMode(p.RGB);
      for (let i = 0; i < 5; i++) {
        p.fill(0xff, 0xff, 0xff, 0x3f + 0xc0 * (1 / 10) * i);
        p.ellipse(
          0,
          0,
          this.size * (0.2 - 0.2 * (1 / 10) * i + 0.1 * (noiseX - 0.5)),
          this.size * (0.3 - 0.3 * (1 / 10) * i + 0.1 * (noiseY - 0.5))
        );
      }
      p.pop();
    }
    public isLive(): boolean {
      return this.x - this.size <= p.windowWidth && this.y + this.size >= 0;
    }
  }
  class Drops {
    private readonly created: number;
    private readonly x: number;
    private readonly y: number;
    private readonly hue: number;
    private readonly size: number;
    private readonly points: Array<[number, number]>;
    constructor(bubble: Bubble) {
      this.created = p.millis();
      this.x = bubble.x;
      this.y = bubble.y;
      this.hue = bubble.hue;
      this.size = bubble.size;
      this.points = Array.from(
        Array(p.floor((this.size * this.size) / 250)),
        () => {
          const z = p.random(-1, 1);
          const s = p.sqrt(1 - z * z) / 2;
          const phi = p.random(0, 2 * p.PI);
          return [
            this.x + this.size * s * p.cos(phi),
            this.y + this.size * s * p.sin(phi),
          ];
        }
      );
    }
    public draw() {
      const t = p.millis() - this.created;
      const alpha = 0.75 * (1 - t / 500);
      p.stroke(p.colorMode(p.HSB).color(this.hue, 100, 100, alpha));
      p.strokeWeight(3);
      this.points.forEach((pos) => p.point(pos[0], pos[1] + (t * t) / 20000));
    }
    public isLive(): boolean {
      return p.millis() - this.created < 500;
    }
  }

  let bubbles: Bubble[] = [];
  let drops: Drops[] = [];

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };
  p.draw = () => {
    const millis = p.millis();
    // background
    p.background(p.colorMode(p.RGB).color(0x80, 0x80, 0x80));
    // bubbles
    bubbles = bubbles.filter((bubble: Bubble) => {
      if (!bubble.isLive()) {
        return false;
      }
      if (p.mouseIsPressed || p.touches.length === 1) {
        const [x, y] = [p.mouseX, p.mouseY];
        const d = p.sqrt((bubble.x - x) ** 2 + (bubble.y - y) ** 2);
        if (d < bubble.size / 2 + 10 && millis - bubble.created > 500) {
          drops.push(new Drops(bubble));
          return false;
        }
      }
      return true;
    });
    bubbles.forEach((bubble: Bubble) => bubble.draw());
    if (bubbles.length < 12) {
      const latest = bubbles[bubbles.length - 1];
      if (!latest || millis - latest.created > 200) {
        bubbles.push(new Bubble());
      }
    }
    // drops
    drops = drops.filter((d: Drops) => d.isLive());
    drops.forEach((d: Drops) => d.draw());
  };
  p.touchMoved = () => {
    return false;
  };
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

export default sketch;
