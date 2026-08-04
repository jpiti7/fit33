# Apple Health en Fit33

Fit33 mantiene la PWA y añade una capa iOS nativa mediante Capacitor. HealthKit no se consulta desde Safari: el puente Swift solicita autorización y entrega un resumen diario a la interfaz web.

## Datos leídos

- Pasos.
- Calorías activas.
- Frecuencia cardíaca en reposo.
- Sueño.
- Peso corporal.
- Minutos y número de entrenamientos.

## Privacidad

Los permisos se solicitan por medio de HealthKit y el usuario conserva el control. Fit33 guarda únicamente los agregados diarios necesarios para recuperación, Dashboard y Coach. Los registros de Supabase están aislados mediante RLS.

## Flujo de sincronización

1. La app iOS solicita permisos.
2. `HealthKitManager.swift` consulta los agregados del día.
3. El plugin devuelve el resumen a `AppleHealthPanel`.
4. Una Server Action valida la sesión y guarda los datos en Supabase.
5. Dashboard, recuperación y Coach pueden consumir el último snapshot en versiones posteriores.

## Puesta en marcha

Consulta `native/ios/HealthKit/INSTALL.md`.
