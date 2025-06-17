import { useState } from "react";
import { SVGCross, SVGPaperPlane } from "~/components/icons";
import { Button } from "../simple/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../simple/dialog";
import { Textarea } from "../simple/textarea";

const EMOJIS = [
  { value: "very-bad", label: "☹️" },
  { value: "bad", label: "😐" },
  { value: "neutral", label: "🙂" },
  { value: "good", label: "😊" },
  { value: "very-good", label: "😍" },
];

export default function FeedbackDialog({
  open,
  setOpen,
  postFeedbackCallback,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  postFeedbackCallback: (feedback: { emoji: string; text: string }) => void;
}) {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState<string>("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onPointerDownOutside={(event) => event.preventDefault()}
        className="bg-tertiary text-center"
      >
        <DialogHeader>
          <DialogDescription className="sr-only">
            Lasați-ne feedback-ul dvs. pentru a ne ajuta să îmbunătățim
            platforma.
          </DialogDescription>
          <DialogTitle className="text-center">Feedback</DialogTitle>
        </DialogHeader>

        <section className="my-2 flex flex-col items-center justify-center gap-2 sm:gap-4 sm:p-6">
          <p className="text-body-small w-full text-neutral-500">
            Feedback-ul tău este important pentru noi și ne ajută să îmbunătățim
            platforma.
          </p>
          <div className="flex w-full flex-row justify-between sm:gap-2">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji.value}
                type="button"
                onClick={() => setSelectedEmoji(emoji.value)}
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-2xl transition-colors hover:cursor-pointer sm:h-14 sm:w-14 sm:text-3xl ${
                  selectedEmoji === emoji.value
                    ? "border-secondary-border bg-secondary/10"
                    : "border-tertiary-border hover:bg-neutral-100"
                }`}
                aria-label={emoji.value}
              >
                {emoji.label}
              </button>
            ))}
          </div>
          <Textarea
            placeholder="Scrie feedback-ul tău aici..."
            className="mt-4 min-h-28 w-full"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          />
        </section>

        <DialogFooter>
          <Button
            variant="tertiary"
            size="sm"
            className="min-w-44"
            onClick={() => setOpen(false)}
          >
            <SVGCross /> Anulați
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="min-w-44"
            onClick={() => {
              // Handle feedback submission logic here
              setOpen(false);
              postFeedbackCallback({
                emoji: selectedEmoji ?? "",
                text: feedbackText.trim(),
              });
            }}
            disabled={!selectedEmoji || !feedbackText.trim()}
          >
            <SVGPaperPlane /> Trimite feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
