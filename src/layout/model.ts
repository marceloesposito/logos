// Impostazioni del documento: stile di citazione e impaginazione (stile InDesign semplificato).
// Salvate in .alexandria/doc-settings/<doc>.json e usate da editor, anteprima ed export.
import { CITATION_LOCALE, docTexts, type WritingLang } from '../i18n/writing';
import { type ObjectData, type HeaderSettings, emptyObject, defaultHeader, normalizeObject, normalizeHeader } from '../types/model';

export type Paper = 'a4' | 'a5' | 'letter' | 'b5' | 'custom';
/** master page: 'title', 'body', 'appendix' predefinite, piu' quelle create dall'utente */
export type MasterId = string;
export const BUILTIN_MASTERS = ['title', 'body', 'appendix'] as const;
export type PageNumberPos = 'none' | 'bottom-center' | 'bottom-outer' | 'top-outer' | 'top-center';
export type ParaStyleId = 'body' | 'h1' | 'h2' | 'h3' | 'quote' | 'caption' | 'footnote';

export interface MasterPage {
  /** nome scelto dall'utente (le predefinite usano la traduzione) */
  name?: string;
  header: string; // testo con variabili {title} {author} {chapter} {page} {pages} {date}
  footer: string;
  pageNumbers: PageNumberPos;
  numbering: '1' | 'i' | 'I' | 'a';
  /** la prima pagina della sezione senza intestazione */
  firstPagePlain: boolean;
}

/** Carattere di uno stile: quello del documento o una delle tre famiglie incluse nell'app. */
export type StyleFont = 'inherit' | 'serif' | 'sans' | 'mono';
export const STYLE_FONTS: StyleFont[] = ['inherit', 'serif', 'sans', 'mono'];

/** Famiglie nell'editor (variabili dei token: Libertinus Serif, Inter, JetBrains Mono). */
export const EDITOR_FONT: Record<Exclude<StyleFont, 'inherit'>, string> = {
  serif: 'var(--font-text)',
  sans: 'var(--font-ui)',
  mono: 'var(--font-mono)',
};

/** Famiglie per il PDF (font inclusi in Typst). */
export const TYPST_FONT: Record<Exclude<StyleFont, 'inherit'>, string> = {
  serif: '("Libertinus Serif", "New Computer Modern")',
  sans: '("Inter", "New Computer Modern Sans", "DejaVu Sans")',
  mono: '("JetBrains Mono", "DejaVu Sans Mono")',
};

/** Famiglie per HTML e Word (con i ripieghi di sistema). */
export const WEB_FONT: Record<Exclude<StyleFont, 'inherit'>, string> = {
  serif: '"Libertinus Serif", Georgia, serif',
  sans: 'Inter, "Helvetica Neue", Arial, sans-serif',
  mono: '"JetBrains Mono", Menlo, Consolas, monospace',
};
export const WORD_FONT: Record<Exclude<StyleFont, 'inherit'>, string> = { serif: 'Libertinus Serif', sans: 'Calibri', mono: 'Consolas' };

/**
 * Caratteri del testo tra cui scegliere (Layout ed export): quelli inclusi in Alexandria e i classici
 * dell'HTML con i loro ripieghi. Per ognuno la pila per il web (editor, HTML), per Typst (PDF: se il
 * carattere non c'e' sul computer si passa al successivo) e il nome per Word.
 */
export interface TextFont {
  id: string;
  label: string;
  group: 'alexandria' | 'web' | 'generic';
  web: string;
  typst: string;
  word: string;
}

const SERIF_TYPST = '"Libertinus Serif", "New Computer Modern"';
const SANS_TYPST = '"Inter", "New Computer Modern Sans", "DejaVu Sans"';
const MONO_TYPST = '"JetBrains Mono", "DejaVu Sans Mono"';

export const TEXT_FONTS: TextFont[] = [
  { id: 'libertinus', label: 'Libertinus Serif', group: 'alexandria', web: '"Libertinus Serif", Georgia, serif', typst: `(${SERIF_TYPST})`, word: 'Libertinus Serif' },
  { id: 'inter', label: 'Inter', group: 'alexandria', web: 'Inter, "Helvetica Neue", Arial, sans-serif', typst: `(${SANS_TYPST})`, word: 'Inter' },
  { id: 'jetbrains', label: 'JetBrains Mono', group: 'alexandria', web: '"JetBrains Mono", Menlo, Consolas, monospace', typst: `(${MONO_TYPST})`, word: 'JetBrains Mono' },
  { id: 'georgia', label: 'Georgia', group: 'web', web: 'Georgia, serif', typst: `("Georgia", ${SERIF_TYPST})`, word: 'Georgia' },
  { id: 'times', label: 'Times New Roman', group: 'web', web: '"Times New Roman", Times, serif', typst: `("Times New Roman", "Times", ${SERIF_TYPST})`, word: 'Times New Roman' },
  { id: 'palatino', label: 'Palatino', group: 'web', web: 'Palatino, "Palatino Linotype", "Book Antiqua", serif', typst: `("Palatino", "Palatino Linotype", "Book Antiqua", ${SERIF_TYPST})`, word: 'Palatino Linotype' },
  { id: 'helvetica', label: 'Helvetica', group: 'web', web: '"Helvetica Neue", Helvetica, Arial, sans-serif', typst: `("Helvetica Neue", "Helvetica", "Arial", ${SANS_TYPST})`, word: 'Helvetica' },
  { id: 'arial', label: 'Arial', group: 'web', web: 'Arial, Helvetica, sans-serif', typst: `("Arial", "Helvetica", ${SANS_TYPST})`, word: 'Arial' },
  { id: 'verdana', label: 'Verdana', group: 'web', web: 'Verdana, Geneva, sans-serif', typst: `("Verdana", "Geneva", ${SANS_TYPST})`, word: 'Verdana' },
  { id: 'courier', label: 'Courier New', group: 'web', web: '"Courier New", Courier, monospace', typst: `("Courier New", "Courier", ${MONO_TYPST})`, word: 'Courier New' },
  { id: 'serif', label: 'serif', group: 'generic', web: 'serif', typst: `("Times New Roman", "Times", ${SERIF_TYPST})`, word: 'Times New Roman' },
  { id: 'sans-serif', label: 'sans-serif', group: 'generic', web: 'sans-serif', typst: `("Helvetica", "Arial", ${SANS_TYPST})`, word: 'Arial' },
  { id: 'monospace', label: 'monospace', group: 'generic', web: 'monospace', typst: `("Courier New", "Courier", ${MONO_TYPST})`, word: 'Courier New' },
];

export function textFont(id: string | null | undefined): TextFont | null {
  return TEXT_FONTS.find((f) => f.id === id) ?? null;
}

/** Carattere scelto per il documento: quello in `fontFamily` o, se manca, quello di `font` (serif/sans). */
export function docFontId(L: Pick<LayoutSettings, 'font' | 'fontFamily'>): string {
  return textFont(L.fontFamily)?.id ?? (L.font === 'sans' ? 'inter' : 'libertinus');
}

/** Pila di caratteri del corpo del testo per un formato d'uscita. */
export function bodyFontStack(L: LayoutSettings, target: 'web' | 'typst' | 'word'): string {
  const body = L.styles.body;
  if (body.font && body.font !== 'inherit') return (target === 'web' ? WEB_FONT : target === 'typst' ? TYPST_FONT : WORD_FONT)[body.font];
  return textFont(docFontId(L))![target];
}

/** Carattere effettivo di uno stile: il suo, o quello del documento. */
export function styleFont(s: ParaStyle, layout: { font: 'serif' | 'sans' }): Exclude<StyleFont, 'inherit'> {
  return s.font && s.font !== 'inherit' ? s.font : layout.font;
}

export interface ParaStyle {
  /** carattere: quello del documento ('inherit') o serif, sans, monospace */
  font: StyleFont;
  sizePt: number;
  weight: 'regular' | 'bold';
  italic: boolean;
  align: 'left' | 'center' | 'right' | 'justify' | 'inherit';
  spaceBeforePt: number;
  spaceAfterPt: number;
  indentFirstMm: number;
  leading: number | null; // null = quello del documento
  smallCaps: boolean;
}

export interface LayoutSettings {
  paper: Paper;
  widthMm: number;
  heightMm: number;
  marginTopMm: number;
  marginBottomMm: number;
  marginInnerMm: number;
  marginOuterMm: number;
  facingPages: boolean;
  columns: 1 | 2 | 3;
  columnGapMm: number;
  font: 'serif' | 'sans';
  /** carattere scelto fra TEXT_FONTS (id); null = quello di `font` */
  fontFamily: string | null;
  fontSizePt: number;
  leading: number; // interlinea (multiplo del corpo)
  justify: boolean;
  hyphenate: boolean;
  /** righe minime prima/dopo un salto di pagina (vedove e orfane) */
  widowsOrphans: boolean;
  baselineGrid: boolean;
  lineNumbersInPdf: boolean;
  /** indice dei contenuti in testa all'export (se la pergamena non ne ha gia' uno) */
  tocInExport: boolean;
  headingNumbers: boolean;
  masters: Record<MasterId, MasterPage>;
  styles: Record<ParaStyleId, ParaStyle>;
}

export interface DocSettings {
  version: 1;
  title: string;
  author: string;
  date: string;
  citationStyle: string; // id CSL
  citationLocale: string; // 'it-IT' | 'en-US' ...
  bibliographyTitle: string;
  layout: LayoutSettings;
  /** tipo e proprietà della pergamena (il testo .md non cambia) */
  object: ObjectData;
  /** header con tipo e proprietà: dove compare e come */
  header: HeaderSettings;
}

export const PAPERS: Record<Exclude<Paper, 'custom'>, [number, number]> = {
  a4: [210, 297],
  a5: [148, 210],
  letter: [215.9, 279.4],
  b5: [176, 250],
};

const style = (p: Partial<ParaStyle>): ParaStyle => ({
  font: 'inherit',
  sizePt: 12,
  weight: 'regular',
  italic: false,
  align: 'inherit',
  spaceBeforePt: 0,
  spaceAfterPt: 0,
  indentFirstMm: 0,
  leading: null,
  smallCaps: false,
  ...p,
});

export function defaultLayout(): LayoutSettings {
  return {
    paper: 'a4',
    widthMm: 210,
    heightMm: 297,
    marginTopMm: 25,
    marginBottomMm: 25,
    marginInnerMm: 25,
    marginOuterMm: 25,
    facingPages: false,
    columns: 1,
    columnGapMm: 8,
    font: 'serif',
    fontFamily: null,
    fontSizePt: 12,
    leading: 1.5,
    justify: true,
    hyphenate: true,
    widowsOrphans: true,
    baselineGrid: false,
    lineNumbersInPdf: false,
    tocInExport: false,
    headingNumbers: false,
    masters: {
      title: { header: '', footer: '', pageNumbers: 'none', numbering: '1', firstPagePlain: true },
      body: { header: '{title}', footer: '', pageNumbers: 'bottom-center', numbering: '1', firstPagePlain: true },
      appendix: { header: '{title}', footer: '', pageNumbers: 'bottom-center', numbering: '1', firstPagePlain: false },
    },
    styles: {
      body: style({ sizePt: 12, spaceAfterPt: 0, indentFirstMm: 0 }),
      h1: style({ sizePt: 20, weight: 'bold', spaceBeforePt: 18, spaceAfterPt: 10 }),
      h2: style({ sizePt: 15, weight: 'bold', spaceBeforePt: 14, spaceAfterPt: 8 }),
      h3: style({ sizePt: 13, weight: 'bold', italic: false, spaceBeforePt: 12, spaceAfterPt: 6 }),
      quote: style({ sizePt: 11, italic: false, spaceBeforePt: 6, spaceAfterPt: 6, indentFirstMm: 0 }),
      caption: style({ sizePt: 10, italic: true, align: 'center', spaceBeforePt: 4, spaceAfterPt: 10 }),
      footnote: style({ sizePt: 9.5 }),
    },
  };
}

export function defaultDocSettings(lang: WritingLang = 'it'): DocSettings {
  return {
    version: 1,
    title: '',
    author: '',
    date: '',
    citationStyle: 'apa',
    citationLocale: CITATION_LOCALE[lang],
    bibliographyTitle: docTexts(lang).bibliography,
    layout: defaultLayout(),
    object: emptyObject(),
    header: defaultHeader(),
  };
}

/**
 * Cambio della lingua di scrittura del Compendium: lingua delle citazioni e titolo della
 * bibliografia seguono la nuova lingua solo se erano ancora i predefiniti della vecchia
 * (una scelta fatta a mano resta).
 */
export function retargetLanguage(s: DocSettings, from: WritingLang, to: WritingLang): DocSettings {
  const patch: Partial<DocSettings> = {};
  if (s.citationLocale === CITATION_LOCALE[from]) patch.citationLocale = CITATION_LOCALE[to];
  if (s.bibliographyTitle === docTexts(from).bibliography) patch.bibliographyTitle = docTexts(to).bibliography;
  return { ...s, ...patch };
}

/** Unisce impostazioni salvate (anche di versioni vecchie) con i valori predefiniti. */
export function normalizeDocSettings(raw: unknown, lang: WritingLang = 'it'): DocSettings {
  const d = defaultDocSettings(lang);
  if (!raw || typeof raw !== 'object') return d;
  const r = raw as Partial<DocSettings>;
  const l = (r.layout ?? {}) as Partial<LayoutSettings>;
  // le predefinite completano quelle salvate; le master create dall'utente restano
  const masters: Record<MasterId, MasterPage> = { ...d.layout.masters };
  for (const [k, m] of Object.entries(l.masters ?? {})) masters[k] = { ...(masters[k] ?? masters.body), ...m };
  const styles = { ...d.layout.styles };
  for (const k of Object.keys(styles) as ParaStyleId[]) styles[k] = { ...styles[k], ...(l.styles?.[k] ?? {}) };
  return { ...d, ...r, version: 1, layout: { ...d.layout, ...l, masters, styles }, object: normalizeObject(r.object), header: normalizeHeader(r.header) };
}

/** Nuova master page copiata da un'altra (di solito il corpo); restituisce anche il suo id. */
export function addMaster(l: LayoutSettings, name: string, from: MasterId = 'body'): { layout: LayoutSettings; id: MasterId } {
  const base = l.masters[from] ?? l.masters.body;
  let n = 1;
  while (l.masters[`m${n}`]) n++;
  const id = `m${n}`;
  return { layout: { ...l, masters: { ...l.masters, [id]: { ...base, name } } }, id };
}

export function renameMaster(l: LayoutSettings, id: MasterId, name: string): LayoutSettings {
  if (!l.masters[id]) return l;
  return { ...l, masters: { ...l.masters, [id]: { ...l.masters[id], name } } };
}

/** Il corpo non si elimina: e' la master di ripiego per le sezioni rimaste senza. */
export function removeMaster(l: LayoutSettings, id: MasterId): LayoutSettings {
  if (id === 'body' || !l.masters[id]) return l;
  const masters = { ...l.masters };
  delete masters[id];
  return { ...l, masters };
}

/** Master usata davvero: quella chiesta, o il corpo se non esiste piu'. */
export function resolveMaster(l: LayoutSettings, id: MasterId | undefined): MasterPage {
  return (id && l.masters[id]) || l.masters.body;
}

export function withPaper(l: LayoutSettings, paper: Paper): LayoutSettings {
  if (paper === 'custom') return { ...l, paper };
  const [w, h] = PAPERS[paper];
  return { ...l, paper, widthMm: w, heightMm: h };
}

export interface PageMetrics {
  textWidthMm: number;
  textHeightMm: number;
  padXmm: number;
  /** righe di corpo per pagina e parole per pagina stimate */
  linesPerPage: number;
  wordsPerPage: number;
}

export function pageMetrics(l: LayoutSettings): PageMetrics {
  const textWidthMm = Math.max(40, l.widthMm - l.marginInnerMm - l.marginOuterMm);
  const textHeightMm = Math.max(40, l.heightMm - l.marginTopMm - l.marginBottomMm);
  const lineMm = (l.fontSizePt * l.leading * 25.4) / 72;
  const linesPerPage = Math.floor(textHeightMm / lineMm);
  // circa 0.5 em per carattere medio, 6 caratteri per parola con lo spazio
  const charsPerLine = (textWidthMm / ((l.fontSizePt * 25.4) / 72 / 2)) * l.columns * 0.98;
  const wordsPerPage = Math.max(50, Math.round((linesPerPage * charsPerLine) / 6.1));
  return {
    textWidthMm: l.columns > 1 ? textWidthMm : textWidthMm,
    textHeightMm,
    padXmm: Math.max(18, (l.marginInnerMm + l.marginOuterMm) / 2),
    linesPerPage,
    wordsPerPage,
  };
}
