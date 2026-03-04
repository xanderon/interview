# 2_dependency_inversion - DIP (D din SOLID)

## Principiu

**Dependency Inversion Principle**:
- modulul high-level (logica de business) nu depinde de implementari concrete
- high-level si low-level depind de abstractii

**Nota importanta**:
- DI (Dependency Injection) este tehnica prin care pasezi dependinta din exterior.
- DIP este regula de arhitectura care spune ca depinzi de abstractii.
- De obicei le folosesti impreuna.

In exemplu:
- `CheckoutService` = high-level
- `StripeGateway` / `PaypalGateway` = low-level concrete
- `PaymentGateway` = abstractia comuna

`CheckoutService` depinde de `PaymentGateway`, nu de Stripe sau PayPal direct.

## De ce e important

- poti schimba provider-ul de plati fara sa modifici `CheckoutService`
- testarea e simpla (injectezi `FakeGateway`)
- cod mai decuplat, mai usor de extins

## Fisiere

- `2_dependency_inversion.ts` - varianta TypeScript cu comentarii
- `2_dist/2_dependency_inversion.js` - varianta JavaScript rulabila direct

## Rulare rapida JS (fara instalari)

```bash
cd "/Users/xan/Documents/Github repos/interview/dependency-injection-typescript/2_dependency_inversion"
node "./2_dist/2_dependency_inversion.js"
```

## Rulare TypeScript (.ts)

```bash
cd "/Users/xan/Documents/Github repos/interview/dependency-injection-typescript/2_dependency_inversion"
npx -y -p typescript tsc "./2_dependency_inversion.ts" --target ES2020 --module commonjs --outDir "./2_dist"
node "./2_dist/2_dependency_inversion.js"
```

## Pitfalls (pe scurt)

- DIP nu inseamna „totul interface”; foloseste abstractii doar la punctele de variatie.
- Daca abstractia copiaza 1:1 concretul, nu ai castig real de design.
- Evita sa legi domeniul de detalii tehnice (SDK-uri, drivere) in high-level.

## Output asteptat (exemplu)

```text
Porneste exemplul 2_dependency_inversion...
Finalizez comanda CMD-200...
[Stripe] Plata procesata: 350 RON
Comanda CMD-200 finalizata.
---
Finalizez comanda CMD-201...
[PayPal] Plata procesata: 420 RON
Comanda CMD-201 finalizata.
---
Finalizez comanda CMD-TEST...
[FAKE] Plata capturata: 99 RON
Comanda CMD-TEST finalizata.
Plati in fake: [ 99 ]
```
