# Sprint v1.2.3 — Mobile Experience

## Objetivo

Mejorar el uso diario de Fit33 desde iPhone y PWA, especialmente durante los entrenamientos.

## Cambios

- Navegación inferior móvil con iconos Lucide, cinco destinos principales y soporte safe-area.
- Navegación inferior oculta durante una sesión para reducir distracciones.
- Cabecera de sesión compacta y adaptada a una sola mano.
- Wake Lock opcional para mantener la pantalla activa durante el entrenamiento.
- Campos y controles táctiles más grandes.
- Vibración háptica compatible al completar series, guardar y cancelar.
- Estilos específicos para modo standalone.
- Test unitario del módulo háptico.

## Validación

```bash
npm run format
npm run lint
npm run typecheck
npm run test:run
npm run build
```
