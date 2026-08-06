import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const PolishInput = z.object({
  residentName: z.string(),
  interests: z.array(z.string()),
  items: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      fact: z.string(),
      signals: z.array(z.string()),
    }),
  ),
});

export type PolishedReason = { id: string; reason: string };

/**
 * Rewrites the deterministic "why this fits you" lines in the voice of the
 * Residences Office. The rules layer already chose the items; the model only
 * rephrases. Any failure falls back to the rule-written copy.
 */
export const polishRecommendations = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PolishInput.parse(input))
  .handler(async ({ data }): Promise<{ items: PolishedReason[]; error?: string }> => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { items: [], error: "AI is not configured." };
    if (data.items.length === 0) return { items: [] };

    const { generateText, Output } = await import("ai");
    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);

    const prompt = [
      `Resident: ${data.residentName}. Stated interests: ${data.interests.join(", ") || "none given"}.`,
      "For each item below, write one warm, understated sentence (max 22 words) explaining why it is being suggested to this resident.",
      "Voice: a five-star residences concierge — precise, never salesy, no exclamation marks, no emoji, British-inflected but plain.",
      "Ground every sentence in the given signals and fact. Never invent facts. Address the resident as 'you'.",
      "",
      ...data.items.map(
        (i) => `id: ${i.id}\ntitle: ${i.title}\nfact: ${i.fact}\nsignals: ${i.signals.join("; ")}`,
      ),
    ].join("\n");

    try {
      const { output } = await generateText({
        model: gateway("google/gemini-3.6-flash"),
        output: Output.object({
          schema: z.object({
            items: z.array(z.object({ id: z.string(), reason: z.string() })),
          }),
        }),
        prompt,
      });
      return { items: output.items };
    } catch (error) {
      console.error("polishRecommendations failed", error);
      return { items: [], error: "Personalised copy is unavailable just now." };
    }
  });
