export const COVER_OVERRIDES_KEY = "digitalquintino-cover-overrides";

export type CoverOverrides = Record<string, string>;

export function coverKey(title: string) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function loadCoverOverrides(): CoverOverrides {
  if (typeof window === "undefined") return {};
  try {
    const value = window.localStorage.getItem(COVER_OVERRIDES_KEY);
    return value ? (JSON.parse(value) as CoverOverrides) : {};
  } catch {
    return {};
  }
}

export function saveCoverOverrides(overrides: CoverOverrides) {
  window.localStorage.setItem(COVER_OVERRIDES_KEY, JSON.stringify(overrides));
  window.dispatchEvent(new CustomEvent("digitalquintino:cover-updated"));
}

export function getCoverSource(title: string, defaultSource: string, overrides: CoverOverrides) {
  return overrides[coverKey(title)] || defaultSource;
}
