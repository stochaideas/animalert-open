"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--neutral)",
          "--normal-text": "var(--primary-foreground)",
          "--normal-border": "var(--neutral-stroke)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
