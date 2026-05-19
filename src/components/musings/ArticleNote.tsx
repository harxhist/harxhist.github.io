import { ReactNode } from "react";
import NotesCursor from "./NotesCursor";

type ArticleNoteProps = {
  title: string;
  children?: ReactNode;
  pdfHref?: string;
  pdfLabel?: string;
  showCursor?: boolean;
};

export default function ArticleNote({
  title,
  children,
  pdfHref,
  pdfLabel = "Open full piece (PDF)",
  showCursor = true,
}: ArticleNoteProps) {
  return (
    <article className="notes-shell notes-article notes-canvas">
      <div className="notes-canvas-scroll notes-article-scroll">
      <header className="notes-article-header">
        <h1 className="notes-article-title">{title}</h1>
      </header>
      <div className="notes-article-body">
        {children}
        {pdfHref ? (
          <p className="notes-article-pdf">
            <a href={pdfHref} target="_blank" rel="noopener noreferrer">
              {pdfLabel}
            </a>
          </p>
        ) : null}
        {showCursor ? (
          <p className="notes-article-cursor-line">
            <NotesCursor />
          </p>
        ) : null}
      </div>
      </div>
    </article>
  );
}
