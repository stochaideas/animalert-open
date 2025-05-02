import { z } from "zod";
import libphonenumber from "google-libphonenumber";

const phoneUtil = new libphonenumber.PhoneNumberUtil();

/**
 * Normalizes a phone number to E.164 format.
 * @param number - The phone number input as a string.
 * @param defaultCountry - The default country code (default is "US").
 * @returns The normalized phone number in E.164 format or null if invalid.
 */
export function normalizePhoneNumber(number: string): string {
  const phoneNumber = phoneUtil.parse(number, "RO");

  const formattedPhoneNumber = phoneUtil.format(
    phoneNumber,
    libphonenumber.PhoneNumberFormat.E164,
  );

  return formattedPhoneNumber;
}

/**
 * Validates a phone number using google-libphonenumber.
 * @param number - The phone number to validate.
 * @returns True if the phone number is valid, otherwise false.
 */
export const phoneNumberRefine = (number: string): boolean => {
  try {
    const phoneNumber = phoneUtil.parse(number, "RO");
    return phoneUtil.isValidNumber(phoneNumber);
  } catch {
    return false;
  }
};

/**
 * Zod schema for validating phone numbers.
 */
export const phoneNumberSchema = z
  .string()
  .nonempty({ message: "Numărul de telefon este necesar" })
  .refine(phoneNumberRefine, { message: "Numărul de telefon este invalid" });
