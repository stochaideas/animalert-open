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
import { type presenceFormSchema } from "../_schemas/presence-form-schema";
import { useVideoThumbnail } from "~/hooks/useVideoThumbnail";

export default function Contact({
  handlePreviousPage,
  presenceForm,
  presenceImageFiles,
  handlePresenceImageChange,
  onPresenceSubmit,
  isPending,
}: {
  handlePreviousPage: () => void;
  presenceForm: ReturnType<typeof useForm<z.infer<typeof presenceFormSchema>>>;
  presenceImageFiles: {
    image1: File | undefined;
    image2: File | undefined;
    image3: File | undefined;
    video1: File | undefined;
  };
  handlePresenceImageChange: (
    e: ChangeEvent<HTMLInputElement>,
    name: string,
    fieldOnChange: (value: File | null, shouldValidate?: boolean) => void,
  ) => void;
  onPresenceSubmit: (data: z.infer<typeof presenceFormSchema>) => void;
  isPending?: boolean;
}) {
  const FileFormField: React.FC<{
    file: "image1" | "image2" | "image3" | "video1";
  }> = ({ file }) => {
    let url: string | undefined;

    if (presenceImageFiles[file]) {
      url = URL.createObjectURL(presenceImageFiles[file]);
    }

    const thumbnailUrl = useVideoThumbnail(file === "video1" ? url : undefined);

    if (thumbnailUrl && file === "video1") {
      url = thumbnailUrl;
    }

    return (
      <FormField
        control={presenceForm.control}
        name={file}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <Input
                id={file}
                className="hidden"
                type="file"
                accept={file === "video1" ? "video/*" : "image/*"}
                onChange={(e) =>
                  handlePresenceImageChange(e, file, field.onChange)
                }
              />
            </FormControl>
            <Label htmlFor={file}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "116px",
                  aspectRatio: "1/1", // or "16/9" or any aspect ratio you want
                  borderRadius: "8px", // optional, for rounded corners
                  overflow: "hidden", // optional, for clean edges
                  cursor: "pointer",
                }}
              >
                <Image
                  alt={
                    file === "video1"
                      ? "Videoclip cu animalul"
                      : "Imagine cu animalul"
                  }
                  src={
                    url ??
                    (file === "video1"
                      ? "/images/report-video-placeholder.png"
                      : "/images/report-image-placeholder.png")
                  }
                  fill
                  style={{
                    objectFit: url ? "cover" : "contain",
                    background: "#e3e3e3",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: `${!url ? "flex" : "none"}`,
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#000", // or any color that contrasts the image
                    fontSize: "1rem",
                    pointerEvents: "none", // so clicks pass through to the image/container
                  }}
                >
                  <span className="text-center">
                    {file === "video1" ? (
                      <>
                        Adaugă
                        <br className="block sm:hidden" />
                        <span className="hidden sm:inline"> </span>
                        videoclip
                      </>
                    ) : (
                      <>
                        Adaugă
                        <br className="block sm:hidden" />
                        <span className="hidden sm:inline"> </span>
                        imagine
                      </>
                    )}
                  </span>
                </div>
              </div>
            </Label>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <>
      <form onSubmit={presenceForm.handleSubmit(onPresenceSubmit)}>
        <Form {...presenceForm}>
          <section className="bg-neutral text-neutral-foreground border-tertiary-border mb-4 rounded-md border-1 px-4 py-8 md:p-12">
            <h3 className="text-heading-3 pb-4">Date contact</h3>
            <section className="mb-4 grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="flex-1">
                <FormField
                  control={presenceForm.control}
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
                  control={presenceForm.control}
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
                  control={presenceForm.control}
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
                  control={presenceForm.control}
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
                control={presenceForm.control}
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
                        presenceForm.formState.errors.confidentiality &&
                        "text-red-500"
                      }`}
                    >
                      Prin trimiterea acestei solicitări, confirm că am citit
                      Politica de confidențialitate și sunt de acord ca
                      AnimAlert să stocheze datele mele personale pentru a putea
                      procesa raportarea prezenței
                    </Label>
                  </FormItem>
                )}
              />
              <FormField
                control={presenceForm.control}
                name="receiveOtherReportUpdates"
                render={({ field }) => (
                  <FormItem className="flex items-start gap-3">
                    <FormControl>
                      <Checkbox
                        className="mt-1"
                        id="receiveOtherReportUpdates"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <Label
                      htmlFor="receiveOtherReportUpdates"
                      className="text-body-small"
                    >
                      Vreau să fiu contactat pe WhatsApp despre alte cazuri și
                      activitățile organizației
                    </Label>
                  </FormItem>
                )}
              />
              <FormField
                control={presenceForm.control}
                name="receiveUpdates"
                render={({ field }) => (
                  <FormItem className="flex items-start gap-3">
                    <FormControl>
                      <Checkbox
                        className="mt-1"
                        id="receiveUpdates"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <Label htmlFor="receiveUpdates" className="text-body-small">
                      Vreau să primesc update pe email despre caz
                    </Label>
                  </FormItem>
                )}
              />
            </div>
          </section>
          <section className="bg-neutral text-neutral-foreground border-tertiary-border mb-12 rounded-md border-1 px-4 py-8 md:p-12">
            <h3 className="text-heading-3 pb-4">Fișiere foto și video</h3>
            <p className="text-body pb-3">Adăugați fotografii cu animalul.</p>
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {Object.keys(presenceImageFiles).map((key) => (
                <FileFormField
                  key={key}
                  file={key as "image1" | "image2" | "image3" | "video1"}
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
              disabled={isPending}
            >
              {isPending ? (
                <>Se salvează</>
              ) : (
                <>
                  Salvează și continuă <SVGArrowRight />
                </>
              )}
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
