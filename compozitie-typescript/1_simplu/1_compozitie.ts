// Compozitie = un obiect contine alte obiecte (has-a),
// in loc sa mosteneasca direct comportamentul (is-a).

class Motor {
  // Componenta responsabila de pornire.
  porneste(): void {
    console.log("Motorul a pornit.");
  }
}

class SistemAudio {
  // Componenta responsabila de muzica.
  redaMuzica(): void {
    console.log("Sistemul audio reda muzica.");
  }
}

class Masina {
  // Masina este compusa din alte componente.
  // Le primim in constructor ca dependinte.
  constructor(
    private motor: Motor,
    private audio: SistemAudio
  ) {}

  // Masina delega comportamentul catre componente.
  pornesteMasina(): void {
    this.motor.porneste();
  }

  pornesteMuzica(): void {
    this.audio.redaMuzica();
  }
}

// Folosire:
const motor = new Motor();
const audio = new SistemAudio();
const masina = new Masina(motor, audio);

console.log("Porneste exemplul 1_simplu compozitie...");
masina.pornesteMasina();
masina.pornesteMuzica();
