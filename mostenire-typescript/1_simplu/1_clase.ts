// Acesta este exemplul de baza pentru mostenire in TypeScript.
// Clasa copil (Caine) mosteneste comportamentul clasei parinte (Animal).

export class Animal {
  // "protected" inseamna ca proprietatea este accesibila in clasa parinte
  // si in clasele copil, dar NU direct din exterior.
  protected nume: string;

  constructor(nume: string) {
    this.nume = nume;
  }

  // Metoda comuna pentru toate animalele.
  mananca(): void {
    console.log(`${this.nume} mananca.`);
  }
}

export class Caine extends Animal {
  // "extends Animal" => Caine mosteneste tot ce e public/protected din Animal.

  // Metoda specifica doar pentru Caine.
  latra(): void {
    console.log(`${this.nume} latra: Ham! Ham!`);
  }

  // Putem suprascrie (override) o metoda din parinte.
  // Aici adaugam un comportament mai specific pentru caine.
  override mananca(): void {
    console.log(`${this.nume} mananca boabe pentru caini.`);
  }
}
