# Sprint v0.9.2 — Dashboard PRO

## Objetivo

Convertir la página de inicio en el centro de control de Fit33, combinando el seguimiento corporal existente con métricas de entrenamiento procedentes del Analytics Engine.

## Funcionalidades

- Resumen de entrenamientos, volumen, duración y series de la semana actual.
- Comparación de sesiones, volumen y duración con la semana anterior.
- Duración media por sesión.
- Identificación del grupo muscular con mayor volumen acumulado.
- Visualización de las tres referencias de rendimiento más recientes.
- Primer motor de recomendaciones deterministas del Coach Fit33.
- Accesos directos a Entrenamientos, Registro de peso y Analíticas.
- Degradación segura: si las métricas no cargan, el seguimiento corporal continúa disponible.

## Arquitectura

```text
features/dashboard/
├── actions/
│   └── dashboard.actions.ts
├── components/
│   ├── CoachCard.tsx
│   ├── DashboardTrainingOverview.tsx
│   ├── PRCard.tsx
│   └── SummaryCard.tsx
├── services/
│   └── dashboard.service.ts
├── index.ts
└── types.ts
```

El módulo reutiliza `features/analytics` como fuente de datos y transforma su salida en un modelo específico para el dashboard.

## Reglas iniciales del Coach

- Detectar una semana sin sesiones.
- Indicar el progreso hacia el objetivo de cuatro entrenamientos semanales.
- Destacar aumentos de volumen iguales o superiores al 10 %.
- Alertar sobre descensos de volumen iguales o superiores al 15 %.
- Mostrar el grupo muscular con mayor trabajo acumulado.
- Destacar la referencia de rendimiento más reciente.

## Base de datos

No requiere migraciones. Los datos se obtienen de `workouts`, `exercises` y `sets` respetando las políticas RLS existentes.

## Criterios de aceptación

- El inicio muestra las métricas de entrenamiento del usuario autenticado.
- Los valores coinciden con `/analiticas`.
- El dashboard funciona con cero, una o múltiples sesiones.
- Una cuenta no puede visualizar datos de otra.
- Si falla Analytics, el módulo corporal sigue cargando.
- `lint`, `typecheck`, `format:check` y `build` terminan correctamente.
