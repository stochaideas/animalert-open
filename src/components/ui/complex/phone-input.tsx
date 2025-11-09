"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/simple/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/simple/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/simple/popover";
import { Input } from "~/components/ui/simple/input";
import {
  COUNTRY_PHONE_CODES,
  DEFAULT_COUNTRY_CODE,
  getCountryByCode,
  type CountryPhoneCode,
} from "~/constants/country-phone-codes";

interface PhoneInputProps {
  value?: string;
  countryCode?: string;
  onValueChange?: (phone: string) => void;
  onCountryCodeChange?: (countryCode: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function PhoneInput({
  value = "",
  countryCode = DEFAULT_COUNTRY_CODE,
  onValueChange,
  onCountryCodeChange,
  placeholder = "Număr de telefon",
  disabled = false,
  className,
}: PhoneInputProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedCountry, setSelectedCountry] =
    React.useState<CountryPhoneCode>(
      getCountryByCode(countryCode) ?? getCountryByCode(DEFAULT_COUNTRY_CODE)!,
    );

  React.useEffect(() => {
    const country = getCountryByCode(countryCode);
    if (country) {
      setSelectedCountry(country);
    }
  }, [countryCode]);

  const handleCountrySelect = (country: CountryPhoneCode) => {
    setSelectedCountry(country);
    setOpen(false);
    onCountryCodeChange?.(country.code);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange?.(e.target.value);
  };

  return (
    <div className={cn("flex w-full gap-2", className)}>
      {/* Country Code Dropdown */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="neutral"
            role="combobox"
            aria-expanded={open}
            aria-label="Cod țară"
            data-testid="country-code-selector"
            className="w-[140px] justify-between px-3"
            disabled={disabled}
            type="button"
          >
            <span className="flex items-center gap-2 truncate">
              <span className="text-lg">{selectedCountry.flag}</span>
              <span className="text-sm">{selectedCountry.dialCode}</span>
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Caută țară..." />
            <CommandList>
              <CommandEmpty>Nicio țară găsită.</CommandEmpty>
              <CommandGroup>
                {COUNTRY_PHONE_CODES.map((country) => (
                  <CommandItem
                    key={country.code}
                    value={`${country.name} ${country.dialCode} ${country.code}`}
                    onSelect={() => handleCountrySelect(country)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCountry.code === country.code
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    <span className="mr-2 text-lg">{country.flag}</span>
                    <span className="flex-1 truncate">{country.name}</span>
                    <span className="text-muted-foreground text-sm">
                      {country.dialCode}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Phone Number Input */}
      <Input
        type="tel"
        value={value}
        onChange={handlePhoneChange}
        placeholder={placeholder}
        disabled={disabled}
        data-testid="phone-number-input"
        className="flex-1 p-6"
      />
    </div>
  );
}
