"use client";

import { useState } from "react";
import FirstPage from "./_components/page1";
import { Button } from "~/components/ui/button";
import { Stepper } from "../_components/stepper";
import { redirect } from "next/navigation";
import Page2 from "./_components/page2";
import Page3 from "./_components/page3";
import Page4 from "./_components/page4";

// TODO: Continue implementing the form in Page2
// TODO: Finish pages 3 and 4

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
            <FirstPage
              termsAccepted={termsAccepted}
              setTermsAccepted={setTermsAccepted}
              handleNextPage={handleNextPage}
            />
            <section className="pt-[6.25rem]">
              <h1 className="text-heading-2">Suntem oameni, ca tine</h1>
              <p className="text-body pt-[1.5rem]">
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
          <Page2
            setTermsAccepted={setTermsAccepted}
            handleNextPage={handleNextPage}
            handlePreviousPage={handlePreviousPage}
          />
        );
      case 3:
        return <Page3 />;
      case 4:
        return <Page4 />;
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
