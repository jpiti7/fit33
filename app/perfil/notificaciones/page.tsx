import { NotificationSettings } from "@/features/notifications";
import { getNotificationPreferencesAction } from "@/features/settings";

export default async function NotificationPage() {
  const preferences = await getNotificationPreferencesAction();

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
          Configuración
        </p>
        <h1 className="mt-2 text-3xl font-bold">Notificaciones</h1>
        <p className="mt-2 mb-8 text-slate-400">
          Controla qué recordatorios quieres recibir en el dispositivo.
        </p>
        <NotificationSettings initialPreferences={preferences} />
      </div>
    </main>
  );
}
