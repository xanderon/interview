# 1_simplu - Immutability in TypeScript

Immutability inseamna ca obiectele nu se modifica dupa creare.
Cand ai nevoie de schimbari, creezi un obiect nou.

## Fisiere
- `1_immutability.ts` - varianta TypeScript cu comentarii
- `1_dist/1_immutability.js` - varianta JavaScript rulabila direct

## Rulare rapida JS (fara instalari)

```bash
cd "/Users/xan/Documents/Github repos/interview/imutabilitate-typescript/1_simplu"
node "./1_dist/1_immutability.js"
```

## Rulare TypeScript (.ts)

```bash
cd "/Users/xan/Documents/Github repos/interview/imutabilitate-typescript/1_simplu"
npx -y -p typescript tsc "./1_immutability.ts" --target ES2020 --module commonjs --outDir "./1_dist"
node "./1_dist/1_immutability.js"
```

## Pitfalls (pe scurt)

- `Object.freeze` este shallow; obiectele imbricate pot ramane mutabile.
- Copierea excesiva a obiectelor mari poate afecta performanta.
- Fii consecvent: daca un flux e imutabil, evita mutatii locale ascunse.

## Output asteptat (exemplu)

```text
Porneste exemplul 1_simplu immutability...
Produs initial: { id: 'p1', nume: 'Laptop', pret: 5000 }
Produs nou (discount): { id: 'p1', nume: 'Laptop', pret: 4500 }
Sunt acelasi obiect? false
```
