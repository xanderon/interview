# 1_simplu - Static Methods vs Instance Methods

## Ideea de baza

- **Static method**: apartine clasei.
  - Se apeleaza asa: `Utilizator.getTotalUtilizatori()`
  - Utila pentru utilitare, contoare globale, factory helpers.

- **Instance method**: apartine obiectului.
  - Se apeleaza asa: `u1.prezintaTe()`
  - Foloseste starea obiectului (`this`).

## Fisiere

- `1_static_vs_instance.ts` - varianta TypeScript cu comentarii
- `1_dist/1_static_vs_instance.js` - varianta JavaScript rulabila direct

## Rulare rapida JS (fara instalari)

```bash
cd "/Users/xan/Documents/Github repos/interview/metode-statice-typescript/1_simplu"
node "./1_dist/1_static_vs_instance.js"
```

## Rulare TypeScript (.ts)

```bash
cd "/Users/xan/Documents/Github repos/interview/metode-statice-typescript/1_simplu"
npx -y -p typescript tsc "./1_static_vs_instance.ts" --target ES2020 --module commonjs --outDir "./1_dist"
node "./1_dist/1_static_vs_instance.js"
```

## Pitfalls (pe scurt)

- Nu pune logica de business dependenta de stare in metode statice.
- Evita state global ascuns in campuri statice (greu de testat).
- Daca metoda foloseste constant `this` de instanta, nu ar trebui sa fie statica.

## Output asteptat

```text
Porneste exemplul 1_simplu static vs instance...
Nume valid pentru 'A'? false
Nume valid pentru 'Ana'? true
Salut, eu sunt Ana.
Salut, eu sunt Mihai.
Total utilizatori creati: 2
```
