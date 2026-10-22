import React from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  random,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// ============================================================
// Palette & Type
// ============================================================
const BG     = '#05070D';
const CYAN   = '#06B6D4';
const VIOLET = '#8B5CF6';
const TEXT   = '#F3F4F6';
const MUTED  = '#6B7280';
const FONT = '"Inter","Helvetica Neue",Arial,sans-serif';
const MONO = '"JetBrains Mono","SF Mono",monospace';

// ============================================================
// Shared primitives
// ============================================================

const Scanlines: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => (
  <AbsoluteFill
    style={{
      opacity,
      background:
        'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, #ffffff 2px, #ffffff 3px)',
      pointerEvents: 'none',
      mixBlendMode: 'overlay',
    }}
  />
);

const Particles: React.FC<{
  count: number;
  color: string;
  speed?: number;
  maxSize?: number;
  drift?: number;
  opacityBoost?: number;
}> = ({ count, color, speed = 0.4, maxSize = 2.5, drift = 0.4, opacityBoost = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const x0 = random(`px${i}`) * 1080;
        const y0 = random(`py${i}`) * 1920;
        const vx = (random(`pvx${i}`) - 0.5) * drift;
        const vy = -speed * (0.4 + random(`pvy${i}`));
        const x = (((x0 + vx * frame) % 1080) + 1080) % 1080;
        const y = (((y0 + vy * frame) % 1920) + 1920) % 1920;
        const r = 0.5 + random(`pr${i}`) * maxSize;
        const op = Math.min(1, 0.15 + random(`po${i}`) * 0.5 + opacityBoost);
        return <circle key={i} cx={x} cy={y} r={r} fill={color} opacity={op} />;
      })}
    </>
  );
};

const GridBackground: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const frame = useCurrentFrame();
  const pulse = 0.6 + 0.4 * Math.sin(frame / 22);
  const lines = 24;
  return (
    <AbsoluteFill style={{ opacity }}>
      <svg width="100%" height="100%" viewBox="0 0 1080 1920" preserveAspectRatio="none">
        <defs>
          <radialGradient id="gridFade" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="gridMask">
            <rect width="1080" height="1920" fill="url(#gridFade)" />
          </mask>
        </defs>
        <g mask="url(#gridMask)" stroke={CYAN} strokeWidth={0.8} opacity={0.18 * pulse}>
          {Array.from({ length: lines }).map((_, i) => (
            <line key={`h${i}`} x1={0} y1={i * (1920 / lines)} x2={1080} y2={i * (1920 / lines)} />
          ))}
          {Array.from({ length: lines }).map((_, i) => (
            <line key={`v${i}`} x1={i * (1080 / lines)} y1={0} x2={i * (1080 / lines)} y2={1920} />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

const ChapterCaption: React.FC<{ text: string; opacity: number }> = ({ text, opacity }) => (
  <div
    style={{
      position: 'absolute',
      left: 56,
      bottom: 80,
      fontFamily: MONO,
      fontSize: 22,
      color: MUTED,
      letterSpacing: 4,
      opacity,
    }}
  >
    {text}
  </div>
);

// ============================================================
// SCENE 1 — ORIGIN (0-12s)
// A single point becomes a rotating wireframe cube.
// ============================================================
const SceneOrigin: React.FC = () => {
  const frame = useCurrentFrame();

  const gridOpacity = interpolate(frame, [0, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const dotOpacity = interpolate(frame, [30, 60, 90, 120], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const dotR = interpolate(frame, [30, 70], [0, 8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const squareScale = interpolate(frame, [70, 150], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const squareRotate = interpolate(frame, [70, 200], [0, 45], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const squareOpacity = interpolate(frame, [70, 110, 180, 220], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const cubeRotateY = interpolate(frame, [180, 340], [0, 360]);
  const cubeRotateX = interpolate(frame, [180, 340], [10, 30]);
  const cubeOpacity = interpolate(frame, [180, 220, 320, 355], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cubeScale = interpolate(frame, [180, 240, 320, 355], [0.4, 1, 1, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const captionOpacity = interpolate(frame, [50, 100], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: BG, overflow: 'hidden' }}>
      <GridBackground opacity={gridOpacity} />

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <svg style={{ position: 'absolute', width: 1080, height: 1920 }} viewBox="0 0 1080 1920">
          <defs>
            <radialGradient id="dotGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={CYAN} stopOpacity="1" />
              <stop offset="50%" stopColor={CYAN} stopOpacity="0.3" />
              <stop offset="100%" stopColor={CYAN} stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="540" cy="960" r={dotR * 8} fill="url(#dotGlow)" opacity={dotOpacity * 0.7} />
          <circle cx="540" cy="960" r={dotR} fill={CYAN} opacity={dotOpacity} />
        </svg>

        <div
          style={{
            position: 'absolute',
            width: 460,
            height: 460,
            border: `2px solid ${CYAN}`,
            transform: `rotate(${squareRotate}deg) scale(${squareScale})`,
            opacity: squareOpacity,
            boxShadow: `0 0 60px ${CYAN}66, inset 0 0 60px ${CYAN}33`,
          }}
        />

        <div style={{ perspective: 1400, opacity: cubeOpacity, transform: `scale(${cubeScale})` }}>
          <div
            style={{
              width: 320,
              height: 320,
              position: 'relative',
              transformStyle: 'preserve-3d',
              transform: `rotateX(${cubeRotateX}deg) rotateY(${cubeRotateY}deg)`,
            }}
          >
            {[
              'translateZ(160px)',
              'translateZ(-160px)',
              'rotateY(90deg) translateZ(160px)',
              'rotateY(90deg) translateZ(-160px)',
              'rotateX(90deg) translateZ(160px)',
              'rotateX(90deg) translateZ(-160px)',
            ].map((t, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: 320,
                  height: 320,
                  border: `2px solid ${i % 2 === 0 ? CYAN : VIOLET}`,
                  transform: t,
                  boxShadow: `0 0 18px ${i % 2 === 0 ? CYAN : VIOLET}`,
                  opacity: 0.9,
                }}
              />
            ))}
          </div>
        </div>

        <svg style={{ position: 'absolute', width: 1080, height: 1920 }} viewBox="0 0 1080 1920">
          <Particles count={70} color={CYAN} speed={0.5} maxSize={2.5} drift={0.6} />
        </svg>
      </AbsoluteFill>

      <ChapterCaption text="// ORIGIN" opacity={captionOpacity} />
      <Scanlines />
    </AbsoluteFill>
  );
};

// ============================================================
// SCENE 2 — BUILD (12-24s)
// Code editor window with animated code bars + a cursor.
// ============================================================
const SceneBuild: React.FC = () => {
  const frame = useCurrentFrame();

  const windowOpacity = interpolate(frame, [0, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const windowScale = interpolate(frame, [0, 40], [0.9, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const windowFade = interpolate(frame, [320, 360], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const lines = [
    { w: 260, c: CYAN, at: 50, indent: 0 },
    { w: 340, c: VIOLET, at: 70, indent: 40 },
    { w: 200, c: CYAN, at: 90, indent: 80 },
    { w: 420, c: VIOLET, at: 110, indent: 80 },
    { w: 180, c: CYAN, at: 130, indent: 40 },
    { w: 300, c: VIOLET, at: 150, indent: 0 },
    { w: 250, c: CYAN, at: 170, indent: 40 },
    { w: 380, c: VIOLET, at: 190, indent: 80 },
    { w: 160, c: CYAN, at: 210, indent: 80 },
    { w: 340, c: VIOLET, at: 230, indent: 40 },
    { w: 220, c: CYAN, at: 250, indent: 0 },
    { w: 280, c: VIOLET, at: 270, indent: 0 },
  ];

  const cursorVisible = Math.floor(frame / 15) % 2 === 0;
  const cursorY = lines.reduce((acc, l) => (frame >= l.at ? acc + 1 : acc), 0);
  const cursorOpacity = interpolate(frame, [50, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: BG, overflow: 'hidden' }}>
      <GridBackground opacity={0.4} />

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          opacity: windowOpacity * windowFade,
          transform: `scale(${windowScale})`,
        }}
      >
        <div
          style={{
            width: 900,
            padding: '36px 40px',
            borderRadius: 24,
            backgroundColor: 'rgba(11, 14, 20, 0.94)',
            border: `1.5px solid ${CYAN}44`,
            boxShadow: `0 0 80px ${CYAN}33, inset 0 0 40px rgba(6, 182, 212, 0.05)`,
            fontFamily: MONO,
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
            <div style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: '#EF4444' }} />
            <div style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: '#F59E0B' }} />
            <div style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: '#22C55E' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {lines.map((l, i) => {
              const appear = interpolate(frame, [l.at, l.at + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
              const width = interpolate(frame, [l.at, l.at + 20], [0, l.w], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
              return (
                <div
                  key={i}
                  style={{
                    marginLeft: l.indent,
                    height: 12,
                    width,
                    backgroundColor: l.c,
                    borderRadius: 6,
                    opacity: appear * 0.9,
                    boxShadow: `0 0 12px ${l.c}66`,
                  }}
                />
              );
            })}
            <div
              style={{
                marginLeft: 0,
                height: 16,
                width: 10,
                marginTop: cursorY === 0 ? 0 : 4,
                backgroundColor: CYAN,
                opacity: cursorVisible ? cursorOpacity : 0,
                boxShadow: `0 0 16px ${CYAN}`,
              }}
            />
          </div>

          <div
            style={{
              marginTop: 32,
              fontSize: 12,
              color: MUTED,
              letterSpacing: 2,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>Composition.tsx</span>
            <span style={{ color: CYAN }}>◉ SAVED</span>
          </div>
        </div>
      </AbsoluteFill>

      <svg style={{ position: 'absolute', width: 1080, height: 1920 }} viewBox="0 0 1080 1920">
        <Particles count={40} color={VIOLET} speed={0.3} maxSize={2} drift={0.5} />
      </svg>

      <ChapterCaption
        text="// BUILD"
        opacity={interpolate(frame, [50, 100], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
      />
      <Scanlines />
    </AbsoluteFill>
  );
};

// ============================================================
// SCENE 3 — MOTION (24-36s)
// Bezier curve draws itself; ball rides it; keyframes pop.
// ============================================================
const SceneMotion: React.FC = () => {
  const frame = useCurrentFrame();

  const drawProgress = interpolate(frame, [20, 180], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ballProgress = interpolate(frame, [140, 260], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fade = interpolate(frame, [320, 360], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Bezier sample: cubic from (120,1400) via ctrl pts to (960,800)
  const bezier = (t: number) => {
    const p0 = { x: 120, y: 1400 };
    const p1 = { x: 400, y: 500 };
    const p2 = { x: 700, y: 1600 };
    const p3 = { x: 960, y: 700 };
    const mt = 1 - t;
    return {
      x: mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x,
      y: mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y,
    };
  };
  const ballPos = bezier(ballProgress);

  const keyframes = [
    { t: 0.0, label: '0%' },
    { t: 0.25, label: '25%' },
    { t: 0.5, label: '50%' },
    { t: 0.75, label: '75%' },
    { t: 1.0, label: '100%' },
  ];

  const timelineY = 1780;
  const timelineX0 = 120;
  const timelineX1 = 960;
  const playheadX = timelineX0 + (timelineX1 - timelineX0) * ballProgress;
  const timelineOpacity = interpolate(frame, [180, 230], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: BG, overflow: 'hidden', opacity: fade }}>
      <GridBackground opacity={0.5} />

      <svg
        style={{ position: 'absolute', width: 1080, height: 1920 }}
        viewBox="0 0 1080 1920"
      >
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={CYAN} />
            <stop offset="100%" stopColor={VIOLET} />
          </linearGradient>
          <radialGradient id="ballGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={CYAN} stopOpacity="1" />
            <stop offset="100%" stopColor={CYAN} stopOpacity="0" />
          </radialGradient>
        </defs>

        <path
          d="M 120 1400 C 400 500, 700 1600, 960 700"
          stroke="url(#pathGradient)"
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - drawProgress}
          style={{ filter: `drop-shadow(0 0 12px ${CYAN})` }}
        />

        {keyframes.map((kf, i) => {
          const p = bezier(kf.t);
          const appear = interpolate(frame, [60 + i * 12, 90 + i * 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <g key={i} opacity={appear}>
              <rect
                x={p.x - 10}
                y={p.y - 10}
                width={20}
                height={20}
                fill={BG}
                stroke={VIOLET}
                strokeWidth={2}
                transform={`rotate(45 ${p.x} ${p.y})`}
                style={{ filter: `drop-shadow(0 0 8px ${VIOLET})` }}
              />
            </g>
          );
        })}

        {ballProgress > 0 && (
          <>
            <circle cx={ballPos.x} cy={ballPos.y} r={44} fill="url(#ballGlow)" opacity={0.7} />
            <circle cx={ballPos.x} cy={ballPos.y} r={16} fill={CYAN} style={{ filter: `drop-shadow(0 0 12px ${CYAN})` }} />
          </>
        )}

        {/* Timeline */}
        <g opacity={timelineOpacity}>
          <line
            x1={timelineX0}
            y1={timelineY}
            x2={timelineX1}
            y2={timelineY}
            stroke={MUTED}
            strokeWidth={2}
          />
          {keyframes.map((kf, i) => {
            const x = timelineX0 + (timelineX1 - timelineX0) * kf.t;
            return (
              <rect
                key={i}
                x={x - 6}
                y={timelineY - 6}
                width={12}
                height={12}
                fill={VIOLET}
                transform={`rotate(45 ${x} ${timelineY})`}
              />
            );
          })}
          <line
            x1={playheadX}
            y1={timelineY - 20}
            x2={playheadX}
            y2={timelineY + 20}
            stroke={CYAN}
            strokeWidth={3}
            style={{ filter: `drop-shadow(0 0 8px ${CYAN})` }}
          />
        </g>
      </svg>

      <svg style={{ position: 'absolute', width: 1080, height: 1920 }} viewBox="0 0 1080 1920">
        <Particles count={50} color={CYAN} speed={0.4} maxSize={2} drift={0.6} />
      </svg>

      <ChapterCaption
        text="// ANIMATE"
        opacity={interpolate(frame, [40, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
      />
      <Scanlines />
    </AbsoluteFill>
  );
};

// ============================================================
// SCENE 4 — RENDER (36-48s)
// Network of nodes + traveling pulses + beam that renders a play.
// ============================================================
const SceneRender: React.FC = () => {
  const frame = useCurrentFrame();

  const fade = interpolate(frame, [320, 360], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const networkOpacity = interpolate(frame, [0, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const beamOpacity = interpolate(frame, [160, 220], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const beamWidth = interpolate(frame, [160, 220], [0, 6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const playScale = interpolate(frame, [220, 300], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const playOpacity = interpolate(frame, [220, 280], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const cx = 540;
  const cy = 700;
  const radius = 320;
  const nodeCount = 10;
  const nodes = Array.from({ length: nodeCount }).map((_, i) => {
    const angle = (i / nodeCount) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BG, overflow: 'hidden', opacity: fade }}>
      <GridBackground opacity={0.6} />

      <svg
        style={{ position: 'absolute', width: 1080, height: 1920 }}
        viewBox="0 0 1080 1920"
        opacity={networkOpacity}
      >
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={CYAN} stopOpacity="1" />
            <stop offset="100%" stopColor={CYAN} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="beamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={CYAN} stopOpacity="0.9" />
            <stop offset="100%" stopColor={CYAN} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Ring lines between adjacent nodes */}
        {nodes.map((n, i) => {
          const next = nodes[(i + 1) % nodeCount];
          const appear = interpolate(frame, [10 + i * 6, 40 + i * 6], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <line
              key={`edge${i}`}
              x1={n.x}
              y1={n.y}
              x2={next.x}
              y2={next.y}
              stroke={VIOLET}
              strokeWidth={1.5}
              opacity={appear * 0.6}
            />
          );
        })}

        {/* Spokes to center */}
        {nodes.map((n, i) => {
          const appear = interpolate(frame, [20 + i * 5, 50 + i * 5], [0, 0.35], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <line
              key={`spoke${i}`}
              x1={n.x}
              y1={n.y}
              x2={cx}
              y2={cy}
              stroke={CYAN}
              strokeWidth={1}
              opacity={appear}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((n, i) => (
          <circle
            key={`node${i}`}
            cx={n.x}
            cy={n.y}
            r={10}
            fill={CYAN}
            style={{ filter: `drop-shadow(0 0 10px ${CYAN})` }}
          />
        ))}

        {/* Traveling pulses */}
        {nodes.map((n, i) => {
          const t = ((frame + i * 30) % 120) / 120;
          const x = n.x + (cx - n.x) * t;
          const y = n.y + (cy - n.y) * t;
          return (
            <circle
              key={`pulse${i}`}
              cx={x}
              cy={y}
              r={5}
              fill="#FFFFFF"
              opacity={1 - t}
              style={{ filter: `drop-shadow(0 0 10px ${CYAN})` }}
            />
          );
        })}

        {/* Central node */}
        <circle cx={cx} cy={cy} r={90} fill="url(#nodeGlow)" opacity={0.6} />
        <circle cx={cx} cy={cy} r={30} fill={CYAN} style={{ filter: `drop-shadow(0 0 30px ${CYAN})` }} />

        {/* Downward beam */}
        <rect
          x={cx - beamWidth / 2}
          y={cy + 30}
          width={beamWidth}
          height={1920 - cy - 30}
          fill="url(#beamGrad)"
          opacity={beamOpacity}
        />
      </svg>

      {/* Play button (rendered from beam) */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 400,
          transform: `translateX(-50%) scale(${playScale})`,
          opacity: playOpacity,
        }}
      >
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: 100,
            border: `4px solid ${CYAN}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 80px ${CYAN}aa, inset 0 0 40px ${CYAN}44`,
            backgroundColor: 'rgba(6, 182, 212, 0.08)',
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `44px solid ${CYAN}`,
              borderTop: '30px solid transparent',
              borderBottom: '30px solid transparent',
              marginLeft: 12,
              filter: `drop-shadow(0 0 12px ${CYAN})`,
            }}
          />
        </div>
      </div>

      <ChapterCaption
        text="// RENDER"
        opacity={interpolate(frame, [40, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
      />
      <Scanlines />
    </AbsoluteFill>
  );
};

// ============================================================
// SCENE 5 — REVEAL (48-60s)
// Particles converge → flash → M logo draws → wordmark fades in.
// ============================================================
const SceneReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Converging particles 0-90
  const converge = interpolate(frame, [0, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Flash 80-110
  const flash = interpolate(frame, [80, 90, 110], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Logo draw 90-200
  const logoDraw = interpolate(frame, [90, 200], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Wordmark 200-260
  const wordmark = interpolate(frame, [200, 260], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Shimmer 260-360
  const shimmerX = interpolate(frame, [260, 360], [-400, 1400]);

  // Gentle pulse after logo appears
  const pulse = spring({
    frame: Math.max(0, frame - 200),
    fps,
    config: { damping: 12, stiffness: 60 },
  });

  const centerX = 540;
  const centerY = 860;

  // M monogram path (normalized inside 300x300 box centered on 540,860)
  // Path: bottom-left → top-left → middle-bottom → top-right → bottom-right
  const mPath = 'M 420 980 L 420 740 L 540 880 L 660 740 L 660 980';

  return (
    <AbsoluteFill style={{ backgroundColor: BG, overflow: 'hidden' }}>
      <GridBackground opacity={0.3} />

      {/* Converging particles */}
      <svg style={{ position: 'absolute', width: 1080, height: 1920 }} viewBox="0 0 1080 1920">
        {Array.from({ length: 120 }).map((_, i) => {
          const angle = random(`cAngle${i}`) * Math.PI * 2;
          const dist = 400 + random(`cDist${i}`) * 800;
          const startX = centerX + Math.cos(angle) * dist;
          const startY = centerY + Math.sin(angle) * dist;
          const x = startX + (centerX - startX) * converge;
          const y = startY + (centerY - startY) * converge;
          const op = (1 - converge) * (0.4 + random(`cOp${i}`) * 0.4);
          return <circle key={i} cx={x} cy={y} r={1.5 + random(`cR${i}`) * 2} fill={random(`cC${i}`) > 0.5 ? CYAN : VIOLET} opacity={op} />;
        })}
      </svg>

      {/* Flash */}
      <AbsoluteFill
        style={{
          backgroundColor: '#FFFFFF',
          opacity: flash * 0.9,
          pointerEvents: 'none',
        }}
      />

      {/* Logo */}
      <svg style={{ position: 'absolute', width: 1080, height: 1920 }} viewBox="0 0 1080 1920">
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={CYAN} />
            <stop offset="100%" stopColor={VIOLET} />
          </linearGradient>
          <linearGradient id="shimmerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <filter id="logoGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer ring */}
        <circle
          cx={centerX}
          cy={centerY}
          r={180}
          fill="none"
          stroke={CYAN}
          strokeWidth={1}
          opacity={logoDraw * 0.4}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - logoDraw}
        />

        {/* M monogram */}
        <path
          d={mPath}
          fill="none"
          stroke="url(#logoGrad)"
          strokeWidth={10}
          strokeLinejoin="miter"
          strokeLinecap="square"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - logoDraw}
          filter="url(#logoGlow)"
        />

        {/* Shimmer pass */}
        <rect
          x={shimmerX}
          y={600}
          width={200}
          height={600}
          fill="url(#shimmerGrad)"
          opacity={0.6}
          transform={`rotate(20 ${shimmerX + 100} 900)`}
        />
      </svg>

      {/* Wordmark */}
      <div
        style={{
          position: 'absolute',
          top: centerY + 240,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: FONT,
          fontSize: 68,
          fontWeight: 800,
          letterSpacing: 22,
          color: TEXT,
          opacity: wordmark,
          transform: `translateY(${(1 - wordmark) * 20}px)`,
          textShadow: `0 0 ${40 + pulse * 20}px ${CYAN}aa`,
        }}
      >
        MOTION
      </div>
      <div
        style={{
          position: 'absolute',
          top: centerY + 340,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: FONT,
          fontSize: 68,
          fontWeight: 200,
          letterSpacing: 42,
          color: CYAN,
          opacity: wordmark,
          transform: `translateY(${(1 - wordmark) * 20}px)`,
        }}
      >
        STUDIO
      </div>
      <div
        style={{
          position: 'absolute',
          top: centerY + 480,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: MONO,
          fontSize: 22,
          color: MUTED,
          letterSpacing: 6,
          opacity: interpolate(frame, [280, 340], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}
      >
        BUILD · RENDER · SHIP
      </div>

      <Scanlines opacity={0.08} />
    </AbsoluteFill>
  );
};

// ============================================================
// Composition root — 5 scenes × 12s = 60s
// ============================================================
export const MyComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Audio src={staticFile('audio.wav')} />
      <Sequence from={0} durationInFrames={360}><SceneOrigin /></Sequence>
      <Sequence from={360} durationInFrames={360}><SceneBuild /></Sequence>
      <Sequence from={720} durationInFrames={360}><SceneMotion /></Sequence>
      <Sequence from={1080} durationInFrames={360}><SceneRender /></Sequence>
      <Sequence from={1440} durationInFrames={360}><SceneReveal /></Sequence>
    </AbsoluteFill>
  );
};