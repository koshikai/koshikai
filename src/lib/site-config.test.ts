import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import {
  getSiteVariant,
  getSiteConfig,
  getSiteConfigByVariant,
  getEffectiveVariant,
} from "./site-config";

const mockGet = vi.fn();
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve({
    get: (key: string) => mockGet(key),
  })),
}));

describe("getSiteVariant", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns "mathkb" when SITE_VARIANT=mathkb', () => {
    process.env.SITE_VARIANT = "mathkb";
    expect(getSiteVariant()).toBe("mathkb");
  });

  it('returns "portfolio" when SITE_VARIANT is undefined', () => {
    delete process.env.SITE_VARIANT;
    expect(getSiteVariant()).toBe("portfolio");
  });

  it('returns "portfolio" when SITE_VARIANT is an unexpected value', () => {
    process.env.SITE_VARIANT = "unexpected";
    expect(getSiteVariant()).toBe("portfolio");
  });
});

describe("getSiteConfigByVariant", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns mathkb config with correct defaults when no SITE_URL is set', () => {
    delete process.env.SITE_URL;
    const config = getSiteConfigByVariant("mathkb");

    expect(config.variant).toBe("mathkb");
    expect(config.baseUrl).toBe("http://127.0.0.1:3103");
    expect(config.name).toBe("Private Math Knowledge Base");
    expect(config.title).toBe("Private Math Knowledge Base");
    expect(config.keywords).toContain("PostgreSQL search");
  });

  it("uses SITE_URL when available", () => {
    process.env.SITE_URL = "https://custom.example.com";
    const config = getSiteConfigByVariant("portfolio");

    expect(config.baseUrl).toBe("https://custom.example.com");
  });

  it('returns portfolio config with correct defaults', () => {
    delete process.env.SITE_URL;
    const config = getSiteConfigByVariant("portfolio");

    expect(config.variant).toBe("portfolio");
    expect(config.baseUrl).toBe("https://koshikai.dev");
    expect(config.name).toBe("koshikai.dev");
    expect(config.keywords).toContain("ポートフォリオ");
  });
});

describe("getSiteConfig", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("reflects the current SITE_VARIANT env value", () => {
    process.env.SITE_VARIANT = "mathkb";
    expect(getSiteConfig().variant).toBe("mathkb");

    process.env.SITE_VARIANT = "portfolio";
    expect(getSiteConfig().variant).toBe("portfolio");
  });
});

describe("getEffectiveVariant", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    mockGet.mockReset();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns portfolio when in production and base variant is portfolio, ignoring cookie overrides", async () => {
    process.env = { ...originalEnv, NODE_ENV: "production" };
    delete process.env.SITE_VARIANT;

    mockGet.mockReturnValue({ value: "mathkb" });

    const variant = await getEffectiveVariant();
    expect(variant).toBe("portfolio");
    expect(mockGet).not.toHaveBeenCalled();
  });

  it("respects cookie overrides when in development environment", async () => {
    process.env = { ...originalEnv, NODE_ENV: "development" };
    delete process.env.SITE_VARIANT;

    mockGet.mockReturnValue({ value: "mathkb" });

    const variant = await getEffectiveVariant();
    expect(variant).toBe("mathkb");
    expect(mockGet).toHaveBeenCalledWith("site-variant");
  });

  it("respects cookie overrides when base variant is mathkb even in production", async () => {
    process.env = { ...originalEnv, NODE_ENV: "production", SITE_VARIANT: "mathkb" };

    mockGet.mockReturnValue({ value: "portfolio" });

    const variant = await getEffectiveVariant();
    expect(variant).toBe("portfolio");
    expect(mockGet).toHaveBeenCalledWith("site-variant");
  });
});
