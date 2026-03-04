# 1_simplu - Mostenire de baza in TypeScript

Acest nivel arata conceptul minim de mostenire:
- o clasa parinte (`Animal`)
- o clasa copil (`Caine`) care foloseste `extends`
- un exemplu de `override`

## Fisiere
- `1_clase.ts` - versiune separata a claselor (pentru studiu)
- `1_rulare.ts` - varianta TypeScript self-contained (pentru studiu)
- `1_dist/1_rulare.js` - varianta rulabila direct cu Node (fara instalari)
- `1_tsconfig.json` - configuratie de compilare

## Rulare rapida JS (fara instalari)

Ruleaza exact din folderul de exercitiu:

```bash
cd "/Users/xan/Documents/Github repos/interview/mostenire-typescript/1_simplu"
node "./1_dist/1_rulare.js"
```

## Rulare TypeScript (.ts)

```bash
cd "/Users/xan/Documents/Github repos/interview/mostenire-typescript/1_simplu"
npx -y -p typescript tsc -p "./1_tsconfig.json"
node "./1_dist/1_rulare.js"
```

## Pitfalls (pe scurt)

- Foloseste mostenirea doar pentru relatii reale `is-a`; altfel prefera compozitie.
- Evita clase parinte foarte mari; apar rapid dependinte greu de mentinut.
- Cand faci `override`, pastreaza semantica metodei parinte (nu schimba contractul).

## Output asteptat

```text
Porneste exemplul 1_simplu...
Animal generic mananca.
---
Rex mananca boabe pentru caini.
Rex latra: Ham! Ham!
```
