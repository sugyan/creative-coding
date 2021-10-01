import dynamic from "next/dynamic";

const P5Wrapper = dynamic(import("../../src/components/p5-wrapper"), {
  ssr: false,
});

const GhostDrawing = () => {
  return <P5Wrapper name={"ghost-drawing"} />;
};
export default GhostDrawing;
