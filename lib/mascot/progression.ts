export function calculateMascotLevel(agendaPassCount: number) {
  if (agendaPassCount >= 20) return 7;
  if (agendaPassCount >= 10) return 6;
  if (agendaPassCount >= 5) return 5;
  if (agendaPassCount >= 3) return 4;
  if (agendaPassCount >= 1) return 2;

  return 1;
}

export function calculateXpFromPasses(agendaPassCount: number) {
  return agendaPassCount * 50;
}

export type MascotUnlockedTrait = {
  milestone: number;
  type: string;
  src: string;
  label: string;
};

/*
  Essa função pega TODOS os traits que a pessoa já deveria ter desbloqueado.
  Exemplo:
  Se ela tem 6 Agenda Pass, recebe os desbloqueios de 1, 3 e 5 passes.
*/
export function getUnlockedTraitsByPassCount(
  agendaPassCount: number
): MascotUnlockedTrait[] {
  const traits: MascotUnlockedTrait[] = [];

  if (agendaPassCount >= 1) {
    traits.push({
      milestone: 1,
      type: "stickers",
      src: "/mascot/stickers/bitcoin.png",
      label: "Sticker inicial",
    });
  }

  if (agendaPassCount >= 3) {
    traits.push({
      milestone: 3,
      type: "background",
      src: "/mascot/background/background-04.png",
      label: "Background especial",
    });
  }

  if (agendaPassCount >= 5) {
    traits.push({
      milestone: 5,
      type: "special",
      src: "/mascot/special/TattooCrypto.png",
      label: "Aura rara",
    });
  }
  if (agendaPassCount >= 7) {
    traits.push({
      milestone: 5,
      type: "special",
      src: "/mascot/eyes/eyes-04.png",
      label: "Aura rara",
    });
  }

  if (agendaPassCount >= 7) {
    traits.push({
      milestone: 5,
      type: "special",
      src: "/mascot/glasses/glasses-08.png",
      label: "Aura rara",
    });
  }

  if (agendaPassCount >= 10) {
    traits.push({
      milestone: 10,
      type: "espiral",
      src: "/mascot/espiral/espiral-06.png",
      label: "Espiral épica",
    });
  }

  if (agendaPassCount >= 20) {
    traits.push({
      milestone: 20,
      type: "background",
      src: "/mascot/background/all.png",
      label: "stickes de colecionador",
    });
  }

  return traits;
}

/*
  Mantive essa função para não quebrar o event-response,
  mas agora ela usa a lógica nova.
*/
export function getUnlockedTraitByPassCount(agendaPassCount: number) {
  const exactTrait = getUnlockedTraitsByPassCount(agendaPassCount).find(
    (trait) => trait.milestone === agendaPassCount
  );

  return exactTrait ?? null;
}