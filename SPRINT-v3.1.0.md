# Sprint v3.1.0 — Menús y lista de la compra

## Objetivo

Convertir el registro nutricional en una herramienta de planificación semanal adaptada a objetivos, alergias y preferencias.

## Incluye

- Generador de menús de 4 o 5 comidas al día.
- Diferenciación entre entrenamiento y descanso.
- Comida libre opcional el sábado.
- Recetas con ingredientes, cantidades, macros y preparación.
- Exclusión automática de alergias y alimentos evitados.
- Lista de la compra agrupada por categorías.
- Suma automática de ingredientes repetidos.
- Marcado de productos comprados y altas manuales.
- Persistencia en Supabase y aislamiento mediante RLS.
- Tests del generador y la deduplicación de ingredientes.

## Migración

Ejecutar `database/migrations/007_meal_planner.sql`.

## Rutas

- `/nutricion/planificador`
- `/nutricion/lista-compra`
