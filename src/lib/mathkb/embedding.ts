import { pipeline, env } from "@xenova/transformers";

// Disable local models search to download from Hugging Face and cache locally
env.allowLocalModels = false;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let extractor: any = null;

async function getExtractor() {
  if (!extractor) {
    extractor = await pipeline("feature-extraction", "Xenova/multilingual-e5-small");
  }
  return extractor;
}

/**
 * Generates a 384-dimensional embedding vector for the given text.
 * @param text The input text to embed.
 * @param type The type of text: 'query' for search queries, 'passage' for note content to store.
 */
export async function getEmbedding(text: string, type: "query" | "passage" = "passage"): Promise<number[]> {
  const cleanText = text.trim();
  if (!cleanText) {
    return new Array(384).fill(0);
  }

  // Prepend prefix as recommended by multilingual-e5 models
  const prefix = type === "query" ? "query: " : "passage: ";
  const inputText = `${prefix}${cleanText}`;

  const extract = await getExtractor();
  const output = await extract(inputText, { pooling: "mean", normalize: true });
  
  return Array.from(output.data);
}
