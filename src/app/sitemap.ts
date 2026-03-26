import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
    const site = getSiteConfig();

    if (site.variant === "notes") {
        return [];
    }

    return [
        {
            url: site.baseUrl,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 1,
        },
    ];
}
