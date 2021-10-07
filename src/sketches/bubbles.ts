import p5 from "p5";

const sketch = (p: p5) => {
  class Bubble {
    public readonly created: number;
    private t: number;
    private x: number;
    private y: number;
    private dx: number;
    private dy: number;
    private readonly ddy: number;
    private radius: number;
    public constructor() {
      const [h, w] = [p.windowHeight, p.windowWidth];
      this.created = p.millis();
      this.t = 0;
      const radiusMin = p.max(h, w) * (1 / 10 - 1 / 40);
      const radiusMax = p.max(h, w) * (1 / 10 + 1 / 40);
      this.radius = p.random(radiusMin, radiusMax);
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
      const h = p.windowHeight;
      const noise = p.noise(this.created + p.millis() / 1000);
      this.x = 0 + this.dx * this.t + ((noise - 0.5) * this.radius) / 5;
      this.y = h - this.dy * this.t + ((noise - 0.5) * this.radius) / 5;
      this.y -= (this.ddy * this.t * this.t) / 2;
    }
    public draw() {
      const millis = p.millis();
      const noiseX = p.noise(this.created + 0 + millis / 300);
      const noiseY = p.noise(this.created + 1 + millis / 300);
      const noiseA = p.noise(this.created + 2 + millis / 300);

      p.push();
      p.translate(this.x, this.y);
      // body
      p.push();
      p.rotate((noiseA * 2 - 1) * p.PI);
      const weight = this.radius / 25;
      p.fill(0xff, 0xff, 0xff, 0x10);
      p.strokeWeight(weight);
      for (let i = 0; i <= 15; i++) {
        const n = p.noise(this.t / 300, this.radius + i / 50);
        const hue = (n * 480 + 300) % 360;
        const color = p
          .colorMode(p.HSB)
          .color(hue, 100, 100, 0.2 - i / 30)
          .toString();
        p.stroke(color);
        p.ellipse(
          0,
          0,
          this.radius * (1 + 0.3 * (noiseX - 0.5)) - i * weight * 2,
          this.radius * (1 + 0.3 * (noiseY - 0.5)) - i * weight * 2
        );
      }
      p.strokeWeight(1);
      p.stroke(0xe0, 0xe0, 0xe0, 0.2);
      p.ellipse(
        0,
        0,
        this.radius * (1 + 0.3 * (noiseX - 0.5)),
        this.radius * (1 + 0.3 * (noiseY - 0.5))
      );
      p.pop();
      // reflection of light
      p.translate(-this.radius * 0.2, -this.radius * 0.2);
      p.rotate((p.PI / 4) * (0.5 + noiseA));
      p.noStroke();
      for (let i = 0; i < 5; i++) {
        p.fill(0xff, 0xff, 0xff, 0x3f + 0xc0 * (1 / 10) * i);
        p.ellipse(
          0,
          0,
          this.radius * (0.2 - 0.2 * (1 / 10) * i + 0.1 * (noiseX - 0.5)),
          this.radius * (0.3 - 0.3 * (1 / 10) * i + 0.1 * (noiseY - 0.5))
        );
      }
      p.pop();
    }
    public isLive(): boolean {
      return this.x - this.radius <= p.windowWidth && this.y + this.radius >= 0;
    }
  }

  let bubbles: Bubble[] = [];

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };
  p.draw = () => {
    // background
    const h = p.windowHeight;
    const c0 = p.color(0x00, 0xff, 0xff);
    const c1 = p.color(0xb0, 0xff, 0xff);
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
