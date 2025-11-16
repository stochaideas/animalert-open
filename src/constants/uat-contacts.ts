export type UatContactRole =
  | "Jandarmerie"
  | "Municipality"
  | "Vet"
  | "HuntingManager";

export type UatContact = {
  role: UatContactRole;
  phone: string;
  label: string;
};

export type UatGeofence = {
  id: string;
  displayName: string;
  centroid: { lat: number; lng: number };
  radiusKm: number;
  contacts: UatContact[];
};

const TEST_PHONE = "0040741028697";

const buildDefaultContacts = (uatName: string): UatContact[] => [
  {
    role: "Jandarmerie",
    phone: TEST_PHONE,
    label: `${uatName} Jandarmerie`,
  },
  {
    role: "Municipality",
    phone: TEST_PHONE,
    label: `${uatName} Primarie`,
  },
  {
    role: "Vet",
    phone: TEST_PHONE,
    label: `${uatName} Serviciu Veterinar`,
  },
  {
    role: "HuntingManager",
    phone: TEST_PHONE,
    label: `${uatName} Gestionar Fond Cinegetic`,
  },
];

export const UAT_GEOFENCES: UatGeofence[] = [
  {
    id: "brasov",
    displayName: "Brasov",
    centroid: { lat: 45.656, lng: 25.607 },
    radiusKm: 18,
    contacts: buildDefaultContacts("Brasov"),
  },
  {
    id: "sinaia",
    displayName: "Sinaia",
    centroid: { lat: 45.351, lng: 25.542 },
    radiusKm: 15,
    contacts: buildDefaultContacts("Sinaia"),
  },
  {
    id: "poiana-cristei",
    displayName: "Poiana Cristei",
    centroid: { lat: 45.596, lng: 26.015 },
    radiusKm: 12,
    contacts: buildDefaultContacts("Poiana Cristei"),
  },
  {
    id: "maracineni",
    displayName: "Maracineni",
    centroid: { lat: 45.166, lng: 26.825 },
    radiusKm: 12,
    contacts: buildDefaultContacts("Maracineni"),
  },
];
