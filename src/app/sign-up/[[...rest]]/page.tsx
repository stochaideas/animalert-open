"use client";

import React, { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
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
import { Checkbox } from "~/components/ui/simple/checkbox";
import { Label } from "~/components/ui/simple/label";
import Link from "next/link";

const signUpSchema = z.object({
  email: z.string().email({ message: "Adresa de email nu este validă" }),
  password: z
    .string()
    .min(6, { message: "Parola trebuie să aibă cel puțin 6 caractere" }),
  acceptTerms: z.boolean({
    errorMap: () => ({ message: "Trebuie să accepți Termenii și Politica" }),
  }),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [step, setStep] = useState<"register" | "verify">("register");
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
      acceptTerms: false,
    },
  });

  // Submit registration form: create user, send verification code
  async function onSubmit(values: SignUpFormData) {
    setErrorMessage(null);
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: values.email,
        password: values.password,
        legalAccepted: values.acceptTerms,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setStep("verify");
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
            ?.longMessage ?? "Înregistrare eșuată.",
        );
      } else {
        setErrorMessage("Înregistrare eșuată.");
      }
    }
  }

  // Verify the code sent to user's email
  async function onVerifyCode() {
    setErrorMessage(null);
    if (!isLoaded) return;

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId, redirectUrl: "/" });
      } else {
        console.error("Verification failed", result);

        setErrorMessage("Verificarea codului a eșuat, încearcă din nou.");
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
            ?.longMessage ?? "Înregistrare eșuată.",
        );
      } else {
        setErrorMessage("Înregistrare eșuată.");
      }
    }
  }

  // Social sign-up handlers (Google/Facebook)
  async function handleSocialSignUp(
    provider: "oauth_google" | "oauth_facebook",
  ) {
    if (!isLoaded) return;

    await signUp.authenticateWithRedirect({
      strategy: provider,
      redirectUrl: "/sso-callback", // Adjust routing as needed
      redirectUrlComplete: "/",
    });
  }

  if (step === "verify") {
    // Render verification code input UI
    return (
      <main className="bg-neutral flex min-h-screen flex-col items-center justify-center px-6 pt-20 pb-40">
        <div className="border-tertiary-border w-full max-w-md rounded-md border bg-white p-12 shadow-md">
          <h1 className="mb-6 text-2xl font-bold">Verificare Email</h1>

          <label htmlFor="code" className="mb-2 block font-semibold">
            Introdu codul primit pe email
          </label>
          <input
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mb-4 w-full rounded border border-gray-300 p-6"
            placeholder="Ex: 123456"
            autoFocus
          />

          {errorMessage && (
            <p className="mb-4 text-sm font-semibold text-red-600">
              {errorMessage}
            </p>
          )}

          <Button type="button" onClick={onVerifyCode} className="w-full">
            Verifică codul
          </Button>
        </div>
      </main>
    );
  }

  // Default render registration form UI
  return (
    <main className="bg-neutral flex min-h-screen flex-col items-center justify-center px-6 pt-20 pb-40">
      <div className="border-tertiary-border w-full max-w-md rounded-md border bg-white p-12 shadow-md">
        <h1 className="mb-6 text-2xl font-bold">Înregistrare</h1>

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
                      autoFocus
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
                      placeholder="******"
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
              name="acceptTerms"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormControl>
                    <Checkbox
                      id="acceptTerms"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <Label
                    htmlFor="acceptTerms"
                    className="text-body-small inline"
                  >
                    Accept{" "}
                    <Link
                      href="/termeni-si-conditii"
                      target="_blank"
                      className="text-blue-500 underline"
                    >
                      Termenii
                    </Link>{" "}
                    și{" "}
                    <Link
                      href="/politica-confidentialitate"
                      target="_blank"
                      className="text-blue-500 underline"
                    >
                      Politica de Confidențialitate
                    </Link>
                  </Label>
                  <FormMessage />
                </FormItem>
              )}
            />

            {errorMessage && (
              <p className="text-sm font-semibold text-red-600">
                {errorMessage}
              </p>
            )}

            <div id="clerk-captcha" />

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              variant="secondary"
              size="md"
              className="flex w-full items-center justify-center gap-2"
            >
              {form.formState.isSubmitting
                ? "Se înregistrează..."
                : "Înregistrează-te"}
            </Button>
          </form>
        </Form>

        {/* Social sign-up */}
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
              onClick={() => handleSocialSignUp("oauth_google")}
            >
              Google
            </Button>
            {/* <Button
              type="button"
              variant="secondary"
              size="md"
              className="flex-1"
              onClick={() => handleSocialSignUp("oauth_facebook")}
            >
              Facebook
            </Button> */}
          </div>
        </div>

        {/* Switch to Sign In */}
        <div className="mt-6 flex flex-col justify-center gap-1 text-center text-gray-700 sm:flex-row">
          <span>Ai deja cont?</span>
          <Link
            href="/sign-in"
            className="font-semibold text-blue-600 underline"
          >
            Autentifică-te aici
          </Link>
        </div>
      </div>
    </main>
  );
}
