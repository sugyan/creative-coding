import dynamic from "next/dynamic";

import sketch from "../../src/sketches/ghost-drawing";

const P5Wrapper = dynamic(import("../../src/components/p5-wrapper"), {
  ssr: false,
});

const GhostDrawing = () => {
  return <P5Wrapper sketch={sketch} />;
};
export default GhostDrawing;
