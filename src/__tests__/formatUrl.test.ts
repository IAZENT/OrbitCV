import { describe, it, expect } from "vitest";
import { formatDisplayUrl, formatLinkText, ensureAbsoluteUrl } from "@/features/cv-builder/pdf/formatUrl";

describe("formatDisplayUrl", () => {
  it("strips http, https, www, and trailing slash", () => {
    expect(formatDisplayUrl("https://www.linkedin.com/in/john-doe/")).toBe("linkedin.com/in/john-doe");
    expect(formatDisplayUrl("http://github.com/user/")).toBe("github.com/user");
  });

  it("omits label if label is contained within the domain or URL", () => {
    expect(formatDisplayUrl("https://www.linkedin.com/in/john-doe/", "LinkedIn")).toBe("linkedin.com/in/john-doe");
    expect(formatDisplayUrl("https://github.com/user", "GitHub")).toBe("github.com/user");
    expect(formatDisplayUrl("https://tryhackme.com/p/user", "TryHackMe")).toBe("tryhackme.com/p/user");
    expect(formatDisplayUrl("https://app.hackthebox.com/users/123", "HackTheBox")).toBe("app.hackthebox.com/users/123");
  });

  it("includes custom label when it is distinct from domain", () => {
    expect(formatDisplayUrl("https://john.dev", "Portfolio")).toBe("Portfolio: john.dev");
    expect(formatDisplayUrl("https://medium.com/@john", "Blog")).toBe("Blog: medium.com/@john");
  });

  it("handles empty or whitespace inputs gracefully", () => {
    expect(formatDisplayUrl("")).toBe("");
    expect(formatDisplayUrl("   ")).toBe("");
  });
});

describe("formatLinkText", () => {
  it("returns label in compact mode when provided", () => {
    expect(formatLinkText("https://linkedin.com/in/john", "LinkedIn", "compact")).toBe("LinkedIn");
    expect(formatLinkText("https://github.com/user", "GitHub", "compact")).toBe("GitHub");
    expect(formatLinkText("https://tryhackme.com/p/user", "TryHackMe", "compact")).toBe("TryHackMe");
  });

  it("falls back to domain name capitalized in compact mode when label is missing", () => {
    expect(formatLinkText("https://hackthebox.com/p/123", "", "compact")).toBe("Hackthebox");
  });

  it("returns full clean domain URL in full mode", () => {
    expect(formatLinkText("https://linkedin.com/in/john", "LinkedIn", "full")).toBe("linkedin.com/in/john");
    expect(formatLinkText("https://github.com/user", "GitHub", "full")).toBe("github.com/user");
  });
});

describe("ensureAbsoluteUrl", () => {
  it("prepends https:// when missing protocol", () => {
    expect(ensureAbsoluteUrl("linkedin.com/in/john")).toBe("https://linkedin.com/in/john");
  });

  it("preserves existing http or https protocol", () => {
    expect(ensureAbsoluteUrl("http://example.com")).toBe("http://example.com");
    expect(ensureAbsoluteUrl("https://example.com")).toBe("https://example.com");
  });
});
