"use client";

import { useState } from "react";
import Disclaimer from "./_components/disclaimer";
import { Button } from "~/components/ui/button";
import { Stepper } from "../_components/stepper";
import { redirect } from "next/navigation";
import Contact from "./_components/contact";
import Map from "./_components/map";
import ChatBot from "./_components/chat-bot";

export default function IncidentReport() {
  const [currentPage, setCurrentPage] = useState(1);
  const [termsAccepted, setTermsAccepted] = useState(false);

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
      case 1:
        return (
          <>
            <Disclaimer
              termsAccepted={termsAccepted}
              setTermsAccepted={setTermsAccepted}
              handleNextPage={handleNextPage}
            />
            <section className="pt-[6.25rem]">
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
              <Button className="mt-[2rem]" variant="tertiary" size="md">
                Află mai multe
              </Button>
            </section>
          </>
        );
      case 2:
        return (
          <Contact
            handleNextPage={handleNextPage}
            handlePreviousPage={handlePreviousPage}
          />
        );
      case 3:
        return (
          <Map
            handlePreviousPage={handlePreviousPage}
            handleNextPage={handleNextPage}
          />
        );
      case 4:
        return <ChatBot />;
      default:
        redirect("/");
    }
  };

  return (
    <div className="bg-tertiary px-[30.75rem] pt-[6.25rem] pb-[12.5rem]">
      <main className="flex flex-col justify-center gap-[3rem]">
        <h1 className="text-heading-2">Raportează incident</h1>
        <Stepper currentStep={currentPage} />
        {getCurrentPage()}
      </main>
    </div>
  );
}
