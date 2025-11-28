"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { values } from "lodash";
import { Trash } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "~/components/ui/simple/button";
import { Checkbox } from "~/components/ui/simple/checkbox";
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
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_VIDEO_TYPES,
} from "~/constants/file-constants";
import {
  petitionPlaceholderMap,
  type PetitionType,
} from "~/constants/petition-form-constants";
import { complaintSchema } from "~/shared/sesizari/complaint.schema";
import { api } from "~/trpc/react";
import { fillTemplate } from "~/utils/templates";
import { COUNTIES } from "../../constants/counties";

export default function Sesizari() {
  const MAX_SIZE_MB = 10;
  const [templateHtml, setTemplateHtml] = useState<string | undefined>();
  const [previewHtml, setPreviewHtml] = useState<string | undefined>();
  const [templateTypes, setTemplateTypes] = useState<PetitionType[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [sendDisabled, setSendDisabled] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const { mutateAsync: mutateComplaintAsync } =
    api.complaint.generateAndSendComplaint.useMutation({
      onSuccess: () => {
        void utils.complaint.invalidate();
      },
    });

  const { mutateAsync: uploadFileToS3Async } =
    api.s3.getUploadFileSignedUrl.useMutation({
      onSuccess: () => {
        void utils.s3.invalidate();
      },
    });

  const selectedPetition = Number(form.watch("incidentType"));
  const { data: templateData } = api.complaintTemplate.getTemplate.useQuery(
    { id: selectedPetition },
    {
      enabled: Boolean(selectedPetition),
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    if (templateData?.html) {
      setTemplateHtml(templateData.html);
      setPreviewHtml(undefined);
    } else {
      setTemplateHtml(undefined);
      setPreviewHtml(undefined);
    }
  }, [templateData]);

  const templateType = api.complaintTemplate.getTemplateTypes.useQuery();

  useEffect(() => {
    if (templateType.data) {
      setTemplateTypes(templateType.data);
    }
  }, [templateType]);

  function onPreviewClick() {
    if (templateHtml) {
      const formData = form.getValues();
      const filledTemplate = fillTemplate(
        templateHtml,
        formData,
        petitionPlaceholderMap,
      );
      setPreviewHtml(filledTemplate);
    } else {
      toast.error(
        "A apărut o eroare la crearea petiției dvs. Vă rugăm să încercați din nou, mai târziu. Dacă problema persistă, vă rugăm să o raportați in formularul de contact!",
      );
    }
  }

  async function sendAndSave() {
    setSendDisabled(true);
    if (selectedFiles.length > 0) {
      setUploading(true);
      try {
        const keys = await handleImagesUpload(selectedFiles);
        const successfulKeys = keys.filter(Boolean);
        form.setValue("attachments", successfulKeys);
      } catch {
        toast.error("Eroare la încărcarea fișierelor. Vă rugăm să încercați din nou, respectand limitarile fisierelor.");
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    try {
      const result = await mutateComplaintAsync({
        ...form.getValues(),
        incidentType: Number(form.getValues().incidentType),
      });

      if (result?.success) {
        const publicId = result.publicId ? ` (ID public: ${result.publicId})` : "";
        toast(`Petitia a fost trimisa spre validare${publicId}.`);
        form.reset();
        setSelectedFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        toast.error("Eroare la generarea petitiei.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "A apărut o eroare neașteptată.",
      );
    } finally {
      setSendDisabled(false);
    }
  }

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
  async function handleImagesUpload(files: File[]) {
    try {
      const urls = await Promise.all(
        files.map(async (file, index) => {
          const extension = file.name.split(".").pop();
          const fileName = `file_${Date.now()}_${index}.${extension}`;

          const response = await uploadFileToS3Async({
            fileName,
            fileType: file.type,
            fileSize: file.size,
          });

          if (!response || typeof response.url !== "string") {
            throw new Error("Failed to get a valid URL for the file upload");
          }

          await fetch(response.url, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type },
            mode: "cors",
          });

          return response.key;
        }),
      );
      return urls;
    } catch (error) {
      toast.error("Eroare la încărcarea fișierelor.");
      form.setError("attachments", {
        message:
          error instanceof Error
            ? error.message
            : "Failed to upload media content",
      });
      throw error;
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files ?? []);
    if (newFiles.length === 0) return;

    // Filter valid files by your conditions
    const validFiles = newFiles.filter((file) => {
      const isAcceptedType =
        ACCEPTED_IMAGE_TYPES.includes(file.type) ||
        ACCEPTED_VIDEO_TYPES.includes(file.type);
      if (!isAcceptedType) {
        form.setError("attachments", {
          type: "manual",
          message: `Tipul fișierului nu este acceptat: ${file.name}`,
        });
        return false;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        form.setError("attachments", {
          type: "manual",
          message: `Fișier prea mare: ${file.name}`,
        });
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles]);

    form.clearErrors("attachments");
  };

  const confidentiality = form.watch("confidentiality");

  function handleRemoveFile(idxToRemove: number) {
    setSelectedFiles((files) => {
      const updated = files.filter((_, idx) => idx !== idxToRemove);
      if (updated.length === 0 && fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return updated;
    });
  }

  return (
    <main className="bg-tertiary px-6 pt-20 pb-40 2xl:px-96 2xl:pt-24 2xl:pb-52">
      <h1 className="mb-10 text-center text-4xl font-bold text-black">
        Sesizare/Petiție
      </h1>
      <Form {...form}>
        <section className="bg-neutral text-neutral-foreground border-tertiary-border mb-4 rounded-md border-1 px-4 py-8 md:p-12">
          <form onSubmit={form.handleSubmit(values)} className="space-y-6">
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
                  <FormLabel>Nr. de telefon</FormLabel>
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
                  <FormLabel>Destinatar (instituție)</FormLabel> 
                   {/* Judet (unitate poliție) */}
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
                      placeholder="Adr. de e-mail a institutiei (unității de poliție)"
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
                      placeholder="Detalii adresa, strada, numar, puncte de reper etc."
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
                      placeholder="Descrie situatia/incidentul în detaliu:"
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
              render={() => (
                <FormItem>
                  <FormLabel>Incarcă imagini/video despre incident</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*, video/*"
                      multiple
                      onChange={handleFileChange}
                      ref={fileInputRef}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <ul>
              {selectedFiles.map((file, idx) => (
                <li key={file.name + idx} className="mb-1 flex items-center">
                  <Trash
                    onClick={() => handleRemoveFile(idx)}
                    className="mr-4 shrink-0"
                  />
                  <span className="max-w-xs truncate">
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </li>
              ))}
            </ul>

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
                    și sunt de acord ca EcoAlert (AnimAlert) să stocheze datele mele
                    personale pentru a putea procesa raportarea problemei descrise.
                    (conflictului/interacțiunii).
                  </Label>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              variant="secondary"
              className="mr-4"
              onClick={sendAndSave}
              disabled={!confidentiality || uploading || sendDisabled}
            >
              Trimite spre validare
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="neutral"
                  onClick={onPreviewClick}
                  disabled={!templateHtml}
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
                  srcDoc={previewHtml ?? templateHtml ?? ""}
                />

                <DialogFooter>
                  <Button
                    variant="primary"
                    size="sm"
                    className="min-w-44"
                    disabled={!confidentiality || uploading || sendDisabled}
                    onClick={sendAndSave}
                  >
                    Trimite spre validare
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </form>
        </section>
      </Form>
    </main>
  );
}
