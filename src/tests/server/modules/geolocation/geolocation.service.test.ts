/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { GeolocationService } from "~/server/api/modules/geolocation/geolocation.service";

// Mock env
vi.mock("~/env", () => ({
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: "test-api-key",
  },
}));

// Mock global fetch
global.fetch = vi.fn();

describe("GeolocationService", () => {
  let geolocationService: GeolocationService;

  beforeEach(() => {
    vi.clearAllMocks();
    geolocationService = new GeolocationService();
  });

  describe("mapsGeocode", () => {
    it("should geocode coordinates successfully", async () => {
      const mockResponse = {
        results: [
          {
            formatted_address: "Strada Exemplu 1, București, România",
            geometry: {
              location: {
                lat: 44.4268,
                lng: 26.1025,
              },
            },
          },
        ],
        status: "OK",
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await geolocationService.mapsGeocode({
        lat: 44.4268,
        lng: 26.1025,
      });

      expect(result.formattedAddress).toBe(
        "Strada Exemplu 1, București, România",
      );
      expect(result.geometry.location.lat).toBe(44.4268);
      expect(result.geometry.location.lng).toBe(26.1025);
    });

    it("should include API key in request", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({
          results: [
            {
              formatted_address: "Test Address",
              geometry: { location: { lat: 45, lng: 25 } },
            },
          ],
          status: "OK",
        }),
      } as Response);

      await geolocationService.mapsGeocode({ lat: 45, lng: 25 });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("key=test-api-key"),
      );
    });

    it("should include lat/lng in request", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({
          results: [
            {
              formatted_address: "Test",
              geometry: { location: { lat: 44.5, lng: 26.5 } },
            },
          ],
          status: "OK",
        }),
      } as Response);

      await geolocationService.mapsGeocode({ lat: 44.5, lng: 26.5 });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("latlng=44.5%2C26.5"),
      );
    });

    it("should throw error when status is not OK", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({
          results: [],
          status: "ZERO_RESULTS",
          error_message: "No results found",
        }),
      } as Response);

      await expect(
        geolocationService.mapsGeocode({ lat: 0, lng: 0 }),
      ).rejects.toThrow("No results found");
    });

    it("should throw error when no results", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({
          results: [],
          status: "OK",
        }),
      } as Response);

      await expect(
        geolocationService.mapsGeocode({ lat: 44, lng: 26 }),
      ).rejects.toThrow("No address found for the given coordinates.");
    });

    it("should use default error message when none provided", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({
          results: [],
          status: "ERROR",
        }),
      } as Response);

      await expect(
        geolocationService.mapsGeocode({ lat: 44, lng: 26 }),
      ).rejects.toThrow("No address");
    });

    it("should handle multiple results correctly", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({
          results: [
            {
              formatted_address: "First Address",
              geometry: { location: { lat: 44.1, lng: 26.1 } },
            },
            {
              formatted_address: "Second Address",
              geometry: { location: { lat: 44.2, lng: 26.2 } },
            },
          ],
          status: "OK",
        }),
      } as Response);

      const result = await geolocationService.mapsGeocode({
        lat: 44.1,
        lng: 26.1,
      });

      expect(result.formattedAddress).toBe("First Address");
    });
  });

  describe("placeAutocomplete", () => {
    it("should return autocomplete predictions", async () => {
      const mockResponse = {
        predictions: [
          { description: "București, România", place_id: "place1" },
          { description: "Brașov, România", place_id: "place2" },
        ],
        status: "OK",
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await geolocationService.placeAutocomplete({
        address: "B",
      });

      expect(result).toHaveLength(2);
      expect(result[0]?.description).toBe("București, România");
      expect(result[0]?.placeId).toBe("place1");
      expect(result[1]?.description).toBe("Brașov, România");
      expect(result[1]?.placeId).toBe("place2");
    });

    it("should include search input in request", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ predictions: [], status: "OK" }),
      } as Response);

      await geolocationService.placeAutocomplete({
        address: "Strada Test",
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("input=Strada+Test"),
      );
    });

    it("should set Romanian language and country", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ predictions: [], status: "OK" }),
      } as Response);

      await geolocationService.placeAutocomplete({ address: "Test" });

      const callUrl = (fetch as any).mock.calls[0][0];
      expect(callUrl).toContain("language=ro");
      expect(callUrl).toContain("components=country%3Aro");
    });

    it("should throw error when status is not OK", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({
          predictions: [],
          status: "INVALID_REQUEST",
          error_message: "Invalid input",
        }),
      } as Response);

      await expect(
        geolocationService.placeAutocomplete({ address: "" }),
      ).rejects.toThrow("Invalid input");
    });

    it("should use default error message when none provided", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({
          predictions: [],
          status: "ERROR",
        }),
      } as Response);

      await expect(
        geolocationService.placeAutocomplete({ address: "Test" }),
      ).rejects.toThrow("No predictions");
    });

    it("should handle empty predictions", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({
          predictions: [],
          status: "OK",
        }),
      } as Response);

      const result = await geolocationService.placeAutocomplete({
        address: "NonexistentPlace",
      });

      expect(result).toEqual([]);
    });

    it("should map predictions correctly", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({
          predictions: [
            { description: "Test Location", place_id: "test-id-123" },
          ],
          status: "OK",
        }),
      } as Response);

      const result = await geolocationService.placeAutocomplete({
        address: "Test",
      });

      expect(result[0]).toEqual({
        description: "Test Location",
        placeId: "test-id-123",
      });
    });
  });

  describe("placeDetails", () => {
    it("should fetch place details successfully", async () => {
      const mockResponse = {
        result: {
          formatted_address: "Piața Universității, București",
          geometry: {
            location: {
              lat: 44.4361,
              lng: 26.1003,
            },
          },
        },
        status: "OK",
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await geolocationService.placeDetails({
        placeId: "test-place-id",
      });

      expect(result.formatted_address).toBe("Piața Universității, București");
      expect(result.location.lat).toBe(44.4361);
      expect(result.location.lng).toBe(26.1003);
    });

    it("should include place ID in request", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({
          result: {
            formatted_address: "Test",
            geometry: { location: { lat: 44, lng: 26 } },
          },
          status: "OK",
        }),
      } as Response);

      await geolocationService.placeDetails({
        placeId: "ChIJ0T2NLikKskARKxE8d61aX_E",
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("place_id=ChIJ0T2NLikKskARKxE8d61aX_E"),
      );
    });

    it("should request specific fields", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({
          result: {
            formatted_address: "Test",
            geometry: { location: { lat: 44, lng: 26 } },
          },
          status: "OK",
        }),
      } as Response);

      await geolocationService.placeDetails({ placeId: "test-id" });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("fields=geometry%2Cformatted_address"),
      );
    });

    it("should set Romanian language", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({
          result: {
            formatted_address: "Test",
            geometry: { location: { lat: 44, lng: 26 } },
          },
          status: "OK",
        }),
      } as Response);

      await geolocationService.placeDetails({ placeId: "test-id" });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("language=ro"),
      );
    });

    it("should throw error when fetch fails", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 404,
      } as Response);

      await expect(
        geolocationService.placeDetails({ placeId: "invalid-id" }),
      ).rejects.toThrow("Failed to fetch place details");
    });

    it("should throw error when status is not OK", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({
          result: {},
          status: "NOT_FOUND",
          error_message: "Place not found",
        }),
      } as Response);

      await expect(
        geolocationService.placeDetails({ placeId: "nonexistent" }),
      ).rejects.toThrow("Place not found");
    });

    it("should use default error message when none provided", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({
          result: {},
          status: "ERROR",
        }),
      } as Response);

      await expect(
        geolocationService.placeDetails({ placeId: "test" }),
      ).rejects.toThrow("No details");
    });
  });
});
