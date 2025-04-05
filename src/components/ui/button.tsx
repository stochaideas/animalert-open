import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Poppins } from "next/font/google";

import { cn } from "~/lib/utils";

const poppins = Poppins({
  style: "normal",
  weight: "500",
});

const buttonVariants = cva(
  `${poppins.className} m-auto hover:cursor-pointer border-1 rounded-lg inline-flex items-center justify-center gap-[8px] whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none`,
  {
    variants: {
      variant: {
        neutral:
          "bg-neutral text-neutral-foreground border-neutral-stroke hover:bg-neutral-hover active:bg-neutral-active disabled:bg-neutral-disabled disabled:text-neutral-disabled-foreground",
      },
      size: {
        sm: "p-[12px]",
        md: "p-[16px]",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "sm",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
