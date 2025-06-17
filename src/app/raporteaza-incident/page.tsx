"use client";

import { isEqual } from "lodash";
import { useState, useRef, type ChangeEvent } from "react";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/simple/dialog";

import { TRPCError } from "@trpc/server";

import { api } from "~/trpc/react";
import type { Coordinates } from "~/types/coordinates";

import { incidentFormSchema } from "./_schemas/incident-form-schema";

import Disclaimer from "./_components/disclaimer";
import Contact from "./_components/contact";
import Map from "../../components/ui/complex/map";
import ChatBot from "../../components/ui/complex/chat-bot";

import { Button } from "~/components/ui/simple/button";
import { MaterialStepper } from "~/components/ui/complex/stepper";
import { TRPCClientError } from "@trpc/client";
import { REPORT_TYPES } from "~/constants/report-types";
import { INCIDENT_STEPS } from "./_constants/incident-steps";

export default function IncidentReport() {
  const lastSubmittedPayload = useRef<{
    user: {
      id: string | undefined;
      firstName: string;
      lastName: string;
      phone: string;
      email?: string;
      receiveOtherReportUpdates?: boolean;
    };
    report: {
      id: string | undefined;
      reportType: string;
      receiveUpdates?: boolean;
      latitude: number | undefined;
      longitude: number | undefined;
      imageKeys: string[];
      conversation: string;
      address: string | undefined;
    };
  } | null>(null);

  const lastImageFiles = useRef<{
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
  const lastUploadedImageUrls = useRef<string[]>([]);

  const mapSubmitted = useRef(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [incidentId, setIncidentId] = useState<string | undefined>();
  const [incidentReportNumber, setIncidentReportNumber] = useState<
    number | undefined
  >();
  const [userId, setUserId] = useState<string | undefined>();
  const [errorDialog, setErrorDialog] = useState<{
    title: string;
    description: string;
  } | null>(null);

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
      receiveUpdates: false,
      receiveOtherReportUpdates: false,
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
  const [mapCoordinates, setMapCoordinates] = useState<
    Coordinates | undefined
  >();
  const [address, setAddress] = useState<string>();

  // CHAT BOT
  const [answers, setAnswers] = useState<
    { question: string; answer: string | string[] }[]
  >([]);

  const [submittingIncident, setSubmittingIncident] = useState(false);

  const utils = api.useUtils();
  const {
    mutateAsync: mutateIncidentAsync,
    isPending: incidentIsPending,
    isSuccess: incidentIsSuccess,
    reset: resetIncidentMutation,
  } = api.incident.create.useMutation({
    onSuccess: () => {
      void utils.incident.invalidate();
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

  function showErrorDialog(title: string, description: string) {
    setErrorDialog({ title, description });
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
      showErrorDialog(
        "Eroare la încărcarea imaginilor",
        error instanceof Error
          ? error.message
          : "A apărut o problemă la încărcarea imaginilor. Vă rugăm să încercați din nou.",
      );
      incidentForm.setError("root", {
        message:
          error instanceof Error ? error.message : "Failed to upload images",
      });
      throw error;
    }
  }

  function newImagesUploaded(
    current: Record<string, File | undefined>,
    previous: Record<string, File | undefined>,
  ) {
    return Object.keys(current).some(
      (key) =>
        !!current[key] && // file is set
        (!previous[key] || current[key] !== previous[key]), // file is new or changed
    );
  }

  // Submit handler for the incident form
  async function onIncidentSubmit(values: z.infer<typeof incidentFormSchema>) {
    try {
      setSubmittingIncident(true);

      const imagesChanged = newImagesUploaded(
        incidentImageFiles,
        lastImageFiles.current,
      );

      let imageKeys: string[] = lastUploadedImageUrls.current;

      if (imagesChanged) {
        // Upload only the new images
        imageKeys =
          (await handleImagesUpload(Object.values(incidentImageFiles)))?.filter(
            (url): url is string => !!url,
          ) ?? [];
        lastImageFiles.current = { ...incidentImageFiles };
        lastUploadedImageUrls.current = imageKeys;
      }

      const email = values.email === "" ? undefined : values.email;

      const payload = {
        user: {
          id: userId,
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
          email: email,
          receiveOtherReportUpdates: values.receiveOtherReportUpdates,
        },
        report: {
          id: incidentId,
          reportType: REPORT_TYPES.INCIDENT,
          receiveUpdates: values.receiveUpdates,
          latitude: mapSubmitted.current ? mapCoordinates?.lat : undefined,
          longitude: mapSubmitted.current ? mapCoordinates?.lng : undefined,
          imageKeys,
          conversation: JSON.stringify(answers),
          address: mapSubmitted.current ? address : undefined,
        },
      };

      // Only mutate if data has changed
      if (isEqual(payload, lastSubmittedPayload.current)) {
        setSubmittingIncident(false);

        handleNextPage();
        return;
      }

      const result = await mutateIncidentAsync(payload);

      lastSubmittedPayload.current = {
        ...payload,
        user: {
          ...payload.user,
          id: result?.user?.id,
        },
        report: {
          ...payload.report,
          id: result?.report?.id,
        },
      };

      if (!incidentId) {
        setIncidentId(result?.report?.id);
        setIncidentReportNumber(result?.report?.reportNumber);
        setUserId(result?.user?.id);
      }

      setSubmittingIncident(false);

      handleNextPage();
    } catch (error) {
      if (error instanceof TRPCError) {
        showErrorDialog(
          "Eroare la trimiterea formularului",
          "A apărut o problemă la trimiterea formularului. Vă rugăm să verificați datele introduse și să încercați din nou.",
        );
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
      } else if (error instanceof TRPCClientError) {
        // Now you can safely access error.data.code, error.message, etc.
        showErrorDialog("Eroare la trimiterea formularului", error.message);
        // Optionally, handle field-specific errors using error.data.path, etc.
      } else {
        showErrorDialog(
          "Eroare necunoscută",
          "A apărut o eroare neașteptată. Încercați din nou mai târziu.",
        );
      }
    }
  }

  function handleIncidentImageChange(
    e: ChangeEvent<HTMLInputElement>,
    name: string,
    fieldOnChange: (value: File | null, shouldValidate?: boolean) => void,
  ) {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setIncidentImageFiles((prev) => ({
        ...prev,
        [name]: file,
      }));
      fieldOnChange(file); // Update react-hook-form state
    }
  }

  function handleNextPage() {
    if (currentPage < INCIDENT_STEPS.length - 1) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setCurrentPage((prevPage) => prevPage + 1);
      resetIncidentMutation();
    }
  }

  function handlePreviousPage() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setCurrentPage((prevPage) => prevPage - 1);
    resetIncidentMutation();
  }

  function getCurrentPage() {
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
            isPending={
              submittingIncident || incidentIsPending || uploadFileToS3IsPending
            }
          />
        );
      case 2:
        return (
          <Map
            address={address}
            setAddress={setAddress}
            handlePreviousPage={handlePreviousPage}
            onMapSubmit={async () => {
              mapSubmitted.current = true;
              await onIncidentSubmit(incidentForm.getValues());
            }}
            mapCoordinates={mapCoordinates}
            setMapCoordinates={setMapCoordinates}
            isPending={
              submittingIncident || incidentIsPending || uploadFileToS3IsPending
            }
          />
        );
      case 3:
        return (
          <ChatBot
            answers={answers}
            setAnswers={setAnswers}
            reportNumber={incidentReportNumber}
            handleChatFinish={async () => {
              await onIncidentSubmit(incidentForm.getValues());
            }}
            handleDialogClose={() => redirect("/")}
            isPending={
              submittingIncident || incidentIsPending || uploadFileToS3IsPending
            }
            incidentIsSuccess={incidentIsSuccess}
          />
        );
      default:
        break;
    }
  }

  return (
    <main className="bg-tertiary px-6 pt-20 pb-40 2xl:px-96 2xl:pt-24 2xl:pb-52">
      <div className="flex flex-col justify-center gap-12">
        <h1 className="text-heading-2">Raportează incident</h1>
        <MaterialStepper steps={INCIDENT_STEPS} currentStep={currentPage} />
        {getCurrentPage()}
      </div>
      <Dialog
        open={!!errorDialog}
        onOpenChange={(open) => {
          if (!open) {
            setErrorDialog(null);
            setSubmittingIncident(false);
          }
        }}
      >
        <DialogContent className="bg-tertiary">
          <DialogHeader>
            <DialogTitle>{errorDialog?.title}</DialogTitle>
            <DialogDescription>{errorDialog?.description}</DialogDescription>
            <Button
              variant="primary"
              className="mt-4"
              onClick={() => {
                setErrorDialog(null);
                setSubmittingIncident(false);
              }}
              size="lg"
            >
              Am înțeles
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
}
