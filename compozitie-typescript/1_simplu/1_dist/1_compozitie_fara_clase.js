// Compozitie fara clase: varianta JavaScript rulabila direct.

function creeazaMotor() {
  return {
    porneste: () => {
      console.log("Motorul a pornit.");
    },
  };
}

function creeazaSistemAudio() {
  return {
    redaMuzica: () => {
      console.log("Sistemul audio reda muzica.");
    },
  };
}

function creeazaMasina(motor, audio) {
  return {
    pornesteMasina: () => motor.porneste(),
    pornesteMuzica: () => audio.redaMuzica(),
  };
}

const motor = creeazaMotor();
const audio = creeazaSistemAudio();
const masina = creeazaMasina(motor, audio);

console.log("Porneste exemplul 1_simplu compozitie fara clase...");
masina.pornesteMasina();
masina.pornesteMuzica();
