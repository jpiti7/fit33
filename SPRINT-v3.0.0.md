# Sprint v3.0.0 — Fit33 Intelligence

## Entregado

- Pantalla Hoy contextual.
- Coach conversacional basado en reglas y datos reales.
- Planificador semanal automático.
- Hidratación diaria.
- Objetivos y preferencias por usuario.
- Preferencias y prueba local de notificaciones.
- Migración con RLS para todos los datos nuevos.
- Tests del planificador y del Coach conversacional.
- Navegación adaptada a los nuevos módulos.

## Límites explícitos

- El chat usa reglas deterministas; no envía información a un modelo externo.
- Las notificaciones programadas con la app cerrada requieren un backend Web Push.
- Apple Health no puede integrarse directamente desde una PWA; requiere una app nativa o puente específico.
- No se realiza análisis corporal automático de fotografías.

## Migración

Ejecutar `database/migrations/006_v3_platform.sql`.
