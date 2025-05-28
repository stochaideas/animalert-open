export const CONVERSATION: {
  question: string;
  options?: string[];
  type: "options" | "input";
  multiple?: boolean;
}[] = [
  {
    question: "În ce categorie se încadrează animalul găsit?",
    options: [
      "Pasăre",
      "Mamifer (vulpe, liliac, arici, mistreț, rozător, pisică sălbatică etc.)",
      "Reptilă (șarpe, șopârlă, țestoasă)",
      "Amfibian (broască, salamandră, triton etc.)",
      "Pește (decedat, pescuit ilegal)",
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
      "Răni vizibile: plăgi deschise, hemoragie, oase la vedere",
      "Nu se mișcă (inert)",
      "Problema la mers",
      "Posibilă problemă (nu majoră)",
    ],
    type: "options",
    multiple: true,
  },
  {
    question:
      "Există pericole sau potențiali prădători în zonă (câini, animale sălbatice, trafic rutier, activități umane)?",
    options: ["Da", "Nu"],
    type: "options",
  },
  {
    question: "Cum se poate localiza victima?",
    type: "input",
  },
];
