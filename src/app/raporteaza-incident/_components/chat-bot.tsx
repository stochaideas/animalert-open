import React, {
  useState,
  type Dispatch,
  type MouseEventHandler,
  type SetStateAction,
} from "react";

import Link from "next/link";

import { CONVERSATION } from "../_constants/chat-bot-conversation";
import { SVGBotAvatar, SVGCross } from "~/components/icons";

import { Button } from "~/components/ui/simple/button";
import { Checkbox } from "~/components/ui/simple/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/simple/dialog";
import { Input } from "~/components/ui/simple/input";

export default function ChatBot({
  answers,
  setAnswers,
  incidentReportNumber,
  handleChatFinish,
  handleDialogClose,
  isPending,
}: {
  answers: { question: string; answer: string | string[] }[];
  setAnswers: Dispatch<
    SetStateAction<{ question: string; answer: string | string[] }[]>
  >;
  incidentReportNumber?: number;
  handleChatFinish?: () => void;
  handleDialogClose?: MouseEventHandler<HTMLButtonElement>;
  isPending: boolean;
}) {
  const [step, setStep] = useState(0);
  const [multiSelect, setMultiSelect] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const currentStep = CONVERSATION[step];

  // For single choice
  const handleOptionChange = (option: string) => {
    if (currentStep) {
      const newEntry = { question: currentStep.question, answer: option };
      setAnswers([...answers, newEntry]);
      const nextStep = step + 1;
      setStep(nextStep);
      setMultiSelect([]);
      setInputValue("");
      if (nextStep === CONVERSATION.length && handleChatFinish) {
        handleChatFinish();
      }
    }
  };

  // For multiple choice
  const handleMultiSelect = (option: string) => {
    setMultiSelect((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option],
    );
  };

  const handleMultiSelectSubmit = () => {
    if (currentStep) {
      if (multiSelect.length === 0) return;
      const newEntry = { question: currentStep.question, answer: multiSelect };
      setAnswers([...answers, newEntry]);
      const nextStep = step + 1;
      setStep(nextStep);
      setMultiSelect([]);
      setInputValue("");
      if (nextStep === CONVERSATION.length && handleChatFinish) {
        handleChatFinish();
      }
    }
  };

  // For input
  const handleInputSubmit = () => {
    if (currentStep) {
      if (!inputValue.trim()) return;
      const newEntry = {
        question: currentStep.question,
        answer: inputValue.trim(),
      };
      setAnswers([...answers, newEntry]);
      const nextStep = step + 1;
      setStep(nextStep);
      setMultiSelect([]);
      setInputValue("");
      if (nextStep === CONVERSATION.length && handleChatFinish) {
        handleChatFinish();
      }
    }
  };

  return (
    <section className="bg-neutral text-neutral-foreground text-single-line-body-base">
      <div className="bg-secondary border-tertiary-border flex flex-row items-start justify-between rounded-t-md border-x-1 border-t-1 p-6 text-white">
        <div className="flex flex-row items-start gap-4">
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
      <div className="border-tertiary-border flex flex-col rounded-b-md border-x-1 border-b-1 bg-white px-6 py-8">
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
                <div className="text-neutral-foreground text-single-line-body-base my-8 max-w-[60%] rounded-t-lg rounded-l-lg bg-[#F2F2F2] p-4">
                  {Array.isArray(answers[idx].answer)
                    ? answers[idx].answer.join(", ")
                    : answers[idx].answer}
                </div>
              </div>
            )}
          </React.Fragment>
        ))}

        {/* Show options/input for current step if not finished */}
        {step < CONVERSATION.length && (
          <div className="mt-2 mr-auto min-w-[20%]">
            <div className="flex flex-col gap-0 rounded-r-lg rounded-b-lg">
              {currentStep?.type === "options" && currentStep?.options && (
                <>
                  {currentStep.multiple ? (
                    <>
                      {currentStep.options.map((option, idx) => (
                        <label
                          key={idx}
                          className={`bg-tertiary hover:bg-tertiary-hover hover:text-tertiary-hover-foreground border-tertiary-border flex cursor-pointer items-center ${
                            idx === 0
                              ? "rounded-tr-lg border-b-[1px]"
                              : idx === (currentStep.options?.length ?? 0) - 1
                                ? "rounded-b-lg"
                                : "border-b-[1px]"
                          } p-4`}
                        >
                          <Checkbox
                            checked={multiSelect.includes(option)}
                            onCheckedChange={() => handleMultiSelect(option)}
                            className="mr-2"
                          />
                          {option}
                        </label>
                      ))}
                      <Button
                        className="bg-secondary text-secondary-foreground hover:bg-secondary-hover mt-2 w-full px-4 py-2"
                        onClick={handleMultiSelectSubmit}
                        disabled={multiSelect.length === 0 || isPending}
                      >
                        {isPending ? "Se salvează" : "Continuă"}
                      </Button>
                    </>
                  ) : (
                    currentStep.options.map((option, idx) => (
                      <span
                        key={idx}
                        className={`bg-tertiary hover:bg-tertiary-hover hover:text-tertiary-hover-foreground border-tertiary-border cursor-pointer ${
                          idx === 0
                            ? "rounded-tr-lg border-b-[1px]"
                            : idx === (currentStep.options?.length ?? 0) - 1
                              ? "rounded-b-lg"
                              : "border-b-[1px]"
                        } p-4`}
                        onClick={() => handleOptionChange(option)}
                      >
                        {option}
                      </span>
                    ))
                  )}
                </>
              )}
              {currentStep?.type === "input" && (
                <form
                  className="flex flex-col gap-2 p-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleInputSubmit();
                  }}
                >
                  <Input
                    type="text"
                    className="rounded border p-2"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Scrie răspunsul aici..."
                  />
                  <Button
                    type="submit"
                    className="bg-secondary text-secondary-foreground hover:bg-secondary-hover w-full px-4 py-2"
                    disabled={!inputValue.trim()}
                  >
                    Continuă
                  </Button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
      <Dialog open={step >= CONVERSATION.length}>
        <DialogContent className="bg-tertiary">
          <DialogHeader>
            <DialogDescription className="sr-only">
              Confirmare de înregistrare a incidentului.
            </DialogDescription>
            <DialogTitle>Incident înregistrat</DialogTitle>
          </DialogHeader>
          <div>
            Incidentul cu numărul <strong>{incidentReportNumber}</strong> a fost
            înregistrat cu succes.
          </div>
          <DialogFooter>
            <Button
              className="bg-secondary text-secondary-foreground hover:bg-secondary-hover rounded px-4 py-2"
              onClick={handleDialogClose}
            >
              Întoarce-te acasă
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
