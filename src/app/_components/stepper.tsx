const steps = [
  { title: "Important!" },
  { title: "Date contact & media" },
  { title: "Locație" },
  { title: "Chatbot" },
];

export function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="mx-auto flex w-full items-center">
      {steps.map((step, idx) => (
        <div key={step.title} className="flex flex-1 flex-col items-center">
          {/* Step circle */}
          <div
            className={`text-body-strong z-10 flex h-[3rem] w-[3rem] items-center justify-center rounded-full border-1 ${
              idx + 1 === currentStep
                ? "border-neutral-stroke bg-neutral-active"
                : "border-neutral-stroke bg-white"
            }`}
          >
            {idx + 1}
          </div>
          {/* Step title */}
          <span className="mt-2 text-center text-sm font-semibold">
            {step.title}
          </span>
          {/* Horizontal line (except last step) */}
          {idx < steps.length - 1 && (
            <div className="bg-neutral-stroke relative top-[-53px] left-30 z-0 h-[1px] w-full"></div>
          )}
        </div>
      ))}
    </div>
  );
}
