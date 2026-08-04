# Sprint v5.0.0 — Apple Health Foundation

## Objetivo

Crear la primera capa nativa de Fit33 para iPhone y conectar datos diarios de Apple Health con Supabase.

## Incluido

- Pantalla `/salud`.
- Lectura nativa de pasos, calorías activas, pulso en reposo, sueño, peso y entrenamientos.
- Persistencia diaria en `health_daily_snapshots`.
- Políticas RLS por usuario.
- Plantilla de plugin HealthKit para Capacitor en Swift.
- Configuración e instrucciones para generar el proyecto iOS en un Mac.
- Degradación segura: la web/PWA informa de que HealthKit requiere la app iOS.

## Requisitos nativos

- macOS y Xcode.
- iPhone físico.
- HealthKit capability.
- Descripciones de uso en Info.plist.
- Cuenta Apple Developer para TestFlight/App Store.

## Validación web

```bash
npm install
npm run quality
npm run build
```

## Preparación iOS

```powershell
powershell -ExecutionPolicy Bypass -File scripts/setup-ios.ps1
```

Después sigue `native/ios/HealthKit/INSTALL.md`.
