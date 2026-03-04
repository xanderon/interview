# 1_simplu - Singleton

Singleton garanteaza o singura instanta pentru o clasa.

In exemplu:
- `AppConfig.getInstance()` returneaza mereu aceeasi instanta
- orice modificare prin `configA` e vizibila prin `configB`

## Fisiere
- `1_singleton.ts` - TypeScript cu comentarii
- `1_dist/1_singleton.js` - JavaScript rulabil direct

## Rulare rapida JS (fara instalari)

```bash
cd "/Users/xan/Documents/Github repos/interview/singleton-typescript/1_simplu"
node "./1_dist/1_singleton.js"
```

## Rulare TypeScript (.ts)

```bash
cd "/Users/xan/Documents/Github repos/interview/singleton-typescript/1_simplu"
npx -y -p typescript tsc "./1_singleton.ts" --target ES2020 --module commonjs --outDir "./1_dist"
node "./1_dist/1_singleton.js"
```

## Pitfalls (pe scurt)

- Singleton ascunde state global; testele pot deveni fragile.
- Daca nu resetezi starea intre teste, apar efecte laterale.
- Foloseste singleton doar unde ai nevoie reala de instanta unica.

## Output asteptat

```text
Porneste exemplul 1_singleton...
Aceeasi instanta? true
configB env: prod
```
