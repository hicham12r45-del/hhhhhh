import React from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// ============================================================
// Motion Studio — 60s promo
// ============================================================

const BG = '#0B0E14';
const CYAN = '#06B6D4';
const VIOLET = '#8B5CF6';
const TEXT = '#F3F4F6';
const MUTED = '#9CA3AF';

const FONT = '"Inter", "Helvetica Neue", Arial, sans-serif';

const FullScreen: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      backgroundColor: BG,
      fontFamily: FONT,
      color: TEXT,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}
  >
    {children}
  </AbsoluteFill>
);

// ============================================================
// Scene 1 — Intro (0-12s)
// ============================================================
const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();

  const circleScale = interpolate(frame, [60, 150], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const circleOpacity = interpolate(frame, [60, 90], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const motionOpacity = interpolate(frame, [150, 180], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const motionSlide = interpolate(frame, [150, 210], [40, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const studioOpacity = interpolate(frame, [195, 225], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const studioSlide = interpolate(frame, [195, 255], [40, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const taglineOpacity = interpolate(frame, [270, 300], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const fadeOut = interpolate(frame, [330, 360], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <FullScreen>
      <div
        style={{
          opacity: fadeOut,
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            width: 280,
            height: 280,
            borderRadius: 140,
            background: `linear-gradient(135deg, ${CYAN}, ${VIOLET})`,
            transform: `scale(${circleScale})`,
            opacity: circleOpacity,
            boxShadow: `0 0 140px ${CYAN}80`,
            marginBottom: 48,
          }}
        />
        <div
          style={{
            fontSize: 108,
            fontWeight: 900,
            letterSpacing: 8,
            opacity: motionOpacity,
            transform: `translateY(${motionSlide}px)`,
            color: TEXT,
          }}
        >
          MOTION
        </div>
        <div
          style={{
            fontSize: 108,
            fontWeight: 300,
            letterSpacing: 18,
            opacity: studioOpacity,
            transform: `translateY(${studioSlide}px)`,
            color: CYAN,
            marginTop: 4,
          }}
        >
          STUDIO
        </div>
        <div
          style={{
            fontSize: 30,
            marginTop: 72,
            opacity: taglineOpacity,
            color: MUTED,
            letterSpacing: 6,
            textTransform: 'uppercase',
          }}
        >
          Cinematic · Simple · Mobile
        </div>
      </div>
    </FullScreen>
  );
};

// ============================================================
// Scene 2 — Problem (12-24s)
// ============================================================
const SceneProblem: React.FC = () => {
  const frame = useCurrentFrame();

  const desktopOpacity = interpolate(
    frame,
    [30, 60, 150, 180],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const mobileOpacity = interpolate(frame, [210, 240], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <FullScreen>
      <div
        style={{
          position: 'absolute',
          opacity: desktopOpacity,
          textAlign: 'center',
          padding: '0 60px',
        }}
      >
        <div style={{ fontSize: 180, marginBottom: 24 }}>💻</div>
        <div style={{ fontSize: 60, fontWeight: 700, color: TEXT }}>
          Desktop tools
        </div>
        <div style={{ fontSize: 60, fontWeight: 700, color: MUTED, marginTop: 8 }}>
          are heavy.
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          opacity: mobileOpacity,
          textAlign: 'center',
          padding: '0 60px',
        }}
      >
        <div style={{ fontSize: 180, marginBottom: 24 }}>📱</div>
        <div style={{ fontSize: 60, fontWeight: 700, color: TEXT }}>
          Motion Studio
        </div>
        <div style={{ fontSize: 60, fontWeight: 700, color: CYAN, marginTop: 8 }}>
          changes that.
        </div>
      </div>
    </FullScreen>
  );
};

// ============================================================
// Scene 3 — Features (24-36s)
// ============================================================
const SceneFeatures: React.FC = () => {
  const frame = useCurrentFrame();
  const features = [
    { icon: '✏️', label: 'Code editor', at: 30 },
    { icon: '🔗', label: 'One-tap push', at: 150 },
    { icon: '🎥', label: 'Render + download', at: 270 },
  ];

  return (
    <FullScreen>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 48,
          width: '88%',
        }}
      >
        {features.map((f, i) => {
          const appear = interpolate(frame, [f.at, f.at + 30], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const slide = interpolate(frame, [f.at, f.at + 30], [60, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 28,
                opacity: appear,
                transform: `translateX(${slide}px)`,
                padding: 28,
                borderRadius: 28,
                backgroundColor: 'rgba(21, 27, 38, 0.95)',
                border: `2px solid ${CYAN}30`,
              }}
            >
              <div style={{ fontSize: 72 }}>{f.icon}</div>
              <div
                style={{
                  fontSize: 42,
                  fontWeight: 600,
                  color: TEXT,
                  flex: 1,
                }}
              >
                {f.label}
              </div>
            </div>
          );
        })}
      </div>
    </FullScreen>
  );
};

// ============================================================
// Scene 4 — Workflow (36-48s)
// ============================================================
const SceneWorkflow: React.FC = () => {
  const frame = useCurrentFrame();
  const steps = [
    { icon: '⌨️', label: 'Code', at: 60 },
    { icon: '⬆️', label: 'Push', at: 150 },
    { icon: '⚙️', label: 'Render', at: 240 },
    { icon: '📥', label: 'Download', at: 330 },
  ];

  return (
    <FullScreen>
      <div
        style={{
          fontSize: 34,
          color: MUTED,
          marginBottom: 72,
          letterSpacing: 8,
          textTransform: 'uppercase',
        }}
      >
        One workflow
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 44,
          width: '82%',
        }}
      >
        {steps.map((s, i) => {
          const appear = interpolate(frame, [s.at, s.at + 30], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const scale = interpolate(frame, [s.at, s.at + 30], [0.5, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 28,
                opacity: appear,
                transform: `scale(${scale})`,
              }}
            >
              <div
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: 55,
                  background: `linear-gradient(135deg, ${CYAN}, ${VIOLET})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 56,
                  boxShadow: `0 0 40px ${CYAN}40`,
                }}
              >
                {s.icon}
              </div>
              <div style={{ fontSize: 58, fontWeight: 700, color: TEXT }}>
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </FullScreen>
  );
};

// ============================================================
// Scene 5 — CTA (48-60s)
// ============================================================
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line1 = interpolate(frame, [30, 90], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const line1Y = interpolate(frame, [30, 90], [60, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const line2 = interpolate(frame, [180, 210], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pulse = spring({
    frame: frame - 180,
    fps,
    config: { damping: 8, stiffness: 100 },
  });
  const logoOpacity = interpolate(frame, [300, 360], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <FullScreen>
      <div style={{ textAlign: 'center', padding: 60 }}>
        <div
          style={{
            fontSize: 68,
            fontWeight: 700,
            color: TEXT,
            opacity: line1,
            transform: `translateY(${line1Y}px)`,
          }}
        >
          Build your
        </div>
        <div
          style={{
            fontSize: 68,
            fontWeight: 700,
            color: TEXT,
            opacity: line1,
            transform: `translateY(${line1Y}px)`,
            marginBottom: 90,
          }}
        >
          first video.
        </div>
        <div
          style={{
            fontSize: 150,
            fontWeight: 900,
            color: CYAN,
            opacity: line2,
            transform: `scale(${0.85 + pulse * 0.15})`,
            textShadow: `0 0 70px ${CYAN}`,
          }}
        >
          Now.
        </div>
        <div
          style={{
            marginTop: 140,
            opacity: logoOpacity,
            fontSize: 30,
            letterSpacing: 12,
            color: MUTED,
            textTransform: 'uppercase',
          }}
        >
          Motion Studio
        </div>
      </div>
    </FullScreen>
  );
};

// ============================================================
// Root composition — 5 scenes, 60s, vertical
// ============================================================
export const MyComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Audio src={staticFile('audio.wav')} />
      <Sequence from={0} durationInFrames={360}>
        <SceneIntro />
      </Sequence>
      <Sequence from={360} durationInFrames={360}>
        <SceneProblem />
      </Sequence>
      <Sequence from={720} durationInFrames={360}>
        <SceneFeatures />
      </Sequence>
      <Sequence from={1080} durationInFrames={360}>
        <SceneWorkflow />
      </Sequence>
      <Sequence from={1440} durationInFrames={360}>
        <SceneCTA />
      </Sequence>
    </AbsoluteFill>
  );
};