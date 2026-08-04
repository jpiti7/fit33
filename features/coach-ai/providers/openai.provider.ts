import type { CoachChatResponse } from "@/features/coach-chat/types";

type AiContext = {
  rulesAnswer: string;
  question: string;
  summary: string;
};

type ResponsesApiPayload = {
  output_text?: string;
  output?: Array<{
    content?: Array<{ type?: string; text?: string }>;
  }>;
};

function extractText(payload: ResponsesApiPayload) {
  if (payload.output_text?.trim()) return payload.output_text.trim();
  return (
    payload.output
      ?.flatMap((item) => item.content ?? [])
      .find((item) => item.type === "output_text")
      ?.text?.trim() ?? ""
  );
}

export async function answerWithOpenAI(
  context: AiContext,
): Promise<CoachChatResponse | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL ?? "gpt-5-mini";
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "developer",
          content:
            "Eres el Coach Fit33. Responde en español, con prudencia, de forma breve y accionable. No diagnostiques enfermedades ni sustituyas atención médica. Basa la respuesta solo en el contexto proporcionado y explica el motivo principal de la recomendación.",
        },
        {
          role: "user",
          content: `Contexto Fit33:\n${context.summary}\n\nRespuesta del motor local:\n${context.rulesAnswer}\n\nPregunta:\n${context.question}`,
        },
      ],
      max_output_tokens: 450,
    }),
    cache: "no-store",
  });

  if (!response.ok) return null;
  const text = extractText((await response.json()) as ResponsesApiPayload);
  if (!text) return null;

  return {
    answer: text,
    suggestions: [
      "¿Qué entreno hoy?",
      "¿Cómo adapto la semana?",
      "¿Qué debería comer?",
    ],
    source: "ai",
  };
}
