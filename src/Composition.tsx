import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const WORDS = ['CREATE', 'MOTION', 'WITH', 'CODE'];

export const MyComposition = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0B0E14',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      {WORDS.map((word, i) => {
        const start = i * 10;
        const scale = spring({
          frame: frame - start,
          fps,
          config: { damping: 200 },
        });
        const opacity = interpolate(
          frame - start,
          [0, 10],
          [0, 1],
          { extrapolateRight: 'clamp' }
        );
        return (
          <div
            key={word}
            style={{
              color: '#F3F4F6',
              fontSize: 140,
              fontWeight: 900,
              letterSpacing: 8,
              opacity,
              transform: 'scale(' + scale + ')',
            }}
          >
            {word}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};