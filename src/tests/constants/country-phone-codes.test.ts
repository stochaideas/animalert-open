import { describe, it, expect } from "vitest";
import {
  COUNTRY_PHONE_CODES,
  DEFAULT_COUNTRY_CODE,
  getCountryByCode,
  getCountryByDialCode,
} from "~/constants/country-phone-codes";

describe("COUNTRY_PHONE_CODES", () => {
  it("should contain at least 60 countries", () => {
    expect(COUNTRY_PHONE_CODES.length).toBeGreaterThanOrEqual(60);
  });

  it("should have valid structure for each country", () => {
    COUNTRY_PHONE_CODES.forEach((country) => {
      expect(country).toHaveProperty("code");
      expect(country).toHaveProperty("name");
      expect(country).toHaveProperty("dialCode");
      expect(country).toHaveProperty("flag");
      expect(country).toHaveProperty("format");

      expect(typeof country.code).toBe("string");
      expect(country.code.length).toBe(2);
      expect(typeof country.name).toBe("string");
      expect(typeof country.dialCode).toBe("string");
      expect(country.dialCode).toMatch(/^\+\d+$/);
      expect(typeof country.flag).toBe("string");
      expect(typeof country.format).toBe("string");
    });
  });

  it("should have Romania in the list", () => {
    const romania = COUNTRY_PHONE_CODES.find((c) => c.code === "RO");
    expect(romania).toBeDefined();
    expect(romania?.name).toBe("România");
    expect(romania?.dialCode).toBe("+40");
    expect(romania?.flag).toBe("🇷🇴");
  });

  it("should have United States in the list", () => {
    const us = COUNTRY_PHONE_CODES.find((c) => c.code === "US");
    expect(us).toBeDefined();
    expect(us?.name).toBe("United States");
    expect(us?.dialCode).toBe("+1");
    expect(us?.flag).toBe("🇺🇸");
  });

  it("should have United Kingdom in the list", () => {
    const uk = COUNTRY_PHONE_CODES.find((c) => c.code === "GB");
    expect(uk).toBeDefined();
    expect(uk?.name).toBe("United Kingdom");
    expect(uk?.dialCode).toBe("+44");
    expect(uk?.flag).toBe("🇬🇧");
  });

  it("should have unique country codes", () => {
    const codes = COUNTRY_PHONE_CODES.map((c) => c.code);
    const uniqueCodes = new Set(codes);
    expect(codes.length).toBe(uniqueCodes.size);
  });

  it("should have unique country names", () => {
    const names = COUNTRY_PHONE_CODES.map((c) => c.name);
    const uniqueNames = new Set(names);
    expect(names.length).toBe(uniqueNames.size);
  });
});

describe("DEFAULT_COUNTRY_CODE", () => {
  it("should be Romania (RO)", () => {
    expect(DEFAULT_COUNTRY_CODE).toBe("RO");
  });

  it("should exist in COUNTRY_PHONE_CODES", () => {
    const defaultCountry = COUNTRY_PHONE_CODES.find(
      (c) => c.code === DEFAULT_COUNTRY_CODE,
    );
    expect(defaultCountry).toBeDefined();
  });
});

describe("getCountryByCode", () => {
  it("should return Romania for RO code", () => {
    const country = getCountryByCode("RO");
    expect(country).toBeDefined();
    expect(country?.code).toBe("RO");
    expect(country?.name).toBe("România");
    expect(country?.dialCode).toBe("+40");
  });

  it("should return United States for US code", () => {
    const country = getCountryByCode("US");
    expect(country).toBeDefined();
    expect(country?.code).toBe("US");
    expect(country?.name).toBe("United States");
    expect(country?.dialCode).toBe("+1");
  });

  it("should return Germany for DE code", () => {
    const country = getCountryByCode("DE");
    expect(country).toBeDefined();
    expect(country?.code).toBe("DE");
    expect(country?.name).toBe("Deutschland");
    expect(country?.dialCode).toBe("+49");
  });

  it("should return undefined for invalid code", () => {
    const country = getCountryByCode("XX");
    expect(country).toBeUndefined();
  });

  it("should return undefined for empty string", () => {
    const country = getCountryByCode("");
    expect(country).toBeUndefined();
  });

  it("should be case-sensitive", () => {
    const country = getCountryByCode("ro");
    expect(country).toBeUndefined();
  });
});

describe("getCountryByDialCode", () => {
  it("should return Romania for +40 dial code", () => {
    const country = getCountryByDialCode("+40");
    expect(country).toBeDefined();
    expect(country?.code).toBe("RO");
    expect(country?.dialCode).toBe("+40");
  });

  it("should return United States for +1 dial code", () => {
    const country = getCountryByDialCode("+1");
    expect(country).toBeDefined();
    expect(country?.code).toBe("US");
    expect(country?.dialCode).toBe("+1");
  });

  it("should return Germany for +49 dial code", () => {
    const country = getCountryByDialCode("+49");
    expect(country).toBeDefined();
    expect(country?.code).toBe("DE");
    expect(country?.dialCode).toBe("+49");
  });

  it("should return United Kingdom for +44 dial code", () => {
    const country = getCountryByDialCode("+44");
    expect(country).toBeDefined();
    expect(country?.code).toBe("GB");
    expect(country?.dialCode).toBe("+44");
  });

  it("should return undefined for invalid dial code", () => {
    const country = getCountryByDialCode("+999");
    expect(country).toBeUndefined();
  });

  it("should return undefined for dial code without plus sign", () => {
    const country = getCountryByDialCode("40");
    expect(country).toBeUndefined();
  });

  it("should return undefined for empty string", () => {
    const country = getCountryByDialCode("");
    expect(country).toBeUndefined();
  });

  it("should return first match for shared dial codes", () => {
    // Multiple countries can share dial codes (e.g., +1 for US and Canada)
    const country = getCountryByDialCode("+1");
    expect(country).toBeDefined();
    expect(country?.dialCode).toBe("+1");
  });
});
