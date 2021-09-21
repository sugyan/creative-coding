import p5 from "p5";

const sketch = (p: p5) => {
  class Circle {
    private x: number;
    private y: number;
    private created: number;
    private size = 50;
    private live = 3000;
    public constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      this.created = p.millis();
    }
    public isLive(millis: number): boolean {
      return millis - this.created < this.live;
    }
    public draw(millis: number) {
      const score = 1.0 - (millis - this.created) / this.live;
      p.stroke(0, 0, 0, score * 255.0);
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
    p.clear();
    circles.forEach((circle) => circle.draw(now));
  };
  p.touchMoved = () => {
    circles.push(new Circle(p.mouseX, p.mouseY));
    return false;
  };
};

new p5(sketch);
