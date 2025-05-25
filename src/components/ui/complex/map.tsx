import { Label } from "@radix-ui/react-label";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { GoogleMap } from "~/components/ui/complex/google-map";
import { SVGArrowLeft, SVGArrowRight } from "~/components/icons";
import { Button } from "~/components/ui/simple/button";
import { Input } from "~/components/ui/simple/input";
import { useGeolocation } from "~/hooks/useGeolocation";
import { api } from "~/trpc/react";
import type { Coordinates } from "../../../types/coordinates";
import { DEFAULT_MAP_COORDINATES } from "~/constants/default-map-coordinates";
// import AddressplaceAutocomplete from "./address-predictions";

export default function Map({
  address,
  setAddress,
  handlePreviousPage,
  onMapSubmit,
  mapCoordinates,
  setMapCoordinates,
  isPending,
}: {
  address?: string;
  setAddress: Dispatch<SetStateAction<string | undefined>>;
  handlePreviousPage: () => void;
  onMapSubmit: () => void;
  mapCoordinates?: Coordinates;
  setMapCoordinates?: Dispatch<SetStateAction<Coordinates | undefined>>;
  isPending?: boolean;
}) {
  const { coordinates, setCoordinates } = useGeolocation(mapCoordinates);

  useEffect(() => {
    if (setMapCoordinates) {
      setMapCoordinates(coordinates);
    }
  }, [coordinates, setMapCoordinates]);

  const fetchedAddress = api.geolocation.mapsGeocode.useQuery(
    coordinates ?? { lat: 0, lng: 0 },
    { enabled: !!coordinates },
  );

  useEffect(() => {
    if (fetchedAddress.data) {
      setAddress(fetchedAddress.data.formattedAddress);
    }
  }, [setAddress, fetchedAddress.data]);

  const handleSearchAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setAddress(e.target.value);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <section className="bg-neutral text-neutral-foreground border-tertiary-border flex flex-col gap-8 rounded-md border-1 px-4 py-8 md:p-12">
          <div>
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
          </div>
          <section className="border-tertiary-border mb-4 h-[600px] rounded-md border-1 lg:hidden">
            <GoogleMap
              coordinates={coordinates ?? DEFAULT_MAP_COORDINATES}
              setCoordinates={setCoordinates}
            />
          </section>
        </section>
        <section className="border-tertiary-border mb-4 hidden h-[600px] rounded-md border-1 lg:block">
          <GoogleMap
            coordinates={coordinates ?? DEFAULT_MAP_COORDINATES}
            setCoordinates={setCoordinates}
          />
        </section>
      </div>
      <section className="flex flex-col items-center justify-end gap-6 md:flex-row-reverse md:justify-start">
        <Button
          className="m-0 w-full sm:w-auto"
          variant="primary"
          size="md"
          type="submit"
          onClick={onMapSubmit}
          disabled={isPending}
        >
          {isPending ? (
            <>Se salvează</>
          ) : (
            <>
              Salvează și continuă <SVGArrowRight />
            </>
          )}
        </Button>
        <Button
          className="m-0 w-full sm:w-auto"
          variant="neutral"
          size="md"
          onClick={handlePreviousPage}
        >
          <SVGArrowLeft /> Înapoi
        </Button>
      </section>
    </>
  );
}
