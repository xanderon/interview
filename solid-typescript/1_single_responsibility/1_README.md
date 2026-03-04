# 1_single_responsibility - SRP (S din SOLID)

SRP = fiecare componenta are un singur motiv de schimbare.

In exemplu:
- `OrderRepository` se ocupa doar de date
- `EmailService` se ocupa doar de notificare
- `OrderService` se ocupa doar de logica de business

## Fisiere
- `1_single_responsibility.ts` - TypeScript cu comentarii
- `1_dist/1_single_responsibility.js` - JavaScript rulabil direct

## Rulare rapida JS (fara instalari)

```bash
cd "/Users/xan/Documents/Github repos/interview/solid-typescript/1_single_responsibility"
node "./1_dist/1_single_responsibility.js"
```

## Rulare TypeScript (.ts)

```bash
cd "/Users/xan/Documents/Github repos/interview/solid-typescript/1_single_responsibility"
npx -y -p typescript tsc "./1_single_responsibility.ts" --target ES2020 --module commonjs --outDir "./1_dist"
node "./1_dist/1_single_responsibility.js"
```

## Pitfalls (pe scurt)

- Daca `OrderService` incepe sa stie SQL + email + reguli business, ai rupt SRP.
- Prea multe clase artificiale pentru cazuri simple poate fi overengineering.
- SRP nu inseamna o clasa cu o singura metoda; inseamna un singur motiv de schimbare.

## Output asteptat

```text
Porneste exemplul 1_single_responsibility...
[Email] Comanda ORD-1 confirmata. Total: 250 RON
```
