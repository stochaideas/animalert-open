import { z } from "zod";
import libphonenumber from "google-libphonenumber";

const phoneUtil = new libphonenumber.PhoneNumberUtil();

export const phoneNumberRefine = (number: string) => {
  try {
    const phoneNumber = phoneUtil.parse(number, "RO");
    return phoneUtil.isValidNumber(phoneNumber);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return false;
  }
};

export const phoneNumberSchema = z
  .string()
  .nonempty({ message: "Numărul de telefon este necesar" })
  .refine(phoneNumberRefine, { message: "Numărul de telefon este invalid" });
