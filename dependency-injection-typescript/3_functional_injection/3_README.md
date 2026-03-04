# 3_functional_injection - DI cu functii (stil Node.js)

Acest exemplu arata exact stilul de productie:
- functia de business primeste `deps` din exterior
- `deps` contine obiecte: `{ db, logger, context }`
- functia nu stie ce implementare concreta e in spate

## Ideea principala

Asta este Dependency Injection chiar daca nu folosesti clase.
Se numeste frecvent:
- function parameter injection
- functional DI

## Fisiere
- `3_dependency_injection_functional.ts` - varianta TypeScript cu comentarii
- `3_dist/3_dependency_injection_functional.js` - varianta JavaScript rulabila direct

## Rulare rapida JS (fara instalari)

```bash
cd "/Users/xan/Documents/Github repos/interview/dependency-injection-typescript/3_functional_injection"
node "./3_dist/3_dependency_injection_functional.js"
```

## Rulare TypeScript (.ts)

```bash
cd "/Users/xan/Documents/Github repos/interview/dependency-injection-typescript/3_functional_injection"
npx -y -p typescript tsc "./3_dependency_injection_functional.ts" --target ES2020 --module commonjs --outDir "./3_dist"
node "./3_dist/3_dependency_injection_functional.js"
```

## Pitfalls (pe scurt)

- Evita obiecte `deps` fara tipuri stricte; apar erori greu de prins.
- Nu injecta context mutabil partajat in multe locuri fara control.
- Daca functia primeste prea multe deps, sparge logica in unitati mai mici.

## Output asteptat (exemplu)

```text
Porneste exemplul 3_functional_injection...
[INFO] [req-prod-1] Caut user u1
[INFO] [req-prod-1] User u1 gasit: ana@example.com
User profil (prod): { id: 'u1', email: 'ana@example.com' }
---
User profil (test): { id: 'u-test', email: 'test@example.com' }
Logs fake: [
  '[INFO] [req-test-1] Caut user orice-id',
  '[INFO] [req-test-1] User orice-id gasit: test@example.com'
]
```
