import { expect, test, describe, beforeEach, afterEach } from "bun:test";
import { getSiteVariant, getSiteConfig } from "./site-config";

describe("site-config", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    for (const key in process.env) {
      delete process.env[key];
    }
    Object.assign(process.env, originalEnv);
  });

  afterEach(() => {
    for (const key in process.env) {
      delete process.env[key];
    }
    Object.assign(process.env, originalEnv);
  });

  describe("getSiteVariant", () => {
    test("returns 'mathkb' when SITE_VARIANT is 'mathkb'", () => {
      process.env.SITE_VARIANT = "mathkb";
      expect(getSiteVariant()).toBe("mathkb");
    });

    test("returns 'portfolio' when SITE_VARIANT is 'portfolio'", () => {
      process.env.SITE_VARIANT = "portfolio";
      expect(getSiteVariant()).toBe("portfolio");
    });

    test("returns 'portfolio' when SITE_VARIANT is undefined", () => {
      delete process.env.SITE_VARIANT;
      expect(getSiteVariant()).toBe("portfolio");
    });
  });

  describe("getSiteConfig", () => {
    test("returns mathkb config when variant is 'mathkb'", () => {
      process.env.SITE_VARIANT = "mathkb";
      const config = getSiteConfig();
      expect(config.variant).toBe("mathkb");
      expect(config.name).toBe("Private Math Knowledge Base");
      expect(config.baseUrl).toBe("http://127.0.0.1:3003");
    });

    test("returns portfolio config when variant is 'portfolio'", () => {
      process.env.SITE_VARIANT = "portfolio";
      const config = getSiteConfig();
      expect(config.variant).toBe("portfolio");
      expect(config.name).toBe("koshikai.dev");
      expect(config.baseUrl).toBe("https://koshikai.dev");
    });

    test("respects SITE_URL environment variable", () => {
      process.env.SITE_VARIANT = "portfolio";
      process.env.SITE_URL = "https://custom.example.com";
      const config = getSiteConfig();
      expect(config.baseUrl).toBe("https://custom.example.com");
    });
  });
});
