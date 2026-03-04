// Encapsulation = ascundem starea interna si expunem doar operatii controlate.
// Aici soldul este privat si poate fi modificat doar prin metodele clasei.

class ContBancar {
  // "private" => nu poate fi accesat direct din exterior.
  private sold: number;

  constructor(soldInitial: number) {
    // Validam datele chiar de la creare.
    if (soldInitial < 0) {
      throw new Error("Soldul initial nu poate fi negativ.");
    }
    this.sold = soldInitial;
  }

  // Getter controlat: citim soldul fara sa expunem campul direct.
  getSold(): number {
    return this.sold;
  }

  depune(suma: number): void {
    if (suma <= 0) {
      throw new Error("Suma depusa trebuie sa fie mai mare ca 0.");
    }
    this.sold += suma;
  }

  retrage(suma: number): void {
    if (suma <= 0) {
      throw new Error("Suma retrasa trebuie sa fie mai mare ca 0.");
    }
    if (suma > this.sold) {
      throw new Error("Fonduri insuficiente.");
    }
    this.sold -= suma;
  }
}

console.log("Porneste exemplul 1_simplu encapsulare...");

const cont = new ContBancar(1000);
console.log(`Sold initial: ${cont.getSold()} RON`);

cont.depune(250);
console.log(`Dupa depunere: ${cont.getSold()} RON`);
cont.retrage(400);
console.log(`Dupa retragere: ${cont.getSold()} RON`);

// Daca incerci asta, TypeScript da eroare la compilare:
// cont.sold = 999999;
