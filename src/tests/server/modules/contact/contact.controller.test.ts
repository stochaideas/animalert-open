import { describe, it, expect, beforeEach, vi } from "vitest";
import { ContactController } from "~/server/api/modules/contact/contact.controller";
import { ContactService } from "~/server/api/modules/contact/contact.service";

// Mock dependencies
vi.mock("~/env", () => ({
  env: {
    NODE_ENV: "development",
    DATABASE_URL: "postgresql://test:test@localhost:5432/test",
  },
}));

vi.mock("~/server/db");

describe("ContactController", () => {
  let controller: ContactController;
  let mockService: ContactService;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new ContactController();
    mockService = controller.contactService;
  });

  it("should instantiate with ContactService", () => {
    expect(controller).toBeDefined();
    expect(mockService).toBeInstanceOf(ContactService);
  });

  describe("upsertContactWithUser", () => {
    it("should call contactService.insertContact", async () => {
      const data = {
        lastName: "Doe",
        firstName: "John",
        email: "test@example.com",
        phone: "0712345678",
        county: "AB",
        solicitationType: "GENERAL",
        message: "Test message",
      };

      const spy = vi
        .spyOn(mockService, "insertContact")
        .mockResolvedValue(undefined);

      await controller.upsertContactWithUser(data);

      expect(spy).toHaveBeenCalledWith(data);
    });
  });
});
