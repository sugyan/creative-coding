import p5, { Color } from "p5";

const sketch = (p: p5) => {
  abstract class Shape {
    protected x: number;
    protected y: number;
    protected size: number;
    protected color: Color;
    public constructor(x: number, y: number, size: number) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.color = p
        .colorMode(p.HSB)
        .color(p.random(0, 360), p.random(80, 100), p.random(80, 100));
    }
    public abstract draw(): void;
    public abstract move(x: number, y: number): void;
    public abstract isHit(x: number, y: number): boolean;
  }

  class Circle extends Shape {
    public constructor(x: number, y: number, size: number) {
      super(x, y, size * 1.2);
    }
    public draw() {
      p.fill(this.color);
      p.ellipse(this.x, this.y, this.size, this.size);
    }
    public move(x: number, y: number) {
      this.x = x;
      this.y = y;
    }
    public isHit(x: number, y: number): boolean {
      return (
        p.sqrt((this.x - x) * (this.x - x) + (this.y - y) * (this.y - y)) <=
        this.size / 2
      );
    }
  }
  class Triangle extends Shape {
    public constructor(x: number, y: number, size: number) {
      super(x, y, size * 1.2);
    }
    public draw() {
      p.beginShape();
      p.vertex(this.x, this.y - this.size);
      p.vertex(this.x + this.size / p.sqrt(3), this.y);
      p.vertex(this.x - this.size / p.sqrt(3), this.y);
      p.endShape(p.CLOSE);
    }
    public move(x: number, y: number) {
      this.x = x;
      this.y = y + this.size / 3;
    }
    public isHit(x: number, y: number): boolean {
      const dx = p.abs(this.x - x);
      const sqrt3 = p.sqrt(3);
      return (
        dx <= this.size / sqrt3 &&
        y <= this.y &&
        y >= this.y - (this.size / sqrt3 - dx) * sqrt3
      );
    }
  }
  class Heart extends Shape {
    public draw() {
      p.fill(this.color);
      p.beginShape();
      p.vertex(this.x, this.y);
      p.bezierVertex(
        this.x - this.size / 2,
        this.y - this.size / 2,
        this.x - this.size,
        this.y + this.size / 3,
        this.x,
        this.y + this.size
      );
      p.bezierVertex(
        this.x + this.size,
        this.y + this.size / 3,
        this.x + this.size / 2,
        this.y - this.size / 2,
        this.x,
        this.y
      );
      p.endShape(p.CLOSE);
    }
    public move(x: number, y: number) {
      this.x = x;
      this.y = y - this.size / 2;
    }
    public isHit(x: number, y: number): boolean {
      return (
        p.abs(x - this.x) <= this.size / 2 &&
        y >= this.y &&
        y - this.y <= this.size
      );
    }
  }
  class Star extends Shape {
    public constructor(x: number, y: number, size: number) {
      super(x, y, size / 1.2);
    }
    public draw() {
      const angle = p.TWO_PI / 10;
      const r =
        p.sin((36 * p.PI) / 180) * p.tan((72 * p.PI) / 180) +
        p.cos((36 * p.PI) / 180);
      p.fill(this.color);
      p.push();
      p.translate(this.x, this.y);
      p.rotate(p.HALF_PI);
      p.beginShape();
      for (let i = 0; i < 5; i++) {
        p.vertex(
          (p.cos(angle * (2 * i)) * this.size) / r,
          (p.sin(angle * (2 * i)) * this.size) / r
        );
        p.vertex(
          p.cos(angle * (2 * i + 1)) * this.size,
          p.sin(angle * (2 * i + 1)) * this.size
        );
      }
      p.endShape(p.CLOSE);
      p.pop();
    }
    public move(x: number, y: number) {
      this.x = x;
      this.y = y;
    }
    public isHit(x: number, y: number): boolean {
      return (
        p.sqrt((this.x - x) * (this.x - x) + (this.y - y) * (this.y - y)) <=
        this.size / 1.2
      );
    }
  }

  let shapes: Shape[] = [
    new Circle(
      p.random(100, p.windowWidth - 100),
      p.random(100, p.windowHeight - 100),
      100
    ),
    new Triangle(
      p.random(100, p.windowWidth - 100),
      p.random(100, p.windowHeight - 100),
      100
    ),
    new Heart(
      p.random(100, p.windowWidth - 100),
      p.random(100, p.windowHeight - 100),
      100
    ),
    new Star(
      p.random(100, p.windowWidth - 100),
      p.random(100, p.windowHeight - 100),
      100
    ),
  ];
  let dragIndex = -1;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };
  p.draw = () => {
    const context = p.drawingContext as CanvasRenderingContext2D;
    context.shadowOffsetX = 5;
    context.shadowOffsetY = 5;
    context.shadowBlur = 10;
    context.shadowColor = "black";
    p.background(p.colorMode(p.RGB).color(0x80, 0x80, 0x80));
    p.strokeWeight(2);
    shapes
      .slice()
      .reverse()
      .forEach((shape) => shape.draw());
  };
  p.touchStarted = () => {
    dragIndex = shapes.findIndex((shape: Shape) =>
      shape.isHit(p.mouseX, p.mouseY)
    );
  };
  p.touchEnded = () => {
    console.log("touchEnded");
  };
  p.touchMoved = () => {
    if (dragIndex !== -1) {
      shapes[dragIndex].move(p.mouseX, p.mouseY);
    }
    return false;
  };
};

export default sketch;
