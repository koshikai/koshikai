import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
    const site = getSiteConfig();

    return {
        rules: {
            userAgent: "*",
            allow: "/",
        },
        sitemap: `${site.baseUrl}/sitemap.xml`,
    };
}
