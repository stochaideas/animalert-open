import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PhoneInput } from "~/components/ui/complex/phone-input";

describe("PhoneInput Component", () => {
  const defaultProps = {
    value: "",
    countryCode: "RO",
    onValueChange: vi.fn(),
    onCountryCodeChange: vi.fn(),
  };

  it("should render with default Romanian country", () => {
    render(<PhoneInput {...defaultProps} />);

    // Should show Romanian flag
    expect(screen.getByText("🇷🇴")).toBeInTheDocument();
    // Should show Romanian dial code
    expect(screen.getByText("+40")).toBeInTheDocument();
  });

  it("should render with custom placeholder", () => {
    render(
      <PhoneInput {...defaultProps} placeholder="Enter your phone number" />,
    );

    expect(
      screen.getByPlaceholderText("Enter your phone number"),
    ).toBeInTheDocument();
  });

  it("should display the provided phone value", () => {
    render(<PhoneInput {...defaultProps} value="0712345678" />);

    const input = screen.getByPlaceholderText("Număr de telefon");
    expect(input).toHaveValue("0712345678");
  });

  it("should call onValueChange when phone input changes", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();

    render(<PhoneInput {...defaultProps} onValueChange={onValueChange} />);

    const input = screen.getByPlaceholderText("Număr de telefon");
    await user.type(input, "0712345678");

    expect(onValueChange).toHaveBeenCalled();
  });

  it("should open country selector when button is clicked", async () => {
    const user = userEvent.setup();

    render(<PhoneInput {...defaultProps} />);

    const button = screen.getByRole("combobox");
    await user.click(button);

    // Should show search input
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Caută țară...")).toBeInTheDocument();
    });
  });

  it("should display US country when countryCode is US", () => {
    render(<PhoneInput {...defaultProps} countryCode="US" />);

    expect(screen.getByText("🇺🇸")).toBeInTheDocument();
    expect(screen.getByText("+1")).toBeInTheDocument();
  });

  it("should display UK country when countryCode is GB", () => {
    render(<PhoneInput {...defaultProps} countryCode="GB" />);

    expect(screen.getByText("🇬🇧")).toBeInTheDocument();
    expect(screen.getByText("+44")).toBeInTheDocument();
  });

  it("should display Germany when countryCode is DE", () => {
    render(<PhoneInput {...defaultProps} countryCode="DE" />);

    expect(screen.getByText("🇩🇪")).toBeInTheDocument();
    expect(screen.getByText("+49")).toBeInTheDocument();
  });

  it("should be disabled when disabled prop is true", () => {
    render(<PhoneInput {...defaultProps} disabled />);

    const input = screen.getByPlaceholderText("Număr de telefon");
    const button = screen.getByRole("combobox");

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });

  it("should apply custom className", () => {
    const { container } = render(
      <PhoneInput {...defaultProps} className="custom-class" />,
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("custom-class");
  });

  it("should show default placeholder when none provided", () => {
    render(<PhoneInput {...defaultProps} />);

    expect(screen.getByPlaceholderText("Număr de telefon")).toBeInTheDocument();
  });

  it("should handle empty value", () => {
    render(<PhoneInput {...defaultProps} value="" />);

    const input = screen.getByPlaceholderText("Număr de telefon");
    expect(input).toHaveValue("");
  });

  it("should render with France country code", () => {
    render(<PhoneInput {...defaultProps} countryCode="FR" />);

    expect(screen.getByText("🇫🇷")).toBeInTheDocument();
    expect(screen.getByText("+33")).toBeInTheDocument();
  });

  it("should render with Italy country code", () => {
    render(<PhoneInput {...defaultProps} countryCode="IT" />);

    expect(screen.getByText("🇮🇹")).toBeInTheDocument();
    expect(screen.getByText("+39")).toBeInTheDocument();
  });

  it("should render with Spain country code", () => {
    render(<PhoneInput {...defaultProps} countryCode="ES" />);

    expect(screen.getByText("🇪🇸")).toBeInTheDocument();
    expect(screen.getByText("+34")).toBeInTheDocument();
  });

  it("should handle country code change", async () => {
    const onCountryCodeChange = vi.fn();
    const user = userEvent.setup();

    render(
      <PhoneInput
        {...defaultProps}
        onCountryCodeChange={onCountryCodeChange}
      />,
    );

    // Open country selector
    const button = screen.getByRole("combobox");
    await user.click(button);

    // Wait for the popover to open and search for USA
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Caută țară...")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Caută țară...");
    await user.type(searchInput, "Statele Unite");

    // Find and click the United States option (Statele Unite in Romanian)
    await waitFor(() => {
      const usOption = screen.getByText(/Statele Unite/);
      expect(usOption).toBeInTheDocument();
    });

    // Click the United States option to trigger handleCountrySelect
    const usOption = screen.getByText(/Statele Unite/);
    await user.click(usOption);

    // Verify onCountryCodeChange was called with US code
    expect(onCountryCodeChange).toHaveBeenCalledWith("US");
  });

  it("should call onValueChange when typing in phone input", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();

    render(<PhoneInput {...defaultProps} onValueChange={onValueChange} />);

    const input = screen.getByPlaceholderText("Număr de telefon");
    await user.type(input, "123");

    // Should be called for each character typed
    expect(onValueChange).toHaveBeenCalled();
    expect(onValueChange.mock.calls.length).toBeGreaterThan(0);
  });

  it("should handle country selection without onCountryCodeChange callback", async () => {
    const user = userEvent.setup();

    render(<PhoneInput {...defaultProps} onCountryCodeChange={undefined} />);

    // Open country selector
    const button = screen.getByRole("combobox");
    await user.click(button);

    // Wait for the popover to open
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Caută țară...")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Caută țară...");
    await user.type(searchInput, "Franța");

    // Find and click France (Franța in Romanian)
    await waitFor(() => {
      const frOption = screen.getByText(/Franța/);
      expect(frOption).toBeInTheDocument();
    });

    const frOption = screen.getByText(/Franța/);
    await user.click(frOption);

    // Should not throw error even without callback
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should handle phone input change without onValueChange callback", async () => {
    const user = userEvent.setup();

    render(<PhoneInput {...defaultProps} onValueChange={undefined} />);

    const input = screen.getByPlaceholderText("Număr de telefon");

    // Should not throw error even without callback
    await expect(user.type(input, "123456")).resolves.not.toThrow();

    // Without onValueChange, the value won't update since it's controlled
    // Just verify no errors occur
  });

  it("should fallback to default country when invalid country code provided", () => {
    render(<PhoneInput {...defaultProps} countryCode={"INVALID" as never} />);

    // Should fallback to Romanian flag (default)
    expect(screen.getByText("🇷🇴")).toBeInTheDocument();
    expect(screen.getByText("+40")).toBeInTheDocument();
  });
});
