"use client";

import { Label } from "@radix-ui/react-label";
import { SVGArrowLeft, SVGArrowRight } from "~/components/icons";
import { Button } from "~/components/ui/simple/button";
import { Checkbox } from "~/components/ui/simple/checkbox";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/simple/form";
import { Input } from "~/components/ui/simple/input";
import { phoneNumberSchema } from "~/lib/mobile-validator";
import { useState, type ChangeEvent } from "react";
import Image from "next/image";

const formSchema = z.object({
  lastName: z.string().min(1, {
    message: "Numele de familie este necesar",
  }),
  firstName: z.string().min(1, {
    message: "Prenumele este necesar",
  }),
  phone: phoneNumberSchema,
  email: z
    .string()
    .email({
      message: "Adresa de email nu este validă",
    })
    .optional(),
  confidentiality: z.boolean().refine((val) => val === true, {
    message: "Trebuie să accepți Politica de confidențialitate",
  }),
  receiveCaseUpdates: z.boolean().optional(),
  receiveOtherCaseUpdates: z.boolean().optional(),
  image1: z
    .instanceof(File, {
      message: "Fișierul trebuie să fie o imagine",
    })
    .refine(
      (file) =>
        [
          "image/png",
          "image/jpeg",
          "image/jpg",
          "image/svg+xml",
          "image/gif",
          "image/webp",
        ].includes(file.type),
      { message: "Fișierul trebuie să fie o imagine" },
    )
    .optional(),
  image2: z
    .instanceof(File, {
      message: "Fișierul trebuie să fie o imagine",
    })
    .refine(
      (file) =>
        [
          "image/png",
          "image/jpeg",
          "image/jpg",
          "image/svg+xml",
          "image/gif",
          "image/webp",
        ].includes(file.type),
      { message: "Fișierul trebuie să fie o imagine" },
    )
    .optional(),
  image4: z
    .instanceof(File, {
      message: "Fișierul trebuie să fie o imagine",
    })
    .refine(
      (file) =>
        [
          "image/png",
          "image/jpeg",
          "image/jpg",
          "image/svg+xml",
          "image/gif",
          "image/webp",
        ].includes(file.type),
      { message: "Fișierul trebuie să fie o imagine" },
    )
    .optional(),
  image3: z
    .instanceof(File, {
      message: "Fișierul trebuie să fie o imagine",
    })
    .refine(
      (file) =>
        [
          "image/png",
          "image/jpeg",
          "image/jpg",
          "image/svg+xml",
          "image/gif",
          "image/webp",
        ].includes(file.type),
      { message: "Fișierul trebuie să fie o imagine" },
    )
    .optional(),
});

export default function Contact({
  handleNextPage,
  handlePreviousPage,
}: {
  handleNextPage: () => void;
  handlePreviousPage: () => void;
}) {
  // Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lastName: "",
      firstName: "",
      phone: "",
      email: undefined,
      confidentiality: false,
      receiveCaseUpdates: false,
      receiveOtherCaseUpdates: false,
      image1: undefined,
      image2: undefined,
      image3: undefined,
      image4: undefined,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const [imagePreviews, setImagePreviews] = useState({
    image1: undefined,
    image2: undefined,
    image3: undefined,
    image4: undefined,
  });

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    name: string,
    fieldOnChange: (value: File | null, shouldValidate?: boolean) => void,
  ) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreviews((prev) => ({
        ...prev,
        [name]: url,
      }));
      fieldOnChange(file); // Update react-hook-form state
    }
  };

  // Define a submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

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
          <section className="flex flex-col items-center justify-end gap-6 md:flex-row-reverse">
            <Button
              className="m-0 w-full sm:w-auto"
              variant="primary"
              size="md"
              type="submit"
              onClick={async () => {
                await form.trigger();
                if (form.formState.isValid) {
                  handleNextPage();
                }
              }}
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
