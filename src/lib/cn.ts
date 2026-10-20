/** Joins truthy class names. Keeps components free of a runtime dependency. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
