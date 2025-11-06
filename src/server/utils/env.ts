export function requireServerEnv(
  name: string,
  value: string | undefined,
): string {
  if (value && value.length > 0) {
    return value;
  }

  throw new Error(
    `${name} environment variable is not configured. Set it to enable this functionality.`,
  );
}
