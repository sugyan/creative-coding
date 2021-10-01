import dynamic from "next/dynamic";

const P5Wrapper = dynamic(import("../../src/components/p5-wrapper"), {
  ssr: false,
});

const Bubbles = () => {
  return <P5Wrapper name={"bubbles"} />;
};
export default Bubbles;
