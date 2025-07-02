import { omit } from "lodash";
import type { z } from "zod";
import type { policeReportSchema } from "~/app/sesizari/_schemas/police-report-form-schema";
import { COUNTIES } from "~/constants/counties";
import type { petitionPlaceholderMap } from "~/constants/petition-form-constants";

export function getCombinedTemplateData(
  formValues: z.infer<typeof policeReportSchema>,
) {
  const derivedValues = {
    name: `${formValues.firstName} ${formValues.lastName}`.trim(),
    address: [
      formValues.country, 
      formValues.county ? `jud. ${COUNTIES[formValues.county]}` : null,
      formValues.city ? `loc. ${formValues.city}` : null,
      formValues.street ? `str. ${formValues.street}` : null,
      formValues.houseNumber ? `nr. ${formValues.houseNumber}` : null,
      formValues.building ? `bl. ${formValues.building}` : null,
      formValues.staircase ? `sc. ${formValues.staircase}` : null,
      formValues.apartment ? `ap. ${formValues.apartment}` : null,
    ]
      .filter(Boolean)
      .join(", "),
    generationDate: new Date().toLocaleDateString("ro-RO"),
    incidentLocation: [
      COUNTIES[formValues.incidentCounty]
        ? `jud. ${COUNTIES[formValues.incidentCounty]}`
        : null,
      formValues.incidentCity ? `loc. ${formValues.incidentCity}` : null,
      formValues.incidentAddress,
    ]
      .filter(Boolean)
      .join(", "),
  };

  const values = {
    ...omit(formValues, [
      "firstName",
      "lastName",
      "country",
      "county",
      "city",
      "street",
      "houseNumber",
      "building",
      "staircase",
      "apartment",
      "incidentCounty",
      "incidentCity",
      "incidentAddress",
    ]),
    ...derivedValues,
  };

  return values;
}

export function fillTemplate(
  template: string,
  formValues: z.infer<typeof policeReportSchema>,
  map: typeof petitionPlaceholderMap,
): string {
  const values = getCombinedTemplateData(formValues);
  console.log(values);
  return Object.entries(map).reduce((result, [formKey, placeholderKey]) => {
    const value = values[formKey as keyof typeof values] ?? "";
    return result.replace(
      new RegExp(`{{\\s*${placeholderKey}\\s*}}`, "g"),
      value,
    );
  }, template);
}
