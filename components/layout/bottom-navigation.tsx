"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  {
    label: "Inicio",
    href: "/",
    icon: "⌂",
  },
  {
    label: "Entrenos",
    href: "/entrenos",
    icon: "🏋",
  },
  {
    label: "Análisis",
    href: "/analiticas",
    icon: "▥",
  },
  {
    label: "Nutrición",
    href: "/nutricion",
    icon: "◉",
  },
  {
    label: "Progreso",
    href: "/progreso",
    icon: "↗",
  },
  {
    label: "Perfil",
    href: "/perfil",
    icon: "●",
  },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Navegación inferior para móvil */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-800 bg-slate-950/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-around">
          {navigationItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-w-0 flex-1 flex-col items-center gap-1 px-1 py-3 text-xs transition ${
                  isActive
                    ? "text-emerald-400"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <span className="text-xl leading-none">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Navegación lateral para ordenador */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-slate-800 bg-slate-950 p-6 md:block">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-emerald-400">
            Fit33
          </p>

          <h2 className="mt-3 text-2xl font-bold text-white">Tu progreso</h2>
        </div>

        <nav className="mt-10 space-y-2">
          {navigationItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-emerald-400 text-slate-950"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-xs text-slate-500">Objetivo actual</p>
          <p className="mt-1 font-bold text-white">82 kg → 75 kg</p>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-[8%] rounded-full bg-emerald-400" />
          </div>
        </div>
      </aside>
    </>
  );
}
