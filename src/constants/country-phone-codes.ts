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
    name: "United Kingdom",
    dialCode: "+44",
    flag: "🇬🇧",
    format: "#### ### ####",
  },
  {
    code: "DE",
    name: "Deutschland",
    dialCode: "+49",
    flag: "🇩🇪",
    format: "#### #######",
  },
  {
    code: "FR",
    name: "France",
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
    name: "España",
    dialCode: "+34",
    flag: "🇪🇸",
    format: "### ## ## ##",
  },
  {
    code: "NL",
    name: "Nederland",
    dialCode: "+31",
    flag: "🇳🇱",
    format: "## ########",
  },
  {
    code: "BE",
    name: "België",
    dialCode: "+32",
    flag: "🇧🇪",
    format: "### ## ## ##",
  },
  {
    code: "AT",
    name: "Österreich",
    dialCode: "+43",
    flag: "🇦🇹",
    format: "### #######",
  },
  {
    code: "CH",
    name: "Schweiz",
    dialCode: "+41",
    flag: "🇨🇭",
    format: "## ### ## ##",
  },
  {
    code: "SE",
    name: "Sverige",
    dialCode: "+46",
    flag: "🇸🇪",
    format: "##-### ## ##",
  },
  {
    code: "NO",
    name: "Norge",
    dialCode: "+47",
    flag: "🇳🇴",
    format: "### ## ###",
  },
  {
    code: "DK",
    name: "Danmark",
    dialCode: "+45",
    flag: "🇩🇰",
    format: "## ## ## ##",
  },
  {
    code: "FI",
    name: "Suomi",
    dialCode: "+358",
    flag: "🇫🇮",
    format: "## ### ####",
  },
  {
    code: "PL",
    name: "Polska",
    dialCode: "+48",
    flag: "🇵🇱",
    format: "### ### ###",
  },
  {
    code: "CZ",
    name: "Česko",
    dialCode: "+420",
    flag: "🇨🇿",
    format: "### ### ###",
  },
  {
    code: "HU",
    name: "Magyarország",
    dialCode: "+36",
    flag: "🇭🇺",
    format: "## ### ####",
  },
  {
    code: "GR",
    name: "Ελλάδα",
    dialCode: "+30",
    flag: "🇬🇷",
    format: "### ### ####",
  },
  {
    code: "PT",
    name: "Portugal",
    dialCode: "+351",
    flag: "🇵🇹",
    format: "### ### ###",
  },
  {
    code: "IE",
    name: "Ireland",
    dialCode: "+353",
    flag: "🇮🇪",
    format: "## ### ####",
  },
  {
    code: "HR",
    name: "Hrvatska",
    dialCode: "+385",
    flag: "🇭🇷",
    format: "## ### ####",
  },
  {
    code: "BG",
    name: "България",
    dialCode: "+359",
    flag: "🇧🇬",
    format: "### ### ###",
  },
  {
    code: "SK",
    name: "Slovensko",
    dialCode: "+421",
    flag: "🇸🇰",
    format: "### ### ###",
  },
  {
    code: "SI",
    name: "Slovenija",
    dialCode: "+386",
    flag: "🇸🇮",
    format: "## ### ###",
  },
  {
    code: "LT",
    name: "Lietuva",
    dialCode: "+370",
    flag: "🇱🇹",
    format: "### #####",
  },
  {
    code: "LV",
    name: "Latvija",
    dialCode: "+371",
    flag: "🇱🇻",
    format: "## ### ###",
  },
  {
    code: "EE",
    name: "Eesti",
    dialCode: "+372",
    flag: "🇪🇪",
    format: "#### ####",
  },
  {
    code: "RS",
    name: "Srbija",
    dialCode: "+381",
    flag: "🇷🇸",
    format: "## ### ####",
  },
  {
    code: "UA",
    name: "Україна",
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
    name: "United States",
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
    name: "México",
    dialCode: "+52",
    flag: "🇲🇽",
    format: "### ### ####",
  },

  // Asia
  {
    code: "CN",
    name: "中国",
    dialCode: "+86",
    flag: "🇨🇳",
    format: "### #### ####",
  },
  {
    code: "JP",
    name: "日本",
    dialCode: "+81",
    flag: "🇯🇵",
    format: "##-####-####",
  },
  {
    code: "KR",
    name: "대한민국",
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
    name: "ประเทศไทย",
    dialCode: "+66",
    flag: "🇹🇭",
    format: "##-###-####",
  },
  {
    code: "PH",
    name: "Philippines",
    dialCode: "+63",
    flag: "🇵🇭",
    format: "#### ### ####",
  },
  {
    code: "VN",
    name: "Việt Nam",
    dialCode: "+84",
    flag: "🇻🇳",
    format: "##-#### ####",
  },
  {
    code: "ID",
    name: "Indonesia",
    dialCode: "+62",
    flag: "🇮🇩",
    format: "###-###-####",
  },
  {
    code: "IL",
    name: "ישראל",
    dialCode: "+972",
    flag: "🇮🇱",
    format: "##-###-####",
  },
  {
    code: "TR",
    name: "Türkiye",
    dialCode: "+90",
    flag: "🇹🇷",
    format: "### ### ## ##",
  },
  {
    code: "AE",
    name: "الإمارات",
    dialCode: "+971",
    flag: "🇦🇪",
    format: "## ### ####",
  },
  {
    code: "SA",
    name: "السعودية",
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
    name: "New Zealand",
    dialCode: "+64",
    flag: "🇳🇿",
    format: "##-### ####",
  },

  // South America
  {
    code: "BR",
    name: "Brasil",
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
    name: "Colombia",
    dialCode: "+57",
    flag: "🇨🇴",
    format: "### ### ####",
  },

  // Africa
  {
    code: "ZA",
    name: "South Africa",
    dialCode: "+27",
    flag: "🇿🇦",
    format: "## ### ####",
  },
  {
    code: "EG",
    name: "مصر",
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
    name: "Luxembourg",
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
    name: "Κύπρος",
    dialCode: "+357",
    flag: "🇨🇾",
    format: "## ### ###",
  },
  {
    code: "IS",
    name: "Ísland",
    dialCode: "+354",
    flag: "🇮🇸",
    format: "### ####",
  },
  {
    code: "AL",
    name: "Shqipëri",
    dialCode: "+355",
    flag: "🇦🇱",
    format: "## ### ####",
  },
  {
    code: "MK",
    name: "Македонија",
    dialCode: "+389",
    flag: "🇲🇰",
    format: "## ### ###",
  },
  {
    code: "BA",
    name: "Bosna i Hercegovina",
    dialCode: "+387",
    flag: "🇧🇦",
    format: "##-####-###",
  },
  {
    code: "ME",
    name: "Crna Gora",
    dialCode: "+382",
    flag: "🇲🇪",
    format: "## ### ###",
  },
  {
    code: "XK",
    name: "Kosova",
    dialCode: "+383",
    flag: "🇽🇰",
    format: "## ### ###",
  },
  {
    code: "RU",
    name: "Россия",
    dialCode: "+7",
    flag: "🇷🇺",
    format: "### ###-##-##",
  },
  {
    code: "BY",
    name: "Беларусь",
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
