export type Output = "csv" | "json" | "xlsx" | "txt";

export function getOutType(output: Output): "text" | "json" {
  switch (output) {
    case "xlsx":
      return "json";

    case "json":
      return "json";

    case "csv":
      return "text";

    default:
      return "text";
  }
}
