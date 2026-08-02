# Fit33 v0.8.1 — Guardado completo de entrenamientos

## Incluye

- Conexión de `WorkoutForm` con la Server Action.
- Guardado de `workouts`, `exercises` y `sets`.
- Reversión del entrenamiento padre si falla un ejercicio o una serie.
- Resumen final de duración, ejercicios, series y volumen.
- Página `/entrenos/historial`.
- Acceso al historial desde `/entrenos`.

## Base de datos

No requiere una migración nueva si ya se ejecutaron:

- `database/migrations/001_user_security.sql`
- `database/migrations/002_workout_module.sql`

## Pruebas

1. Inicia sesión.
2. Abre `/entrenos/push`.
3. Completa al menos una serie con kg, repeticiones y RIR.
4. Marca esa serie como hecha.
5. Pulsa `Finalizar entrenamiento`.
6. Comprueba el resumen.
7. Abre `/entrenos/historial`.
8. Comprueba en Supabase las tablas `workouts`, `exercises` y `sets`.

## Comandos de comprobación

```powershell
npm install
npm run format
npm run lint
npm run typecheck
npm run build
```

## Commit recomendado

```powershell
git add .
git commit -m "v0.8.1 guarda entrenamientos completos"
git push origin main
git tag v0.8.1
git push origin v0.8.1
```
