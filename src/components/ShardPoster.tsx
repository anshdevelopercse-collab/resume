/** Static obsidian shard: shown while the 3D scene loads, and when WebGL / motion is unavailable. */
export default function ShardPoster() {
  return (
    <svg
      viewBox="0 0 400 600"
      className="absolute left-1/2 top-1/2 h-[78%] w-auto -translate-x-1/2 -translate-y-1/2"
      role="img"
      aria-label="Faceted obsidian crystal"
    >
      <defs>
        <linearGradient id="sp-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2a2a2e" />
          <stop offset="0.5" stopColor="#0b0b0d" />
          <stop offset="1" stopColor="#050506" />
        </linearGradient>
        <linearGradient id="sp-b" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3326" />
          <stop offset="0.45" stopColor="#0d0d0f" />
          <stop offset="1" stopColor="#040405" />
        </linearGradient>
        <linearGradient id="sp-c" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#c8a24a" stopOpacity="0.5" />
          <stop offset="0.35" stopColor="#141416" />
          <stop offset="1" stopColor="#070708" />
        </linearGradient>
      </defs>
      <g stroke="#c8a24a" strokeOpacity="0.5" strokeWidth="1" strokeLinejoin="round">
        <polygon points="200,18 118,150 200,196" fill="url(#sp-a)" />
        <polygon points="200,18 200,196 292,140" fill="url(#sp-b)" />
        <polygon points="118,150 96,360 200,196" fill="url(#sp-c)" />
        <polygon points="200,196 96,360 214,430" fill="url(#sp-a)" />
        <polygon points="200,196 214,430 304,350 292,140" fill="url(#sp-b)" />
        <polygon points="96,360 150,500 214,430" fill="url(#sp-b)" />
        <polygon points="214,430 150,500 200,584 262,480" fill="url(#sp-a)" />
        <polygon points="214,430 262,480 304,350" fill="url(#sp-c)" />
      </g>
    </svg>
  );
}
