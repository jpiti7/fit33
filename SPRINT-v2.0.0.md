# Fit33 v2.0.0 — Smart Progress Edition

## Objetivo

Agrupar en una sola versión el Coach semanal mejorado, el sistema de logros y las fotos privadas de progreso.

## Incluye

- Informe semanal ampliado del Coach.
- Nivel, puntos, progreso e insignias automáticas.
- Galería privada de fotos con Supabase Storage.
- Peso opcional y notas por fotografía.
- Nueva experiencia de Progreso.
- Nuevas rutas `/logros` y `/progreso/fotos`.
- Políticas RLS y Storage aisladas por usuario.
- Pruebas unitarias del motor de logros.

## Migración

Ejecutar `database/migrations/005_smart_progress.sql` antes de usar la galería.

## Validación

```bash
npm run format
npm run lint
npm run typecheck
npm run test:run
npm run build
```
