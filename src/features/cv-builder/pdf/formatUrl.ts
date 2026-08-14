import type { LinkStyle } from "@/features/cv-builder/types";

/**
 * Formats a raw URL into a clean, human-readable display string for PDF text.
 * Strips protocols (http/https), www, and trailing slashes.
 * e.g., "https://www.linkedin.com/in/rupesh-thakur-aa98702a7/" -> "linkedin.com/in/rupesh-thakur-aa98702a7"
 */
export function formatDisplayUrl(url: string, label?: string): string {
  if (!url) return "";
  
  const clean = url
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/$/, "");

  if (!label || !label.trim()) return clean;

  const cleanLabel = label.trim();
  const lowerClean = clean.toLowerCase();
  const lowerLabel = cleanLabel.toLowerCase();

  // If the label is part of the domain/path (e.g., label "LinkedIn" in "linkedin.com/in/..."),
  // display just the clean URL.
  if (lowerClean.includes(lowerLabel)) {
    return clean;
  }

  // Otherwise, prefix with the custom label (e.g., "Portfolio: mywebsite.com")
  return `${cleanLabel}: ${clean}`;
}

/**
 * Formats a link display string based on user preference ("compact" or "full").
 * - "compact": hyperlinked concise word (e.g. "LinkedIn", "GitHub", "TryHackMe")
 * - "full": domain path or label: domain path (e.g. "linkedin.com/in/rupesh")
 */
export function formatLinkText(url: string, label?: string, style: LinkStyle = "compact"): string {
  if (!url) return "";

  if (style === "compact") {
    if (label && label.trim()) return label.trim();
    // Fallback: extract domain name if label is omitted
    const clean = url.trim().replace(/^https?:\/\//i, "").replace(/^www\./i, "");
    const domainMatch = clean.split("/")[0];
    const mainName = domainMatch.split(".")[0];
    return mainName ? mainName.charAt(0).toUpperCase() + mainName.slice(1) : "Link";
  }

  return formatDisplayUrl(url, label);
}

/**
 * Ensures a URL string has an explicit http/https protocol for PDF href/src attributes.
 */
export function ensureAbsoluteUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "#";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}
