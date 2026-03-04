// Varianta JavaScript rulabila direct cu Node.

class Motor {
  porneste() {
    console.log("Motorul a pornit.");
  }
}

class SistemAudio {
  redaMuzica() {
    console.log("Sistemul audio reda muzica.");
  }
}

class Masina {
  constructor(motor, audio) {
    this.motor = motor;
    this.audio = audio;
  }

  pornesteMasina() {
    this.motor.porneste();
  }

  pornesteMuzica() {
    this.audio.redaMuzica();
  }
}

const motor = new Motor();
const audio = new SistemAudio();
const masina = new Masina(motor, audio);

console.log("Porneste exemplul 1_simplu compozitie...");
masina.pornesteMasina();
masina.pornesteMuzica();
