import { Fragment } from "react";
import { splitAccent } from "@/lib/rich-text";

/** Renders "[word]" as the accent style. */
export function RichText({ text }: { text: string }) {
  return splitAccent(text).map((part, i) =>
    part.accent ? (
      <span key={i} className="text-primary">
        {part.text}
      </span>
    ) : (
      <Fragment key={i}>{part.text}</Fragment>
    ),
  );
}
