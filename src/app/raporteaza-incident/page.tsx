"use client";

import { useState, type ChangeEvent } from "react";
import Disclaimer from "./_components/disclaimer";
import { Button } from "~/components/ui/simple/button";
import { MaterialStepper } from "../../components/ui/complex/stepper";
import { redirect } from "next/navigation";
import Contact from "./_components/contact";
import Map from "./_components/map";
import ChatBot from "./_components/chat-bot";
import { formSchema } from "./_utils/contact-form-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";

export default function IncidentReport() {
  const [currentPage, setCurrentPage] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lastName: "",
      firstName: "",
      phone: "",
      email: undefined,
      confidentiality: false,
      receiveCaseUpdates: false,
      receiveOtherCaseUpdates: false,
      image1: undefined,
      image2: undefined,
      image3: undefined,
      image4: undefined,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const [imagePreviews, setImagePreviews] = useState({
    image1: undefined,
    image2: undefined,
    image3: undefined,
    image4: undefined,
  });

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    name: string,
    fieldOnChange: (value: File | null, shouldValidate?: boolean) => void,
  ) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreviews((prev) => ({
        ...prev,
        [name]: url,
      }));
      fieldOnChange(file); // Update react-hook-form state
    }
  };

  // Submit handler for the contact form
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);

    handleNextPage();
  }

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
              termsAccepted={termsAccepted}
              setTermsAccepted={setTermsAccepted}
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
            form={form}
            imagePreviews={imagePreviews}
            handleImageChange={handleImageChange}
            onSubmit={onSubmit}
          />
        );
      case 2:
        return (
          <Map
            handlePreviousPage={handlePreviousPage}
            handleNextPage={handleNextPage}
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
