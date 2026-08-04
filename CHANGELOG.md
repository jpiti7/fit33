# Changelog

## [2.0.0]

### Added

- Informe semanal ampliado del Coach Fit33.
- Sistema de logros, nivel y puntos.
- Fotos privadas de progreso en Supabase Storage.
- Nueva experiencia de progreso con línea temporal.
- Migración `005_smart_progress.sql`.

# Changelog

## [1.2.2]

### Added

- Modo offline para finalizar entrenamientos.
- Cola persistente con IndexedDB.
- Sincronización automática al recuperar conexión.
- Service worker y página `/offline`.
- Indicador global de conexión y pendientes.
- Idempotencia mediante `client_id`.
- Test de deduplicación de la cola offline.

## [1.2.1]

### Added

- Manifiesto PWA para Fit33.
- Iconos F33 para iPhone y navegadores.
- Metadatos Apple Web App y modo standalone.
- Página de instalación `/instalar`.
- Compatibilidad con zonas seguras del iPhone.

## [1.1.1]

### Added

- Módulo base de nutrición.
- Registro diario de comidas con calorías, proteína, hidratos, grasas y fibra.
- Resumen diario frente a objetivos personales.
- Agrupación de registros por tipo de comida.
- Eliminación segura de registros nutricionales.
- Tablas `foods`, `nutrition_logs` y `meal_templates` con RLS por usuario.
- Pruebas unitarias para el cálculo de totales nutricionales.

## [0.9.2]

### Added

- Dashboard PRO integrado en la página de inicio.
- Resumen semanal de sesiones, volumen, duración y series.
- Comparaciones con la semana anterior.
- Foco muscular y marcas recientes.
- Primeras recomendaciones automáticas del Coach Fit33.
- Accesos directos a entrenamiento y analíticas.

## [0.9.1]

### Added

- Motor analítico de entrenamientos.
- Comparación semanal de sesiones, volumen y duración.
- Resumen mensual.
- Distribución por grupo muscular.
- Referencias de rendimiento y 1RM estimado.
- Página `/analiticas`.

## [0.8.3]

### Added

- Historial profesional con resumen acumulado.
- Página de detalle para cada sesión.
- Desglose completo de ejercicios y series.
- Comparación de volumen, carga máxima y series con la sesión anterior del mismo tipo.
- Navegación directa desde cada tarjeta del historial.

## [0.8.2]

### Added

- Workout Session Manager.
- Cronómetro preciso basado en marcas de tiempo.
- Pausa y reanudación de sesión.
- Descanso automático de 90 segundos al completar una serie.
- Controles para ampliar o cancelar el descanso.
- Autosave del formulario cada cinco segundos.
- Recuperación opcional tras recargar o cerrar el navegador.
- Vibración compatible al finalizar el descanso.
- Cancelación de sesión con limpieza del borrador.

## [0.8.1]

### Added

- Guardado completo de workouts, exercises y sets.
- Resumen al finalizar el entrenamiento.
- Historial inicial de sesiones.

## [0.7.6]

### Added

- Documentación y roadmap del proyecto.

## [0.7.5]

### Added

- ESLint, Prettier, Husky, lint-staged y GitHub Actions.

## [0.6.0]

### Added

- Autenticación y aislamiento de datos por usuario mediante RLS.
