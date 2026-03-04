// Compozitie fara clase: folosim functii care returneaza obiecte.
// Ideea ramane aceeasi: Masina este compusa din componente.

type Motor = {
  porneste: () => void;
};

type SistemAudio = {
  redaMuzica: () => void;
};

function creeazaMotor(): Motor {
  return {
    porneste: () => {
      console.log("Motorul a pornit.");
    },
  };
}

function creeazaSistemAudio(): SistemAudio {
  return {
    redaMuzica: () => {
      console.log("Sistemul audio reda muzica.");
    },
  };
}

function creeazaMasina(motor: Motor, audio: SistemAudio) {
  // Masina doar compune si deleaga comportamentul catre obiectele primite.
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
