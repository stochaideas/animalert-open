import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { CONVERSATION } from "../_constants/chat-bot-conversation";
import { SVGBot, SVGBotAvatar, SVGCross, SVGUser } from "~/components/icons";
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
import { Textarea } from "~/components/ui/simple/textarea";

export default function ChatBot({
  answers,
  setAnswers,
  incidentReportNumber,
  handleChatFinish,
  handleDialogClose,
  isPending,
  incidentIsSuccess,
}: {
  answers: { question: string; answer: string | string[] }[];
  setAnswers: React.Dispatch<
    React.SetStateAction<{ question: string; answer: string | string[] }[]>
  >;
  incidentReportNumber?: number;
  handleChatFinish?: () => void;
  handleDialogClose?: React.MouseEventHandler<HTMLButtonElement>;
  isPending: boolean;
  incidentIsSuccess: boolean;
}) {
  const [step, setStep] = useState(answers.length); // Start at next unanswered
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [reviewMode, setReviewMode] = useState(false);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const [multiSelect, setMultiSelect] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const answersMemo = useMemo(() => answers, [answers]);

  // Prepare input state when editing
  useEffect(() => {
    if (editingIdx !== null) {
      const a = answersMemo[editingIdx];
      if (a) {
        if (Array.isArray(a.answer)) setMultiSelect(a.answer);
        else setInputValue(a.answer);
      }
    } else {
      setMultiSelect([]);
      setInputValue("");
    }
  }, [editingIdx, answersMemo]);

  useEffect(() => {
    if (incidentIsSuccess) {
      setShowConfirmDialog(false);
    }
  }, [incidentIsSuccess]);

  // Handle answer submit (for both new and edit)
  const handleAnswerSubmit = (answer: string | string[]) => {
    if (editingIdx !== null) {
      // Replace only the edited answer, keep the rest
      setAnswers((prev) =>
        prev.map((a, i) =>
          i === editingIdx
            ? { question: CONVERSATION[editingIdx]?.question ?? "", answer }
            : a,
        ),
      );
      setEditingIdx(null);
      if (reviewMode) {
        setStep(
          CONVERSATION.length === answers.length
            ? answers.length
            : answers.length + 1,
        );
      } else {
        setStep(
          CONVERSATION.length === answers.length
            ? answers.length - 1
            : answers.length,
        );
      }
    } else {
      // Add new answer
      setAnswers((prev) => [
        ...prev,
        { question: CONVERSATION[step]?.question ?? "", answer },
      ]);
      setStep(step + 1);
    }
    setMultiSelect([]);
    setInputValue("");
    // If last step, show confirm dialog
    if (
      (editingIdx !== null ? editingIdx + 1 : step + 1) ===
        CONVERSATION.length &&
      !reviewMode
    ) {
      setShowConfirmDialog(true);
      setReviewMode(true);
    }
  };

  // Render a single question/answer row
  const renderRow = (stepItem: (typeof CONVERSATION)[0], idx: number) => {
    const isEditing = editingIdx === idx && step === idx;
    const answered = answers[idx];

    return (
      <React.Fragment key={idx}>
        {/* Bot message */}
        <div className="flex items-center gap-4">
          <SVGBot width="32" height="32" />
          <div className="bg-tertiary text-neutral-foreground text-single-line-body-base rounded-t-lg rounded-r-lg p-4">
            <span className="text-base">{stepItem.question}</span>
          </div>
        </div>
        {/* User answer or input */}
        {answered && !isEditing && (
          <div className="mt-8 flex justify-end gap-4">
            <div className="flex w-full flex-col items-end">
              <div className="text-neutral-foreground text-single-line-body-base mb-2 max-w-[60%] rounded-t-lg rounded-l-lg bg-[#F2F2F2] p-4">
                {Array.isArray(answered.answer)
                  ? answered.answer.join(", ")
                  : answered.answer}
              </div>
              <div className="flex flex-row justify-end">
                <span
                  className="text-secondary text-body-small mb-8 cursor-pointer font-bold"
                  onClick={() => {
                    setEditingIdx(idx);
                    setStep(idx);
                  }}
                >
                  🔄 Modifică răspuns
                </span>
              </div>
            </div>
            <SVGUser width="32" height="32" />
          </div>
        )}
        {(isEditing || !answered) && (
          <div className="my-2 mr-auto ml-12 min-w-[20%]">
            <div className="flex flex-col rounded-r-lg rounded-b-lg">
              {stepItem.type === "options" && stepItem.options && (
                <>
                  {stepItem.multiple ? (
                    <>
                      {stepItem.options.map((option, idx2) => (
                        <label
                          key={idx2}
                          className={`bg-tertiary hover:bg-tertiary-hover hover:text-tertiary-hover-foreground border-tertiary-border flex cursor-pointer items-center ${
                            idx2 === 0
                              ? "rounded-tr-lg border-b-[1px]"
                              : idx2 === (stepItem.options?.length ?? 0) - 1
                                ? "rounded-b-lg"
                                : "border-b-[1px]"
                          } p-4`}
                        >
                          <Checkbox
                            checked={multiSelect.includes(option)}
                            onCheckedChange={() =>
                              setMultiSelect((prev) =>
                                prev.includes(option)
                                  ? prev.filter((o) => o !== option)
                                  : [...prev, option],
                              )
                            }
                            className="mr-2"
                          />
                          {option}
                        </label>
                      ))}
                      <Button
                        className="bg-secondary text-secondary-foreground hover:bg-secondary-hover mt-2 w-full px-4 py-2"
                        onClick={() => handleAnswerSubmit(multiSelect)}
                        disabled={multiSelect.length === 0 || isPending}
                      >
                        {isPending ? "Se salvează" : "Continuă"}
                      </Button>
                    </>
                  ) : (
                    stepItem.options.map((option, idx2) => (
                      <span
                        key={idx2}
                        className={`bg-tertiary hover:bg-tertiary-hover hover:text-tertiary-hover-foreground border-tertiary-border cursor-pointer ${
                          idx2 === 0
                            ? "rounded-tr-lg border-b-[1px]"
                            : idx2 === (stepItem.options?.length ?? 0) - 1
                              ? "rounded-b-lg"
                              : "border-b-[1px]"
                        } p-4`}
                        onClick={() => handleAnswerSubmit(option)}
                      >
                        {option}
                      </span>
                    ))
                  )}
                </>
              )}
              {stepItem.type === "input" && (
                <form
                  className="flex w-96 flex-col gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAnswerSubmit(inputValue);
                  }}
                >
                  <Textarea
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
              {answers.length > 1 && (
                <Button
                  variant="tertiary"
                  className="mt-2"
                  onClick={() => {
                    setEditingIdx(null);
                    setMultiSelect([]);
                    setInputValue("");
                  }}
                >
                  Anulează
                </Button>
              )}
            </div>
          </div>
        )}
      </React.Fragment>
    );
  };

  // For new answers (not editing), render input for current step
  const renderCurrentInput = () => {
    if (editingIdx !== null || step >= CONVERSATION.length) return null;
    const stepItem = CONVERSATION[step];
    if (!stepItem) return null;
    return renderRow(stepItem, step);
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
      <div className="border-tertiary-border flex flex-col rounded-b-md border-x-1 border-b-1 bg-white px-6 py-8">
        {CONVERSATION.map((stepItem, idx) =>
          idx < answers.length || (editingIdx === idx && step === idx)
            ? renderRow(stepItem, idx)
            : null,
        )}
        {renderCurrentInput()}
        {reviewMode && editingIdx === null && step >= CONVERSATION.length && (
          <div className="mt-6 flex justify-end">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setShowConfirmDialog(true)}
              disabled={isPending}
            >
              Finalizează
            </Button>
          </div>
        )}
      </div>
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-tertiary">
          <DialogHeader>
            <DialogDescription className="sr-only">
              Confirmare de înregistrare a incidentului.
            </DialogDescription>
            <DialogTitle>Confirmare creare incident</DialogTitle>
          </DialogHeader>
          <div>Ești sigur că vrei să creezi acest incident?</div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => {
                if (handleChatFinish) handleChatFinish();
              }}
              disabled={isPending}
            >
              {isPending ? <>Se salvează</> : <>Salvează și trimite</>}
            </Button>
            <Button
              variant="tertiary"
              className="ml-2"
              onClick={() => setShowConfirmDialog(false)}
            >
              Modifică
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={incidentIsSuccess}>
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
