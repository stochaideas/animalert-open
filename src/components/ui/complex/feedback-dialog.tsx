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
import { FEEDBACK_RATINGS } from "~/constants/feedback-ratings";
import { api } from "~/trpc/react";

export default function FeedbackDialog({
  open,
  setOpen,
  postFeedbackCallback,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  postFeedbackCallback?: (feedback: { emoji: string; text: string }) => void;
}) {
  const [selectedRating, setSelectedRating] = useState<FEEDBACK_RATINGS | null>(
    null,
  );
  const [feedbackText, setFeedbackText] = useState<string>("");

  const utils = api.useUtils();
  const { mutateAsync: mutateFeedbackAsync, isPending: feedbackIsPending } =
    api.feedback.create.useMutation({
      onSuccess: async () => {
        void utils.feedback.invalidate();
      },
    });

  const handleSendFeedback = async () => {
    if (selectedRating && feedbackText.trim()) {
      await mutateFeedbackAsync({
        rating: selectedRating,
        text: feedbackText.trim(),
      });
    }
  };

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
            {Object.entries(FEEDBACK_RATINGS).map(([label, value]) => (
              <button
                key={value}
                type="button"
                onClick={() => setSelectedRating(value)}
                className={`hover:bg-secondary/10 flex h-12 w-12 items-center justify-center rounded-full border-2 text-2xl transition-colors hover:cursor-pointer sm:h-14 sm:w-14 sm:text-3xl ${
                  selectedRating === value
                    ? "border-secondary bg-secondary/20"
                    : "border-secondary/50 hover:bg-neutral/10"
                }`}
                aria-label={value}
              >
                {label}
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
            onClick={async (event) => {
              event.preventDefault();

              // Handle feedback submission logic here
              // setOpen(false);
              await handleSendFeedback();
              if (postFeedbackCallback)
                postFeedbackCallback({
                  emoji: selectedRating ?? "",
                  text: feedbackText.trim(),
                });
            }}
            disabled={!selectedRating || !feedbackText.trim()}
          >
            <SVGPaperPlane />{" "}
            {feedbackIsPending ? "Se trimite..." : "Trimite feedback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
