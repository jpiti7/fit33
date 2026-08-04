"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Apple,
  BarChart3,
  Bot,
  Dumbbell,
  House,
  TrendingUp,
  Trophy,
  Camera,
  CalendarDays,
  MessageCircle,
  UserRound,
  type LucideIcon,
} from "lucide-react";

type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  mobile?: boolean;
};

const navigationItems: NavigationItem[] = [
  { label: "Inicio", href: "/", icon: House, mobile: true },
  { label: "Entrenos", href: "/entrenos", icon: Dumbbell, mobile: true },
  { label: "Análisis", href: "/analiticas", icon: BarChart3 },
  { label: "Coach", href: "/coach/chat", icon: MessageCircle, mobile: true },
  { label: "Nutrición", href: "/nutricion", icon: Apple, mobile: true },
  { label: "Progreso", href: "/progreso", icon: TrendingUp },
  { label: "Plan", href: "/planificacion", icon: CalendarDays },
  { label: "Coach informe", href: "/coach", icon: Bot },
  { label: "Logros", href: "/logros", icon: Trophy },
  { label: "Fotos", href: "/progreso/fotos", icon: Camera },
  { label: "Perfil", href: "/perfil", icon: UserRound, mobile: true },
];

function isItemActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function BottomNavigation() {
  const pathname = usePathname();
  const workoutSessionSlugs = [
    "/entrenos/push",
    "/entrenos/pierna-a",
    "/entrenos/pull",
    "/entrenos/pierna-b-hombro",
  ];
  const isWorkoutSession = workoutSessionSlugs.includes(pathname);
  const mobileItems = navigationItems.filter((item) => item.mobile);

  return (
    <>
      {!isWorkoutSession && (
        <nav className="mobile-tab-bar fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-slate-950/90 px-2 backdrop-blur-xl md:hidden">
          <div className="mx-auto grid max-w-lg grid-cols-5">
            {mobileItems.map((item) => {
              const active = isItemActive(pathname, item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[11px] font-medium transition active:scale-95 ${
                    active ? "text-emerald-300" : "text-slate-500"
                  }`}
                >
                  {active && (
                    <span className="absolute top-1 h-1 w-8 rounded-full bg-emerald-400" />
                  )}
                  <Icon className={`h-5 w-5 ${active ? "stroke-[2.5]" : ""}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-slate-800 bg-slate-950 p-6 md:block">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-emerald-400">
            Fit33
          </p>
          <h2 className="mt-3 text-2xl font-bold text-white">Tu progreso</h2>
        </div>

        <nav className="mt-10 max-h-[calc(100vh-12rem)] space-y-2 overflow-y-auto pb-28">
          {navigationItems.map((item) => {
            const active = isItemActive(pathname, item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-emerald-400 text-slate-950"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
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
