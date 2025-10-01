import { describe, expect, it } from "vitest";
import { TRPCError } from "@trpc/server";
import {
  PostgresErrorCode,
  handlePostgresError,
  type PostgresError,
} from "../postgres-error";

const baseError: PostgresError = {
  name: "PostgresError",
  severity_local: "ERROR",
  severity: "ERROR",
  code: PostgresErrorCode.UniqueViolation,
  position: "0",
  file: "test",
  line: "1",
  routine: "test",
};

describe("handlePostgresError", () => {
  it("throws a conflict TRPCError for known unique violations", () => {
    try {
      handlePostgresError({
        ...baseError,
        code: PostgresErrorCode.UniqueViolation,
        constraint_name: "users_email_unique",
      });
      throw new Error("Expected to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(TRPCError);
      const trpcError = error as TRPCError;
      expect(trpcError.code).toBe("CONFLICT");
      expect(trpcError.message).toBe(
        "Această adresă de email este deja înregistrată",
      );
    }
  });

  it("falls back to a generic error message for unknown errors", () => {
    try {
      handlePostgresError({
        ...baseError,
        code: "unknown" as PostgresErrorCode,
      });
      throw new Error("Expected to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(TRPCError);
      const trpcError = error as TRPCError;
      expect(trpcError.code).toBe("INTERNAL_SERVER_ERROR");
      expect(trpcError.message).toBe(
        "A apărut o eroare neașteptată",
      );
    }
  });
});
