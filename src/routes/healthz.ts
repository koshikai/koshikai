import { createFileRoute } from "@tanstack/react-router";

export async function handleHealthz() {
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
}

export const Route = createFileRoute("/healthz")({
  server: {
    handlers: {
      GET: handleHealthz,
    },
  },
});
