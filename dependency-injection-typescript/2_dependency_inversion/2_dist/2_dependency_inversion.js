// Dependency Inversion Principle (D din SOLID):
// 1) Modulul high-level NU depinde de module low-level concrete.
// 2) Ambele depind de abstractii.
// Low-level module #1
class StripeGateway {
    plateste(suma) {
        console.log(`[Stripe] Plata procesata: ${suma} RON`);
    }
}
// Low-level module #2
class PaypalGateway {
    plateste(suma) {
        console.log(`[PayPal] Plata procesata: ${suma} RON`);
    }
}
// High-level module (business logic)
class CheckoutService {
    // High-level depinde de abstractie (PaymentGateway), nu de Stripe/PayPal direct.
    constructor(gateway) {
        this.gateway = gateway;
    }
    finalizeazaComanda(idComanda, suma) {
        console.log(`Finalizez comanda ${idComanda}...`);
        this.gateway.plateste(suma);
        console.log(`Comanda ${idComanda} finalizata.`);
    }
}
// Fake pentru teste unitare
class FakeGateway {
    constructor() {
        this.ultimelePlati = [];
    }
    plateste(suma) {
        this.ultimelePlati.push(suma);
        console.log(`[FAKE] Plata capturata: ${suma} RON`);
    }
}
console.log("Porneste exemplul 2_dependency_inversion...");
const checkoutStripe = new CheckoutService(new StripeGateway());
checkoutStripe.finalizeazaComanda("CMD-200", 350);
console.log("---");
const checkoutPaypal = new CheckoutService(new PaypalGateway());
checkoutPaypal.finalizeazaComanda("CMD-201", 420);
console.log("---");
const fake = new FakeGateway();
const checkoutTest = new CheckoutService(fake);
checkoutTest.finalizeazaComanda("CMD-TEST", 99);
console.log("Plati in fake:", fake.ultimelePlati);
