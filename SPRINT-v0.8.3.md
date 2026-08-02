# Sprint v0.8.3 — Historial profesional

## Objetivo

Convertir el historial inicial en una herramienta útil para revisar cada sesión y comparar el rendimiento con el entrenamiento anterior del mismo tipo.

## Entregado

- Resumen de sesiones, duración media, series y volumen acumulado.
- Tarjetas navegables para cada entrenamiento.
- Página de detalle por sesión.
- Desglose de peso, repeticiones, RIR y volumen por serie.
- Comparación por ejercicio de volumen, carga máxima y número de series.
- Estado protegido por RLS a través del cliente de Supabase del servidor.

## Pruebas

1. Guardar dos sesiones del mismo tipo.
2. Abrir `/entrenos/historial`.
3. Entrar en el detalle de la sesión más reciente.
4. Verificar que aparecen ejercicios y series.
5. Confirmar que la comparación usa la sesión anterior del mismo tipo.
6. Iniciar sesión con otra cuenta y comprobar que no aparecen sesiones ajenas.
