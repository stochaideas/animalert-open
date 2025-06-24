"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { contactFormSchema } from "./_schemas/contact-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormControl,
  FormLabel,
} from "~/components/ui/simple/form";
import { Input } from "~/components/ui/simple/input";
import { Textarea } from "~/components/ui/simple/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/simple/select";
import { COUNTIES } from "~/constants/counties";
import { Button } from "~/components/ui/simple/button";
import { SVGPaperPlane } from "~/components/icons";
import { SOLICITATION_TYPES } from "./_constants/solicitation-types";
import { api } from "~/trpc/react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/simple/dialog";
import { TRPCClientError } from "@trpc/client";

export default function Contact() {
  const [successDialog, setSuccessDialog] = useState<{
    title: string;
    description: string;
  } | null>(null);
  const [errorDialog, setErrorDialog] = useState<{
    title: string;
    description: string;
  } | null>(null);

  const utils = api.useUtils();

  const {
    mutateAsync: mutateContactAsync,
    isPending: contactIsPending,
    // error: contactError,
  } = api.contact.create.useMutation({
    onSuccess: () => {
      void utils.contact.invalidate();
    },
  });

  const contactForm = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      lastName: "",
      firstName: "",
      phone: "",
      email: "",
      county: undefined,
      solicitationType: "general",
      message: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  function showErrorDialog(title: string, description: string) {
    setErrorDialog({ title, description });
  }

  async function onContactSubmit(values: z.infer<typeof contactFormSchema>) {
    try {
      await mutateContactAsync(values);
      setSuccessDialog({
        title: "Mesaj trimis cu succes",
        description:
          "Îți mulțumim pentru mesaj! Vom reveni cu un răspuns cât mai curând posibil.",
      });
      contactForm.reset(); // Optionally reset the form
    } catch (error) {
      if (error instanceof TRPCClientError) {
        showErrorDialog(
          "Eroare la trimiterea mesajului",
          error.message ||
            "A apărut o problemă la trimiterea mesajului. Vă rugăm să încercați din nou.",
        );
        contactForm.setError("root", {
          message: error.message,
        });
        return;
      }

      showErrorDialog(
        "Eroare necunoscută",
        "A apărut o eroare neașteptată. Încercați din nou mai târziu.",
      );
      contactForm.setError("root", {
        message: "A apărut o eroare necunoscută.",
      });
    }
  }

  return (
    <main className="bg-tertiary flex flex-col gap-24 px-6 pt-20 pb-40 lg:flex-row lg:gap-14 2xl:px-96 2xl:pt-24 2xl:pb-52">
      <section className="flex flex-col justify-center gap-8 self-start lg:w-1/2">
        <h1 className="text-heading-1">Contact</h1>
        <p className="text-body">
          Ne poți contacta pentru a semnala un animal sălbatic rănit sau în
          pericol, pentru informații despre proiectele noastre sau pentru a afla
          cum poți ajuta.
        </p>
        <p className="text-subheading">
          Împreună protejăm și ajutăm fauna sălbatică!
        </p>
        <div className="grid h-full gap-3 md:grid-cols-2 md:grid-rows-2">
          <div className="h-full w-full md:col-start-1 md:row-start-1">
            <Image
              alt="Colaborare"
              src="/images/contact-hands.png"
              width={330}
              height={172}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="h-full w-full md:col-start-1 md:row-start-2">
            <Image
              alt="Colaborare"
              src="/images/contact-bird.svg"
              width={330}
              height={172}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="h-full w-full md:col-start-2 md:row-span-2 md:row-start-1">
            <Image
              alt="Colaborare"
              src="/images/contact-bunny.png"
              width={330}
              height={344} // 172+172=344 to match left side
              className="h-full w-full rounded-md object-cover"
            />
          </div>
        </div>
      </section>
      <form
        onSubmit={contactForm.handleSubmit(onContactSubmit)}
        className="lg:w-1/2"
      >
        <Form {...contactForm}>
          <section className="bg-neutral text-neutral-foreground border-tertiary-border mb-4 h-full rounded-md border-1 px-4 py-8 md:p-12">
            <section className="mb-4 flex flex-col gap-8">
              <div className="flex-1">
                <FormField
                  control={contactForm.control}
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
                  control={contactForm.control}
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
                  control={contactForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-0">
                        Număr de telefon
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: 0745 234 566"
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
                  control={contactForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-0">
                        Adresă email
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: cris.popescu@email.com"
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
                  control={contactForm.control}
                  name="county"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-0">
                        Localizare (zona în care poți să activezi)
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full p-6 hover:cursor-pointer">
                            <SelectValue placeholder="Selectează Județ" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-neutral">
                          {Object.entries(COUNTIES).map(
                            ([countyCode, countyName]) => (
                              <SelectItem
                                className="hover:bg-neutral-hover hover:cursor-pointer"
                                key={countyCode}
                                value={countyCode}
                              >
                                {countyName}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex-1">
                <FormField
                  control={contactForm.control}
                  name="solicitationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-0">
                        Alege tipul solicitării
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full p-6 hover:cursor-pointer">
                            <SelectValue placeholder="Selectează tipul solicitării" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-neutral">
                          {Object.entries(SOLICITATION_TYPES).map(
                            ([solicitationTypeCode, solicitationTypeName]) => (
                              <SelectItem
                                className="hover:bg-neutral-hover hover:cursor-pointer"
                                key={solicitationTypeCode}
                                value={solicitationTypeCode}
                              >
                                {solicitationTypeName}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex-1">
                <FormField
                  control={contactForm.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-0">
                        Mesaj
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Scrie aici mesajul tău..."
                          className="resize-none"
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
                disabled={contactIsPending}
              >
                {contactIsPending ? (
                  <>
                    <SVGPaperPlane /> Mesajul se trimite
                  </>
                ) : (
                  <>
                    <SVGPaperPlane /> Trimite Mesaj
                  </>
                )}
              </Button>
            </section>
          </section>
        </Form>
      </form>
      <Dialog
        open={!!successDialog}
        onOpenChange={(open) => {
          if (!open) setSuccessDialog(null);
        }}
      >
        <DialogContent className="bg-tertiary">
          <DialogHeader>
            <DialogTitle>{successDialog?.title}</DialogTitle>
            <DialogDescription>{successDialog?.description}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!errorDialog}
        onOpenChange={(open) => {
          if (!open) setErrorDialog(null);
        }}
      >
        <DialogContent className="bg-tertiary">
          <DialogHeader>
            <DialogTitle>{errorDialog?.title}</DialogTitle>
            <DialogDescription>{errorDialog?.description}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
}
