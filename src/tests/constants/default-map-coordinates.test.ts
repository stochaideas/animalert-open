import { describe, it, expect } from "vitest";
import { DEFAULT_MAP_COORDINATES } from "~/constants/default-map-coordinates";

describe("DEFAULT_MAP_COORDINATES", () => {
  it("should export DEFAULT_MAP_COORDINATES object", () => {
    expect(DEFAULT_MAP_COORDINATES).toBeDefined();
    expect(typeof DEFAULT_MAP_COORDINATES).toBe("object");
  });

  it("should have lat and lng properties", () => {
    expect(DEFAULT_MAP_COORDINATES).toHaveProperty("lat");
    expect(DEFAULT_MAP_COORDINATES).toHaveProperty("lng");
  });

  it("should have valid latitude", () => {
    expect(typeof DEFAULT_MAP_COORDINATES.lat).toBe("number");
    expect(DEFAULT_MAP_COORDINATES.lat).toBeGreaterThanOrEqual(-90);
    expect(DEFAULT_MAP_COORDINATES.lat).toBeLessThanOrEqual(90);
  });

  it("should have valid longitude", () => {
    expect(typeof DEFAULT_MAP_COORDINATES.lng).toBe("number");
    expect(DEFAULT_MAP_COORDINATES.lng).toBeGreaterThanOrEqual(-180);
    expect(DEFAULT_MAP_COORDINATES.lng).toBeLessThanOrEqual(180);
  });

  it("should point to Romania (Cluj-Napoca area)", () => {
    // Romania's approximate coordinates: 45°N, 25°E
    expect(DEFAULT_MAP_COORDINATES.lat).toBeGreaterThan(44);
    expect(DEFAULT_MAP_COORDINATES.lat).toBeLessThan(48);
    expect(DEFAULT_MAP_COORDINATES.lng).toBeGreaterThan(20);
    expect(DEFAULT_MAP_COORDINATES.lng).toBeLessThan(30);
  });
});
