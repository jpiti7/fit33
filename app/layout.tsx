import type { Metadata } from "next";
import "./globals.css";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Fit33",
  description: "Aplicación personal de entrenamiento y nutrición",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={cn("font-sans", geist.variable)}>
      <body className="bg-slate-950 antialiased">
        <BottomNavigation />

        <div className="min-h-screen pb-24 md:pb-0 md:pl-64">{children}</div>
      </body>
    </html>
  );
}
