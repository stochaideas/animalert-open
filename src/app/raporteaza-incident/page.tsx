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

import { contactFormSchema } from "./_schemas/contact-form-schema";
import type { Coordinates } from "../../types/coordinates";
import { api } from "~/trpc/react";

export default function IncidentReport() {
  const [currentPage, setCurrentPage] = useState(0);
  const [incidentId, setIncidentId] = useState<string | undefined>(undefined);
  const [userId, setUserId] = useState<string | undefined>(undefined);

  // DISCLAIMER
  const [disclaimerTermsAccepted, setDisclaimerTermsAccepted] = useState(false);

  // CONTACT FORM
  // Define contact form
  const contactForm = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
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

  const [contactImagePreviews, setContactImagePreviews] = useState<{
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mutateAsync, isPending, error } = api.incident.create.useMutation({
    onSuccess: () => {
      void utils.incident.invalidate();
    },
  });

  // Submit handler for the contact form
  async function onContactSubmit(values: z.infer<typeof contactFormSchema>) {
    try {
      const result = await mutateAsync({
        user: {
          id: userId,
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
          email: values.email,
          receiveOtherIncidentUpdates:
            values.receiveOtherIncidentUpdates ?? false,
        },
        incident: {
          id: incidentId,
          receiveIncidentUpdates: values.receiveIncidentUpdates ?? false,
          latitude: mapCoordinates?.lat ?? 0,
          longitude: mapCoordinates?.lng ?? 0,
          imageUrls: [
            values.image1,
            values.image2,
            values.image3,
            values.image4,
          ],
        },
      });

      if (!incidentId) {
        setIncidentId(result?.id);
        setUserId(result?.userId);
      }

      handleNextPage();
    } catch (error) {
      // Error handled by TRPC
      console.log(error);
    }
  }

  const handleContactImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    name: string,
    fieldOnChange: (value: File | null, shouldValidate?: boolean) => void,
  ) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setContactImagePreviews((prev) => ({
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
            contactForm={contactForm}
            contactImagePreviews={contactImagePreviews}
            handleContactImageChange={handleContactImageChange}
            onContactSubmit={onContactSubmit}
            isPending={isPending}
          />
        );
      case 2:
        return (
          <Map
            handlePreviousPage={handlePreviousPage}
            handleNextPage={handleNextPage}
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
    <div className="bg-tertiary px-6 pt-20 pb-40 2xl:px-96 2xl:pt-24 2xl:pb-52">
      <main className="flex flex-col justify-center gap-12">
        <h1 className="text-heading-2">Raportează incident</h1>
        <MaterialStepper currentStep={currentPage} />
        {getCurrentPage()}
      </main>
    </div>
  );
}
