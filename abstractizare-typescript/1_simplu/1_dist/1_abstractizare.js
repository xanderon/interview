// Varianta JavaScript rulabila direct.
// In JS nu avem abstract class nativ, dar pastram aceeasi idee de "contract".

class MetodaPlata {
  plateste(_suma) {
    throw new Error("Metoda plateste trebuie implementata in clasa copil.");
  }

  afiseazaMesajStart(suma) {
    console.log(`Incepe plata de ${suma} RON...`);
  }
}

class PlataCuCard extends MetodaPlata {
  plateste(suma) {
    this.afiseazaMesajStart(suma);
    console.log(`Plata cu cardul a fost procesata: ${suma} RON.`);
  }
}

class PlataCash extends MetodaPlata {
  plateste(suma) {
    this.afiseazaMesajStart(suma);
    console.log(`Plata cash a fost inregistrata: ${suma} RON.`);
  }
}

console.log("Porneste exemplul 1_simplu abstractizare...");

const card = new PlataCuCard();
card.plateste(150);

console.log("---");

const cash = new PlataCash();
cash.plateste(80);
