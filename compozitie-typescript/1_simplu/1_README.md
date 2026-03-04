# 1_simplu - Compozitie in TypeScript

Compozitia inseamna ca un obiect foloseste alte obiecte ca parti interne.
- `Masina` are un `Motor`
- `Masina` are un `SistemAudio`

## Compozitie vs Dependency Injection

- In acest exemplu ai **compozitie** pentru ca `Masina` are (`has-a`) `Motor` si `SistemAudio`.
- Ai si **constructor injection (DI)** pentru ca aceste obiecte sunt primite din exterior:
  - `new Masina(motor, audio)`
- Pe scurt:
  - compozitie = relatia dintre obiecte
  - DI = modul in care oferi dependintele obiectului

## Fisiere
- `1_compozitie.ts` - varianta cu clase, TypeScript, cu comentarii
- `1_compozitie_fara_clase.ts` - varianta functionala (obiecte + functii), TypeScript, cu comentarii
- `1_dist/1_compozitie.js` - varianta JS rulabila direct (cu clase)
- `1_dist/1_compozitie_fara_clase.js` - varianta JS rulabila direct (fara clase)

## Rulare rapida JS (fara instalari)

Varianta cu clase:

```bash
cd "/Users/xan/Documents/Github repos/interview/compozitie-typescript/1_simplu"
node "./1_dist/1_compozitie.js"
```

Varianta fara clase (obiecte in functii):

```bash
cd "/Users/xan/Documents/Github repos/interview/compozitie-typescript/1_simplu"
node "./1_dist/1_compozitie_fara_clase.js"
```

## Rulare TypeScript (.ts)

Varianta cu clase:

```bash
cd "/Users/xan/Documents/Github repos/interview/compozitie-typescript/1_simplu"
npx -y -p typescript tsc "./1_compozitie.ts" --target ES2020 --module commonjs --outDir "./1_dist"
node "./1_dist/1_compozitie.js"
```

Varianta fara clase:

```bash
cd "/Users/xan/Documents/Github repos/interview/compozitie-typescript/1_simplu"
npx -y -p typescript tsc "./1_compozitie_fara_clase.ts" --target ES2020 --module commonjs --outDir "./1_dist"
node "./1_dist/1_compozitie_fara_clase.js"
```

## Pitfalls (pe scurt)

- Nu crea componentele direct in clasa principala daca vrei flexibilitate la testare.
- Evita sa faci componentele prea dependente una de alta; creste coupling-ul.
- Daca injectezi multe dependinte, verifica daca obiectul are prea multe responsabilitati.

## Output asteptat

Cu clase:

```text
Porneste exemplul 1_simplu compozitie...
Motorul a pornit.
Sistemul audio reda muzica.
```

Fara clase:

```text
Porneste exemplul 1_simplu compozitie fara clase...
Motorul a pornit.
Sistemul audio reda muzica.
```
