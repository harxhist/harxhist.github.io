/** Encode path segments so PDFs with spaces open correctly. Safe for client components. */
export function encodeMusingsPdfPath(pdfPath: string): string {
  return pdfPath
    .split("/")
    .map((segment, index) => (index === 0 ? segment : encodeURIComponent(segment)))
    .join("/");
}
