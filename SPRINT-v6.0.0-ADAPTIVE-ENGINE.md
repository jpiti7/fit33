# Fit33 v6.0.0 — Adaptive Engine

## Objetivo

Convertir Fit33 de un sistema que registra y muestra datos en un sistema que usa historial, recuperación, adherencia y objetivos para proponer la siguiente acción.

## Incluido

- Motor Adaptive Engine accesible en `/adaptativo`.
- Selección de variante de entrenamiento evitando repetir ejercicios recientes cuando existe alternativa.
- Recomendación de carga por ejercicio usando última carga, repeticiones y RIR.
- Reducción aproximada del 10% y una serie menos cuando la recuperación es baja.
- Progresión aproximada del 2,5% cuando se alcanza el extremo alto del rango con margen.
- Recovery Score integrado en la decisión.
- Adherencia semanal visible dentro del motor.
- Referencia nutricional diferenciada para días de entrenamiento y descanso, manteniendo proteína objetivo.
- Acciones rápidas hacia entrenamiento, nutrición y recuperación.
- Acceso desde Dashboard y navegación lateral.
- Tests unitarios del motor adaptativo.

## Manteniendo lo existente

Se conserva la PWA, offline, Supabase, Coach, nutrición, planificación, predicciones, retos, logros, fotos, registro de peso y las tres variantes de cada rutina.

## Apple Health

Continúa preparado para una fase posterior cuando exista un entorno Mac/Xcode. No es requisito para esta versión web.

## Validación

Ejecutar en el proyecto:

```powershell
npm install
npm run format
npm run lint
npm run typecheck
npm run test:run
npm run build
```
