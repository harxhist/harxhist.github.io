import NotesCursor from "./NotesCursor";

type PoetryNoteProps = {
  title?: string;
  lang?: string;
  children: string;
};

/** Split raw poem text into stanzas (blank line) and lines. */
export function parsePoetryText(raw: string): string[][] {
  return raw
    .trim()
    .split(/\n\s*\n/)
    .map((stanza) =>
      stanza
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    )
    .filter((stanza) => stanza.length > 0);
}

export default function PoetryNote({ title, lang, children }: PoetryNoteProps) {
  const stanzas = parsePoetryText(children);
  const lastStanzaIndex = stanzas.length - 1;
  const lastLineIndex =
    lastStanzaIndex >= 0 ? (stanzas[lastStanzaIndex]?.length ?? 0) - 1 : -1;

  return (
    <article className="notes-shell notes-poetry notes-canvas" lang={lang}>
      <div className="notes-canvas-scroll notes-poetry-scroll">
        <div className="notes-poetry-center">
          {title ? <h1 className="notes-poetry-title">{title}</h1> : null}
          <div className="notes-poetry-body">
            {stanzas.map((lines, stanzaIndex) => (
              <div key={stanzaIndex} className="notes-poetry-stanza">
                {lines.map((line, lineIndex) => {
                  const isLastLine =
                    stanzaIndex === lastStanzaIndex && lineIndex === lastLineIndex;

                  return (
                    <p key={lineIndex} className="notes-poetry-line">
                      {line}
                      {isLastLine ? (
                        <>
                          {" "}
                          <NotesCursor />
                        </>
                      ) : null}
                    </p>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
