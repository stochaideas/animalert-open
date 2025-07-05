"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "~/components/ui/simple/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/simple/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/simple/form";
import { Input } from "~/components/ui/simple/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/simple/select";
import { Textarea } from "~/components/ui/simple/textarea";
import {
  petitionPlaceholderMap,
  type PetitionType,
} from "~/constants/petition-form-constants";
import { api } from "~/trpc/react";
import { fillTemplate } from "~/utils/templates";
import { COUNTIES } from "../../constants/counties";
import { complaintSchema } from "~/shared/sesizari/complaint.schema";
import {
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_VIDEO_TYPES,
} from "~/constants/file-constants";
import { Checkbox } from "~/components/ui/simple/checkbox";
import Link from "next/link";

export default function Sesizari({
  reportSchema,
}: {
  reportSchema: ReturnType<typeof useForm<z.infer<typeof complaintSchema>>>;
}) {
  const MAX_SIZE_MB = 10;
  const [petitionTemplate, setPetitionTemplate] = useState<string | undefined>(
    undefined,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [templateTypes, setTemplateTypes] = useState<PetitionType[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof complaintSchema>>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      country: "Romania",
      county: "CJ",
      city: "",
      street: "",
      houseNumber: "",
      building: "",
      staircase: "",
      apartment: "",
      phoneNumber: "",
      destinationInstitute: "",
      destionationInstituteEmail: "",
      incidentDescription: "",
      incidentAddress: "",
      incidentCity: "",
      incidentType: -1,
      incidentCounty: "CJ",
      incidentDate: new Date().toISOString().split("T")[0],
      confidentiality: false,
      attachments: [],
    },
  });

  const utils = api.useUtils();
  const { mutateAsync: mutateComplaintAsync, isSuccess: isComplaintSuccess } =
    api.complaint.generateAndSendComplaint.useMutation({
      onSuccess: () => {
        void utils.complaint.invalidate();
      },
    });

  const {
    mutateAsync: uploadFileToS3Async,
    isPending: uploadFileToS3IsPending,
  } = api.s3.getUploadFileSignedUrl.useMutation({
    onSuccess: () => {
      void utils.s3.invalidate();
    },
  });

  const selectedPetition = Number(form.watch("incidentType"));
  const { data: templateData } = api.complaintTemplate.getTemplate.useQuery(
    { id: selectedPetition! },
    {
      enabled: !!selectedPetition,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    if (templateData) {
      setPetitionTemplate(templateData.html);
    }
  }, [templateData]);

  const templateType = api.complaintTemplate.getTemplateTypes.useQuery();

  useEffect(() => {
    if (templateType.data) {
      setTemplateTypes(templateType.data);
    }
  }, [templateType]);

  const onSubmit = (values: z.infer<typeof complaintSchema>) => {
    sendAndSave();
  };

  function onPreviewClick() {
    if (petitionTemplate) {
      const formData = form.getValues();
      const filledTemplate = fillTemplate(
        petitionTemplate,
        formData,
        petitionPlaceholderMap,
      );
      setPetitionTemplate(filledTemplate);
    } else {
      setErrorMessage(
        "A fost o eroare la crearea petiției dvs. Vă rugăm să încercați din nou mai târziu. Dacă problema persistă, vă rugăm să o raportați!",
      );
    }
  }

  async function sendAndSave() {
    await mutateComplaintAsync({
      ...form.getValues(),
      incidentType: Number(form.getValues().incidentType),
    });
    if (isComplaintSuccess) {
      form.reset();
      window.location.reload();
    }
  }

  useEffect(() => {
    if (isComplaintSuccess) {
      setToastMessage("Petiția a fost generată cu succes!");
    }
  }, [isComplaintSuccess]);

  /**
   * Uploads an array of image files to S3 asynchronously and returns their keys.
   *
   * For each file in the input array, this function:
   * - Requests a pre-signed S3 upload URL and key using `uploadFileToS3Async`.
   * - Uploads the file to the obtained URL via a PUT request.
   * - Returns the S3 key for each successfully uploaded file.
   *
   * If a file is `undefined`, it is skipped and `null` is returned for that position.
   * If any upload fails, an error dialog is shown and the error is set on the form.
   *
   * @param files - An array of `File` objects or `undefined` values to be uploaded.
   * @returns A promise that resolves to an array of S3 keys (or `null` for skipped files).
   * @throws If any upload or pre-signed URL request fails, the error is shown and re-thrown.
   */
  async function handleImagesUpload(files: (File | undefined)[]) {
    try {
      const urls = await Promise.all(
        Array.from(files).map(async (file, index) => {
          if (!file) return null;

          const response = await uploadFileToS3Async({
            fileName: `file_${index}`,
            fileType: file.type,
            fileSize: file.size,
          });

          if (!response || typeof response.url !== "string") {
            throw new Error("Failed to get a valid URL for the file upload");
          }

          if (!response?.url) {
            throw new Error("Failed to get a valid URL for the file upload");
          }

          const url = response.url;
          const key = response.key;

          if (!url) {
            throw new Error("Failed to get a valid URL for the file upload");
          }

          await fetch(url, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type },
            mode: "cors",
          });

          return key;
        }),
      );
      return urls;
    } catch (error) {
      setErrorMessage("Eroare la încărcarea imaginilor");
      form.setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "Failed to upload media content",
      });
      throw error;
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    //TODO refactor exisitng file upload component from incidents to be usable accross all components
    const validFiles = files.filter((file) => {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        form.setError("attachments", {
          type: "manual",
          message: `Invalid type: ${file.name}`,
        });
        return false;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        form.setError("attachments", {
          type: "manual",
          message: `File too large: ${file.name}`,
        });
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);

    try {
      const keys = await handleImagesUpload(files);
      const successfulKeys = keys.filter(Boolean) as string[];

      form.setValue("attachments", successfulKeys);
    } catch (error) {
      console.error("Upload error", error);
    } finally {
      setUploading(false);
    }
  };

  const confidentiality = form.watch("confidentiality");
  function isSendingDisabled() {
    return !confidentiality || uploading;
  }

  return (
    <main className="bg-tertiary px-6 pt-20 pb-40 2xl:px-96 2xl:pt-24 2xl:pb-52">
      <h1 className="mb-10 text-center text-4xl font-bold text-black">
        Sesizare Poliție
      </h1>
      <Form {...form}>
        <section className="bg-neutral text-neutral-foreground border-tertiary-border mb-4 rounded-md border-1 px-4 py-8 md:p-12">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Label className="block">Date personale</Label>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prenume</FormLabel>
                    <FormControl>
                      <Input placeholder="Ion" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nume de familie</FormLabel>
                    <FormControl>
                      <Input placeholder="Popescu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@exemplu.ro"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-start gap-x-4">
              <FormField
                control={form.control}
                name="county"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Județ</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selectează județul" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-neutral">
                        {Object.keys(COUNTIES).map((code) => (
                          <SelectItem key={code} value={code}>
                            {COUNTIES[code as keyof typeof COUNTIES]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Oraș / Localitate</FormLabel>
                    <FormControl>
                      <Input placeholder="Numele localității" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="item-start flex gap-x-4">
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Strada</FormLabel>
                    <FormControl>
                      <Input placeholder="Numele strazii" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="houseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Număr</FormLabel>
                    <FormControl>
                      <Input placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="building"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bloc</FormLabel>
                    <FormControl>
                      <Input placeholder="XY" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="apartment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apartament</FormLabel>
                    <FormControl>
                      <Input placeholder="000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefon</FormLabel>
                  <FormControl>
                    <Input placeholder="07xxxxxxxx" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Label className="block">Detalii incident</Label>
            <FormField
              control={form.control}
              name="incidentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tip incident</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează tipul de incident" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-neutral">
                      {templateTypes.map((template) => (
                        <SelectItem
                          key={template.id}
                          value={template.id.toString()}
                        >
                          {template.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="destinationInstitute"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destinatar (unitate poliție)</FormLabel>
                  <FormControl>
                    <Input placeholder="Denumirea instituției..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="destionationInstituteEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresă email destinatar</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email-ul unității de poliție"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Label className="block">Locatie incident</Label>

            <div className="flex items-start gap-x-4">
              <FormField
                control={form.control}
                name="incidentCounty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Județ</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selectează județul" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-neutral">
                        {Object.keys(COUNTIES).map((code) => (
                          <SelectItem key={code} value={code}>
                            {COUNTIES[code as keyof typeof COUNTIES]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="incidentCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Oraș/Localitate</FormLabel>
                    <FormControl>
                      <Input placeholder="Numele localității" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="incidentAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Strada</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Detalii adresa, strada, numar, puncte de reper, etc"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="incidentDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conținut</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descrie incidentul în detaliu..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="incidentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data incidentului</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      className="w-40 rounded-md border px-3 py-2 text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="attachments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Incarcă imagini/video despre incident</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*, video/*"
                      multiple
                      onChange={handleFileChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

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
                    Prin trimiterea acestei solicitări, confirm că am citit{" "}
                    <Link
                      href="/politica-confidentialitate"
                      target="_blank"
                      className="underline"
                    >
                      Politica de confidențialitate
                    </Link>{" "}
                    și sunt de acord ca AnimAlert să stocheze datele mele
                    personale pentru a putea procesa raportarea
                    conflictului/interacțiunii.
                  </Label>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              variant="secondary"
              className="mr-4"
              onClick={sendAndSave}
              disabled={isSendingDisabled()}
            >
              Trimite
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="neutral"
                  onClick={onPreviewClick}
                  disabled={!petitionTemplate}
                >
                  Previzualizare document
                </Button>
              </DialogTrigger>

              <DialogContent className="bg-tertiary h-[calc(100dvh-2rem)] min-w-3/5 overflow-auto text-center">
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Petitia dumneavoastra
                  </DialogTitle>
                </DialogHeader>

                <iframe
                  className="h-[75vh] w-full rounded-s border shadow-md"
                  srcDoc={petitionTemplate}
                />

                <DialogFooter>
                  <Button
                    variant="primary"
                    size="sm"
                    className="min-w-44"
                    disabled={isSendingDisabled()}
                    onClick={sendAndSave}
                  >
                    Salveaza si trimite
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <br />
            {errorMessage ?? (
              <Label className="block text-amber-900">{errorMessage}</Label>
            )}
          </form>
        </section>
      </Form>
    </main>
  );
}
