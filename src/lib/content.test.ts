import { describe, expect, it } from "vitest";
import { caseItems, getCaseBySlug } from "./cases";
import { capabilities } from "./engineering";
import { profile } from "./profile";
import { featuredResearch, researchTopics } from "./research";
import { featuredWorks, works } from "./works";

/**
 * 表示用データの整合性。リンク切れや、方針（トップに出す作品・研究の数、
 * トップに肩書きを出さない）からのずれをビルド前に検出する。
 */
describe("content data", () => {
  it("features exactly Smoke it., KariGallery and mathkb on the home page", () => {
    expect(featuredWorks.map((work) => work.slug)).toEqual(["smoke-it", "karigallery", "mathkb"]);
  });

  it("links works and research topics only to case studies that exist", () => {
    const slugs = [
      ...works.map((work) => work.links.caseSlug),
      ...researchTopics.map((topic) => topic.caseSlug),
    ].filter((slug): slug is string => Boolean(slug));

    for (const slug of slugs) {
      expect(getCaseBySlug(slug), slug).toBeDefined();
    }
  });

  it("backs every capability with at least one resolvable piece of evidence", () => {
    const caseSlugs = new Set(caseItems.map((item) => item.slug));
    const workSlugs = new Set(works.map((work) => work.slug));

    for (const capability of capabilities) {
      expect(capability.evidence.length, capability.area).toBeGreaterThan(0);
      for (const evidence of capability.evidence) {
        const caseMatch = evidence.href.match(/^\/cases\/(.+)$/);
        const workMatch = evidence.href.match(/^\/works#(.+)$/);
        if (caseMatch) expect(caseSlugs.has(caseMatch[1]), evidence.href).toBe(true);
        if (workMatch) expect(workSlugs.has(workMatch[1]), evidence.href).toBe(true);
      }
    }
  });

  it("describes private works without live links", () => {
    for (const work of works.filter((w) => w.status === "private")) {
      expect(work.links.live, work.slug).toBeUndefined();
      expect(work.architecture?.length ?? 0, work.slug).toBeGreaterThan(0);
    }
  });

  it("keeps affiliations and awards out of the hero copy", () => {
    const hero = [profile.role, profile.lead].join(" ");
    expect(hero).not.toMatch(/大学|研究室|学会|賞|松尾|SCI/);
  });

  it("shows two research topics on the home page, each with Problem / Method / Result", () => {
    expect(featuredResearch).toHaveLength(2);
    for (const topic of featuredResearch) {
      expect(topic.problem && topic.method && topic.result, topic.slug).toBeTruthy();
    }
  });
});
