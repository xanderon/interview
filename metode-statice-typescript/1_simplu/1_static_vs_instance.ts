// Static Methods vs Instance Methods
// - metoda statica apartine clasei (nu unui obiect anume)
// - metoda de instanta apartine obiectului creat cu new

class Utilizator {
  // Proprietate statica: este comuna pentru toata clasa.
  private static totalUtilizatori = 0;

  constructor(private nume: string) {
    // Fiecare obiect nou creste contorul global.
    Utilizator.totalUtilizatori += 1;
  }

  // Metoda de instanta: foloseste datele obiectului curent.
  prezintaTe(): void {
    console.log(`Salut, eu sunt ${this.nume}.`);
  }

  // Metoda statica: se apeleaza pe clasa, nu pe obiect.
  static getTotalUtilizatori(): number {
    return Utilizator.totalUtilizatori;
  }

  // Exemplu de metoda statica utilitara, independenta de un obiect anume.
  static valideazaNume(nume: string): boolean {
    return nume.trim().length >= 2;
  }
}

console.log("Porneste exemplul 1_simplu static vs instance...");

console.log(`Nume valid pentru 'A'? ${Utilizator.valideazaNume("A")}`);
console.log(`Nume valid pentru 'Ana'? ${Utilizator.valideazaNume("Ana")}`);

const u1 = new Utilizator("Ana");
const u2 = new Utilizator("Mihai");

// Instanta: metoda chemata pe obiect.
u1.prezintaTe();
u2.prezintaTe();
// Static: metoda chemata pe clasa.
console.log(`Total utilizatori creati: ${Utilizator.getTotalUtilizatori()}`);

// Daca incerci asta in TypeScript, vei primi eroare:
// u1.getTotalUtilizatori();
