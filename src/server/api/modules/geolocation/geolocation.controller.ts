import type { Coordinates } from "~/types/coordinates";
import { GeolocationService } from "./geolocation.service";

export class GeolocationController {
  private geolocationService: GeolocationService;

  constructor() {
    this.geolocationService = new GeolocationService();
  }

  async mapsGeocode(coordinates: Coordinates) {
    return await this.geolocationService.mapsGeocode(coordinates);
  }

  async placeAutocomplete(input: { address: string }) {
    return await this.geolocationService.placeAutocomplete(input);
  }

  async placeDetails(input: { placeId: string }) {
    return await this.geolocationService.placeDetails(input);
  }
}
