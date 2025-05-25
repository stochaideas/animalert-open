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

import { presenceFormSchema } from "./_schemas/presence-form-schema";

import Contact from "./_components/contact";
import Map from "../../components/ui/complex/map";

import { Button } from "~/components/ui/simple/button";
import { MaterialStepper } from "~/components/ui/complex/stepper";
import { TRPCClientError } from "@trpc/client";
import { REPORT_TYPES } from "~/constants/report-types";

export default function PresenceReport() {
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
  const [presenceId, setPresenceId] = useState<string | undefined>();
  const [presenceReportNumber, setPresenceReportNumber] = useState<
    number | undefined
  >();
  const [userId, setUserId] = useState<string | undefined>();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [errorDialog, setErrorDialog] = useState<{
    title: string;
    description: string;
  } | null>(null);

  // PRESENCE FORM
  // Define presence form
  const presenceForm = useForm<z.infer<typeof presenceFormSchema>>({
    resolver: zodResolver(presenceFormSchema),
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

  const [presenceImageFiles, setPresenceImageFiles] = useState<{
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
  const [mapCoordinates, setMapCoordinates] = useState<Coordinates>({
    lat: 46.7715965,
    lng: 23.6080557,
  });
  const [address, setAddress] = useState<string>();

  const [submittingPresence, setSubmittingPresence] = useState(false);

  const utils = api.useUtils();
  const {
    mutateAsync: mutatePresenceAsync,
    isPending: presenceIsPending,
    isSuccess: presenceIsSuccess,
    reset: resetPresenceMutation,
  } = api.presence.create.useMutation({
    onSuccess: () => {
      void utils.presence.invalidate();
    },
  });

  const { mutateAsync: mutateS3Async, isPending: s3IsPending } =
    api.s3.getPresignedUrl.useMutation({
      onSuccess: () => {
        void utils.s3.invalidate();
      },
    });

  useEffect(() => {
    if (mapSubmitted.current && presenceIsSuccess) {
      setShowSuccessDialog(true);
    }
  }, [presenceIsSuccess]);

  function showErrorDialog(title: string, description: string) {
    setErrorDialog({ title, description });
  }

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
      showErrorDialog(
        "Eroare la încărcarea imaginilor",
        error instanceof Error
          ? error.message
          : "A apărut o problemă la încărcarea imaginilor. Vă rugăm să încercați din nou.",
      );
      presenceForm.setError("root", {
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

  // Submit handler for the presence form
  async function onPresenceSubmit(values: z.infer<typeof presenceFormSchema>) {
    try {
      setSubmittingPresence(true);

      const imagesChanged = newImagesUploaded(
        presenceImageFiles,
        lastImageFiles.current,
      );

      let imageKeys: string[] = lastUploadedImageUrls.current;

      if (imagesChanged) {
        // Upload only the new images
        imageKeys =
          (await handleImageUpload(Object.values(presenceImageFiles)))?.filter(
            (url): url is string => !!url,
          ) ?? [];
        lastImageFiles.current = { ...presenceImageFiles };
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
          id: presenceId,
          reportType: REPORT_TYPES.PRESENCE,
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

      const result = await mutatePresenceAsync(payload);

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

      if (!presenceId) {
        setPresenceId(result?.report?.id);
        setPresenceReportNumber(result?.report?.reportNumber);
        setUserId(result?.user?.id);
      }

      setSubmittingPresence(false);

      handleNextPage();
    } catch (error) {
      if (error instanceof TRPCError) {
        showErrorDialog(
          "Eroare la trimiterea formularului",
          "A apărut o problemă la trimiterea formularului. Vă rugăm să verificați datele introduse și să încercați din nou.",
        );
        presenceForm.setError("root", {
          message: error.message,
        });

        // Handle field-specific errors
        if (
          "path" in error &&
          typeof error.path === "string" &&
          (error.path.startsWith("user.") || error.path.startsWith("presence"))
        ) {
          const field = error.path.split(".")[1];
          presenceForm.setError(field as keyof typeof values, {
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

  function handlePresenceImageChange(
    e: ChangeEvent<HTMLInputElement>,
    name: string,
    fieldOnChange: (value: File | null, shouldValidate?: boolean) => void,
  ) {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setPresenceImageFiles((prev) => ({
        ...prev,
        [name]: file,
      }));
      fieldOnChange(file); // Update react-hook-form state
    }
  }

  function handleNextPage() {
    if (currentPage < 3) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setCurrentPage((prevPage) => prevPage + 1);
      resetPresenceMutation();
    }
  }

  function handlePreviousPage() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setCurrentPage((prevPage) => prevPage - 1);
    resetPresenceMutation();
  }

  function getCurrentPage() {
    switch (currentPage) {
      case 0:
        return (
          <Contact
            handlePreviousPage={handlePreviousPage}
            presenceForm={presenceForm}
            presenceImageFiles={presenceImageFiles}
            handlePresenceImageChange={handlePresenceImageChange}
            onPresenceSubmit={onPresenceSubmit}
            isPending={submittingPresence || presenceIsPending || s3IsPending}
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
              await onPresenceSubmit(presenceForm.getValues());
            }}
            mapCoordinates={mapCoordinates}
            setMapCoordinates={setMapCoordinates}
            isPending={submittingPresence || presenceIsPending || s3IsPending}
          />
        );
      default:
        break;
    }
  }

  return (
    <main className="bg-tertiary px-6 pt-20 pb-40 2xl:px-96 2xl:pt-24 2xl:pb-52">
      <div className="flex flex-col justify-center gap-12">
        <h1 className="text-heading-2">Raportează prezență</h1>
        <MaterialStepper currentStep={currentPage} />
        {getCurrentPage()}
      </div>
      <Dialog open={showSuccessDialog}>
        <DialogContent className="bg-tertiary">
          <DialogHeader>
            <DialogDescription className="sr-only">
              Confirmare de înregistrare a incidentului.
            </DialogDescription>
            <DialogTitle>Raport prezență înregistrată</DialogTitle>
          </DialogHeader>
          <div>
            Incidentul cu numărul <strong>{presenceReportNumber}</strong> a fost
            înregistrat cu succes.
          </div>
          <DialogFooter>
            <Button
              className="bg-secondary text-secondary-foreground hover:bg-secondary-hover rounded px-4 py-2"
              onClick={() => redirect("/")}
            >
              Întoarce-te acasă
            </Button>
          </DialogFooter>
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
