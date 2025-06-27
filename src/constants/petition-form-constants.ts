export const petitionPlaceholderMap = {
  name: "nume_utilizator",
  email: "email_utilizator",
  phoneNumber: "telefon_utilizator",
  address: "adresa_utilizator",
  generationDate: "data_generare",
  species: "denumire_specie",
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
  species: string;
  destinationInstitute: string;
  incidentDate: string;
  incidentLocation: string;
  incidentDescription: string;
  attachments: string;
};

export const PETITION_TYPES = {
  POACHING : "BRACONAJ",
  CRUELTY: "CRUZIME ÎMPOTRIVA ANIMALELOR",
}