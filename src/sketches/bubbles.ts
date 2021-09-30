import p5 from "p5";

const sketch = (p: p5) => {
  class Bubble {
    private baseX: number;
    private x: number;
    private y: number;
    private radius: number;
    public constructor() {
      const radiusMin = p.windowWidth * (1 / 10 - 1 / 40);
      const radiusMax = p.windowWidth * (1 / 10 + 1 / 40);
      this.radius = p.random(radiusMin, radiusMax);
      this.x = this.baseX = p.random(0, p.windowWidth);
      this.y = p.windowHeight + this.radius * p.random(0, 5);
    }
    public move() {
      const noise = p.noise(this.baseX + p.millis() / 2500.0);
      this.x = this.baseX + (noise - 0.5) * this.radius;
      this.y -= (p.windowHeight / 300) * (1 + noise);
    }
    public draw() {
      const millis = p.millis();
      const noiseX = p.noise(this.radius + millis / 300.0);
      const noiseY = p.noise(this.radius + millis / 300.0 + 1);
      p.stroke(0xb0, 0xb0, 0xb0);
      p.fill(0xff, 0xff, 0xff, 0x40);
      p.ellipse(
        this.x,
        this.y,
        this.radius * (1 + 0.1 * (noiseX - 0.5)),
        this.radius * (1 + 0.1 * (noiseY - 0.5))
      );
    }
    public isLive(): boolean {
      return this.y + this.radius >= 0;
    }
  }

  let bubbles: Bubble[] = [];

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };
  p.draw = () => {
    // background
    const c0 = p.color(0x00, 0xff, 0xff);
    const c1 = p.color(0xb0, 0xff, 0xff);
    Array.from(Array(p.windowHeight).keys()).forEach((i) => {
      p.stroke(p.lerpColor(c0, c1, p.map(i, 0, p.windowHeight, 0, 1)));
      p.line(0, i, p.windowWidth, i);
    });
    bubbles.forEach((bubble: Bubble) => {
      bubble.move();
      bubble.draw();
    });
    if (bubbles.length < 10) {
      bubbles.push(new Bubble());
    }
    bubbles = bubbles.filter((bubble) => bubble.isLive());
  };
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

export default sketch;
