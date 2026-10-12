# logos

Nucleo condiviso di **Alexandria** (app desktop offline per scrivere paper e saggi) e
**Simposium** (la sua sorella collaborativa nel browser, cifrata end-to-end). Contiene solo
**funzioni pure e testate**: niente React, niente store, niente I/O.

| Cartella | Cosa fa |
|---|---|
| `doc/` | Markdown come fonte di verità: `parseMarkdown`, `serializeMarkdown` (`parse(serialize(doc)) == doc`), callout, citazioni `[@key]`, conteggi, revisioni tracciate |
| `citations/` | motore CSL (citeproc), BibTeX/RIS, fonte per esteso nelle note |
| `export/` | HTML, DOCX, LaTeX, testo, sorgente Typst, indice, commenti di Word |
| `comments/` | ancore dei commenti (stile W3C TextQuote) e andata e ritorno con Word |
| `resources/` | modello delle fonti (CSL-JSON, layer, filtri), Tabula, grafo, albero, suggerimenti |
| `layout/`, `types/` | impaginazione e modelli, tipi di oggetto con proprietà |
| `versions/` | confronto e unione a tre vie dei testi |
| `commands/shortcuts.ts` | scorciatoie da tastiera personalizzabili |
| `i18n/writing.ts` | lingue di scrittura e testi che finiscono nel documento |

Gli stili e le locali CSL usati dai test stanno in `public/csl/` (licenza CC BY-SA 3.0 del
progetto CSL).

## Uso

Si usa come dipendenza git, dai sorgenti TypeScript (Vite e Vitest li compilano):

```json
"logos": "github:marceloesposito/logos#v0.1.0"
```

```ts
import { parseMarkdown } from 'logos/doc/parse';
```

Con Vitest va compilato anche da `node_modules`: `test.server.deps.inline: ['logos']`.

## Sviluppo

```sh
npm test          # vitest
npm run typecheck # tsc
```

Commenti e messaggi di commit in italiano, identificatori in inglese. Ogni cambiamento va provato
anche nelle app che lo usano prima di pubblicare un tag nuovo.

## Licenza

MIT. Simposium, che usa questo nucleo, è AGPL-3.0.
