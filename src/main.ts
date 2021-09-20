import p5 from "p5";

const sketch = (p: p5) => {
  class Circle {
    private x: number;
    private y: number;
    private size = 50;
    public constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }
    public display() {
      p.ellipse(this.x, this.y, this.size, this.size);
    }
  }
  const circles: Circle[] = [];

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };
  p.draw = () => {
    circles.forEach((circle) => circle.display());
  };
  p.touchMoved = () => {
    circles.push(new Circle(p.mouseX, p.mouseY));
    return false;
  };
};

new p5(sketch);
