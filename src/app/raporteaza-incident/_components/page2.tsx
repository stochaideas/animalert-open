"use client";

import { Label } from "@radix-ui/react-label";
import { SVGArrowLeft, SVGArrowRight } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
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
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import Image from "next/image";

const formSchema = z.object({
  lastName: z.string().min(1, {
    message: "Numele de familie este necesar",
  }),
  firstName: z.string().min(1, {
    message: "Prenumele este necesar",
  }),
  phone: z.string().min(1, {
    message: "Numărul de telefon este necesar",
  }),
  email: z
    .string()
    .email({
      message: "Adresa de email nu este validă",
    })
    .optional(),
  confidentiality: z.boolean().refine((val) => val === true, {
    message: "Trebuie să accepți termenii și condițiile",
  }),
  receiveCaseUpdates: z.boolean().optional(),
  receiveOtherCaseUpdates: z.boolean().optional(),
});

export default function Page2({
  setTermsAccepted,
  handleNextPage,
  handlePreviousPage,
}: {
  setTermsAccepted: (value: boolean) => void;
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
      email: "",
      confidentiality: false,
      receiveCaseUpdates: false,
      receiveOtherCaseUpdates: false,
    },
  });

  // Define a submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Form {...form}>
          <section className="bg-neutral text-neutral-foreground border-tertiary-border mb-[1rem] rounded-md border-1 p-[3rem]">
            <h3 className="text-heading-3 pb-[1rem]">Date contact</h3>
            <section className="mb-[1rem] flex flex-col gap-[2rem]">
              <div className="flex flex-row justify-between gap-[2rem]">
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
                            className="p-[1.5rem]"
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
                            className="p-[1.5rem]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-row justify-between gap-[2rem]">
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
                            className="p-[1.5rem]"
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
                            className="p-[1.5rem]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="confidentiality"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-1">
                      <FormControl>
                        <Checkbox
                          id="terms"
                          checked={field.value}
                          onCheckedChange={(checked) =>
                            setTermsAccepted(checked.valueOf() as boolean)
                          }
                        />
                      </FormControl>
                      <Label htmlFor="terms" className="text-body-small">
                        Prin trimiterea acestei solicitări, confirm că am citit
                        Politica de confidențialitate și sunt de acord ca
                        AnimAlert să stocheze datele mele personale pentru a
                        putea procesa raportarea incidentului
                      </Label>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="receiveCaseUpdates"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-1">
                      <FormControl>
                        <Checkbox
                          id="receiveCaseUpdates"
                          checked={field.value}
                          onCheckedChange={(checked) =>
                            field.onChange(checked.valueOf() as boolean)
                          }
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
                <FormField
                  control={form.control}
                  name="receiveOtherCaseUpdates"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-1">
                      <FormControl>
                        <Checkbox
                          id="receiveOtherCaseUpdates"
                          checked={field.value}
                          onCheckedChange={(checked) =>
                            field.onChange(checked.valueOf() as boolean)
                          }
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
              </div>
            </section>
          </section>
          <section className="bg-neutral text-neutral-foreground border-tertiary-border mb-[3rem] rounded-md border-1 p-[3rem]">
            <h3 className="text-heading-3 pb-[1rem]">Fișiere foto și video</h3>
            <p className="text-body pb-[0.75rem]">
              Încărcați cel puțin o imagine
              <span className="text-red-500">*</span> (obligatoriu). Adăugați
              fotografii atât cu animalul cât și cu incidentul.
            </p>
            <div className="flex flex-row gap-[2rem]">
              <Image
                width={185}
                height={116}
                src="/images/incident-report-image-placeholder.png"
                alt="Incarca o imagine"
                className="cursor-pointer"
              />
              <Image
                width={185}
                height={116}
                src="/images/incident-report-image-placeholder.png"
                alt="Incarca o imagine"
                className="cursor-pointer"
              />
              <Image
                width={185}
                height={116}
                src="/images/incident-report-image-placeholder.png"
                alt="Incarca o imagine"
                className="cursor-pointer"
              />
              <Image
                width={185}
                height={116}
                src="/images/incident-report-image-placeholder.png"
                alt="Incarca o imagine"
                className="cursor-pointer"
              />
            </div>
          </section>
          <section className="flex items-center justify-end gap-[1.5rem]">
            <Button
              className="m-0"
              variant="neutral"
              size="md"
              onClick={handlePreviousPage}
            >
              <SVGArrowLeft /> Înapoi
            </Button>
            <Button
              className="m-0"
              variant="primary"
              size="md"
              onClick={handleNextPage}
            >
              Salvează și continuă <SVGArrowRight />
            </Button>
          </section>
        </Form>
      </form>
    </>
  );
}
