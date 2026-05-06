type MascotAvatarProps = {
  traits?: Record<string, string>;
  size?: "sm" | "md" | "lg";
};

const layerOrder = [
  "background",
  "body",
  "hands",
  "hair",
  "espiral",
  "eyes",
  "mouth",
  "shoes",
  "glasses",
  "stickers",
  "special",
];

export function MascotAvatar({ traits, size = "md" }: MascotAvatarProps) {
  const sizeClass = {
    sm: "h-28 w-28",
    md: "h-40 w-40",
    lg: "h-64 w-64",
  }[size];

  if (!traits) {
    return (
      <div
        className={`${sizeClass} flex items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-xs text-white/50`}
      >
        Sem mascote
      </div>
    );
  }

  return (
    <div
      className={`relative ${sizeClass} overflow-hidden rounded-3xl border border-white/10 bg-black/20`}
    >
      {layerOrder.map((layer) => {
        const src = traits[layer];

        if (!src) return null;

        return (
          <img
            key={layer}
            src={src}
            alt={layer}
            className="absolute inset-0 h-full w-full object-contain"
            draggable={false}
          />
        );
      })}
    </div>
  );
}