# 1_simplu - Dependency Injection in TypeScript

Dependency Injection inseamna ca o clasa primeste dependintele din exterior,
in loc sa le creeze intern cu `new`.

## Ideea principala

- Fara DI: `ServiciuComenzi` ar face intern `new EmailNotifier()`.
- Cu DI: `ServiciuComenzi` primeste `Notifier` in constructor.
- Beneficiu: poti schimba implementarea (Email/SMS/Fake) fara sa modifici clasa.
- In DI poti injecta:
  - instanta de clasa (`new EmailNotifier()`)
  - obiect literal (ex: `{ trimite() { ... } }`)
  - fake/mock pentru teste

## Fisiere
- `1_dependency_injection.ts` - varianta TypeScript cu comentarii
- `1_dist/1_dependency_injection.js` - varianta JavaScript rulabila direct

## Rulare rapida JS (fara instalari)

```bash
cd "/Users/xan/Documents/Github repos/interview/dependency-injection-typescript/1_simplu"
node "./1_dist/1_dependency_injection.js"
```

## Rulare TypeScript (.ts)

```bash
cd "/Users/xan/Documents/Github repos/interview/dependency-injection-typescript/1_simplu"
npx -y -p typescript tsc "./1_dependency_injection.ts" --target ES2020 --module commonjs --outDir "./1_dist"
node "./1_dist/1_dependency_injection.js"
```

## Pitfalls (pe scurt)

- Nu amesteca DI cu service locator global; ascunde dependinte reale.
- Daca injectezi prea multe dependinte, clasa/functia are prea multe roluri.
- Contractele prea vagi (`any`) reduc beneficiile DI in TypeScript.

## Output asteptat (exemplu)

```text
Porneste exemplul 1_simplu dependency injection...
Comanda CMD-100 a fost plasata.
[Email] Comanda CMD-100 este confirmata.
---
Comanda CMD-101 a fost plasata.
[SMS] Comanda CMD-101 este confirmata.
---
Comanda CMD-OBJ a fost plasata.
[ObjectNotifier] Comanda CMD-OBJ este confirmata.
---
Comanda CMD-TEST a fost plasata.
[FAKE] mesaj capturat: Comanda CMD-TEST este confirmata.
Mesaje in fake: [ 'Comanda CMD-TEST este confirmata.' ]
```
