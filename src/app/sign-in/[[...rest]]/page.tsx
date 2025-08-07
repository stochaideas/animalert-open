"use client";

import React, { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormControl,
  FormLabel,
} from "~/components/ui/simple/form";

import { Input } from "~/components/ui/simple/input";
import { Button } from "~/components/ui/simple/button";
import { SVGPaperPlane } from "~/components/icons";
import Link from "next/link";

const signInSchema = z.object({
  email: z.string().email({ message: "Adresa de email nu este validă" }),
  password: z.string().min(1, { message: "Parola este necesară" }),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInFormData) {
    setErrorMessage(null);
    if (!isLoaded) return;

    try {
      const result = await signIn.create({
        identifier: values.email,
        password: values.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId, redirectUrl: "/" });
      }
    } catch (err) {
      if (
        typeof err === "object" &&
        err !== null &&
        "errors" in err &&
        Array.isArray((err as { errors: { longMessage?: string }[] }).errors) &&
        (err as { errors: { longMessage?: string }[] }).errors[0]?.longMessage
      ) {
        setErrorMessage(
          (err as { errors: { longMessage?: string }[] }).errors[0]
            ?.longMessage ?? "Autentificare eșuată.",
        );
      } else {
        setErrorMessage("Autentificare eșuată.");
      }
    }
  }

  async function handleSocialSignIn(
    provider: "oauth_google" | "oauth_facebook",
  ) {
    if (!isLoaded) return;
    await signIn.authenticateWithRedirect({
      strategy: provider,
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/",
    });
  }

  return (
    <main className="bg-neutral flex min-h-screen flex-col items-center justify-center px-6 pt-20 pb-40">
      <div className="border-tertiary-border w-full max-w-md rounded-md border bg-white p-12 shadow-md">
        <h1 className="mb-6 text-2xl font-bold">Autentificare</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Ex: cris.popescu@email.com"
                      {...field}
                      className="p-6"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parolă</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      {...field}
                      className="p-6"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {errorMessage && (
              <p className="text-sm font-semibold text-red-600">
                {errorMessage}
              </p>
            )}

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              variant="secondary"
              size="md"
              className="flex w-full items-center justify-center gap-2"
            >
              <SVGPaperPlane />
              {form.formState.isSubmitting
                ? "Se autentifică..."
                : "Autentifică-te"}
            </Button>
          </form>
        </Form>

        {/* Social sign-in */}
        <div className="border-tertiary-border mt-8 flex flex-col gap-3 border-t pt-6">
          <p className="text-center font-semibold text-gray-500">
            Sau continuă cu
          </p>
          <div className="flex justify-center gap-4">
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="flex-1"
              onClick={() => handleSocialSignIn("oauth_google")}
            >
              Google
            </Button>
            {/* <Button
              type="button"
              variant="secondary"
              size="md"
              className="flex-1"
              onClick={() => handleSocialSignIn("oauth_facebook")}
            >
              Facebook
            </Button> */}
          </div>
        </div>

        {/* Switch to Sign Up */}
        <div className="mt-6 flex flex-col justify-center gap-1 text-center text-gray-700 sm:flex-row">
          <span>Nu ai cont?</span>
          <Link
            href="/sign-up"
            className="font-semibold text-blue-600 underline"
          >
            Înregistrează-te aici
          </Link>
        </div>
      </div>
    </main>
  );
}
