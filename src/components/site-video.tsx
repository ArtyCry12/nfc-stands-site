"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  poster?: string;
  className?: string;
  /** When true, try muted autoplay (hero). Always silent. */
  autoPlay?: boolean;
  label?: string;
};

/**
 * Silent video with poster + reduced-motion static fallback.
 * Content/CTA must never wait on this component.
 */
export function SiteVideo({
  src,
  poster,
  className = "",
  autoPlay = false,
  label = "Product video",
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!autoPlay || reduceMotion || failed) return;
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    const play = el.play();
    if (play) play.catch(() => setFailed(true));
  }, [autoPlay, reduceMotion, failed, src]);

  if (reduceMotion || failed) {
    return (
      <div className={`relative overflow-hidden bg-[var(--tf-photo)] ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={poster || "/media/refs/stands-desk.jpg"}
          alt={label}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[var(--tf-photo)] ${className}`}>
      <video
        ref={ref}
        className="h-full w-full object-cover"
        src={src}
        poster={poster}
        muted
        playsInline
        loop={autoPlay}
        controls={!autoPlay}
        preload="metadata"
        aria-label={label}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
