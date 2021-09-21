import p5 from "p5";

const sketch = (p: p5) => {
  class Circle {
    private x: number;
    private y: number;
    private created: number;
    private color: string;
    private size = 50;
    private live = 3000;
    public constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      this.created = p.millis();
      this.color = p
        .colorMode(p.HSB)
        .color((this.created / 10) % 360, 100, 100)
        .toString();
    }
    public isLive(millis: number): boolean {
      return millis - this.created < this.live;
    }
    public draw(millis: number) {
      const score = 1.0 - (millis - this.created) / this.live;
      p.stroke(0, 0, 0, score);
      p.fill(this.color);
      p.ellipse(this.x, this.y, this.size * score, this.size * score);
    }
  }

  let circles: Circle[] = [];

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };
  p.draw = () => {
    const now = p.millis();
    circles = circles.filter((circle) => circle.isLive(now));
    p.background(0, 0, 0);
    circles.forEach((circle) => circle.draw(now));
  };
  p.touchMoved = () => {
    circles.push(new Circle(p.mouseX, p.mouseY));
    return false;
  };
};

new p5(sketch);
