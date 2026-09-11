import type { MetadataRoute } from "next";
import { caseItems } from "@/lib/cases";
import { primaryNav } from "@/lib/navigation";
import { getSiteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
    const site = getSiteConfig();

    return [
        {
            url: site.baseUrl,
            changeFrequency: "monthly",
            priority: 1,
        },
        ...primaryNav.map((item) => ({
            url: `${site.baseUrl}${item.href}`,
            changeFrequency: "monthly" as const,
            priority: 0.9,
        })),
        {
            url: `${site.baseUrl}/cases`,
            changeFrequency: "monthly",
            priority: 0.6,
        },
        {
            url: `${site.baseUrl}/llm-benchmarks`,
            changeFrequency: "monthly",
            priority: 0.5,
        },
        ...caseItems.map((item) => ({
            url: `${site.baseUrl}/cases/${item.slug}`,
            lastModified: new Date(item.publishedAt),
            changeFrequency: "monthly" as const,
            priority: 0.7,
        })),
    ];
}
