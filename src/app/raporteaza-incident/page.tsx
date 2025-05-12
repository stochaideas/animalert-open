"use client";

import { useState, type ChangeEvent } from "react";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";

import { TRPCError } from "@trpc/server";

import { api } from "~/trpc/react";
import type { Coordinates } from "~/types/coordinates";

import { incidentFormSchema } from "./_schemas/incident-form-schema";

import Disclaimer from "./_components/disclaimer";
import Contact from "./_components/contact";
import Map from "./_components/map";
import ChatBot from "./_components/chat-bot";

import { Button } from "~/components/ui/simple/button";
import { MaterialStepper } from "~/components/ui/complex/stepper";

export default function IncidentReport() {
  const [currentPage, setCurrentPage] = useState(0);
  const [incidentId, setIncidentId] = useState<string | undefined>(undefined);
  const [userId, setUserId] = useState<string | undefined>(undefined);

  // DISCLAIMER
  const [disclaimerTermsAccepted, setDisclaimerTermsAccepted] = useState(false);

  // INCIDENT FORM
  // Define incident form
  const incidentForm = useForm<z.infer<typeof incidentFormSchema>>({
    resolver: zodResolver(incidentFormSchema),
    defaultValues: {
      lastName: "",
      firstName: "",
      phone: "",
      email: "",
      confidentiality: false,
      receiveIncidentUpdates: false,
      receiveOtherIncidentUpdates: false,
      image1: undefined,
      image2: undefined,
      image3: undefined,
      video1: undefined,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const [incidentImageFiles, setIncidentImageFiles] = useState<{
    image1: File | undefined;
    image2: File | undefined;
    image3: File | undefined;
    video1: File | undefined;
  }>({
    image1: undefined,
    image2: undefined,
    image3: undefined,
    video1: undefined,
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
        Array.from(files).map(async (file, index) => {
          if (!file) return null;

          const response = await mutateS3Async({
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

          const url = response?.url;
          if (!url) {
            throw new Error("Failed to get a valid URL for the file upload");
          }

          await fetch(url, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type },
            mode: "cors",
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

  // Submit handler for the incident form
  async function onIncidentSubmit(values: z.infer<typeof incidentFormSchema>) {
    try {
      const imageUrls = await handleImageUpload(
        Object.values(incidentImageFiles),
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
        setIncidentId(result?.incident?.id);
        setUserId(result?.user?.id);
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

  const handleIncidentImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    name: string,
    fieldOnChange: (value: File | null, shouldValidate?: boolean) => void,
  ) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setIncidentImageFiles((prev) => ({
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
            incidentImageFiles={incidentImageFiles}
            handleIncidentImageChange={handleIncidentImageChange}
            onIncidentSubmit={onIncidentSubmit}
            isPending={incidentIsPending}
          />
        );
      case 2:
        return (
          <Map
            handlePreviousPage={handlePreviousPage}
            onMapSubmit={async () =>
              await onIncidentSubmit(incidentForm.getValues())
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
