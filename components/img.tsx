/* eslint-disable @next/next/no-img-element */
"use client";
import type { ImgHTMLAttributes } from "react";

const hide = (el: HTMLImageElement) => { el.style.display = "none"; };

// Plain <img> that hides itself if the file is missing, so the frame's placeholder shows through.
// The ref check catches errors that fired before React hydrated.
export function Img(props: ImgHTMLAttributes<HTMLImageElement> & { alt: string }) {
  return (
    <img
      {...props}
      alt={props.alt}
      ref={(el) => { if (el?.complete && !el.naturalWidth) hide(el); }}
      onError={(e) => hide(e.currentTarget)}
    />
  );
}

