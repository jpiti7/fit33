# Fit33 v6.0.0 — Adaptive Engine

## Objetivo

Convertir Fit33 de un sistema que registra datos en un sistema que usa los datos para adaptar la sesión recomendada.

## Incluye

- Adaptive Engine con recuperación, adherencia y nutrición como señales.
- Progresión automática por ejercicio usando el último entrenamiento del mismo tipo.
- Recomendación de subir, mantener, bajar o establecer carga.
- Reducción de carga cuando la recuperación es baja.
- Página `/adaptativo` con resumen, sesión y carga propuesta por ejercicio.
- Acceso Adaptive en navegación.
- Acceso desde el Dashboard.
- Mantiene PWA, offline, Supabase, Coach, predicciones, retos, nutrición, lista de compra y registro de peso.
- Apple Health permanece preparado para una futura integración nativa.

## Criterios de progresión

- Rango alto + RIR >= 2: +2,5% aproximadamente.
- Por debajo del rango mínimo: -5% aproximadamente.
- Recuperación < 50: -10% aproximadamente.
- En el resto de casos: mantener y buscar repeticiones.

## Nota

Las recomendaciones son reglas de entrenamiento orientativas, no sustituyen la valoración profesional.
