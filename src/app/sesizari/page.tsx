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
import { PETITION_TYPES, petitionPlaceholderMap } from "~/constants/petition-form-constants";
import { api } from "~/trpc/react";
import { fillTemplate } from "~/utils/templates";
import { COUNTIES } from "../../constants/counties";
import { policeReportSchema } from "./_schemas/police-report-form-schema";

export default function Sesizari({
  reportSchema,
}: {
  reportSchema: ReturnType<typeof useForm<z.infer<typeof policeReportSchema>>>;
}) {
  const [petitionTemplate, setPetitionTemplate] = useState<string | undefined>(
    undefined,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [petitionType, setPetitionType] = useState<string>(
    "/templates/petite-capturare-specie-salbatica.html",
  );

  const utils = api.useUtils();
  const {
    mutateAsync: mutateComplaintAsync,
    isPending: complaintIsPending,
    reset: resetConflictMutation,
  } = api.complaint.generatePDF.useMutation({
    onSuccess: () => {
      void utils.complaint.invalidate();
    },
  });

  useEffect(() => {
    const loadTemplate = async () => {
      const res = fetch(petitionType)
        .then((res) => res.text())
        .then(setPetitionTemplate)
        .catch((err) => {
          console.error("Failed to load template:", err);
        });
    };
    loadTemplate();
  }, [petitionType]);

  const form = useForm<z.infer<typeof policeReportSchema>>({
    resolver: zodResolver(policeReportSchema),
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
      subject: "",
      incidentDescription: "",
      incidentAddress: "",
      incidentCity: "",
      incidentCounty: "CJ",
      incidentDate: "",
    },
  });

  const onSubmit = (values: z.infer<typeof policeReportSchema>) => {
    console.log(values);
  };

  function onPreviewClick() {
    console.log("preview doc");
    if (petitionTemplate) {
      const formData = form.getValues();
      console.log("formData before filling");
      console.log(formData);
      const filledTemplate = fillTemplate(
        petitionTemplate,
        formData,
        petitionPlaceholderMap,
      );
      setPetitionTemplate(filledTemplate);
    } else {
      setErrorMessage(
        "Something went wrong with creating your petition. Please try again later. If the problem persits, please report it!",
      );
    }
  }

  async function sendAndSave(){
      const generatorInput = {
        template: petitionTemplate || "",
      };
      console.log("calling endpoint")
     await mutateComplaintAsync(generatorInput);
  }

  return (
    <main className="bg-tertiary px-6 pt-20 pb-40 2xl:px-96 2xl:pt-24 2xl:pb-52">
      <h1 className="text-4xl font-bold text-center text-black mb-10">
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
                      <Input placeholder="Numele localitatii" {...field} />
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
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selectează tipul de incident" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-neutral">
                        {Object.keys(PETITION_TYPES).map((code) => (
                          <SelectItem key={code} value={code}>
                            {PETITION_TYPES[code as keyof typeof PETITION_TYPES]}
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
                    <Input
                      placeholder="O sa fie un select cu ce trebuie "
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subiect</FormLabel>
                  <FormControl>
                    <Input placeholder="Subiectul sesizarii" {...field} />
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
                      <Input placeholder="Numele localitatii" {...field} />
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

            <Button type="submit" variant="secondary" className="mr-4" onClick={sendAndSave}>
              Trimite
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="neutral" onClick={onPreviewClick}>
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
                  <Button variant="primary" size="sm" className="min-w-44" onClick={sendAndSave}>
                    Salveaza si trimite
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {errorMessage ?? (
              <Label className="block text-amber-900">{errorMessage}</Label>
            )}
          </form>
        </section>
      </Form>
    </main>
  );
}
