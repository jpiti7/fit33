# Instalar el puente HealthKit en Xcode

1. En un Mac ejecuta `npm install`, `npx cap add ios` y `npm run cap:sync`.
2. Copia `HealthKitManager.swift` y `HealthKitPlugin.swift` dentro de `ios/App/App/HealthKit/` y añádelos al target App.
3. En Xcode: Target App → Signing & Capabilities → `+ Capability` → HealthKit.
4. Añade al `Info.plist` las claves de `Info.plist.fragment.xml`.
5. Comprueba que el entitlements del target contiene `com.apple.developer.healthkit`.
6. Ejecuta en un iPhone físico. El simulador no representa datos reales de Salud.
