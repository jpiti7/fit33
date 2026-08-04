import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fit33",
    short_name: "Fit33",
    description:
      "Entrenamiento, nutrición, progreso corporal y Coach Fit33 en una sola aplicación.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#34d399",
    theme_color: "#020617",
    orientation: "portrait-primary",
    categories: ["fitness", "health", "lifestyle"],
    lang: "es-ES",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
