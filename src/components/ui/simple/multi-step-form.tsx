"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeftIcon, type LucideIcon } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { create } from "zustand";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface FormStore {
  currentStep: number;
  selections: Record<number | string, string>;
  setStep: (step: number) => void;
  setSelection: (step: number, selection: string, totalSteps: number) => void;
  reset: () => void;
  hasForm: boolean;
}

const useFormStore = create<FormStore>((set) => ({
  currentStep: 0,
  selections: {},
  setStep: (step) => set({ currentStep: step }),
  setSelection: (step, selection, totalSteps) =>
    set((state) => {
      const newSelections = { ...state.selections, [step]: selection };
      // Stay on last step unless we have a form
      const nextStep =
        step === totalSteps - 1
          ? state.hasForm
            ? totalSteps
            : step
          : step + 1;
      return {
        selections: newSelections,
        currentStep: nextStep,
      };
    }),
  reset: () => set({ currentStep: 0, selections: {} }),
  hasForm: false,
}));

export type FormStep = {
  level: number;
  id: string;
  title: string;
  description?: string;
  items: FormItem[];
};

export type FormItem = {
  id: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  image?: string;
  validNextSteps?: string[];
};

interface OptionCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  image?: string;
  selected?: boolean;
  onClick?: () => void;
  variant?: "default" | "compact";
  cardClassName?: string;
  imageClassName?: string;
  iconClassName?: string;
}

const OptionCard = React.forwardRef<HTMLDivElement, OptionCardProps>(
  (
    {
      title,
      description,
      icon: Icon,
      image,
      selected,
      onClick,
      variant = "default",
      cardClassName,
      imageClassName,
      iconClassName,
    },
    ref,
  ) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "hover:ring-primary relative h-full cursor-pointer overflow-hidden transition-all hover:ring-2",
          selected && "ring-primary ring-2",
          cardClassName,
        )}
        onClick={onClick}
      >
        {variant === "default" ? (
          <>
            {image ? (
              <div className={cn("relative h-32 md:h-44", imageClassName)}>
                <Image src={image} alt={title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0" />
                {Icon && (
                  <Icon
                    className={cn(
                      "absolute bottom-3 left-3 h-6 w-6 text-white",
                      iconClassName,
                    )}
                  />
                )}
              </div>
            ) : (
              Icon && (
                <div
                  className={cn(
                    "bg-muted flex h-32 items-center justify-center md:h-44",
                    imageClassName,
                  )}
                >
                  <Icon
                    className={cn(
                      "text-muted-foreground h-12 w-12",
                      iconClassName,
                    )}
                  />
                </div>
              )
            )}
            <div className="p-4">
              <h3 className="font-semibold">{title}</h3>
              {description && (
                <p className="text-muted-foreground text-sm">{description}</p>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="p-2">
              <h3 className="text-center font-semibold">{title}</h3>
            </div>
            {image ? (
              <div className="relative h-32 md:h-44">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className={cn("object-cover", imageClassName)}
                />
              </div>
            ) : (
              Icon && (
                <div
                  className={cn(
                    "bg-muted flex h-48 items-center justify-center",
                    imageClassName,
                  )}
                >
                  <Icon
                    className={cn(
                      "text-muted-foreground h-12 w-12",
                      iconClassName,
                    )}
                  />
                </div>
              )
            )}
          </>
        )}
      </Card>
    );
  },
);
OptionCard.displayName = "OptionCard";

interface FormCardProps {
  options: FormItem[];
  variant?: "default" | "compact";
  totalSteps?: number;
  cardClassName?: string;
  imageClassName?: string;
  iconClassName?: string;
}

const FormCard = React.forwardRef<HTMLDivElement, FormCardProps>(
  (
    {
      options,
      variant = "default",
      cardClassName,
      imageClassName,
      iconClassName,
      totalSteps,
    },
    ref,
  ) => {
    const currentStep = useFormStore((state) => state.currentStep);
    const selections = useFormStore((state) => state.selections);
    const setSelection = useFormStore((state) => state.setSelection);
    const visualOptions = options.filter(
      (option) => option.image || option.icon,
    );
    const textOptions = options.filter(
      (option) => !option.image && !option.icon,
    );
    const [selectedId, setSelectedId] = React.useState<string | null>(null);
    const [isSelecting, setIsSelecting] = React.useState(false);

    const handleSelection = React.useCallback(
      (optionId: string) => {
        if (isSelecting) return;
        setIsSelecting(true);
        setSelectedId(optionId);
        setSelection(currentStep, optionId, totalSteps || 0);
        setTimeout(() => {
          setIsSelecting(false);
        }, 300);
      },
      [currentStep, isSelecting, setSelection, totalSteps],
    );

    return (
      <div ref={ref}>
        {visualOptions.length > 0 && (
          <div className="flex flex-wrap justify-center">
            {visualOptions.map((option) => (
              <div className="w-1/2 p-2 md:w-1/4" key={option.id}>
                <OptionCard
                  title={option.title}
                  description={option.description}
                  icon={option.icon}
                  image={option.image}
                  selected={
                    selectedId === option.id ||
                    selections[currentStep] === option.id
                  }
                  onClick={() => handleSelection(option.id)}
                  variant={variant}
                  cardClassName={cardClassName}
                  imageClassName={imageClassName}
                  iconClassName={iconClassName}
                />
              </div>
            ))}
          </div>
        )}

        {textOptions.length > 0 && (
          <div className="flex flex-wrap justify-center">
            {textOptions.map((option) => (
              <div className="w-full p-2" key={option.id}>
                <OptionCard
                  title={option.title}
                  description={option.description}
                  selected={
                    selectedId === option.id ||
                    selections[currentStep] === option.id
                  }
                  onClick={() => handleSelection(option.id)}
                  variant={variant}
                  cardClassName={cardClassName}
                  imageClassName={imageClassName}
                  iconClassName={iconClassName}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
);
FormCard.displayName = "FormCard";

interface StepOptions {
  title: string;
  options: FormStep["items"];
}

export interface MultiStepFormProps {
  title?: React.ReactNode;
  formSteps: FormStep[];
  onComplete: (selections: Record<number | string, string>) => boolean;
  variant?: "default" | "compact";
  cardClassName?: string;
  imageClassName?: string;
  iconClassName?: string;
  children?: React.ReactNode;
  finalStep?: React.ReactNode;
  className?: string;
}

const MultiStepForm = React.forwardRef<HTMLDivElement, MultiStepFormProps>(
  (
    {
      title,
      formSteps,
      onComplete,
      variant = "default",
      cardClassName,
      imageClassName,
      iconClassName,
      children,
      finalStep,
      className,
      ...props
    },
    ref,
  ) => {
    const { currentStep, setStep, selections } = useFormStore();
    const [canFinish, setCanFinish] = React.useState(false);
    const [showSuccess, setShowSuccess] = React.useState(false);

    // Set hasForm on mount
    React.useEffect(() => {
      useFormStore.setState({ hasForm: Boolean(children) });
    }, [children]);

    const handleBack = () => {
      if (showSuccess) {
        setShowSuccess(false);
        return;
      }
      if (currentStep > 0) {
        setStep(currentStep - 1);
      }
    };

    const getStepOptions = (
      currentStep: number,
      selections: Record<number | string, string>,
    ): StepOptions | null => {
      const step = formSteps[currentStep];
      if (!step) return null;

      if (currentStep === 0) {
        return {
          title: step.title,
          options: step.items,
        };
      }

      const previousSelection = selections[currentStep - 1];
      if (!previousSelection) return null;

      const previousStep = formSteps[currentStep - 1];
      const previousOption = previousStep.items.find(
        (item) => item.id === previousSelection,
      );
      if (!previousOption) return null;

      const validNextSteps = previousOption.validNextSteps || [];
      const availableOptions = step.items.filter((item) =>
        validNextSteps.includes(item.id),
      );

      return {
        title: step.title,
        options: availableOptions,
      };
    };

    const isLastStep = currentStep === formSteps.length - 1;
    const isSuccessStep = currentStep === formSteps.length;
    const stepOptions = getStepOptions(currentStep, selections);
    const hasLastStepSelection = selections[formSteps.length - 1] !== undefined;

    const handleComplete = () => {
      if (finalStep) {
        // If no form, just use selections and show success
        const isValid = onComplete(selections);
        if (isValid) {
          setShowSuccess(true);
        }
      } else {
        onComplete(selections);
      }
    };

    const shouldShowOptions =
      stepOptions && (!isSuccessStep || (!children && !finalStep));
    const shouldShowComplete =
      isLastStep && !showSuccess && hasLastStepSelection && !children;

    React.useEffect(() => {
      if (isLastStep) {
        const hasSelection = selections[currentStep] !== undefined;
        setCanFinish(hasSelection);
      }
    }, [isLastStep, currentStep, selections]);

    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center", className)}
        {...props}
      >
        <div className="h-screen min-h-screen w-full max-w-5xl p-2">
          <Card className="mx-auto h-full w-full p-2 p-6 shadow-lg md:p-6">
            <div className="mb-8 p-4 md:p-0">
              <div className="mb-4 flex items-center justify-between">
                <div className="w-20">
                  {currentStep > 0 ? (
                    <Button
                      variant="link"
                      onClick={handleBack}
                      className="mr-4 p-0"
                    >
                      <ChevronLeftIcon className="h-5 w-5" />
                      Back
                    </Button>
                  ) : (
                    <div className="invisible">
                      <Button variant="link" className="mr-4 p-0">
                        <ChevronLeftIcon className="h-5 w-5" />
                        Back
                      </Button>
                    </div>
                  )}
                </div>
                {title && <div className="flex items-center">{title}</div>}
                <div className="text-muted-foreground w-20 text-right text-sm font-medium">
                  {isSuccessStep
                    ? `${formSteps.length}/${formSteps.length}`
                    : `${currentStep + 1}/${formSteps.length}`}
                </div>
              </div>
              <Progress
                value={
                  isSuccessStep
                    ? 100
                    : ((currentStep + 1) / formSteps.length) * 100
                }
                className="h-2"
              />
              <div className="mt-4 text-center">
                {!isSuccessStep && stepOptions && (
                  <h1 className="mb-2 text-2xl font-semibold">
                    {stepOptions.title}
                  </h1>
                )}
                {formSteps[currentStep]?.description && (
                  <p className="text-muted-foreground mx-auto max-w-md text-sm">
                    {formSteps[currentStep].description}
                  </p>
                )}
              </div>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.15 }}
                // className="h-full"
              >
                {showSuccess ? (
                  finalStep
                ) : isSuccessStep && children ? (
                  children
                ) : shouldShowOptions ? (
                  <FormCard
                    options={stepOptions?.options || []}
                    variant={variant}
                    totalSteps={formSteps.length}
                    cardClassName={cardClassName}
                    imageClassName={imageClassName}
                    iconClassName={iconClassName}
                    key={`form-card-${currentStep}`}
                  />
                ) : null}
              </motion.div>
            </AnimatePresence>

            {/* Show Complete button when we have no form */}
            {shouldShowComplete && (
              <div className="mt-8 flex justify-end">
                <Button onClick={handleComplete} disabled={!canFinish}>
                  Complete
                </Button>
              </div>
            )}
            {/* Show Submit/Complete button on form step */}
            {isSuccessStep && !showSuccess && children && (
              <div className="mt-8 flex justify-end">
                <Button onClick={handleComplete}>
                  {finalStep ? "Submit" : "Complete"}
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    );
  },
);
MultiStepForm.displayName = "MultiStepForm";

export default MultiStepForm;
