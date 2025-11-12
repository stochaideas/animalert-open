import { z } from "zod";
import libphonenumber from "google-libphonenumber";
import { DEFAULT_COUNTRY_CODE } from "~/constants/country-phone-codes";

const phoneUtil = new libphonenumber.PhoneNumberUtil();

/**
 * Normalizes a phone number to E.164 format.
 * @param number - The phone number input as a string.
 * @param countryCode - The ISO 3166-1 alpha-2 country code (e.g., "RO", "US").
 * @returns The normalized phone number in E.164 format or the original if invalid.
 */
export function normalizePhoneNumber(
  number: string,
  countryCode: string = DEFAULT_COUNTRY_CODE,
): string {
  try {
    const phoneNumber = phoneUtil.parse(number, countryCode);

    const formattedPhoneNumber = phoneUtil.format(
      phoneNumber,
      libphonenumber.PhoneNumberFormat.E164,
    );

    return formattedPhoneNumber;
  } catch {
    // Return original if parsing fails
    return number;
  }
}

/**
 * Validates a phone number using google-libphonenumber.
 * @param number - The phone number to validate.
 * @param countryCode - The ISO 3166-1 alpha-2 country code (e.g., "RO", "US").
 * @returns True if the phone number is valid, otherwise false.
 */
export const phoneNumberRefine = (
  number: string,
  countryCode: string = DEFAULT_COUNTRY_CODE,
): boolean => {
  try {
    const phoneNumber = phoneUtil.parse(number, countryCode);
    return phoneUtil.isValidNumber(phoneNumber);
  } catch {
    return false;
  }
};

/**
 * Zod schema for validating phone numbers with country code.
 * Use this for forms that include both phone and countryCode fields.
 */
export const phoneNumberWithCountrySchema = z
  .object({
    phone: z.string().nonempty({ message: "Numărul de telefon este necesar" }),
    countryCode: z.string().default(DEFAULT_COUNTRY_CODE),
  })
  .refine((data) => phoneNumberRefine(data.phone, data.countryCode), {
    message: "Numărul de telefon este invalid",
    path: ["phone"],
  });

/**
 * Legacy Zod schema for validating phone numbers (Romanian only).
 * @deprecated Use phoneNumberWithCountrySchema instead for international support.
 */
export const phoneNumberSchema = z
  .string()
  .nonempty({ message: "Numărul de telefon este necesar" })
  .refine((number) => phoneNumberRefine(number, DEFAULT_COUNTRY_CODE), {
    message: "Numărul de telefon este invalid",
  });
