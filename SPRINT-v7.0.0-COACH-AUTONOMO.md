# Fit33 v7.0.0 — Coach Autónomo

## Objetivo

Convertir el Coach en un sistema proactivo que detecta desviaciones y propone acciones con confirmación explícita del usuario.

## Incluye

- Motor de propuestas autónomas.
- Reorganización sugerida cuando faltan sesiones.
- Protección de recuperación cuando el score es bajo.
- Revisión de nutrición cuando la proteína está por debajo del objetivo.
- Acceso directo a recuperación, nutrición y planificación.
- Nueva ruta `/coach/autonomo`.
- Integración en Dashboard y navegación móvil.
- Tests unitarios del motor.

## Seguridad funcional

En v7.0 aceptar una propuesta no muta entrenamiento ni nutrición de forma silenciosa. La aceptación lleva al flujo correspondiente para que el usuario confirme el cambio.

## Apple Health

Sigue pospuesto hasta disponer de Mac/Xcode.
