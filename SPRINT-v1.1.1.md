# Sprint v1.1.1 — Base nutricional

## Objetivo

Añadir el primer flujo funcional de nutrición de Fit33: registrar alimentos o platos, consultar los totales diarios y comparar el consumo con los objetivos personales.

## Cambios de base de datos

Ejecutar `database/migrations/003_nutrition_module.sql` en Supabase. La migración crea:

- `foods`: catálogo personal y futuro catálogo global.
- `nutrition_logs`: registros diarios con una copia de los valores nutricionales.
- `meal_templates`: base para plantillas y planificación semanal.

Las tres tablas usan Row Level Security. Cada usuario solo puede gestionar sus propios datos; los alimentos globales con `user_id` nulo son de solo lectura.

## Funcionalidad

- Página `/nutricion` conectada a Supabase.
- Resumen diario de calorías, proteína, hidratos, grasas y fibra.
- Registro de desayuno, media mañana, comida, merienda, cena u otros.
- Eliminación de registros.
- Objetivos iniciales tomados de `constants/profile.ts`.

## Pruebas

1. Ejecutar la migración SQL.
2. Iniciar sesión y abrir `/nutricion`.
3. Registrar una comida y comprobar los totales.
4. Recargar la página y verificar que el registro persiste.
5. Eliminarlo y comprobar que los totales se actualizan.
6. Iniciar sesión con otra cuenta y comprobar que no aparecen datos ajenos.
7. Ejecutar `npm run quality` y `npm run build`.

## Limitaciones conocidas

- Los objetivos aún no son editables por usuario.
- Los nutrientes se introducen manualmente.
- El catálogo de alimentos y las plantillas se usarán en próximos sprints.
