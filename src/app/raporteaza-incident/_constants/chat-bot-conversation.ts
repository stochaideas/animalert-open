export const CONVERSATION: {
  question: string;
  options?: string[];
  type: "options" | "input";
  multiple?: boolean;
}[] = [
  {
    question: "În ce categorie se încadrează animalul găsit?",
    options: [
      "Pasare",
      "Mamifer (vulpe, liliac, arici, mistret, rozator, pisica salbatica etc.)",
      "Reptila (sarpe, soparla, testoasa)",
      "Amfibian/Amphibian (broasca, salamandra, triton etc.)",
      "Peste (decedat, pescuit ilegal)",
    ],
    type: "options",
  },
  {
    question: "Este viu animalul?",
    options: ["Da", "Nu"],
    type: "options",
  },
  {
    question: "Care este problema identificată?",
    options: [
      "Rani vizibile: plagi deschise, hemoragie, oase la vedere",
      "Nu se misca (inert)",
      "Problema la mers",
      "Posibila problema (nu majora)",
    ],
    type: "options",
    multiple: true, // <-- Allows multiple selections
  },
  {
    question:
      "Exista pericole sau potențiali pradatori în zona (caini, animale salbatice, trafic rutier, activitati umane)?",
    options: ["Da", "Nu"],
    type: "options",
  },
  {
    question: "Cum se poate localiza victima?",
    type: "input",
  },
];
