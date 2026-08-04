# Fit33 v4 — Inteligencia adaptativa

## Flujo de decisión

1. El usuario registra su recuperación diaria.
2. El motor calcula una puntuación normalizada.
3. El planificador ajusta número de sesiones o intensidad propuesta.
4. El Coach local genera una respuesta segura y contextual.
5. Cuando existe `OPENAI_API_KEY`, el proveedor externo puede mejorar la redacción usando un resumen limitado del contexto.
6. Si el proveedor falla, Fit33 devuelve la respuesta local.

## Privacidad

- La clave del proveedor solo se utiliza en el servidor.
- Los datos de recuperación están aislados por `user_id` mediante RLS.
- No se envían fotografías al proveedor.
- El resumen enviado evita datos innecesarios y se limita a objetivos y métricas agregadas.

## Límites

El estado de recuperación es una estimación orientativa y no constituye evaluación médica. Apple Health, Health Connect y notificaciones push programadas requieren integraciones adicionales.
