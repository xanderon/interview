# 1_simplu - Encapsulation in TypeScript

Encapsulation inseamna ca datele interne sunt protejate,
iar modificarile trec prin metode controlate.

## Fisiere
- `1_encapsulare.ts` - varianta TypeScript cu comentarii
- `1_dist/1_encapsulare.js` - varianta JavaScript rulabila direct

## Rulare rapida JS (fara instalari)

```bash
cd "/Users/xan/Documents/Github repos/interview/encapsulare-typescript/1_simplu"
node "./1_dist/1_encapsulare.js"
```

## Rulare TypeScript (.ts)

```bash
cd "/Users/xan/Documents/Github repos/interview/encapsulare-typescript/1_simplu"
npx -y -p typescript tsc "./1_encapsulare.ts" --target ES2020 --module commonjs --outDir "./1_dist"
node "./1_dist/1_encapsulare.js"
```

## Pitfalls (pe scurt)

- Daca expui prea multe campuri publice, pierzi controlul asupra starii interne.
- Getter/setter fara reguli reale adauga zgomot fara beneficiu.
- Valideaza invariants in acelasi loc (constructor/metode), nu imprastiat.

## Output asteptat

```text
Porneste exemplul 1_simplu encapsulare...
Sold initial: 1000 RON
Dupa depunere: 1250 RON
Dupa retragere: 850 RON
```
