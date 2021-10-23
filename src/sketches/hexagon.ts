import p5 from "p5";

interface Point {
  x: number;
  y: number;
}

const sketch = (p: p5) => {
  const num = 500;
  const hsq3 = p.sqrt(3) / 2;
  let grid: number[][] = [];
  let size: number;

  const resize = () => {
    const [h, w] = [p.windowHeight, p.windowWidth];
    size = p.sqrt((w * h) / num / hsq3);

    const rows = p.ceil(h / size / hsq3) + 1;
    const cols = p.ceil(w / size);
    grid = Array.from(Array(rows), () => Array.from(Array(cols), () => 0));
    for (let i = 0; i < num / 5; i++) {
      grid[p.floor(p.random(rows))][p.floor(p.random(cols))] = 1;
    }
  };
  const drawer = (size: number) => {
    const points: Point[] = [
      { x: 0.0, y: -0.5 / hsq3 },
      { x: 0.5, y: -0.25 / hsq3 },
      { x: 0.5, y: +0.25 / hsq3 },
      { x: 0.0, y: +0.5 / hsq3 },
      { x: -0.5, y: +0.25 / hsq3 },
      { x: -0.5, y: -0.25 / hsq3 },
    ].map((point) => ({ x: size * point.x, y: size * point.y }));
    return (x: number, y: number) => {
      p.beginShape();
      points.forEach((point: Point) => p.vertex(x + point.x, y + point.y));
      p.endShape(p.CLOSE);
    };
  };

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    resize();
  };
  p.draw = () => {
    p.background(0x00, 0x00, 0x00);
    p.stroke(0x00, 0xff, 0xff);

    const rows = p.ceil(p.windowHeight / size / hsq3) + 1;
    const cols = p.ceil(p.windowWidth / size);
    const draw = drawer(size);
    for (let i = 0; i < rows; i++) {
      const offset = i % 2 == 0 ? 0 : size / 2;
      for (let j = 0; j < cols; j++) {
        p.fill(
          grid[i][j] > 0 ? p.color(0xff, 0x00, 0xff) : p.color(0x00, 0x00, 0x00)
        );
        draw(offset + size * j, size * i * hsq3);
      }
    }
  };
  p.windowResized = () => {
    resize();
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
  p.touchMoved = () => {
    return false;
  };
};

export default sketch;
