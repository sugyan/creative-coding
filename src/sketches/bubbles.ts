import p5 from "p5";

const sketch = (p: p5) => {
  class Bubble {
    public readonly created: number;
    public x: number;
    public y: number;
    public size: number;
    public broken?: number;
    private t = 0;
    private dx: number;
    private dy: number;
    private readonly ddy: number;
    public constructor() {
      const [h, w] = [p.windowHeight, p.windowWidth];
      this.created = p.millis();
      const sizeMin = p.max(h, w) * (1 / 10 - 1 / 40);
      const sizeMax = p.max(h, w) * (1 / 10 + 1 / 40);
      this.size = p.random(sizeMin, sizeMax);
      this.x = 0;
      this.y = h;
      const angle = (p.PI / 2) * (p.random() * 0.9) ** 1.5;
      const hypot = p.sqrt(h * h + w * w);
      this.dx = (p.cos(angle) * hypot) / 300;
      this.dy = (p.sin(angle) * hypot) / 300;
      this.ddy = (this.dx / w) * 2;
    }
    public move() {
      this.t++;
      if (p.mouseIsPressed || p.touches.length === 1) {
        const [x, y] = [p.mouseX, p.mouseY];
        if (p.sqrt((this.x - x) ** 2 + (this.y - y) ** 2) < this.size / 2) {
          this.broken = p.millis();
        }
      }
      if (!this.broken) {
        const h = p.windowHeight;
        const noise = p.noise(this.created + p.millis() / 1000);
        this.x = 0 + this.dx * this.t + ((noise - 0.5) * this.size) / 5;
        this.y = h - this.dy * this.t + ((noise - 0.5) * this.size) / 5;
        this.y -= (this.ddy * this.t * this.t) / 2;
      }
    }
    public draw() {
      if (this.broken) {
        const rate = 1 + (p.millis() - this.broken) / 200;
        const n = p.noise(this.t / 300, this.size);
        const hue = (n * 480 + 300) % 360;
        p.strokeWeight(7);
        for (let i = 0; i < p.max(10, this.size / 10); i++) {
          p.stroke(p.colorMode(p.HSB).color(hue, 100, 100, 0.4 - 0.02 * i));
          const a = p.noise(this.created + i) * 20 * p.PI;
          p.point(
            this.x + (this.size / 2) * p.cos(a) * rate,
            this.y + (this.size / 2) * p.sin(a) * rate
          );
        }
        return;
      }

      const millis = p.millis();
      const noiseX = p.noise(this.created + 0 + millis / 300);
      const noiseY = p.noise(this.created + 1 + millis / 300);
      const noiseA = p.noise(this.created + 2 + millis / 300);
      p.push();
      p.translate(this.x, this.y);
      // body
      p.push();
      p.rotate((noiseA * 2 - 1) * p.PI);
      const weight = this.size / 25;
      p.fill(p.colorMode(p.RGB).color(0xff, 0xff, 0xff, 0x10));
      p.strokeWeight(weight);
      p.colorMode(p.HSB);
      for (let i = 0; i <= 15; i++) {
        const n = p.noise(this.t / 300, this.size + i / 50);
        const hue = (n * 480 + 300) % 360;
        p.stroke(p.color(hue, 100, 100, 0.2 - i / 30));
        p.ellipse(
          0,
          0,
          this.size * (1 + 0.3 * (noiseX - 0.5)) - i * weight * 2,
          this.size * (1 + 0.3 * (noiseY - 0.5)) - i * weight * 2
        );
      }
      p.strokeWeight(1);
      p.stroke(p.colorMode(p.RGB).color(0x80, 0x80, 0x80, 0x20));
      p.ellipse(
        0,
        0,
        this.size * (1 + 0.3 * (noiseX - 0.5)),
        this.size * (1 + 0.3 * (noiseY - 0.5))
      );
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
      return (
        (!this.broken || p.millis() - this.broken < 100) &&
        this.x - this.size <= p.windowWidth &&
        this.y + this.size >= 0
      );
    }
  }

  let bubbles: Bubble[] = [];

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };
  p.draw = () => {
    // background
    const h = p.windowHeight;
    const c0 = p.colorMode(p.RGB).color(0x00, 0xff, 0xff);
    const c1 = p.colorMode(p.RGB).color(0xb0, 0xff, 0xff);
    for (let i = 0; i <= h; i++) {
      p.stroke(p.lerpColor(c0, c1, p.map(i, 0, p.windowHeight, 0, 1)));
      p.line(0, i, p.windowWidth, i);
    }
    // bubbles
    bubbles.forEach((bubble: Bubble) => {
      bubble.move();
      bubble.draw();
    });
    bubbles = bubbles.filter((bubble) => bubble.isLive());
    if (bubbles.length < 12) {
      const latest = bubbles[bubbles.length - 1];
      if (!latest || p.millis() - latest.created > 150) {
        bubbles.push(new Bubble());
      }
    }
  };
  p.touchMoved = () => {
    return false;
  };
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

export default sketch;
