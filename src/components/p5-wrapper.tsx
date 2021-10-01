import { ReactP5Wrapper } from "react-p5-wrapper";

const P5Wrapper = ({ name }) => {
  const sketch = require(`../sketches/${name}`).default;
  return <ReactP5Wrapper sketch={sketch} />;
};
export default P5Wrapper;
