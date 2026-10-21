import { Composition } from 'remotion';
import { MyComposition } from './Composition';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="MyComposition"
        component={MyComposition}
        durationInFrames={1800}
fps={30}
width={1080}
height={1920}
      />
    </>
  );
};