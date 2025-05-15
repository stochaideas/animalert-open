"use client";

import { useForm } from "react-hook-form";
import type { z } from "zod";
import { presenceReportFormSchema } from "./_schemas/presence-report-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormControl,
  FormLabel,
} from "~/components/ui/simple/form";
import { Textarea } from "~/components/ui/simple/textarea";
import { Button } from "~/components/ui/simple/button";
import { SVGCheck, SVGPaperPlane } from "~/components/icons";
import { RadioGroup, RadioGroupItem } from "~/components/ui/simple/radio-group";
import { LOCATION_FOUND_OPTIONS } from "./_constants/location-found-options";
import { IS_ANIMAL_INJURED_OPTIONS } from "./_constants/is-animal-injured-options";
import { OBSERVED_SIGNS_OPTIONS } from "./_constants/observed-signs-options";
import { Checkbox } from "~/components/ui/simple/checkbox";
import { IS_IN_DANGEROUS_ENVIRONMENT_OPTIONS } from "./_constants/is-in-dangerous-environment";
import { WANTS_UPDATES_OPTIONS } from "./_constants/wants-updates-options";

export default function PresenceReport() {
  const presenceReportForm = useForm<z.infer<typeof presenceReportFormSchema>>({
    resolver: zodResolver(presenceReportFormSchema),
    defaultValues: {
      observed_animal_type: "",
      location_found: "ROADSIDE",
      location_details: "",
      is_animal_injured: "YES",
      observed_signs: [],
      observed_signs_details: "",
      is_in_dangerous_environment: "YES",
      observation_datetime: "",
      has_media: true,
      wants_updates: [],
      contact_details: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  function onContactSubmit(values: z.infer<typeof presenceReportFormSchema>) {
    console.log(values);
  }

  return (
    <main className="bg-tertiary flex flex-col gap-12 px-6 pt-20 pb-40 2xl:px-96 2xl:pt-24 2xl:pb-52">
      <h1 className="text-heading-1 self-start">Raportează prezență</h1>
      <form onSubmit={presenceReportForm.handleSubmit(onContactSubmit)}>
        <Form {...presenceReportForm}>
          <section className="text-neutral-foreground w-full">
            <section className="mb-4 flex flex-col gap-12">
              <div className="flex-1">
                <FormField
                  control={presenceReportForm.control}
                  name="observed_animal_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-body-strong mb-6">
                        Ce tip de animal ai observat?
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descrie..."
                          className="text-single-line-body-base h-36 bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-1 flex-col gap-6">
                <FormField
                  control={presenceReportForm.control}
                  name="location_found"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-body-strong mb-6">
                        Unde ai găsit animalul?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-col space-y-1"
                        >
                          {Object.entries(LOCATION_FOUND_OPTIONS).map(
                            ([key, label]) => (
                              <FormItem
                                key={key}
                                className="flex items-center space-x-3"
                              >
                                <FormControl>
                                  <RadioGroupItem value={key} />
                                </FormControl>
                                <FormLabel className="text-single-line-body-base">
                                  {label}
                                </FormLabel>
                              </FormItem>
                            ),
                          )}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={presenceReportForm.control}
                  name="location_details"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Descrie..."
                          className="text-single-line-body-base h-36 bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-1">
                <FormField
                  control={presenceReportForm.control}
                  name="is_animal_injured"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-body-strong mb-6">
                        Animalul pare să fie rănit sau afectat?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-col space-y-1"
                        >
                          {Object.entries(IS_ANIMAL_INJURED_OPTIONS).map(
                            ([key, label]) => (
                              <FormItem
                                key={key}
                                className="flex items-center space-x-3"
                              >
                                <FormControl>
                                  <RadioGroupItem value={key} />
                                </FormControl>
                                <FormLabel className="text-single-line-body-base">
                                  {label}
                                </FormLabel>
                              </FormItem>
                            ),
                          )}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-1 flex-col gap-6">
                <FormField
                  control={presenceReportForm.control}
                  name="observed_signs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-body-strong mb-6">
                        Ce semne observi la animal?
                      </FormLabel>
                      <div className="flex flex-col space-y-2">
                        {Object.entries(OBSERVED_SIGNS_OPTIONS).map(
                          ([value, label]) => (
                            <FormItem
                              key={value}
                              className="flex flex-row items-center space-y-0 space-x-3"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(
                                    value as keyof typeof OBSERVED_SIGNS_OPTIONS,
                                  )}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([...field.value, value]);
                                    } else {
                                      field.onChange(
                                        field.value.filter((v) => v !== value),
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-single-line-body-base">
                                {label}
                              </FormLabel>
                            </FormItem>
                          ),
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={presenceReportForm.control}
                  name="observed_signs_details"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Descrie..."
                          className="text-single-line-body-base h-36 bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-1">
                <FormField
                  control={presenceReportForm.control}
                  name="is_in_dangerous_environment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-body-strong mb-6">
                        Animalul se află într-un mediu periculos?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-col space-y-1"
                        >
                          {Object.entries(
                            IS_IN_DANGEROUS_ENVIRONMENT_OPTIONS,
                          ).map(([key, label]) => (
                            <FormItem
                              key={key}
                              className="flex items-center space-x-3"
                            >
                              <FormControl>
                                <RadioGroupItem value={key} />
                              </FormControl>
                              <FormLabel className="text-single-line-body-base">
                                {label}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-1">
                <FormField
                  control={presenceReportForm.control}
                  name="observation_datetime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-body-strong">
                        Când ai făcut observația?
                      </FormLabel>
                      <span className="text-single-line-body-base mb-6">
                        (Dată și oră, dacă este posibil)
                      </span>
                      <FormControl>
                        <Textarea
                          placeholder="Descrie..."
                          className="text-single-line-body-base h-36 bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-1">
                <FormField
                  control={presenceReportForm.control}
                  name="has_media"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-body-strong">
                        Ai reușit să faci fotografii sau înregistrări video?
                      </FormLabel>
                      <FormControl>
                        <div className="flex flex-row gap-8">
                          <div
                            className={`${
                              field.value === true
                                ? "bg-neutral-foreground text-neutral"
                                : "bg-neutral text-neutral-foreground"
                            } flex cursor-pointer flex-row items-center gap-2 rounded-md p-2 select-none`}
                            onClick={() => field.onChange(true)}
                          >
                            {field.value === true && <SVGCheck />}
                            Da
                          </div>
                          <div
                            className={`${
                              field.value === false
                                ? "bg-neutral-foreground text-neutral"
                                : "bg-neutral text-neutral-foreground"
                            } flex cursor-pointer flex-row items-center gap-2 rounded-md p-2 select-none`}
                            onClick={() => field.onChange(false)}
                          >
                            {field.value === false && <SVGCheck />}
                            Nu
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-1 flex-col gap-6">
                <FormField
                  control={presenceReportForm.control}
                  name="wants_updates"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-body-strong mb-6">
                        Dorești să fii contactat pentru actualizări?
                      </FormLabel>
                      <div className="flex flex-col space-y-2">
                        {Object.entries(WANTS_UPDATES_OPTIONS).map(
                          ([value, label]) => (
                            <FormItem
                              key={value}
                              className="flex flex-row items-center space-y-0 space-x-3"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(
                                    value as keyof typeof WANTS_UPDATES_OPTIONS,
                                  )}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([...field.value, value]);
                                    } else {
                                      field.onChange(
                                        field.value.filter((v) => v !== value),
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-single-line-body-base">
                                {label}
                              </FormLabel>
                            </FormItem>
                          ),
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={presenceReportForm.control}
                  name="contact_details"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Lasă-ne aici datele de contact..."
                          className="text-single-line-body-base h-36 bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                className="m-0 w-full sm:w-auto"
                variant="secondary"
                size="md"
                type="submit"
              >
                <SVGPaperPlane /> Trimite Mesaj
              </Button>
            </section>
          </section>
        </Form>
      </form>
    </main>
  );
}
