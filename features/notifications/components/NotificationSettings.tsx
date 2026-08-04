"use client";

import { useState, useTransition } from "react";
import { Bell, BellRing } from "lucide-react";

import { saveNotificationPreferencesAction } from "@/features/settings";
import type { NotificationPreferences } from "@/features/settings";

const reminderOptions: Array<{
  key:
    | "workoutReminders"
    | "weightReminders"
    | "nutritionReminders"
    | "coachSummary";
  label: string;
}> = [
  { key: "workoutReminders", label: "Entrenamientos" },
  { key: "weightReminders", label: "Registro de peso" },
  { key: "nutritionReminders", label: "Nutrición" },
  { key: "coachSummary", label: "Resumen del Coach" },
];

export function NotificationSettings({
  initialPreferences,
}: {
  initialPreferences: NotificationPreferences;
}) {
  const [preferences, setPreferences] = useState(initialPreferences);
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification === "undefined" ? "default" : Notification.permission,
  );
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  async function requestPermission() {
    if (!("Notification" in window)) {
      setMessage("Este navegador no admite notificaciones web.");
      return;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === "granted") {
      new Notification("Fit33", {
        body: "Las notificaciones están activadas.",
      });
    }
  }

  function save() {
    startTransition(async () => {
      const result = await saveNotificationPreferencesAction(preferences);
      setMessage(result.success ? "Preferencias guardadas." : result.message);
    });
  }

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex items-center gap-3">
          <BellRing className="h-6 w-6 text-emerald-300" />
          <div>
            <h2 className="font-bold">Permiso del dispositivo</h2>
            <p className="text-sm text-slate-400">Estado: {permission}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={requestPermission}
          className="mt-5 min-h-12 w-full rounded-2xl bg-emerald-400 font-bold text-slate-950"
        >
          Activar y probar
        </button>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="flex items-center gap-2 font-bold">
          <Bell className="h-5 w-5" /> Preferencias
        </h2>
        <div className="mt-4 space-y-3">
          {reminderOptions.map(({ key, label }) => (
            <label
              key={key}
              className="flex items-center justify-between rounded-2xl bg-slate-950 p-4"
            >
              <span>{label}</span>
              <input
                type="checkbox"
                checked={preferences[key]}
                onChange={(event) =>
                  setPreferences((current) => ({
                    ...current,
                    [key]: event.target.checked,
                  }))
                }
                className="h-5 w-5 accent-emerald-400"
              />
            </label>
          ))}
          <label className="block text-sm text-slate-300">
            Hora preferida
            <input
              type="time"
              value={preferences.reminderTime}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  reminderTime: event.target.value,
                }))
              }
              className="mt-2 min-h-12 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4"
            />
          </label>
        </div>
        <button
          type="button"
          disabled={isPending}
          onClick={save}
          className="mt-5 min-h-12 w-full rounded-2xl bg-emerald-400 font-bold text-slate-950 disabled:opacity-50"
        >
          Guardar preferencias
        </button>
        {message && <p className="mt-3 text-sm text-slate-300">{message}</p>}
      </section>

      <p className="text-xs leading-5 text-slate-500">
        Esta versión configura permisos y preferencias locales. Los avisos
        programados cuando la app está cerrada requerirán activar un proveedor
        de Web Push en una versión posterior.
      </p>
    </div>
  );
}
