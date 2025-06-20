"use client";

import { isEqual } from "lodash";
import { useState, useRef, type ChangeEvent, useEffect } from "react";
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
  DialogFooter,
} from "~/components/ui/simple/dialog";

import { TRPCError } from "@trpc/server";

import { api } from "~/trpc/react";
import type { Coordinates } from "~/types/coordinates";

import { conflictFormSchema } from "./_schemas/conflict-form-schema";

import Contact from "./_components/contact";
import Map from "../../components/ui/complex/map";

import { Button } from "~/components/ui/simple/button";
import { MaterialStepper } from "~/components/ui/complex/stepper";
import { TRPCClientError } from "@trpc/client";
import { REPORT_TYPES } from "~/constants/report-types";
import { CONFLICT_STEPS } from "./_constants/conflict-steps";
import Recommendations from "./_components/recommendations";
import Link from "next/link";
import { SVGHeart, SVGStar } from "~/components/icons";
import FeedbackDialog from "~/components/ui/complex/feedback-dialog";

export default function ConflictReport() {
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
  const [conflictId, setConflictId] = useState<string | undefined>();
  const [conflictReportNumber, setConflictReportNumber] = useState<
    number | undefined
  >();
  const [userId, setUserId] = useState<string | undefined>();

  const [recommendationsFinished, setRecommendationsFinished] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [errorDialog, setErrorDialog] = useState<{
    title: string;
    description: string;
  } | null>(null);

  // CONFLICT FORM
  // Define conflict form
  const conflictForm = useForm<z.infer<typeof conflictFormSchema>>({
    resolver: zodResolver(conflictFormSchema),
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

  const [conflictImageFiles, setConflictImageFiles] = useState<{
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
  const [address, setAddress] = useState<string>("Cluj-Napoca, Cluj, Romania");

  const [submittingConflict, setSubmittingConflict] = useState(false);

  const utils = api.useUtils();
  const {
    mutateAsync: mutateConflictAsync,
    isPending: conflictIsPending,
    reset: resetConflictMutation,
  } = api.conflict.create.useMutation({
    onSuccess: () => {
      void utils.conflict.invalidate();
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

  useEffect(() => {
    if (recommendationsFinished) {
      setShowSuccessDialog(true);
    }
  }, [recommendationsFinished]);

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
  async function handleImageUpload(files: (File | undefined)[]) {
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
      conflictForm.setError("root", {
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

  // Submit handler for the conflict form
  async function onConflictSubmit(values: z.infer<typeof conflictFormSchema>) {
    try {
      setSubmittingConflict(true);

      const imagesChanged = newImagesUploaded(
        conflictImageFiles,
        lastImageFiles.current,
      );

      let imageKeys: string[] = lastUploadedImageUrls.current;

      if (imagesChanged) {
        // Upload only the new images
        imageKeys =
          (await handleImageUpload(Object.values(conflictImageFiles)))?.filter(
            (url): url is string => !!url,
          ) ?? [];
        lastImageFiles.current = { ...conflictImageFiles };
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
          id: conflictId,
          reportType: REPORT_TYPES.CONFLICT,
          receiveUpdates: values.receiveUpdates,
          latitude: mapSubmitted.current ? mapCoordinates?.lat : undefined,
          longitude: mapSubmitted.current ? mapCoordinates?.lng : undefined,
          imageKeys,
          conversation: "", // TODO: JSON.stringify(answers),
          address: mapSubmitted.current ? address : undefined,
        },
      };

      // Only mutate if data has changed
      if (isEqual(payload, lastSubmittedPayload.current)) {
        handleNextPage();
        return;
      }

      const result = await mutateConflictAsync(payload);

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

      if (!conflictId) {
        setConflictId(result?.report?.id);
        setConflictReportNumber(result?.report?.reportNumber);
        setUserId(result?.user?.id);
      }

      setSubmittingConflict(false);

      handleNextPage();
    } catch (error) {
      if (error instanceof TRPCError) {
        showErrorDialog(
          "Eroare la trimiterea formularului",
          "A apărut o problemă la trimiterea formularului. Vă rugăm să verificați datele introduse și să încercați din nou.",
        );
        conflictForm.setError("root", {
          message: error.message,
        });

        // Handle field-specific errors
        if (
          "path" in error &&
          typeof error.path === "string" &&
          (error.path.startsWith("user.") || error.path.startsWith("conflict"))
        ) {
          const field = error.path.split(".")[1];
          conflictForm.setError(field as keyof typeof values, {
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

  function handleConflictImageChange(
    e: ChangeEvent<HTMLInputElement>,
    name: string,
    fieldOnChange: (value: File | null, shouldValidate?: boolean) => void,
  ) {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setConflictImageFiles((prev) => ({
        ...prev,
        [name]: file,
      }));
      fieldOnChange(file); // Update react-hook-form state
    }
  }

  function handleNextPage() {
    if (currentPage < CONFLICT_STEPS.length - 1) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setCurrentPage((prevPage) => prevPage + 1);
      resetConflictMutation();
    }
  }

  function handlePreviousPage() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setCurrentPage((prevPage) => prevPage - 1);
    resetConflictMutation();
  }

  function getCurrentPage() {
    switch (currentPage) {
      case 0:
        return (
          <Contact
            conflictForm={conflictForm}
            conflictImageFiles={conflictImageFiles}
            handleConflictImageChange={handleConflictImageChange}
            onConflictSubmit={onConflictSubmit}
            isPending={
              submittingConflict || conflictIsPending || uploadFileToS3IsPending
            }
          />
        );
      case 1:
        return (
          <Map
            address={address}
            setAddress={setAddress}
            handlePreviousPage={handlePreviousPage}
            onMapSubmit={async () => {
              mapSubmitted.current = true;
              await onConflictSubmit(conflictForm.getValues());
            }}
            mapCoordinates={mapCoordinates}
            setMapCoordinates={setMapCoordinates}
            isPending={
              submittingConflict || conflictIsPending || uploadFileToS3IsPending
            }
          />
        );
      case 2:
        return (
          <Recommendations
            setRecommendationsFinished={setRecommendationsFinished}
          />
        );
      default:
        break;
    }
  }

  return (
    <main className="bg-tertiary px-6 pt-20 pb-40 2xl:px-96 2xl:pt-24 2xl:pb-52">
      <div className="flex flex-col justify-center gap-12">
        <h1 className="text-heading-2">Raportează conflict/interacțiune</h1>
        <MaterialStepper steps={CONFLICT_STEPS} currentStep={currentPage} />
        {getCurrentPage()}
      </div>
      <Dialog open={showSuccessDialog}>
        <DialogContent
          onPointerDownOutside={(event) => event.preventDefault()}
          className="bg-tertiary text-center"
        >
          <DialogHeader>
            <DialogDescription className="sr-only">
              Confirmare de înregistrare a raportului.
            </DialogDescription>
            <DialogTitle className="text-center">
              Raport înregistrat
            </DialogTitle>
          </DialogHeader>
          <div>
            Raportul cu numărul <strong>{conflictReportNumber}</strong> a fost
            înregistrat cu succes.
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              size="sm"
              className="min-w-44"
              onClick={() => {
                setShowFeedbackDialog(true);
                setShowSuccessDialog(false);
              }}
            >
              <SVGStar /> Feedback
            </Button>
            <Button variant="primary" size="sm" className="min-w-44">
              <SVGHeart /> <Link href="/doneaza">Donează</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {showFeedbackDialog && (
        <FeedbackDialog
          open={showFeedbackDialog}
          setOpen={setShowFeedbackDialog}
          postFeedbackCallback={() => {
            redirect("/");
          }}
        />
      )}
      <Dialog
        open={!!errorDialog}
        onOpenChange={(open) => {
          if (!open) {
            setErrorDialog(null);
            setSubmittingConflict(false);
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
                setSubmittingConflict(false);
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
