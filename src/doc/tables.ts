// Tabelle: larghezza delle colonne. Il Markdown (GFM) non la conosce: la si scrive in un commento
// subito dopo la tabella, <!-- widths:30,45,25 --> (percentuali), che gli altri lettori ignorano.

export const WIDTHS_COMMENT = /^widths:\s*([\d.\s,]+)$/;

/** Larghezze in percentuale (somma 100) se la tabella ne ha di valide per `cols` colonne, altrimenti null. */
export function columnWidths(attrs: Record<string, unknown> | undefined, cols: number): number[] | null {
  const w = attrs?.widths;
  if (!Array.isArray(w) || w.length !== cols || !cols) return null;
  if (!w.every((x) => typeof x === 'number' && Number.isFinite(x) && x > 0)) return null;
  const sum = (w as number[]).reduce((a, b) => a + b, 0);
  return (w as number[]).map((x) => Math.round((x / sum) * 1000) / 10);
}

/** Commento da scrivere dopo la tabella ('' se non ha larghezze). */
export function widthsComment(attrs: Record<string, unknown> | undefined, cols: number): string {
  const w = columnWidths(attrs, cols);
  return w ? `<!-- widths:${w.join(',')} -->` : '';
}

export function parseWidths(body: string): number[] | null {
  const m = WIDTHS_COMMENT.exec(body.trim());
  if (!m) return null;
  const w = m[1].split(',').map((x) => Number(x.trim()));
  return w.length && w.every((x) => Number.isFinite(x) && x > 0) ? w : null;
}
