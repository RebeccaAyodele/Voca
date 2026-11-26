import React from 'react'

interface SoundformBlobProps {
  isRecording: boolean
  isPaused?: boolean
  volume?: number // 0 to 1 normalized audio level
}

export const SoundformBlob: React.FC<SoundformBlobProps> = ({
  isRecording,
  isPaused = false,
  volume = 0.2
}) => {
  // Scale between 0.95 and 1.25 based on audio level
  const dynamicScale = isRecording && !isPaused ? 0.96 + Math.min(volume * 0.4, 0.35) : 0.95
  const dynamicGlow = isRecording && !isPaused ? 0.45 + Math.min(volume * 0.4, 0.4) : 0.25

  return (
    <div className="relative flex items-center justify-center w-full max-w-[380px] h-[380px] select-none pointer-events-none">
      {/* CSS Keyframe Styles for Harmonic Animations */}
      <style>{`
        @keyframes harmonic-spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes harmonic-spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes ripple-wave {
          0%, 100% { transform: scale(0.96); opacity: 0.35; }
          50% { transform: scale(1.05); opacity: 0.75; }
        }
        @keyframes particle-float-1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          50% { transform: translate(6px, -10px) scale(1.3); opacity: 0.9; }
        }
        @keyframes particle-float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
          50% { transform: translate(-8px, 8px) scale(1.25); opacity: 0.85; }
        }
        @keyframes particle-float-3 {
          0%, 100% { transform: translate(0, 0) scale(1.1); opacity: 0.3; }
          50% { transform: translate(10px, 6px) scale(0.85); opacity: 0.8; }
        }
        @keyframes soundform-breathe {
          0%, 100% {
            transform: scale(0.96);
            filter: drop-shadow(0 0 25px rgba(244, 123, 69, 0.35));
          }
          50% {
            transform: scale(1.06);
            filter: drop-shadow(0 0 50px rgba(244, 123, 69, 0.65));
          }
        }
        .animate-soundform-breathe {
          animation: soundform-breathe 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .voca-wave-pulse-1 {
          animation: ripple-wave 5s ease-in-out infinite;
          transform-origin: 250px 250px;
        }
        .voca-wave-pulse-2 {
          animation: ripple-wave 6.5s ease-in-out infinite 0.8s;
          transform-origin: 250px 250px;
        }
        .voca-wave-spin-slow {
          animation: harmonic-spin-slow 48s linear infinite;
          transform-origin: 250px 250px;
        }
        .voca-wave-spin-rev {
          animation: harmonic-spin-reverse 40s linear infinite;
          transform-origin: 250px 250px;
        }
        .voca-p-float-1 { animation: particle-float-1 4.5s ease-in-out infinite; }
        .voca-p-float-2 { animation: particle-float-2 5.5s ease-in-out infinite 1s; }
        .voca-p-float-3 { animation: particle-float-3 6s ease-in-out infinite 2s; }
      `}</style>

      {/* Layered Atmospheric Glows & Harmonic Rings from Stitch */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
        <svg
          className="w-[480px] h-[480px] max-w-none opacity-85 transition-opacity duration-300"
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="freq-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f47b45" stopOpacity="0.22" />
              <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#f47b45" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Core Frequency Glow */}
          <circle cx="250" cy="250" r="230" fill="url(#freq-glow)" />

          {/* Outer Wave Rings */}
          <g className="voca-wave-pulse-1">
            <circle cx="250" cy="250" r="178" stroke="#f47b45" strokeWidth="1.2" strokeDasharray="3 6" opacity="0.45" />
            <circle cx="250" cy="250" r="196" stroke="#fb923c" strokeWidth="0.8" opacity="0.35" />
          </g>

          {/* Slow Spinning Dash Circle & Orbital Anchors */}
          <g className="voca-wave-spin-slow">
            <circle cx="250" cy="250" r="214" stroke="#f59e0b" strokeWidth="1" strokeDasharray="1.5 8 4 8" opacity="0.4" />
            <circle cx="250" cy="36" r="2.5" fill="#f47b45" opacity="0.7" />
            <circle cx="464" cy="250" r="2" fill="#fb923c" opacity="0.6" />
            <circle cx="250" cy="464" r="2.5" fill="#f59e0b" opacity="0.7" />
            <circle cx="36" cy="250" r="2" fill="#f47b45" opacity="0.6" />
          </g>

          {/* Harmonic Ripple Ring 2 */}
          <g className="voca-wave-pulse-2">
            <circle cx="250" cy="250" r="232" stroke="#f47b45" strokeWidth="1" strokeDasharray="2 12" opacity="0.3" />
            <circle cx="250" cy="250" r="242" stroke="#f5bc7e" strokeWidth="0.75" opacity="0.25" />
          </g>

          {/* Reverse Orbit Particles */}
          <g className="voca-wave-spin-rev">
            <circle cx="395" cy="145" r="3" fill="#fb923c" opacity="0.65" />
            <circle cx="105" cy="355" r="2.5" fill="#f59e0b" opacity="0.6" />
            <circle cx="375" cy="345" r="2" fill="#f47b45" opacity="0.55" />
            <circle cx="125" cy="155" r="2" fill="#f5bc7e" opacity="0.6" />
          </g>

          {/* Floating Harmonic Particles */}
          <g className="voca-p-float-1">
            <circle cx="210" cy="52" r="2" fill="#f47b45" />
            <circle cx="412" cy="210" r="2.5" fill="#fb923c" />
            <circle cx="90" cy="280" r="2.5" fill="#f59e0b" />
            <circle cx="290" cy="445" r="1.8" fill="#f47b45" />
          </g>
          <g className="voca-p-float-2">
            <circle cx="305" cy="60" r="2.5" fill="#f5bc7e" />
            <circle cx="440" cy="290" r="1.8" fill="#f47b45" />
            <circle cx="65" cy="225" r="2" fill="#fb923c" />
            <circle cx="195" cy="440" r="2.5" fill="#f59e0b" />
          </g>
          <g className="voca-p-float-3">
            <circle cx="360" cy="95" r="1.8" fill="#fb923c" />
            <circle cx="75" cy="340" r="2.2" fill="#f47b45" />
            <circle cx="425" cy="380" r="2" fill="#f5bc7e" />
            <circle cx="150" cy="75" r="1.8" fill="#f59e0b" />
          </g>
        </svg>
      </div>

      {/* Ambient Blur Circles */}
      <div className="absolute w-72 h-72 rounded-full bg-voca-tangerine/15 blur-3xl pointer-events-none" />
      <div className="absolute w-56 h-56 rounded-full bg-voca-primary/10 blur-2xl pointer-events-none" />

      {/* Central Organic Soundform Focal Piece from Stitch Design */}
      <div
        className="relative z-10 flex items-center justify-center transition-transform duration-150 ease-out"
        style={{
          transform: `scale(${dynamicScale})`
        }}
      >
        <div
          className={`relative flex items-center justify-center ${
            isRecording && !isPaused ? 'animate-soundform-breathe' : ''
          }`}
        >
          {/* Sliced 3D Soundform Sphere Container */}
          <div
            className="relative w-[260px] h-[260px] sm:w-[280px] sm:h-[280px] rounded-full overflow-hidden shadow-2xl flex items-center justify-center"
            style={{
              boxShadow: `rgba(244, 123, 69, ${dynamicGlow}) 0px 0px 55px, rgba(255, 255, 255, 0.45) 0px 0px 30px inset`
            }}
          >
            <svg
              className="w-full h-full"
              viewBox="80 80 340 340"
              width="100%"
              height="100%"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="slice-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFB385" />
                  <stop offset="50%" stopColor="#F7864F" />
                  <stop offset="100%" stopColor="#E2581E" />
                </linearGradient>
                <linearGradient id="slice-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFBE94" />
                  <stop offset="45%" stopColor="#F99462" />
                  <stop offset="100%" stopColor="#EA672D" />
                </linearGradient>
                <linearGradient id="slice-grad-3" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFC9A3" />
                  <stop offset="50%" stopColor="#FA9F72" />
                  <stop offset="100%" stopColor="#F1743B" />
                </linearGradient>
                <linearGradient id="slice-grad-4" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFD4B5" />
                  <stop offset="50%" stopColor="#FBAC84" />
                  <stop offset="100%" stopColor="#F5834D" />
                </linearGradient>
                <linearGradient id="slice-grad-5" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFDEBE" />
                  <stop offset="50%" stopColor="#FFBA96" />
                  <stop offset="100%" stopColor="#FA9665" />
                </linearGradient>
                <linearGradient id="slice-grad-6" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFE7D0" />
                  <stop offset="60%" stopColor="#FFCAA8" />
                  <stop offset="100%" stopColor="#FCA677" />
                </linearGradient>
                <linearGradient id="warm-seam-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#E05218" stopOpacity="0.35" />
                  <stop offset="50%" stopColor="#D6480F" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#E05218" stopOpacity="0.3" />
                </linearGradient>
                <clipPath id="soundform-circle-clip">
                  <circle cx="250" cy="250" r="170" />
                </clipPath>
              </defs>

              <circle cx="250" cy="250" r="170" fill="url(#slice-grad-1)" />

              <g clipPath="url(#soundform-circle-clip)">
                {/* Slice 1 */}
                <path
                  d="M 80 80 L 175 80 C 160 145, 138 200, 152 270 C 168 335, 195 385, 195 425 L 80 425 Z"
                  fill="url(#slice-grad-1)"
                />
                {/* Slice 2 */}
                <path
                  d="M 165 80 L 245 80 C 225 155, 192 205, 210 275 C 228 335, 260 380, 262 425 L 182 425 C 182 385, 155 335, 140 270 C 126 200, 150 145, 165 80 Z"
                  fill="url(#slice-grad-2)"
                />
                <path
                  d="M 165 80 C 150 145, 126 200, 140 270 C 155 335, 182 385, 182 425"
                  fill="none"
                  stroke="url(#warm-seam-grad)"
                  strokeWidth="2.5"
                />
                {/* Slice 3 */}
                <path
                  d="M 235 80 L 318 80 C 298 150, 252 200, 272 280 C 290 340, 328 385, 328 425 L 250 425 C 248 380, 216 335, 198 275 C 180 205, 215 155, 235 80 Z"
                  fill="url(#slice-grad-3)"
                />
                <path
                  d="M 235 80 C 215 155, 180 205, 198 275 C 216 335, 248 380, 250 425"
                  fill="none"
                  stroke="url(#warm-seam-grad)"
                  strokeWidth="2.5"
                />
                {/* Slice 4 */}
                <path
                  d="M 308 80 L 392 80 C 372 155, 325 210, 342 270 C 358 325, 395 375, 398 425 L 318 425 C 318 385, 280 340, 262 280 C 242 200, 288 150, 308 80 Z"
                  fill="url(#slice-grad-4)"
                />
                <path
                  d="M 308 80 C 288 150, 242 200, 262 280 C 280 340, 318 385, 318 425"
                  fill="none"
                  stroke="url(#warm-seam-grad)"
                  strokeWidth="2.5"
                />
                {/* Slice 5 */}
                <path
                  d="M 382 80 L 430 80 L 430 220 C 405 250, 375 285, 382 325 C 390 365, 410 395, 415 425 L 388 425 C 385 375, 348 325, 332 270 C 315 210, 362 155, 382 80 Z"
                  fill="url(#slice-grad-5)"
                />
                <path
                  d="M 382 80 C 362 155, 315 210, 332 270 C 348 325, 385 375, 388 425"
                  fill="none"
                  stroke="url(#warm-seam-grad)"
                  strokeWidth="2.5"
                />
                {/* Slice 6 */}
                <path
                  d="M 418 80 L 430 80 L 430 425 L 405 425 C 400 395, 380 365, 372 325 C 365 285, 395 250, 420 220 C 420 160, 418 110, 418 80 Z"
                  fill="url(#slice-grad-6)"
                />
                {/* Subtle Rim Highlight */}
                <circle cx="250" cy="250" r="169" fill="none" stroke="#FFD8BE" strokeWidth="2.5" opacity="0.6" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
