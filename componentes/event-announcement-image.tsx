"use client";

import { useState } from "react";

type Props = {
  src: string | null;
  alt: string;
};

export default function EventAnnouncementImage({ src, alt }: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-full min-h-48 items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(25,181,201,0.28),transparent_48%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.22),transparent_45%),#292929] px-6 text-center">
        <div aria-hidden="true">
          <span className="block text-4xl">◌</span>
          <span className="mt-3 block text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
            Imagem em breve
          </span>
        </div>
        <span className="sr-only">Imagem do evento ainda não disponível.</span>
      </div>
    );
  }

  return (
    // A origem é cadastrada pela curadoria e pode variar por anúncio.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="h-full min-h-48 w-full object-cover"
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
