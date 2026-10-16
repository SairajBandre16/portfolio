import { Fragment } from "react";

/** Lets long display titles like "Ctrl+Automate" wrap after the plus instead of overflowing. */
export function Breakable({ text }: { text: string }) {
  const parts = text.split("+");
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 && (
        <>
          +<wbr />
        </>
      )}
    </Fragment>
  ));
}
