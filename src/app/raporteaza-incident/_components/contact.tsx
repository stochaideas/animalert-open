"use client";

import { Label } from "@radix-ui/react-label";
import { SVGArrowLeft, SVGArrowRight } from "~/components/icons";
import { Button } from "~/components/ui/simple/button";
import { Checkbox } from "~/components/ui/simple/checkbox";
import type { z } from "zod";
import { type useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/simple/form";
import { Input } from "~/components/ui/simple/input";
import { type ChangeEvent } from "react";
import Image from "next/image";
import { type formSchema } from "../_utils/contact-form-schema";

export default function Contact({
  handlePreviousPage,
  form,
  imagePreviews,
  handleImageChange,
  onSubmit,
}: {
  handlePreviousPage: () => void;
  form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
  imagePreviews: {
    image1: string | undefined;
    image2: string | undefined;
    image3: string | undefined;
    image4: string | undefined;
  };
  handleImageChange: (
    e: ChangeEvent<HTMLInputElement>,
    name: string,
    fieldOnChange: (value: File | null, shouldValidate?: boolean) => void,
  ) => void;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
}) {
  const ImageFormField: React.FC<{
    image: "image1" | "image2" | "image3" | "image4";
  }> = ({ image }) => (
    <FormField
      control={form.control}
      name={image}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormControl>
            <Input
              id={image}
              className="hidden"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, image, field.onChange)}
            />
          </FormControl>
          <Label htmlFor={image}>
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "116px",
                aspectRatio: "1/1", // or "16/9" or any aspect ratio you want
                borderRadius: "8px", // optional, for rounded corners
                overflow: "hidden", // optional, for clean edges
              }}
            >
              <Image
                alt="Imagine cu incidentul"
                src={
                  imagePreviews[image] ??
                  "/images/incident-report-image-placeholder.png"
                }
                fill
                style={{
                  objectFit: imagePreviews[image] ? "cover" : "contain",
                  background: "#e3e3e3",
                }}
              />
            </div>
          </Label>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Form {...form}>
          <section className="bg-neutral text-neutral-foreground border-tertiary-border mb-4 rounded-md border-1 p-12">
            <h3 className="text-heading-3 pb-4">Date contact</h3>
            <section className="mb-4 grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-0">
                        Nume
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Popescu"
                          className="p-6"
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
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-0">
                        Prenume
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Cristina"
                          className="p-6"
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
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-0">
                        Număr de telefon
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Număr de telefon"
                          className="p-6"
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
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresă email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Adresă de email"
                          className="p-6"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="confidentiality"
                render={({ field }) => (
                  <FormItem className="flex items-start gap-3">
                    <FormControl>
                      <Checkbox
                        className="mt-1"
                        id="confidentiality"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <Label
                      htmlFor="confidentiality"
                      className={`text-body-small ${
                        form.formState.errors.confidentiality && "text-red-500"
                      }`}
                    >
                      Prin trimiterea acestei solicitări, confirm că am citit
                      Politica de confidențialitate și sunt de acord ca
                      AnimAlert să stocheze datele mele personale pentru a putea
                      procesa raportarea incidentului
                    </Label>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="receiveOtherCaseUpdates"
                render={({ field }) => (
                  <FormItem className="flex items-start gap-3">
                    <FormControl>
                      <Checkbox
                        className="mt-1"
                        id="receiveOtherCaseUpdates"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <Label
                      htmlFor="receiveOtherCaseUpdates"
                      className="text-body-small"
                    >
                      Vreau să fiu contactat pe WhatsApp despre alte cazuri și
                      activitățile organizației
                    </Label>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="receiveCaseUpdates"
                render={({ field }) => (
                  <FormItem className="flex items-start gap-3">
                    <FormControl>
                      <Checkbox
                        className="mt-1"
                        id="receiveCaseUpdates"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <Label
                      htmlFor="receiveCaseUpdates"
                      className="text-body-small"
                    >
                      Vreau să primesc update pe email despre caz
                    </Label>
                  </FormItem>
                )}
              />
            </div>
          </section>
          <section className="bg-neutral text-neutral-foreground border-tertiary-border mb-12 rounded-md border-1 p-12">
            <h3 className="text-heading-3 pb-4">Fișiere foto și video</h3>
            <p className="text-body pb-3">
              Încărcați cel puțin o imagine
              <span className="text-red-500">*</span> (obligatoriu). Adăugați
              fotografii atât cu animalul cât și cu incidentul.
            </p>
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {Object.keys(imagePreviews).map((key) => (
                <ImageFormField
                  key={key}
                  image={key as "image1" | "image2" | "image3" | "image4"}
                />
              ))}
            </div>
          </section>
          <section className="flex flex-col items-center justify-end gap-6 md:flex-row-reverse md:justify-start">
            <Button
              className="m-0 w-full sm:w-auto"
              variant="primary"
              size="md"
              type="submit"
            >
              Salvează și continuă <SVGArrowRight />
            </Button>
            <Button
              className="m-0 w-full sm:w-auto"
              variant="neutral"
              size="md"
              onClick={handlePreviousPage}
            >
              <SVGArrowLeft /> Înapoi
            </Button>
          </section>
        </Form>
      </form>
    </>
  );
}
