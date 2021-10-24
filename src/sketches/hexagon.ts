import p5 from "p5";

interface Point {
  x: number;
  y: number;
}

const sketch = (p: p5) => {
  const num = 2000;
  const hsq3 = p.sqrt(3) / 2;
  let grid: boolean[][] = [];
  let size: number;

  const resize = (): void => {
    const [h, w] = [p.windowHeight, p.windowWidth];
    size = p.sqrt((w * h) / num / hsq3);

    const rows = p.ceil(h / size / hsq3) + 1;
    const cols = p.ceil(w / size);
    grid = Array.from(Array(rows), () => Array.from(Array(cols), () => false));
    for (let i = 0; i < num / 10; i++) {
      grid[p.floor(p.random(rows))][p.floor(p.random(cols))] = true;
    }
  };
  const drawer = (size: number): ((x: number, y: number) => void) => {
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
  const next = (rows: number, cols: number): void => {
    const neighbors = Array.from(Array(rows), () =>
      Array.from(Array(cols), () => 0)
    );
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (!grid[i][j]) continue;
        if (j > 0) neighbors[i][j - 1]++;
        if (j < cols - 1) neighbors[i][j + 1]++;
        const k = j - 1 + (i & 1);
        if (i > 0) {
          if (k >= 0) neighbors[i - 1][k]++;
          if (k + 1 < cols) neighbors[i - 1][k + 1]++;
        }
        if (i < rows - 1) {
          if (k >= 0) neighbors[i + 1][k]++;
          if (k + 1 < cols) neighbors[i + 1][k + 1]++;
        }
      }
    }
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const n = neighbors[i][j];
        grid[i][j] =
          (grid[i][j] && (n == 3 || n == 5)) ||
          (!grid[i][j] && (n == 2 || n == 4));
      }
    }
  };
  const touch = (x: number, y: number): void => {
    const [w, h] = [p.windowWidth, p.windowHeight];
    if (x >= w || y >= h) {
      return;
    }
    const rows = p.ceil(h / size / hsq3);
    const cols = p.ceil(w / size);
    grid[p.floor((y / h) * rows)][p.floor((x / w) * cols)] = true;
  };

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(24);
    resize();
  };
  p.draw = () => {
    const rows = p.ceil(p.windowHeight / size / hsq3) + 1;
    const cols = p.ceil(p.windowWidth / size);
    if (p.frameCount % 5 === 0) {
      next(rows, cols);
    }
    p.background(0x00, 0x00, 0x00);
    p.stroke(0x80, 0x80, 0x80);
    const draw = drawer(size);
    for (let i = 0; i < rows; i++) {
      const offset = (size / 2) * (i & 1);
      for (let j = 0; j < cols; j++) {
        p.fill(
          grid[i][j] ? p.color(0x00, 0xff, 0x80) : p.color(0x00, 0x00, 0x00)
        );
        draw(offset + size * j, size * i * hsq3);
      }
    }
  };
  p.windowResized = () => {
    resize();
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
  p.mouseClicked = () => {
    touch(p.mouseX, p.mouseY);
  };
  p.touchMoved = () => {
    touch(p.mouseX, p.mouseY);
    return false;
  };
};

export default sketch;
