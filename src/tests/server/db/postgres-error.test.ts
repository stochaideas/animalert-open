import { describe, it, expect } from "vitest";
import {
  handlePostgresError,
  PostgresErrorCode,
  type PostgresError,
} from "~/server/db/postgres-error";
import { TRPCError } from "@trpc/server";

describe("PostgreSQL Error Handling", () => {
  const baseError: PostgresError = {
    name: "PostgresError",
    severity_local: "ERROR",
    severity: "ERROR",
    code: PostgresErrorCode.UniqueViolation,
    position: "0",
    file: "nbtinsert.c",
    line: "664",
    routine: "_bt_check_unique",
  };

  describe("handlePostgresError", () => {
    it("should handle unique violation for phone number", () => {
      const error: PostgresError = {
        ...baseError,
        code: PostgresErrorCode.UniqueViolation,
        constraint_name: "users_phone_unique",
      };

      expect(() => handlePostgresError(error)).toThrow(TRPCError);

      try {
        handlePostgresError(error);
      } catch (e) {
        expect(e).toBeInstanceOf(TRPCError);
        expect((e as TRPCError).code).toBe("CONFLICT");
        expect((e as TRPCError).message).toBe(
          "Acest număr de telefon este deja înregistrat",
        );
      }
    });

    it("should handle unique violation for email", () => {
      const error: PostgresError = {
        ...baseError,
        code: PostgresErrorCode.UniqueViolation,
        constraint_name: "users_email_unique",
      };

      try {
        handlePostgresError(error);
      } catch (e) {
        expect(e).toBeInstanceOf(TRPCError);
        expect((e as TRPCError).code).toBe("CONFLICT");
        expect((e as TRPCError).message).toBe(
          "Această adresă de email este deja înregistrată",
        );
      }
    });

    it("should handle unique violation with unknown constraint", () => {
      const error: PostgresError = {
        ...baseError,
        code: PostgresErrorCode.UniqueViolation,
        constraint_name: "unknown_constraint",
      };

      try {
        handlePostgresError(error);
      } catch (e) {
        expect(e).toBeInstanceOf(TRPCError);
        expect((e as TRPCError).code).toBe("CONFLICT");
        expect((e as TRPCError).message).toBe(
          "Date duplicat detectate. Vă rugăm să verificați informațiile introduse",
        );
      }
    });

    it("should handle unique violation without constraint name", () => {
      const error: PostgresError = {
        ...baseError,
        code: PostgresErrorCode.UniqueViolation,
      };

      try {
        handlePostgresError(error);
      } catch (e) {
        expect(e).toBeInstanceOf(TRPCError);
        expect((e as TRPCError).code).toBe("CONFLICT");
        expect((e as TRPCError).message).toContain("Date duplicat detectate");
      }
    });

    it("should handle foreign key violation", () => {
      const error: PostgresError = {
        ...baseError,
        code: PostgresErrorCode.ForeignKeyViolation,
      };

      try {
        handlePostgresError(error);
      } catch (e) {
        expect(e).toBeInstanceOf(TRPCError);
        expect((e as TRPCError).code).toBe("BAD_REQUEST");
        expect((e as TRPCError).message).toBe(
          "Date invalide: referință inexistentă",
        );
      }
    });

    it("should handle not null violation", () => {
      const error: PostgresError = {
        ...baseError,
        code: PostgresErrorCode.NotNullViolation,
      };

      try {
        handlePostgresError(error);
      } catch (e) {
        expect(e).toBeInstanceOf(TRPCError);
        expect((e as TRPCError).code).toBe("BAD_REQUEST");
        expect((e as TRPCError).message).toBe(
          "Toate câmpurile obligatorii trebuie completate",
        );
      }
    });

    it("should handle unknown postgres error code", () => {
      const error: PostgresError = {
        ...baseError,
        code: "99999" as PostgresErrorCode,
      };

      try {
        handlePostgresError(error);
      } catch (e) {
        expect(e).toBeInstanceOf(TRPCError);
        expect((e as TRPCError).code).toBe("INTERNAL_SERVER_ERROR");
        expect((e as TRPCError).message).toBe("A apărut o eroare neașteptată");
      }
    });

    it("should handle non-postgres error", () => {
      const error = {
        name: "Error",
      } as unknown as PostgresError;

      try {
        handlePostgresError(error);
      } catch (e) {
        expect(e).toBeInstanceOf(TRPCError);
        expect((e as TRPCError).code).toBe("INTERNAL_SERVER_ERROR");
      }
    });

    it("should include all optional error fields", () => {
      const error: PostgresError = {
        ...baseError,
        code: PostgresErrorCode.UniqueViolation,
        constraint_name: "users_phone_unique",
        detail: "Key (phone)=(123) already exists",
        hint: "Try a different phone number",
        internal_position: "10",
        internal_query: "INSERT INTO users",
        where: "in function insert_user",
        schema_name: "public",
        table_name: "users",
        column_name: "phone",
        data: "123",
        type_name: "text",
      };

      try {
        handlePostgresError(error);
      } catch (e) {
        expect(e).toBeInstanceOf(TRPCError);
        // Error handler doesn't use these fields but they should be preserved
      }
    });
  });

  describe("PostgresErrorCode enum", () => {
    it("should have correct error codes", () => {
      expect(PostgresErrorCode.UniqueViolation).toBe("23505");
      expect(PostgresErrorCode.ForeignKeyViolation).toBe("23503");
      expect(PostgresErrorCode.NotNullViolation).toBe("23502");
    });
  });
});
