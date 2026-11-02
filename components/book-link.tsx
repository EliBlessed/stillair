"use client";
import type { ReactNode } from "react";

/** Link to the booking form; optionally prefills the form's need and message. */
export function BookLink({ need, message, className = "btn btn-ice", children = "Book a visit" }: { need?: string; message?: string; className?: string; children?: ReactNode }) {
  return (
    <a
      href="#book"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent("prefill", { detail: { need, message } }))}
    >
      {children}
    </a>
  );
}

