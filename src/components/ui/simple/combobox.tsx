import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/simple/popover";
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "~/components/ui/simple/command";
import { Input } from "~/components/ui/simple/input";

export function Combobox({
  value,
  onValueChange,
  options,
  loading,
  placeholder = "Type to search...",
  noResultsText = "No results found.",
  onInputChange,
}: {
  value: string;
  onValueChange: (value: string, label: string) => void;
  options: { value: string; label: string }[];
  loading?: boolean;
  placeholder?: string;
  noResultsText?: string;
  onInputChange?: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  // Keep inputValue in sync with value prop
  React.useEffect(() => {
    setInputValue(
      value ? (options.find((opt) => opt.value === value)?.label ?? "") : "",
    );
  }, [value, options]);

  console.log(inputValue);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Input
          value={inputValue}
          placeholder={placeholder}
          onChange={(e) => {
            setInputValue(e.target.value);
            setOpen(true);
            onInputChange?.(e.target.value);
          }}
          onFocus={() => setOpen(true)}
          placeAutocomplete="off"
        />
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandList>
            {loading ? (
              <div className="text-muted-foreground p-2 text-sm">
                Loading...
              </div>
            ) : options.length === 0 ? (
              <CommandEmpty>{noResultsText}</CommandEmpty>
            ) : (
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      setInputValue(option.label);
                      onValueChange(option.value, option.label);
                      setOpen(false);
                    }}
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
