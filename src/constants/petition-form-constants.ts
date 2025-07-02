export const petitionPlaceholderMap = {
  name: "nume_utilizator",
  email: "email_utilizator",
  phoneNumber: "telefon_utilizator",
  address: "adresa_utilizator",
  generationDate: "data_generare",
  destinationInstitute: "institutie_selectata",
  incidentDate: "data_incident",
  incidentLocation: "locatie_incident",
  incidentDescription: "descriere_incident",
  attachments: "dovezi_atasate",
};

export type petitionPlaceHolder = {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  generationDate: Date;
  destinationInstitute: string;
  incidentDate: string;
  incidentLocation: string;
  incidentDescription: string;
  attachments: string;
};

export const PETITION_TYPES = {
  POACHING: { name: "BRACONAJ", path: "/templates/petitie-braconaj.html" },
  CRUELTY: {
    name: "CRUZIME ÎMPOTRIVA ANIMALELOR",
    path: "/templates/petitie-cruzime.html",
  },
  WASTE_DUMP: {
    name: "DEPUNERE ILEGALĂ DE DEȘEURI",
    path: "/templates/petitie-deseu.html",
  },
};
