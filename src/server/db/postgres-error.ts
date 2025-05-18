// ~/server/database/postgres-errors.ts
import { TRPCError } from "@trpc/server";

export enum PostgresErrorCode {
  UniqueViolation = "23505",
  ForeignKeyViolation = "23503",
  NotNullViolation = "23502",
}

export interface PostgresError {
  name: "PostgresError";
  severity_local: string;
  severity: string;
  code: PostgresErrorCode;
  position: string;
  file: string;
  line: string;
  routine: string;

  detail?: string | undefined;
  hint?: string | undefined;
  internal_position?: string | undefined;
  internal_query?: string | undefined;
  where?: string | undefined;
  schema_name?: string | undefined;
  table_name?: string | undefined;
  column_name?: string | undefined;
  data?: string | undefined;
  type_name?: string | undefined;
  constraint_name?: string | undefined;
}

export function handlePostgresError(error: PostgresError): never {
  if (error.name === "PostgresError") {
    switch (error.code) {
      case PostgresErrorCode.UniqueViolation:
        return handleUniqueViolation(error);
      case PostgresErrorCode.ForeignKeyViolation:
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Date invalide: referință inexistentă",
        });
      case PostgresErrorCode.NotNullViolation:
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Toate câmpurile obligatorii trebuie completate",
        });
    }
  }

  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "A apărut o eroare neașteptată",
  });
}

function handleUniqueViolation(error: PostgresError): never {
  const constraintMap: Record<string, string> = {
    users_phone_unique: "Acest număr de telefon este deja înregistrat",
    users_email_unique: "Această adresă de email este deja înregistrată",
    // Add other unique constraints here
  };

  const message =
    constraintMap[error.constraint_name ?? ""] ??
    "Date duplicat detectate. Vă rugăm să verificați informațiile introduse";

  throw new TRPCError({
    code: "CONFLICT",
    message,
  });
}
