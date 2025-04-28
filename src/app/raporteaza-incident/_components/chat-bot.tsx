import Link from "next/link";
import React, { useState } from "react";
import { SVGBotAvatar, SVGCross } from "~/components/icons";

const CONVERSATION: {
  question: string;
  options: string[];
}[] = [
  {
    question: "Te rog, spune-mi despre ce tip de animal sălbatic e vorba?",
    options: ["Vulpe", "Căprior", "Mistreț", "Urs", "Lup", "Iepure"],
  },
  {
    question: "Unde ai găsit animalul?",
    options: [
      "În apropierea unui drum/trafic intens",
      "În pădure/parc",
      "În apropierea locuințelor",
      "Alte locații (te rog specifică)",
    ],
  },
  // Add more steps if needed
];

export default function ChatBot() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const handleOptionChange = (option: string) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);
    if (step < CONVERSATION.length) {
      setStep((previousStep) => previousStep + 1);
    }
  };

  return (
    <section className="bg-neutral text-neutral-foreground text-single-line-body-base">
      <div className="bg-secondary border-tertiary-border flex flex-row items-center justify-between rounded-t-md border-x-1 border-t-1 p-6 text-white">
        <div className="flex flex-row items-center gap-4">
          <SVGBotAvatar width="60" height="60" />
          <div className="flex flex-col">
            <h3 className="text-heading-3">AnimAlert Bot</h3>
            <span className="text-subheading-1">Online</span>
          </div>
        </div>
        <Link href="/">
          <SVGCross className="cursor-pointer" width="32" height="32" />
        </Link>
      </div>
      {/* Chat body */}
      <div className="border-tertiary-border flex flex-col rounded-b-md border-x-1 border-b-1 bg-white px-6 py-[2rem]">
        {CONVERSATION.slice(0, step + 1).map((stepItem, idx) => (
          <React.Fragment key={idx}>
            {/* Bot message */}
            <div className="flex">
              <div className="bg-tertiary text-neutral-foreground text-single-line-body-base rounded-t-lg rounded-r-lg p-4">
                <span className="text-base">{stepItem.question}</span>
              </div>
            </div>

            {/* User reply */}
            {answers[idx] && (
              <div className="flex justify-end">
                <div className="text-neutral-foreground text-single-line-body-base mt-6 max-w-[60%] rounded-t-lg rounded-l-lg bg-[#F2F2F2] p-4">
                  {answers[idx]}
                </div>
              </div>
            )}
          </React.Fragment>
        ))}

        {/* Show options for current step if not finished */}
        {step < CONVERSATION.length && (
          <div className="mt-2 mr-auto min-w-[20%]">
            <div className="bg-tertiary flex flex-col gap-0 rounded-r-lg rounded-b-lg">
              {CONVERSATION[step]?.options?.map((option, idx) => (
                <span
                  key={idx}
                  className={`hover:bg-tertiary-hover hover:text-tertiary-hover-foreground border-tertiary-border cursor-pointer ${
                    idx === 0
                      ? "rounded-tr-lg border-b-[1px]"
                      : idx === (CONVERSATION[step]?.options ?? []).length - 1
                        ? "rounded-b-lg"
                        : "border-b-[1px]"
                  } p-4`}
                  onClick={() => handleOptionChange(option)}
                >
                  {option}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
