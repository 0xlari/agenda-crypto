export type MascotVibe =
  | "street"
  | "cyber"
  | "cute"
  | "futuristic"
  | "minimal"
  | "surprise";

export type MascotGoal =
  | "learn"
  | "network"
  | "opportunities"
  | "build"
  | "invest"
  | "community"
  | "main_events";

export function getMascotClass(goal: MascotGoal) {
  const classes: Record<MascotGoal, string> = {
    learn: "Exploradora Web3",
    network: "Conectora",
    opportunities: "Hunter",
    build: "Builder",
    invest: "Strategist",
    community: "Community Seeker",
    main_events: "Insider",
  };

  return classes[goal] ?? "Exploradora Web3";
}

export function getInitialTraits(vibe: MascotVibe) {
  const surpriseVibes: MascotVibe[] = [
    "street",
    "cyber",
    "cute",
    "futuristic",
    "minimal",
  ];

  const finalVibe =
    vibe === "surprise"
      ? surpriseVibes[Math.floor(Math.random() * surpriseVibes.length)]
      : vibe;

  const traitsByVibe: Record<string, Record<string, string>> = {
    street: {
      background: "/mascot/background/background-02.png",
      body: "/mascot/body/body-02.png",
      eyes: "/mascot/eyes/eyes-19.png",
      mouth: "/mascot/mouth/mouth-10.png",
      hair: "/mascot/hair/hair-01.png",
      hands: "/mascot/hands/hands-06.png",
      shoes: "/mascot/shoes/shoes-02.png",
    },

    cyber: {
      background: "/mascot/background/background-03.png",
      body: "/mascot/body/body-03.png",
      eyes: "/mascot/eyes/eyes-03.png",
      mouth: "/mascot/mouth/mouth-06.png",
      hair: "/mascot/hair/hair-08.png",
      hands: "/mascot/hands/hands-03.png",
      shoes: "/mascot/shoes/shoes-05.png",
      glasses: "/mascot/glasses/glasses-06.png"
    },

    cute: {
      background: "/mascot/background/background-05.png",
      body: "/mascot/body/body-05.png",
      eyes: "/mascot/eyes/eyes-13.png",
      mouth: "/mascot/mouth/mouth-04.png",
      hair: "/mascot/hair/hair-04.png",
      hands: "/mascot/hands/hands-02.png",
      shoes: "/mascot/shoes/shoes-16.png",
    },

    futuristic: {
      background: "/mascot/background/background-06.png",
      body: "/mascot/body/body-15.png",
      eyes: "/mascot/eyes/eyes-18.png",
      mouth: "/mascot/mouth/mouth-07.png",
      hair: "/mascot/hair/hair-18.png",
      hands: "/mascot/hands/hands-02.png",
      shoes: "/mascot/shoes/shoes-12.png",
    },

    minimal: {
      background: "/mascot/background/background-07.png",
      body: "/mascot/body/body-07.png",
      eyes: "/mascot/eyes/eyes-16.png",
      mouth: "/mascot/mouth/mouth-10.png",
      hair: "/mascot/hair/hair-07.png",
      hands: "/mascot/hands/hands-06.png",
      shoes: "/mascot/shoes/shoes-06.png",
    },
  };

  return traitsByVibe[finalVibe] ?? traitsByVibe.street;
}