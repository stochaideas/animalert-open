import { useState, useEffect } from "react";
import { Combobox } from "~/components/ui/combobox";
import { api } from "~/trpc/react";

export default function AddressAutocomplete({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (description: string, placeId: string) => void;
}) {
  const [inputValue, setInputValue] = useState(value);
  const [debounced, setDebounced] = useState(inputValue);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(inputValue), 300);
    return () => clearTimeout(id);
  }, [inputValue]);

  const { data: predictions = [], isLoading } =
    api.geolocation.autocomplete.useQuery(
      { input: debounced },
      { enabled: debounced.length >= 3 },
    );

  return (
    <Combobox
      value={value}
      onValueChange={(val, label) => onSelect(label, val)}
      options={predictions.map((p) => ({
        value: p.place_id,
        label: p.description,
      }))}
      loading={isLoading}
      onInputChange={setInputValue}
      placeholder="Ex: București, Cluj, Timișoara"
    />
  );
}
