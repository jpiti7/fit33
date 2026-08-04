# Fit33 v2.0.0 — Alcance de la release

Esta release agrupa los tres bloques funcionales acordados:

1. Coach semanal mejorado.
2. Logros, nivel y puntos.
3. Fotos privadas de progreso.

## Decisiones técnicas

- Los logros se calculan desde los datos existentes; no duplican estado en base de datos.
- Las fotografías se guardan en un bucket privado de Supabase Storage.
- La tabla `progress_photos` conserva únicamente metadatos y la ruta privada.
- Las URLs se firman durante una hora y no convierten el bucket en público.
- Las políticas RLS y Storage verifican el usuario autenticado.

## Pendiente para futuras versiones

- Comparador visual lado a lado.
- Notificaciones push configurables.
- Persistencia histórica de logros desbloqueados.
- Coach conversacional mediante un proveedor de IA externo.
- Auditoría Lighthouse y publicación nativa en App Store.
