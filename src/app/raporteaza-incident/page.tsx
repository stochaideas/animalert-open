"use client";

import { useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { redirect } from "next/navigation";

import Disclaimer from "./_components/disclaimer";
import Contact from "./_components/contact";
import Map from "./_components/map";
import ChatBot from "./_components/chat-bot";
import { Button } from "~/components/ui/simple/button";
import { MaterialStepper } from "../../components/ui/complex/stepper";

import { incidentFormSchema } from "./_schemas/incident-form-schema";
import type { Coordinates } from "../../types/coordinates";
import { api } from "~/trpc/react";
import { TRPCError } from "@trpc/server";

export default function IncidentReport() {
  const [currentPage, setCurrentPage] = useState(0);
  const [incidentId, setIncidentId] = useState<string | undefined>(undefined);
  const [userId, setUserId] = useState<string | undefined>(undefined);

  // DISCLAIMER
  const [disclaimerTermsAccepted, setDisclaimerTermsAccepted] = useState(false);

  // CONTACT FORM
  // Define contact form
  const incidentForm = useForm<z.infer<typeof incidentFormSchema>>({
    resolver: zodResolver(incidentFormSchema),
    defaultValues: {
      lastName: "",
      firstName: "",
      phone: "",
      email: undefined,
      confidentiality: false,
      receiveIncidentUpdates: false,
      receiveOtherIncidentUpdates: false,
      image1: undefined,
      image2: undefined,
      image3: undefined,
      image4: undefined,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const [contactImageFiles, setContactImageFiles] = useState<{
    image1: File | undefined;
    image2: File | undefined;
    image3: File | undefined;
    image4: File | undefined;
  }>({
    image1: undefined,
    image2: undefined,
    image3: undefined,
    image4: undefined,
  });

  // MAP
  const [mapCoordinates, setMapCoordinates] = useState<Coordinates | null>(
    null,
  );

  const utils = api.useUtils();
  const {
    mutateAsync: mutateIncidentAsync,
    isPending: incidentIsPending,
    // error: incidentError,
  } = api.incident.create.useMutation({
    onSuccess: () => {
      void utils.incident.invalidate();
    },
  });

  const {
    mutateAsync: mutateS3Async,
    // isPending: s3IsPending,
    // error: s3Error,
  } = api.s3.getPresignedUrl.useMutation({
    onSuccess: () => {
      void utils.s3.invalidate();
    },
  });

  async function handleImageUpload(files: (File | undefined)[]) {
    try {
      const urls = await Promise.all(
        Array.from(files).map(async (file) => {
          if (!file) return null;

          if (!userId || !incidentId) {
            throw new Error("User ID or Incident ID is not defined");
          }

          const { url } = await mutateS3Async({
            userId: userId,
            incidentId: incidentId,
            fileName: file.name,
            fileType: file.type,
          });

          await fetch(url, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type },
          });

          return url.split("?")[0]; // Get permanent URL
        }),
      );

      return urls;
    } catch (error) {
      incidentForm.setError("root", {
        message:
          error instanceof Error ? error.message : "Failed to upload images",
      });
      throw error;
    }
  }

  // Submit handler for the contact form
  async function onContactSubmit(values: z.infer<typeof incidentFormSchema>) {
    try {
      const imageUrls = await handleImageUpload(
        Object.values(contactImageFiles),
      );

      const result = await mutateIncidentAsync({
        user: {
          id: userId,
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
          email: values.email,
          receiveOtherIncidentUpdates: values.receiveOtherIncidentUpdates,
        },
        incident: {
          id: incidentId,
          receiveIncidentUpdates: values.receiveIncidentUpdates,
          latitude: mapCoordinates?.lat,
          longitude: mapCoordinates?.lng,
          imageUrls: imageUrls?.filter((url): url is string => !!url) ?? [],
        },
      });

      if (!incidentId) {
        setIncidentId(result?.id);
        setUserId(result?.userId);
      }

      handleNextPage();
    } catch (error) {
      if (error instanceof TRPCError) {
        incidentForm.setError("root", {
          message: error.message,
        });

        // Handle field-specific errors
        if (
          "path" in error &&
          typeof error.path === "string" &&
          (error.path.startsWith("user.") || error.path.startsWith("incident"))
        ) {
          const field = error.path.split(".")[1];
          incidentForm.setError(field as keyof typeof values, {
            message: error.message,
          });
        }
      }
    }
  }

  const handleContactImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    name: string,
    fieldOnChange: (value: File | null, shouldValidate?: boolean) => void,
  ) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setContactImageFiles((prev) => ({
        ...prev,
        [name]: file,
      }));
      fieldOnChange(file); // Update react-hook-form state
    }
  };

  const handleNextPage = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const getCurrentPage = () => {
    switch (currentPage) {
      case 0:
        return (
          <>
            <Disclaimer
              disclaimerTermsAccepted={disclaimerTermsAccepted}
              setDisclaimerTermsAccepted={setDisclaimerTermsAccepted}
              handleNextPage={handleNextPage}
            />
            <section className="pt-24">
              <h1 className="text-heading-2">Suntem oameni, ca tine</h1>
              <p className="text-body pt-6">
                Facem tot ce putem, cu toată inima. Suntem un ONG format din
                voluntari care își oferă timpul liber pentru această cauză, pe
                lângă serviciu și viața personală. Uneori nu putem răspunde sau
                acționa atât de repede pe cât ne-am dori, dar ne pasă și suntem
                aici.
              </p>{" "}
              <br />
              <p className="text-body">
                Mulțumim pentru răbdare, încredere și empatie. Contează enorm
                pentru noi.
              </p>
              <Button className="mt-8" variant="tertiary" size="md">
                Află mai multe
              </Button>
            </section>
          </>
        );
      case 1:
        return (
          <Contact
            handlePreviousPage={handlePreviousPage}
            incidentForm={incidentForm}
            contactImageFiles={contactImageFiles}
            handleContactImageChange={handleContactImageChange}
            onContactSubmit={onContactSubmit}
            isPending={incidentIsPending}
          />
        );
      case 2:
        return (
          <Map
            handlePreviousPage={handlePreviousPage}
            onMapSubmit={async () =>
              await onContactSubmit(incidentForm.getValues())
            }
            initialCoordinates={mapCoordinates}
            onCoordinatesChange={setMapCoordinates}
          />
        );
      case 3:
        return <ChatBot />;
      default:
        redirect("/");
    }
  };

  return (
    <main className="bg-tertiary px-6 pt-20 pb-40 2xl:px-96 2xl:pt-24 2xl:pb-52">
      <div className="flex flex-col justify-center gap-12">
        <h1 className="text-heading-2">Raportează incident</h1>
        <MaterialStepper currentStep={currentPage} />
        {getCurrentPage()}
      </div>
    </main>
  );
}
