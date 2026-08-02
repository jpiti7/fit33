# Sprint v1.0.1 — Coach Fit33

## Objetivo

Convertir los datos de peso y entrenamiento en recomendaciones accionables mediante un motor de reglas determinista.

## Incluye

- Página `/coach`.
- Puntuación semanal y adherencia.
- Próxima sesión recomendada.
- Reglas independientes de adherencia, frecuencia, volumen, progresión, peso y recuperación.
- Integración compacta en el Dashboard.
- Lectura segura de datos mediante Supabase Auth y RLS.

## Criterios de aceptación

- El informe funciona con cero, pocos o muchos entrenamientos.
- Otra cuenta no puede consultar recomendaciones basadas en datos ajenos.
- Las recomendaciones cambian al registrar peso o entrenamientos.
- La próxima sesión abre una ruta válida.
