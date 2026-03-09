/**
 * Converts API keys to human-readable labels.
 * Supports snake_case and camelCase.
 *
 * Examples:
 *  - "total_fat" => "Total Fat"
 *  - "servingSize" => "Serving Size"
 */
export function formatLabel(key: string) {
  // 1. Replace underscores with spaces
  let label = key.replace(/_/g, " ");

  // 2. Insert space before capital letters (camelCase)
  label = label.replace(/([a-z0-9])([A-Z])/g, "$1 $2");

  // 3. Capitalize first letter of each word
  label = label.replace(/\b\w/g, (c) => c.toUpperCase());

  return label;
}
