import dynamic from "next/dynamic";

const GhostDrawingWithNoSSR = dynamic(
  () => import("../../src/components/ghost-drawing"),
  { ssr: false }
);

const GhostDrawing = () => {
  return <GhostDrawingWithNoSSR />;
};
export default GhostDrawing;
