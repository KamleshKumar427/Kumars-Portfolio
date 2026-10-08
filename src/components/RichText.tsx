import { Fragment } from 'react'

/** Renders copy with **bold** spans, the same emphasis the CV uses. Only the
 *  double-asterisk marker is supported; everything else is plain text. */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong className="rich-strong" key={i}>
            {part}
          </strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  )
}
