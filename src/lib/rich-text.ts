/** Splits "Build on a [solid] base" into plain and accent parts. */
export function splitAccent(text: string): { text: string; accent: boolean }[] {
  return text
    .split(/(\[[^\]]+\])/g)
    .filter(Boolean)
    .map((part) =>
      part.startsWith("[") ? { text: part.slice(1, -1), accent: true } : { text: part, accent: false },
    );
}

export const stripAccent = (text: string) => text.replace(/\[([^\]]+)\]/g, "$1");
