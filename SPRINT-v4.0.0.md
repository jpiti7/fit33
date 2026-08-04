# Sprint v4.0.0 — Adaptive Intelligence

## Objetivo

Convertir Fit33 en una plataforma capaz de adaptar la semana según la recuperación diaria y activar opcionalmente un Coach IA sin perder el motor local.

## Implementado

- Nuevo check-in diario de recuperación.
- Puntuación basada en sueño, energía, estrés y dolor muscular.
- Plan semanal adaptativo:
  - reduce una sesión con recuperación muy baja;
  - propone volumen reducido con recuperación media-baja;
  - mantiene el plan estándar cuando la recuperación es suficiente.
- Coach híbrido:
  - motor local siempre disponible;
  - proveedor OpenAI opcional mediante variables de entorno;
  - fallback automático si la API no está configurada o falla.
- Recuperación integrada en la pantalla Hoy, Planificación y Perfil.
- Nueva identidad visual con colores invertidos en todos los iconos.
- Nueva migración RLS para `recovery_checkins`.
- Tests unitarios del motor de recuperación.

## Variables opcionales

```env
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5-mini
```

Sin estas variables, el Coach continúa funcionando mediante reglas privadas.

## Migración

Ejecutar `database/migrations/008_v4_intelligence.sql` en Supabase.

## Validación

```bash
npm install
npm run format
npm run lint
npm run typecheck
npm run test:run
npm run build
```
