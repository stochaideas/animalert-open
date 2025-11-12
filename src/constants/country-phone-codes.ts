export interface CountryPhoneCode {
  code: string; // ISO 3166-1 alpha-2 code
  name: string;
  dialCode: string;
  flag: string; // Emoji flag
  format?: string; // Optional phone number format pattern
}

export const COUNTRY_PHONE_CODES: CountryPhoneCode[] = [
  // European countries (most common first)
  {
    code: "RO",
    name: "România",
    dialCode: "+40",
    flag: "🇷🇴",
    format: "### ### ###",
  },
  {
    code: "GB",
    name: "Regatul Unit",
    dialCode: "+44",
    flag: "🇬🇧",
    format: "#### ### ####",
  },
  {
    code: "DE",
    name: "Germania",
    dialCode: "+49",
    flag: "🇩🇪",
    format: "#### #######",
  },
  {
    code: "FR",
    name: "Franța",
    dialCode: "+33",
    flag: "🇫🇷",
    format: "# ## ## ## ##",
  },
  {
    code: "IT",
    name: "Italia",
    dialCode: "+39",
    flag: "🇮🇹",
    format: "### ### ####",
  },
  {
    code: "ES",
    name: "Spania",
    dialCode: "+34",
    flag: "🇪🇸",
    format: "### ## ## ##",
  },
  {
    code: "NL",
    name: "Olanda",
    dialCode: "+31",
    flag: "🇳🇱",
    format: "## ########",
  },
  {
    code: "BE",
    name: "Belgia",
    dialCode: "+32",
    flag: "🇧🇪",
    format: "### ## ## ##",
  },
  {
    code: "AT",
    name: "Austria",
    dialCode: "+43",
    flag: "🇦🇹",
    format: "### #######",
  },
  {
    code: "CH",
    name: "Elveția",
    dialCode: "+41",
    flag: "🇨🇭",
    format: "## ### ## ##",
  },
  {
    code: "SE",
    name: "Suedia",
    dialCode: "+46",
    flag: "🇸🇪",
    format: "##-### ## ##",
  },
  {
    code: "NO",
    name: "Norvegia",
    dialCode: "+47",
    flag: "🇳🇴",
    format: "### ## ###",
  },
  {
    code: "DK",
    name: "Danemarca",
    dialCode: "+45",
    flag: "🇩🇰",
    format: "## ## ## ##",
  },
  {
    code: "FI",
    name: "Finlanda",
    dialCode: "+358",
    flag: "🇫🇮",
    format: "## ### ####",
  },
  {
    code: "PL",
    name: "Polonia",
    dialCode: "+48",
    flag: "🇵🇱",
    format: "### ### ###",
  },
  {
    code: "CZ",
    name: "Republica Cehă",
    dialCode: "+420",
    flag: "🇨🇿",
    format: "### ### ###",
  },
  {
    code: "HU",
    name: "Ungaria",
    dialCode: "+36",
    flag: "🇭🇺",
    format: "## ### ####",
  },
  {
    code: "GR",
    name: "Grecia",
    dialCode: "+30",
    flag: "🇬🇷",
    format: "### ### ####",
  },
  {
    code: "PT",
    name: "Portugalia",
    dialCode: "+351",
    flag: "🇵🇹",
    format: "### ### ###",
  },
  {
    code: "IE",
    name: "Irlanda",
    dialCode: "+353",
    flag: "🇮🇪",
    format: "## ### ####",
  },
  {
    code: "HR",
    name: "Croația",
    dialCode: "+385",
    flag: "🇭🇷",
    format: "## ### ####",
  },
  {
    code: "BG",
    name: "Bulgaria",
    dialCode: "+359",
    flag: "🇧🇬",
    format: "### ### ###",
  },
  {
    code: "SK",
    name: "Slovacia",
    dialCode: "+421",
    flag: "🇸🇰",
    format: "### ### ###",
  },
  {
    code: "SI",
    name: "Slovenia",
    dialCode: "+386",
    flag: "🇸🇮",
    format: "## ### ###",
  },
  {
    code: "LT",
    name: "Lituania",
    dialCode: "+370",
    flag: "🇱🇹",
    format: "### #####",
  },
  {
    code: "LV",
    name: "Letonia",
    dialCode: "+371",
    flag: "🇱🇻",
    format: "## ### ###",
  },
  {
    code: "EE",
    name: "Estonia",
    dialCode: "+372",
    flag: "🇪🇪",
    format: "#### ####",
  },
  {
    code: "RS",
    name: "Serbia",
    dialCode: "+381",
    flag: "🇷🇸",
    format: "## ### ####",
  },
  {
    code: "UA",
    name: "Ucraina",
    dialCode: "+380",
    flag: "🇺🇦",
    format: "## ### ## ##",
  },
  {
    code: "MD",
    name: "Moldova",
    dialCode: "+373",
    flag: "🇲🇩",
    format: "#### ####",
  },

  // North America
  {
    code: "US",
    name: "Statele Unite",
    dialCode: "+1",
    flag: "🇺🇸",
    format: "(###) ###-####",
  },
  {
    code: "CA",
    name: "Canada",
    dialCode: "+1",
    flag: "🇨🇦",
    format: "(###) ###-####",
  },
  {
    code: "MX",
    name: "Mexic",
    dialCode: "+52",
    flag: "🇲🇽",
    format: "### ### ####",
  },

  // Asia
  {
    code: "CN",
    name: "China",
    dialCode: "+86",
    flag: "🇨🇳",
    format: "### #### ####",
  },
  {
    code: "JP",
    name: "Japonia",
    dialCode: "+81",
    flag: "🇯🇵",
    format: "##-####-####",
  },
  {
    code: "KR",
    name: "Coreea de Sud",
    dialCode: "+82",
    flag: "🇰🇷",
    format: "##-####-####",
  },
  {
    code: "IN",
    name: "India",
    dialCode: "+91",
    flag: "🇮🇳",
    format: "##### #####",
  },
  {
    code: "SG",
    name: "Singapore",
    dialCode: "+65",
    flag: "🇸🇬",
    format: "#### ####",
  },
  {
    code: "MY",
    name: "Malaysia",
    dialCode: "+60",
    flag: "🇲🇾",
    format: "##-### ####",
  },
  {
    code: "TH",
    name: "Thailanda",
    dialCode: "+66",
    flag: "🇹🇭",
    format: "##-###-####",
  },
  {
    code: "PH",
    name: "Filipine",
    dialCode: "+63",
    flag: "🇵🇭",
    format: "#### ### ####",
  },
  {
    code: "VN",
    name: "Vietnam",
    dialCode: "+84",
    flag: "🇻🇳",
    format: "##-#### ####",
  },
  {
    code: "ID",
    name: "Indonezia",
    dialCode: "+62",
    flag: "🇮🇩",
    format: "###-###-####",
  },
  {
    code: "IL",
    name: "Israel",
    dialCode: "+972",
    flag: "🇮🇱",
    format: "##-###-####",
  },
  {
    code: "TR",
    name: "Turcia",
    dialCode: "+90",
    flag: "🇹🇷",
    format: "### ### ## ##",
  },
  {
    code: "AE",
    name: "Emiratele Arabe Unite",
    dialCode: "+971",
    flag: "🇦🇪",
    format: "## ### ####",
  },
  {
    code: "SA",
    name: "Arabia Saudită",
    dialCode: "+966",
    flag: "🇸🇦",
    format: "## ### ####",
  },

  // Oceania
  {
    code: "AU",
    name: "Australia",
    dialCode: "+61",
    flag: "🇦🇺",
    format: "### ### ###",
  },
  {
    code: "NZ",
    name: "Noua Zeelandă",
    dialCode: "+64",
    flag: "🇳🇿",
    format: "##-### ####",
  },

  // South America
  {
    code: "BR",
    name: "Brazilia",
    dialCode: "+55",
    flag: "🇧🇷",
    format: "## #####-####",
  },
  {
    code: "AR",
    name: "Argentina",
    dialCode: "+54",
    flag: "🇦🇷",
    format: "## ####-####",
  },
  {
    code: "CL",
    name: "Chile",
    dialCode: "+56",
    flag: "🇨🇱",
    format: "# #### ####",
  },
  {
    code: "CO",
    name: "Columbia",
    dialCode: "+57",
    flag: "🇨🇴",
    format: "### ### ####",
  },

  // Africa
  {
    code: "ZA",
    name: "Africa de Sud",
    dialCode: "+27",
    flag: "🇿🇦",
    format: "## ### ####",
  },
  {
    code: "EG",
    name: "Egipt",
    dialCode: "+20",
    flag: "🇪🇬",
    format: "### ### ####",
  },
  {
    code: "NG",
    name: "Nigeria",
    dialCode: "+234",
    flag: "🇳🇬",
    format: "### ### ####",
  },
  {
    code: "KE",
    name: "Kenya",
    dialCode: "+254",
    flag: "🇰🇪",
    format: "### ### ###",
  },

  // More European countries
  {
    code: "LU",
    name: "Luxemburg",
    dialCode: "+352",
    flag: "🇱🇺",
    format: "### ### ###",
  },
  {
    code: "MT",
    name: "Malta",
    dialCode: "+356",
    flag: "🇲🇹",
    format: "#### ####",
  },
  {
    code: "CY",
    name: "Cipru",
    dialCode: "+357",
    flag: "🇨🇾",
    format: "## ### ###",
  },
  {
    code: "IS",
    name: "Islanda",
    dialCode: "+354",
    flag: "🇮🇸",
    format: "### ####",
  },
  {
    code: "AL",
    name: "Albania",
    dialCode: "+355",
    flag: "🇦🇱",
    format: "## ### ####",
  },
  {
    code: "MK",
    name: "Macedonia de Nord",
    dialCode: "+389",
    flag: "🇲🇰",
    format: "## ### ###",
  },
  {
    code: "BA",
    name: "Bosnia și Herțegovina",
    dialCode: "+387",
    flag: "🇧🇦",
    format: "##-####-###",
  },
  {
    code: "ME",
    name: "Muntenegru",
    dialCode: "+382",
    flag: "🇲🇪",
    format: "## ### ###",
  },
  {
    code: "XK",
    name: "Kosovo",
    dialCode: "+383",
    flag: "🇽🇰",
    format: "## ### ###",
  },
  {
    code: "RU",
    name: "Rusia",
    dialCode: "+7",
    flag: "🇷🇺",
    format: "### ###-##-##",
  },
  {
    code: "BY",
    name: "Belarus",
    dialCode: "+375",
    flag: "🇧🇾",
    format: "## ###-##-##",
  },
];

// Default country (Romania)
export const DEFAULT_COUNTRY_CODE = "RO";

// Helper function to get country by code
export const getCountryByCode = (
  code: string,
): CountryPhoneCode | undefined => {
  return COUNTRY_PHONE_CODES.find((country) => country.code === code);
};

// Helper function to get country by dial code
export const getCountryByDialCode = (
  dialCode: string,
): CountryPhoneCode | undefined => {
  return COUNTRY_PHONE_CODES.find((country) => country.dialCode === dialCode);
};
