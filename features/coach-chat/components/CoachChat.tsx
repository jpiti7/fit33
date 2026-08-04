"use client";

import { useState, useTransition, type FormEvent } from "react";
import { Bot, Send, UserRound } from "lucide-react";

import { askCoachAction } from "@/features/coach-chat/actions/coach-chat.actions";
import type { CoachChatMessage } from "@/features/coach-chat/types";

const initialMessage: CoachChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Soy el Coach Fit33. Puedo interpretar tus entrenamientos, nutrición, hidratación y progreso. ¿Qué necesitas hoy?",
  createdAt: "",
};

export function CoachChat() {
  const [messages, setMessages] = useState<CoachChatMessage[]>([
    initialMessage,
  ]);
  const [question, setQuestion] = useState("");
  const [suggestions, setSuggestions] = useState([
    "¿Qué entreno hoy?",
    "¿Qué debería comer?",
    "¿Cómo voy de agua?",
  ]);
  const [isPending, startTransition] = useTransition();

  function submit(event: FormEvent) {
    event.preventDefault();
    const content = question.trim();
    if (!content || isPending) return;

    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        role: "user",
        content,
        createdAt: new Date().toISOString(),
      },
    ]);
    setQuestion("");

    startTransition(async () => {
      const result = await askCoachAction(content);
      const answer = result.success ? result.response.answer : result.message;
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: answer,
          createdAt: new Date().toISOString(),
        },
      ]);
      if (result.success) setSuggestions(result.response.suggestions);
    });
  }

  return (
    <div className="flex min-h-[70vh] flex-col rounded-3xl border border-slate-800 bg-slate-900">
      <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
        {messages.map((message) => {
          const assistant = message.role === "assistant";
          return (
            <div
              key={message.id}
              className={`flex gap-3 ${assistant ? "" : "justify-end"}`}
            >
              {assistant && (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-slate-950">
                  <Bot className="h-5 w-5" />
                </span>
              )}
              <div
                className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-6 ${
                  assistant
                    ? "rounded-tl-md bg-slate-800 text-slate-100"
                    : "rounded-tr-md bg-emerald-400 text-slate-950"
                }`}
              >
                {message.content}
              </div>
              {!assistant && (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-300">
                  <UserRound className="h-5 w-5" />
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="border-t border-slate-800 p-4">
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setQuestion(suggestion)}
              className="shrink-0 rounded-full border border-slate-700 px-3 py-2 text-xs text-slate-300"
            >
              {suggestion}
            </button>
          ))}
        </div>
        <form onSubmit={submit} className="flex gap-2">
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            maxLength={500}
            placeholder="Pregunta al Coach Fit33…"
            className="min-h-12 flex-1 rounded-2xl border border-slate-700 bg-slate-950 px-4 text-white outline-none focus:border-emerald-400"
          />
          <button
            type="submit"
            disabled={isPending || !question.trim()}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950 disabled:opacity-40"
            aria-label="Enviar pregunta"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
