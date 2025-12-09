import { describe, it, expect, beforeEach, vi } from "vitest";
import { GeolocationController } from "~/server/api/modules/geolocation/geolocation.controller";
import { GeolocationService } from "~/server/api/modules/geolocation/geolocation.service";

// Mock dependencies
vi.mock("~/env", () => ({
  env: {
    NODE_ENV: "development",
    GOOGLE_MAPS_API_KEY: "test-api-key",
  },
}));

describe("GeolocationController", () => {
  let controller: GeolocationController;
  let mockService: GeolocationService;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new GeolocationController();
    mockService = controller.geolocationService;
  });

  it("should instantiate with GeolocationService", () => {
    expect(controller).toBeDefined();
    expect(mockService).toBeInstanceOf(GeolocationService);
  });

  describe("mapsGeocode", () => {
    it("should call geolocationService.mapsGeocode", async () => {
      const coordinates = { lat: 44.4268, lng: 26.1025 };

      const spy = vi.spyOn(mockService, "mapsGeocode").mockResolvedValue({
        formattedAddress: "Bucharest, Romania",
        geometry: {
          location: { lat: 44.4268, lng: 26.1025 },
        },
      });

      await controller.mapsGeocode(coordinates);

      expect(spy).toHaveBeenCalledWith(coordinates);
    });
  });

  describe("placeAutocomplete", () => {
    it("should call geolocationService.placeAutocomplete", async () => {
      const input = { address: "Bucharest" };

      const spy = vi.spyOn(mockService, "placeAutocomplete").mockResolvedValue([
        {
          description: "Bucharest, Romania",
          placeId: "ChIJT608vzr5sUARzkmsxZ1U-Gw",
        },
      ]);

      await controller.placeAutocomplete(input);

      expect(spy).toHaveBeenCalledWith(input);
    });
  });

  describe("placeDetails", () => {
    it("should call geolocationService.placeDetails", async () => {
      const input = { placeId: "ChIJT608vzr5sUARzkmsxZ1U-Gw" };

      const spy = vi.spyOn(mockService, "placeDetails").mockResolvedValue({
        formatted_address: "Bucharest, Romania",
        location: { lat: 44.4268, lng: 26.1025 },
      });

      await controller.placeDetails(input);

      expect(spy).toHaveBeenCalledWith(input);
    });
  });
});
