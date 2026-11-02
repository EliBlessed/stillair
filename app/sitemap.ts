import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/commercial"].map((p) => ({ url: `https://stillair.example${p}` }));
}

