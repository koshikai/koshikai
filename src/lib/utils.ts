/**
 * Safely serializes an object to JSON for use in an HTML script tag.
 * It escapes the '<' character to prevent XSS attacks like </script><script>alert(1)</script>.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
