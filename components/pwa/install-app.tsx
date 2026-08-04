"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Download,
  ExternalLink,
  Share2,
  Smartphone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function isStandaloneMode() {
  if (typeof window === "undefined") {
    return false;
  }

  const navigatorWithStandalone = window.navigator as Navigator & {
    standalone?: boolean;
  };

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    navigatorWithStandalone.standalone === true
  );
}

type InstallationEnvironment = {
  isStandalone: boolean;
  isIos: boolean;
  isSafari: boolean;
};

function detectInstallationEnvironment(): InstallationEnvironment {
  if (typeof window === "undefined") {
    return {
      isStandalone: false,
      isIos: false,
      isSafari: false,
    };
  }

  const userAgent = window.navigator.userAgent;

  const isIosDevice =
    /iPad|iPhone|iPod/i.test(userAgent) ||
    (window.navigator.platform === "MacIntel" &&
      window.navigator.maxTouchPoints > 1);

  const isSafariBrowser =
    /Safari/i.test(userAgent) && !/CriOS|FxiOS|EdgiOS|OPiOS/i.test(userAgent);

  return {
    isStandalone: isStandaloneMode(),
    isIos: isIosDevice,
    isSafari: isSafariBrowser,
  };
}

export function InstallApp() {
  const [environment, setEnvironment] = useState<InstallationEnvironment>({
    isStandalone: false,
    isIos: false,
    isSafari: false,
  });

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    function updateEnvironment() {
      setEnvironment(detectInstallationEnvironment());
      setIsReady(true);
    }

    const animationFrame = window.requestAnimationFrame(updateEnvironment);

    const displayModeQuery = window.matchMedia("(display-mode: standalone)");

    displayModeQuery.addEventListener("change", updateEnvironment);

    window.addEventListener("appinstalled", updateEnvironment);

    return () => {
      window.cancelAnimationFrame(animationFrame);

      displayModeQuery.removeEventListener("change", updateEnvironment);

      window.removeEventListener("appinstalled", updateEnvironment);
    };
  }, []);

  if (!isReady) {
    return (
      <Card className="border-slate-800 bg-slate-900 text-white">
        <CardContent className="flex min-h-48 items-center justify-center p-6">
          <p className="text-sm text-slate-400">Comprobando el dispositivo…</p>
        </CardContent>
      </Card>
    );
  }

  if (environment.isStandalone) {
    return (
      <Card className="border-emerald-400/30 bg-emerald-400/10 text-white">
        <CardHeader>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
            <CheckCircle2 className="h-6 w-6" />
          </div>

          <CardTitle className="mt-4 text-2xl">
            Fit33 ya está instalada
          </CardTitle>

          <CardDescription className="text-slate-300">
            Estás utilizando Fit33 como una aplicación desde la pantalla de
            inicio.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-xl border border-emerald-400/20 bg-slate-950/50 p-4 text-sm text-slate-300">
            Las nuevas versiones estarán disponibles automáticamente cuando
            vuelvas a abrir la aplicación.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-slate-800 bg-slate-900 text-white">
        <CardHeader>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400 bg-slate-950 text-xl font-black text-emerald-400">
            F33
          </div>

          <CardTitle className="mt-4 text-3xl">Instalar Fit33</CardTitle>

          <CardDescription className="text-slate-400">
            Añade Fit33 a la pantalla de inicio para abrirla como una aplicación
            en tu iPhone.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex gap-4 rounded-xl border border-slate-800 bg-slate-950 p-4">
            <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />

            <div>
              <p className="font-semibold">Experiencia de aplicación</p>

              <p className="mt-1 text-sm text-slate-400">
                Fit33 se abrirá a pantalla completa, sin la barra habitual de
                Safari.
              </p>
            </div>
          </div>

          <div className="flex gap-4 rounded-xl border border-slate-800 bg-slate-950 p-4">
            <Download className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />

            <div>
              <p className="font-semibold">Actualizaciones automáticas</p>

              <p className="mt-1 text-sm text-slate-400">
                No tendrás que descargar nuevas versiones desde la App Store.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {environment.isIos && environment.isSafari ? (
        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardHeader>
            <CardTitle>Cómo instalarla en Safari</CardTitle>

            <CardDescription className="text-slate-400">
              Sigue estos pasos desde tu iPhone.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ol className="space-y-4">
              <li className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400 font-bold text-slate-950">
                  1
                </span>

                <div>
                  <p className="font-semibold">Pulsa el botón Compartir</p>

                  <p className="mt-1 text-sm text-slate-400">
                    Está situado en la barra inferior de Safari.
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400 font-bold text-slate-950">
                  2
                </span>

                <div>
                  <p className="font-semibold">
                    Selecciona “Añadir a pantalla de inicio”
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Puede que tengas que desplazarte por el menú.
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400 font-bold text-slate-950">
                  3
                </span>

                <div>
                  <p className="font-semibold">Confirma el nombre Fit33</p>

                  <p className="mt-1 text-sm text-slate-400">
                    Pulsa Añadir para crear el icono F33.
                  </p>
                </div>
              </li>
            </ol>

            <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">
              <Share2 className="h-5 w-5 shrink-0" />
              Empieza pulsando el icono de compartir de Safari.
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-amber-400/30 bg-amber-400/10 text-white">
          <CardHeader>
            <CardTitle className="text-xl">
              Abre esta página con Safari
            </CardTitle>

            <CardDescription className="text-amber-100/80">
              La instalación en iPhone debe realizarse desde Safari, no desde
              Chrome u otro navegador.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button
              type="button"
              variant="outline"
              className="w-full border-amber-300/40 bg-transparent text-amber-100"
              onClick={() => {
                window.location.href = window.location.href;
              }}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Continuar en Safari
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
