import "./globals";
import "p5/lib/addons/p5.sound";
import p5 from "p5";

declare module "p5" {
  interface p5InstanceExtensions {
    userStartAudio(): Promise<void>;
  }
}

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
      const noiseX = p.noise(this.x + millis / 100.0) - 0.5;
      const noiseY = p.noise(this.y + millis / 100.0) - 0.5;
      p.stroke(0, 0, 0, score);
      p.fill(this.color);
      p.ellipse(
        this.x + noiseX * this.size * (1.0 - score),
        this.y + noiseY * this.size * (1.0 - score),
        this.size * score,
        this.size * score
      );
    }
  }

  let circles: Circle[] = [];
  let playing: boolean;
  const osc = new p5.Oscillator();
  osc.setType("triangle");
  const envelope = new p5.Envelope();

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };
  p.draw = () => {
    const now = p.millis();
    circles = circles.filter((circle) => circle.isLive(now));
    if (circles.length == 0) {
      osc.stop(0);
      playing = false;
    } else {
      osc.amp(p.constrain(circles.length / 500, 0, 1));
      osc.freq(circles.length + 300);
    }
    p.background(0, 0, 0);
    circles.forEach((circle) => circle.draw(now));
  };
  p.touchStarted = () => {
    p.userStartAudio();
  };
  p.touchMoved = () => {
    if (!playing) {
      playing = true;
      osc.start();
      envelope.play(osc);
    }
    circles.push(new Circle(p.mouseX, p.mouseY));
    return false;
  };
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

export default sketch;
