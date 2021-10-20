import p5 from "p5";

const sketch = (p: p5) => {
  const num = 500;
  const hsq3 = p.sqrt(3) / 2;
  let size: number;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    size = p.sqrt((p.windowWidth * p.windowHeight) / num / hsq3);
  };
  p.draw = () => {
    p.background(0x00, 0x00, 0x00);
    p.stroke(0x00, 0xff, 0xff);
    p.noFill();
    for (let i = 0; i < p.windowHeight / size / hsq3 + 1; i++) {
      const offset = i % 2 == 0 ? 0 : size / 2;
      for (let j = 0; j < p.windowWidth / size; j++) {
        p.beginShape();
        p.vertex(offset + size * j, size * (i * hsq3 - 1 / 2 / hsq3));
        p.vertex(offset + size * (j + 0.5), size * (i * hsq3 - 1 / 4 / hsq3));
        p.vertex(offset + size * (j + 0.5), size * (i * hsq3 + 1 / 4 / hsq3));
        p.vertex(offset + size * j, size * (i * hsq3 + 1 / 2 / hsq3));
        p.vertex(offset + size * (j - 0.5), size * (i * hsq3 + 1 / 4 / hsq3));
        p.vertex(offset + size * (j - 0.5), size * (i * hsq3 - 1 / 4 / hsq3));
        p.endShape(p.CLOSE);
      }
    }
  };
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    size = p.sqrt((p.windowWidth * p.windowHeight) / num / hsq3);
  };
};

export default sketch;
