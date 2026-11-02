"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import "lenis/dist/lenis.css";

/** Lenis smooth scroll wired to ScrollTrigger, plus the one-time entrance observer. Off with reduced motion. */
export function SmoothScroll() {
  const path = usePathname();

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Loaded after hydration, not in the first HTML: keeps ~60 KB of JS off the phone's first paint.
    let stop = () => {};
    let dead = false;
    Promise.all([import("lenis"), import("gsap"), import("gsap/ScrollTrigger")]).then(([{ default: Lenis }, { default: gsap }, { ScrollTrigger }]) => {
      if (dead) return;
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({ anchors: true });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      stop = () => { gsap.ticker.remove(tick); lenis.destroy(); };
    });
    return () => { dead = true; stop(); };
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.setAttribute("data-in", ""); io.unobserve(e.target); } }),
      { rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [path]);

  return null;
}

