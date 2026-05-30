import type { Request, Response } from "express";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import { getMathKbPool, hasMathKbDatabaseConfig, logPoolStats } from "../lib/mathkb/db";
import { getNoteBySlug, listFields, listTags, searchNotes, createNote, updateNote, semanticSearchNotes, deleteNote } from "../lib/mathkb/repository";
import type { MathKbSearchFilters } from "../lib/mathkb/types";

const noteTagSchema = z.object({
  name: z.string(),
  slug: z.string(),
});

const catalogTagSchema = noteTagSchema.extend({
  noteCount: z.number().int().nonnegative(),
});

const noteSummarySchema = z.object({
  slug: z.string(),
  title: z.string(),
  field: z.string(),
  summary: z.string(),
  updatedAt: z.string(),
  tags: z.array(noteTagSchema),
});

const noteDetailSchema = noteSummarySchema.extend({
  bodyMarkdown: z.string(),
  bodyPlain: z.string(),
  createdAt: z.string(),
  isPublic: z.boolean(),
});

const fieldSchema = z.object({
  name: z.string(),
  noteCount: z.number().int().nonnegative(),
});

interface LogEntry {
  level: "info" | "warn" | "error";
  message: string;
  timestamp: string;
  error?: string;
}

function logStructured(
  level: "info" | "warn" | "error",
  message: string,
  error?: unknown,
) {
  const entry: LogEntry = {
    level,
    message: `[mathkb-mcp] ${message}`,
    timestamp: new Date().toISOString(),
  };

  if (error instanceof Error) {
    entry.error = error.message;
  } else if (error !== undefined) {
    entry.error = String(error);
  }

  console.error(JSON.stringify(entry));
}

function log(message: string, error?: unknown) {
  logStructured("error", message, error);
}

function formatError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error";
}

function createToolError(message: string) {
  return {
    isError: true,
    content: [{ type: "text" as const, text: message }],
  };
}

function toSearchText(result: Awaited<ReturnType<typeof searchNotes>>) {
  if (result.notes.length === 0) {
    return "No notes matched the given filters.";
  }

  return result.notes
    .map((note, index) => {
      const tags = note.tags.map((tag) => `#${tag.name}`).join(", ");
      const metadata = [note.field, tags].filter(Boolean).join(" | ");
      return `${index + 1}. ${note.title} (${note.slug})${metadata ? ` - ${metadata}` : ""}`;
    })
    .join("\n");
}

function toNoteText(note: NonNullable<Awaited<ReturnType<typeof getNoteBySlug>>>) {
  const tags = note.tags.map((tag) => `#${tag.name}`).join(", ");

  return [
    `${note.title} (${note.slug})`,
    `Field: ${note.field}`,
    tags ? `Tags: ${tags}` : "",
    "",
    note.summary,
    "",
    note.bodyMarkdown,
  ]
    .filter(Boolean)
    .join("\n");
}

function buildFilters(input: {
  field?: string;
  limit?: number;
  page?: number;
  query?: string;
  tag?: string;
}): MathKbSearchFilters {
  return {
    query: input.query?.trim() ?? "",
    field: input.field?.trim() ?? "",
    tag: input.tag?.trim() ?? "",
    limit: input.limit ?? 10,
    page: Math.max(1, Math.floor(input.page ?? 1)),
  };
}

function createMathKbServer() {
  const server = new McpServer(
    {
      name: "private-mathkb",
      version: "1.0.0",
    },
    {
      capabilities: {
        logging: {},
      },
    },
  );

  server.registerTool(
    "search_notes",
    {
      title: "Search notes",
      description:
        "Search math notes by query string, field, and tag. This tool is read-only.",
      inputSchema: z.object({
        query: z.string().trim().optional(),
        field: z.string().trim().optional(),
        tag: z.string().trim().optional(),
        limit: z.number().int().min(1).max(50).optional(),
      }),
      outputSchema: z.object({
        count: z.number().int().nonnegative(),
        notes: z.array(noteSummarySchema),
      }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
      },
    },
    async (input) => {
      try {
        const result = await searchNotes(buildFilters(input));
        return {
          content: [{ type: "text" as const, text: toSearchText(result) }],
          structuredContent: {
            count: result.totalFilteredNotes,
            notes: result.notes,
          },
        };
      } catch (error) {
        return createToolError(`search_notes failed: ${formatError(error)}`);
      }
    },
  );

  server.registerTool(
    "get_note",
    {
      title: "Get note",
      description: "Fetch a single math note by slug. This tool is read-only.",
      inputSchema: z.object({
        slug: z.string().trim().min(1),
      }),
      outputSchema: z.object({
        found: z.boolean(),
        note: noteDetailSchema.nullable(),
      }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
      },
    },
    async ({ slug }) => {
      try {
        const note = await getNoteBySlug(slug);

        if (!note) {
          return {
            content: [{ type: "text" as const, text: `No note found for slug '${slug}'.` }],
            structuredContent: {
              found: false,
              note: null,
            },
          };
        }

        return {
          content: [{ type: "text" as const, text: toNoteText(note) }],
          structuredContent: {
            found: true,
            note,
          },
        };
      } catch (error) {
        return createToolError(`get_note failed: ${formatError(error)}`);
      }
    },
  );

  server.registerTool(
    "list_fields",
    {
      title: "List fields",
      description: "List all available math fields in the knowledge base.",
      outputSchema: z.object({
        fields: z.array(fieldSchema),
      }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
      },
    },
    async () => {
      try {
        const fields = await listFields();
        const lines =
          fields.length === 0
            ? "No fields are registered yet."
            : fields
                .map((field) => `${field.name} (${field.noteCount})`)
                .join("\n");

        return {
          content: [{ type: "text" as const, text: lines }],
          structuredContent: { fields },
        };
      } catch (error) {
        return createToolError(`list_fields failed: ${formatError(error)}`);
      }
    },
  );

  server.registerTool(
    "list_tags",
    {
      title: "List tags",
      description: "List all available tags in the knowledge base.",
      outputSchema: z.object({
        tags: z.array(catalogTagSchema),
      }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
      },
    },
    async () => {
      try {
        const tags = await listTags();
        const lines =
          tags.length === 0
            ? "No tags are registered yet."
            : tags.map((tag) => `#${tag.name} (${tag.noteCount ?? 0})`).join("\n");

        return {
          content: [{ type: "text" as const, text: lines }],
          structuredContent: { tags },
        };
      } catch (error) {
        return createToolError(`list_tags failed: ${formatError(error)}`);
      }
    },
  );

  server.registerTool(
    "create_note",
    {
      title: "Create a note",
      description: "Create a new math note in the database. Tags and slug generation are handled automatically.",
      inputSchema: z.object({
        title: z.string().trim().min(1),
        field: z.string().trim().min(1),
        summary: z.string().trim().optional(),
        bodyMarkdown: z.string().trim().min(1),
        isPublic: z.boolean().optional(),
        tags: z.array(z.string().trim()).optional(),
      }),
      outputSchema: z.object({
        success: z.boolean(),
        slug: z.string(),
      }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
      },
    },
    async (input) => {
      try {
        const result = await createNote(input);
        return {
          content: [
            {
              type: "text" as const,
              text: `Note created successfully with slug: ${result.slug}`,
            },
          ],
          structuredContent: result,
        };
      } catch (error) {
        return createToolError(`create_note failed: ${formatError(error)}`);
      }
    },
  );

  server.registerTool(
    "update_note",
    {
      title: "Update a note",
      description: "Update an existing math note specified by slug in the database. Tags can be replaced if specified.",
      inputSchema: z.object({
        slug: z.string().trim().min(1),
        title: z.string().trim().optional(),
        field: z.string().trim().optional(),
        summary: z.string().trim().optional(),
        bodyMarkdown: z.string().trim().optional(),
        isPublic: z.boolean().optional(),
        tags: z.array(z.string().trim()).optional(),
      }),
      outputSchema: z.object({
        success: z.boolean(),
      }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
      },
    },
    async ({ slug, ...updates }) => {
      try {
        const result = await updateNote(slug, updates);
        return {
          content: [
            {
              type: "text" as const,
              text: `Note with slug '${slug}' updated successfully.`,
            },
          ],
          structuredContent: result,
        };
      } catch (error) {
        return createToolError(`update_note failed: ${formatError(error)}`);
      }
    },
  );

  server.registerTool(
    "semantic_search_notes",
    {
      title: "Semantic search notes",
      description:
        "Search math notes by conceptual meaning using vector embeddings. Ideal for finding related math topics even if keywords differ. This tool is read-only.",
      inputSchema: z.object({
        query: z.string().trim().min(1),
        limit: z.number().int().min(1).max(50).optional(),
      }),
      outputSchema: z.object({
        count: z.number().int().nonnegative(),
        notes: z.array(noteSummarySchema),
      }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
      },
    },
    async ({ query, limit }) => {
      try {
        const notes = await semanticSearchNotes(query, limit ?? 5);
        return {
          content: [
            {
              type: "text" as const,
              text: toSearchText({ notes, totalFilteredNotes: notes.length }),
            },
          ],
          structuredContent: {
            count: notes.length,
            notes,
          },
        };
      } catch (error) {
        return createToolError(`semantic_search_notes failed: ${formatError(error)}`);
      }
    },
  );

  server.registerTool(
    "delete_note",
    {
      title: "Delete a note",
      description: "Delete an existing math note specified by slug from the database.",
      inputSchema: z.object({
        slug: z.string().trim().min(1),
      }),
      outputSchema: z.object({
        success: z.boolean(),
      }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
      },
    },
    async ({ slug }) => {
      try {
        const result = await deleteNote(slug);
        return {
          content: [
            {
              type: "text" as const,
              text: `Note with slug '${slug}' deleted successfully.`,
            },
          ],
          structuredContent: result,
        };
      } catch (error) {
        return createToolError(`delete_note failed: ${formatError(error)}`);
      }
    },
  );

  return server;
}

async function startStdioServer() {
  const server = createMathKbServer();
  const transport = new StdioServerTransport();

  await server.connect(transport);
  logStructured("info", "stdio transport ready");
}

// Simple in-memory rate limiter: 60 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  if (entry.count >= 60) {
    return false;
  }

  entry.count++;
  return true;
}

async function startHttpServer() {
  const host = process.env.MCP_BIND_HOST ?? "0.0.0.0";
  const port = Number(process.env.MCP_PORT ?? "3004");
  const path = process.env.MCP_PATH ?? "/mcp";
  const allowedHosts = process.env.MCP_ALLOWED_HOSTS?.split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const app = createMcpExpressApp({
    host,
    ...(allowedHosts && allowedHosts.length > 0 ? { allowedHosts } : {}),
  });

  app.use((req: Request, res: Response, next) => {
    const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";
    if (!checkRateLimit(ip)) {
      res.status(429).json({
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "Rate limit exceeded. Try again later.",
        },
        id: null,
      });
      return;
    }
    next();
  });

  app.get("/healthz", async (_req: Request, res: Response) => {
    try {
      if (hasMathKbDatabaseConfig()) {
        await getMathKbPool().query("SELECT 1");
        logPoolStats();
      }
      res.json({ ok: true });
    } catch (error) {
      log("healthz check failed", error);
      res.status(503).json({
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  app.post(path, async (req: Request, res: Response) => {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    res.on("close", () => {
      void transport.close();
    });

    try {
      const mathKbServer = createMathKbServer();
      await mathKbServer.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      log("failed to handle MCP request", error);

      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: "2.0",
          error: {
            code: -32603,
            message: "Internal server error",
          },
          id: null,
        });
      }

      // Ensure transport is closed on error even if response hasn't closed yet
      await transport.close().catch(() => {});
    }
  });

  app.get(path, (_req: Request, res: Response) => {
    res.status(405).set("Allow", "POST").send("Method Not Allowed");
  });

  app.delete(path, (_req: Request, res: Response) => {
    res.status(405).set("Allow", "POST").send("Method Not Allowed");
  });

  await new Promise<void>((resolve, reject) => {
    const server = app.listen(port, host, () => {
      logStructured("info", `HTTP transport ready at http://${host}:${port}${path}`);
      resolve();
    });

    server.once("error", reject);
  });
}

async function main() {
  const mode = process.argv[2] ?? process.env.MCP_TRANSPORT ?? "http";

  if (mode === "stdio") {
    await startStdioServer();
    return;
  }

  await startHttpServer();
}

main().catch((error) => {
  log("fatal error", error);
  process.exit(1);
});
