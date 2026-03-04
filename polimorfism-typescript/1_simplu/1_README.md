# 1_simplu - Polimorfism in TypeScript

Polimorfism inseamna ca mai multe clase respecta acelasi contract,
dar fiecare are implementare proprie.

In acest exemplu:
- contractul este `calculeazaArie()`
- clasele `Cerc`, `Dreptunghi`, `Triunghi` il implementeaza diferit
- consumatorul (`afiseazaArie`) lucreaza doar cu tipul abstract

## Fisiere
- `1_polimorfism.ts` - varianta TypeScript cu comentarii
- `1_dist/1_polimorfism.js` - varianta JavaScript rulabila direct

## Rulare rapida JS (fara instalari)

```bash
cd "/Users/xan/Documents/Github repos/interview/polimorfism-typescript/1_simplu"
node "./1_dist/1_polimorfism.js"
```

## Rulare TypeScript (.ts)

```bash
cd "/Users/xan/Documents/Github repos/interview/polimorfism-typescript/1_simplu"
npx -y -p typescript tsc "./1_polimorfism.ts" --target ES2020 --module commonjs --outDir "./1_dist"
node "./1_dist/1_polimorfism.js"
```

## Pitfalls (pe scurt)

- Evita `if/switch` pe tip concret in consumator; rupe polimorfismul.
- Pastreaza acelasi sens al metodei in toate implementararile.
- Daca subclasele necesita tratament special permanent, contractul e gresit.

## Output asteptat (aprox)

```text
Porneste exemplul 1_simplu polimorfism...
Sunt o forma geometrica.
Arie: 28.27
---
Sunt o forma geometrica.
Arie: 24.00
---
Sunt o forma geometrica.
Arie: 25.00
---
```
