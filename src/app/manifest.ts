import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  const site = getSiteConfig();

  if (site.variant === "notes") {
    return {
      name: site.name,
      short_name: "notes",
      start_url: "/",
      display: "standalone",
      background_color: "#1a1625",
      theme_color: "#1a1625",
    };
  }

  return {
    name: site.name,
    short_name: "koshikai",
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fffbf0",
    theme_color: "#fffbf0",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
