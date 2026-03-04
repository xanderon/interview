# 1_simplu - Abstraction in TypeScript

Abstraction inseamna ca definim o interfata/structura comuna,
iar implementarea concreta este in clasele copil.

In acest exemplu:
- `MetodaPlata` este clasa abstracta
- `PlataCuCard` si `PlataCash` implementeaza metoda `plateste`

## Fisiere
- `1_abstractizare.ts` - varianta TypeScript cu comentarii
- `1_dist/1_abstractizare.js` - varianta JavaScript rulabila direct

## Rulare rapida JS (fara instalari)

```bash
cd "/Users/xan/Documents/Github repos/interview/abstractizare-typescript/1_simplu"
node "./1_dist/1_abstractizare.js"
```

## Rulare TypeScript (.ts)

```bash
cd "/Users/xan/Documents/Github repos/interview/abstractizare-typescript/1_simplu"
npx -y -p typescript tsc "./1_abstractizare.ts" --target ES2020 --module commonjs --outDir "./1_dist"
node "./1_dist/1_abstractizare.js"
```

## Pitfalls (pe scurt)

- Nu introduce abstractii prea devreme pentru un singur caz simplu.
- Daca ai multe metode nefolosite in abstractie, contractul e prea larg.
- Pastreaza responsabilitatile concrete in clasele copil, nu in baza.

## Output asteptat

```text
Porneste exemplul 1_simplu abstractizare...
Incepe plata de 150 RON...
Plata cu cardul a fost procesata: 150 RON.
---
Incepe plata de 80 RON...
Plata cash a fost inregistrata: 80 RON.
```
