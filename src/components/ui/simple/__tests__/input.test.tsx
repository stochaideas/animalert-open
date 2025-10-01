import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "../input";

describe("Input", () => {
  it("renders with merged class names and attributes", () => {
    render(<Input type="email" className="custom-class" aria-label="email" />);

    const input = screen.getByLabelText("email");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveClass("custom-class");
    expect(input).toHaveAttribute("data-slot", "input");
  });

  it("exposes aria-invalid styling hook", () => {
    render(<Input aria-label="invalid" aria-invalid="true" />);
    const input = screen.getByLabelText("invalid");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });
});
