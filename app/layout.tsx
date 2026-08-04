import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { OfflineManager } from "@/components/offline/offline-manager";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  applicationName: "Fit33",
  title: {
    default: "Fit33",
    template: "%s · Fit33",
  },
  description:
    "Aplicación personal de entrenamiento, nutrición, progreso y Coach Fit33.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Fit33",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={cn("font-sans", geist.variable)}>
      <body className="bg-slate-950 antialiased">
        <ServiceWorkerRegister />
        <OfflineManager />
        <BottomNavigation />

        <div className="min-h-screen pb-24 md:pb-0 md:pl-64">{children}</div>
      </body>
    </html>
  );
}
