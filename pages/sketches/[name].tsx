import { useRouter } from "next/dist/client/router";
import dynamic from "next/dynamic";

const P5Wrapper = dynamic(import("../../src/components/p5-wrapper"), {
  ssr: false,
});

const Sketch = () => {
  const router = useRouter();
  const { name } = router.query;
  return <P5Wrapper name={name as string} />;
};
export default Sketch;
