import p5 from "p5";
import React, { FC, useEffect, useRef, useState } from "react";

export interface Sketch {
  (instance: p5): void;
}

export interface P5WrapperProps {
  name: string;
}

const ReactP5WrapperComponent: FC<P5WrapperProps> = ({ name }) => {
  const wrapper = useRef<HTMLDivElement>();
  const [_, setInstance] = useState<p5>();

  useEffect(() => {
    if (wrapper.current === null) return;
    const sketch = require(`../sketches/${name}`).default;
    const canvas = new p5(sketch, wrapper.current);
    setInstance(canvas);
    return () => {
      canvas.remove();
    };
  }, [name]);

  return <div ref={wrapper} />;
};

export default ReactP5WrapperComponent;
