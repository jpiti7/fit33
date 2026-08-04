# Sprint v1.2.2 — Entrenamientos offline

## Objetivo

Permitir finalizar un entrenamiento sin conexión y sincronizarlo automáticamente con Supabase al recuperar Internet.

## Implementación

- Service worker en `public/sw.js` para caché de recursos y páginas visitadas.
- Página de respaldo `/offline`.
- Cola local basada en IndexedDB.
- Indicador global del estado de red y de la sincronización.
- Guardado de entrenamientos finalizados cuando no hay conexión.
- Sincronización automática al recibir el evento `online`.
- Identificador `client_id` para evitar duplicados durante reintentos.
- Test unitario de deduplicación de la cola.

## Migración obligatoria

Ejecutar `database/migrations/004_offline_workout_idempotency.sql` en Supabase antes de publicar esta versión.

## Límites de esta versión

- Una rutina debe haberse abierto al menos una vez con conexión para poder recuperarse desde la caché.
- La cola offline está almacenada en el dispositivo y navegador actuales.
- El historial se actualiza cuando la sincronización termina y se vuelve a cargar la página.

## Criterios de aceptación

1. La app muestra el estado Online u Offline.
2. Una sesión finalizada sin conexión se guarda en IndexedDB.
3. Al recuperar Internet, la sesión se envía automáticamente.
4. Un reintento con el mismo `client_id` no crea otro entrenamiento.
5. La cola queda vacía después de sincronizar correctamente.
