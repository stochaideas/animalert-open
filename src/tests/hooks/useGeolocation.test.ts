import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useGeolocation } from "~/hooks/useGeolocation";

describe("useGeolocation", () => {
  let mockGeolocation: {
    getCurrentPosition: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockGeolocation = {
      getCurrentPosition: vi.fn(),
    };
    // @ts-expect-error - Mocking navigator.geolocation
    global.navigator.geolocation = mockGeolocation;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return initial coordinates when provided", () => {
    const initialCoords = { lat: 44.4268, lng: 26.1025 };
    const { result } = renderHook(() => useGeolocation(initialCoords));

    expect(result.current.coordinates).toEqual(initialCoords);
    expect(result.current.isUsingInitialCoordinates).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("should not call getCurrentPosition when initial coordinates are provided", () => {
    const initialCoords = { lat: 44.4268, lng: 26.1025 };
    renderHook(() => useGeolocation(initialCoords));

    expect(mockGeolocation.getCurrentPosition).not.toHaveBeenCalled();
  });

  it("should fetch geolocation when no initial coordinates provided", async () => {
    const mockPosition = {
      coords: {
        latitude: 40.7128,
        longitude: -74.006,
        accuracy: 10,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    };

    mockGeolocation.getCurrentPosition.mockImplementation(
      (success: PositionCallback) => {
        success(mockPosition as GeolocationPosition);
      },
    );

    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => {
      expect(result.current.coordinates).toEqual({
        lat: 40.7128,
        lng: -74.006,
      });
    });

    expect(result.current.isUsingInitialCoordinates).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should handle geolocation error", async () => {
    const mockError = {
      code: 1,
      message: "User denied geolocation",
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
    } as GeolocationPositionError;

    mockGeolocation.getCurrentPosition.mockImplementation(
      (_: PositionCallback, error?: PositionErrorCallback) => {
        error?.(mockError);
      },
    );

    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => {
      expect(result.current.error).toBe(
        "Geolocation error (1): User denied geolocation",
      );
    });

    expect(result.current.coordinates).toBeUndefined();
  });

  it("should handle browser without geolocation support", () => {
    // @ts-expect-error - Remove geolocation to simulate unsupported browser
    delete global.navigator.geolocation;

    const { result } = renderHook(() => useGeolocation());

    expect(result.current.error).toBe(
      "Geolocation is not supported by your browser",
    );
    expect(result.current.coordinates).toBeUndefined();
  });

  it("should allow manual coordinate updates via setCoordinates", () => {
    const { result } = renderHook(() => useGeolocation());

    const newCoords = { lat: 51.5074, lng: -0.1278 };
    result.current.setCoordinates(newCoords);

    expect(result.current.coordinates).toEqual(newCoords);
  });

  it("should use high accuracy and proper timeout", () => {
    mockGeolocation.getCurrentPosition.mockImplementation(
      (success: PositionCallback) => {
        success({
          coords: {
            latitude: 40.7128,
            longitude: -74.006,
            accuracy: 10,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
          timestamp: Date.now(),
        } as GeolocationPosition);
      },
    );

    renderHook(() => useGeolocation());

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    );
  });

  it("should handle different coordinate values", async () => {
    const testCases = [
      { lat: 0, lng: 0 }, // Null Island
      { lat: 90, lng: 180 }, // Max values
      { lat: -90, lng: -180 }, // Min values
      { lat: 35.6762, lng: 139.6503 }, // Tokyo
    ];

    for (const coords of testCases) {
      mockGeolocation.getCurrentPosition.mockImplementation(
        (success: PositionCallback) => {
          success({
            coords: {
              latitude: coords.lat,
              longitude: coords.lng,
              accuracy: 10,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              speed: null,
            },
            timestamp: Date.now(),
          } as GeolocationPosition);
        },
      );

      const { result } = renderHook(() => useGeolocation());

      await waitFor(() => {
        expect(result.current.coordinates).toEqual(coords);
      });
    }
  });
});
