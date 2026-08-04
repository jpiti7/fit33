# Modo offline de Fit33

Fit33 usa un service worker para conservar recursos de la PWA y una cola de IndexedDB para entrenamientos terminados sin conexión.

## Flujo

1. El usuario abre previamente la rutina con Internet.
2. Si pierde la conexión, el formulario y los cronómetros siguen funcionando en el dispositivo.
3. Al finalizar, Fit33 guarda la sesión en `fit33-offline/pending-workouts`.
4. El componente global `OfflineManager` escucha el evento `online`.
5. La cola llama a la Server Action y elimina cada elemento confirmado.

## Idempotencia

Cada sesión offline usa un UUID `client_id`. La base de datos tiene un índice único por `(user_id, client_id)`, evitando sesiones duplicadas si una respuesta se pierde y el dispositivo reintenta.

## Prueba manual

1. Abre una rutina conectado.
2. En las herramientas del navegador activa Network → Offline, o desactiva Wi-Fi y datos en el iPhone.
3. Completa al menos una serie y finaliza.
4. Confirma el mensaje de guardado offline.
5. Recupera la conexión.
6. Espera a que el indicador muestre Online sin pendientes.
7. Revisa el historial y Supabase.

## Borrar la cola durante desarrollo

En DevTools → Application → IndexedDB, elimina la base `fit33-offline`.
