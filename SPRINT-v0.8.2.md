# Sprint v0.8.2 — Workout Session Manager

## Objetivo

Gestionar el ciclo de vida de una sesión de entrenamiento activa sin perder datos al recargar o cerrar el navegador.

## Funcionalidades

- Cronómetro de sesión basado en marcas de tiempo.
- Pausa y reanudación de la sesión.
- Descanso automático de 90 segundos al completar una serie.
- Controles para sumar 30 segundos o cancelar el descanso.
- Vibración compatible al finalizar el descanso.
- Guardado automático del borrador cada cinco segundos.
- Guardado adicional antes de cerrar o recargar la pestaña.
- Restauración opcional de una sesión encontrada en `localStorage`.
- Cancelación de sesión con confirmación.
- Limpieza del borrador al finalizar correctamente el entrenamiento.

## Persistencia

Los borradores se guardan únicamente en el navegador mediante una clave por tipo de entrenamiento:

```text
fit33:workout-session:<tipo>
```

No se sincronizan todavía entre dispositivos.

## Pruebas de aceptación

1. Abrir una rutina y comprobar que el cronómetro avanza.
2. Pausar y reanudar sin perder el tiempo acumulado.
3. Completar una serie y comprobar que comienza el descanso.
4. Recargar la página y aceptar recuperar la sesión.
5. Confirmar que pesos, repeticiones, RIR, notas y series completadas reaparecen.
6. Cancelar la sesión y comprobar que no vuelve a ofrecer recuperación.
7. Finalizar una sesión y comprobar que se guarda en Supabase y se elimina el borrador local.
