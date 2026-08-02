# Sprint v0.9.1 — Analytics Engine

## Objetivo

Crear el primer motor analítico de Fit33 a partir de los entrenamientos ya guardados.

## Incluye

- Resumen de la semana actual y comparación con la anterior.
- Volumen, sesiones, series y duración.
- Resumen mensual.
- Distribución por grupo muscular.
- Referencias de rendimiento por ejercicio.
- Estimación de 1RM mediante la fórmula de Epley.
- Nueva ruta `/analiticas`.
- Acceso desde Entrenamientos y desde la navegación principal.

## Arquitectura

```text
features/analytics/
├── actions/
├── components/
├── repositories/
├── services/
├── types.ts
└── index.ts
```

## Seguridad

Las consultas utilizan el cliente SSR autenticado. Las políticas RLS existentes continúan limitando los entrenamientos al usuario propietario.

## Criterios de aceptación

- La página de analítica carga sin entrenamientos.
- Los totales coinciden con el historial.
- La semana actual se compara con la semana anterior.
- Los grupos musculares se ordenan por volumen.
- Las referencias de rendimiento se calculan por ejercicio.
- Una segunda cuenta no puede ver estadísticas ajenas.
