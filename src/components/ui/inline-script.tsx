"use client";

/**
 * An inline <script> that runs once, during HTML parsing on a full page load.
 *
 * On client-side navigations React renders it again (for example when the
 * root layout's `[locale]` changes), but browsers never run scripts that React
 * inserts, and React warns about them in development. So on the client it is
 * rendered as inert `text/plain`; suppressHydrationWarning covers the type
 * mismatch. Next docs: "Preventing flash before hydration".
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
