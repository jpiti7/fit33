import { CoachChat } from "@/features/coach-chat";

export default function CoachChatPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
          Fit33 Intelligence
        </p>
        <h1 className="mt-2 text-3xl font-bold">Habla con tu Coach</h1>
        <p className="mt-2 mb-6 text-slate-400">
          Respuestas basadas en tus datos reales. Esta versión utiliza un motor
          de reglas local y no envía tu información a un proveedor de IA.
        </p>
        <CoachChat />
      </div>
    </main>
  );
}
