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
} from "~/components/ui/simple/form";
import { FormControl, FormLabel } from "@mui/material";
import { Input } from "~/components/ui/simple/input";

export default function Contact() {
  const contactForm = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      lastName: "",
      firstName: "",
      phone: "",
      email: undefined,
      county: "CJ",
      message: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  function onContactSubmit(values: z.infer<typeof contactFormSchema>) {
    console.log(values);
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
          {/* Image 1 */}
          <div className="h-full w-full md:col-start-1 md:row-start-1">
            <Image
              alt="Colaborare"
              src="/images/contact-hands.png"
              width={330}
              height={172}
              className="h-full w-full object-cover"
            />
          </div>
          {/* Image 2 */}
          <div className="h-full w-full md:col-start-1 md:row-start-2">
            <Image
              alt="Colaborare"
              src="/images/contact-bird.svg"
              width={330}
              height={172}
              className="h-full w-full object-cover"
            />
          </div>
          {/* Image 3 */}
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
                  control={contactForm.control}
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
              <div className="flex-1">
                <FormField
                  control={contactForm.control}
                  name="county"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Localizare (zona în care poți să activezi)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Selectează Județ"
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
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mesaj</FormLabel>
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
          </section>
        </Form>
      </form>
    </main>
  );
}
