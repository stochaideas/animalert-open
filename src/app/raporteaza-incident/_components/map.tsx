import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";
import { GoogleMap } from "~/app/_components/map";
import { SVGArrowLeft, SVGArrowRight } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useGeolocation } from "~/hooks/useGeolocation";
import { api } from "~/trpc/react";
// import AddressAutocomplete from "./address-predictions";

export default function Map({
  handlePreviousPage,
  handleNextPage,
}: {
  handlePreviousPage: () => void;
  handleNextPage: () => void;
}) {
  const { position, setPosition, error } = useGeolocation();
  const [address, setAddress] = useState<string | null>(null);

  const fetchedAddress = api.geolocation.getAddress.useQuery(
    position ?? { lat: 0, lng: 0 },
    { enabled: !!position },
  );

  useEffect(() => {
    if (fetchedAddress.data) {
      setAddress(fetchedAddress.data.formatted_address);
    }
  }, [fetchedAddress.data]);

  if (error) return <div>Error: {error}</div>;

  const handleSearchAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setAddress(e.target.value);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <section className="bg-neutral text-neutral-foreground border-tertiary-border rounded-md border-1 p-12">
          <h3 className="text-heading-3 pb-4">Identificare locație</h3>
          <Label className="flex items-center gap-0" htmlFor="location">
            Localizare
            <span className="text-red-500">*</span>
          </Label>
          <Input
            type="search"
            id="location"
            placeholder="Ex: București, Cluj, Timișoara"
            className="mt-3 p-6"
            onChange={handleSearchAddressChange}
            value={address ?? ""}
          />
        </section>
        <section className="border-tertiary-border mb-4 h-[600px] rounded-md border-1">
          <GoogleMap position={position} setPosition={setPosition} />
        </section>
      </div>
      <section className="flex items-center justify-end gap-6">
        <Button
          className="m-0"
          variant="neutral"
          size="md"
          onClick={handlePreviousPage}
        >
          <SVGArrowLeft /> Înapoi
        </Button>
        <Button
          className="m-0"
          variant="primary"
          size="md"
          type="submit"
          onClick={handleNextPage}
        >
          Salvează și continuă <SVGArrowRight />
        </Button>
      </section>
    </>
  );
}
