# Fit33

Fit33 es una PWA personal de entrenamiento, nutrición, progreso corporal y asistencia inteligente, construida con Next.js, TypeScript y Supabase.

## Versión

`v3.0.0`

## Funcionalidades

- Autenticación y aislamiento de datos mediante RLS.
- Registro de peso, cintura, grasa corporal y fotos privadas.
- Rutinas, sesiones, cronómetro, descansos, autosave y modo offline.
- Historial, analíticas, marcas personales, logros, nivel y XP.
- Nutrición diaria con calorías y macronutrientes.
- Hidratación diaria.
- Pantalla Hoy contextual.
- Planificador semanal automático.
- Coach Fit33 con informe y conversación basada en reglas.
- PWA instalable en iPhone.
- Preferencias de notificaciones web.
- Vitest, ESLint, Prettier, Husky y GitHub Actions.

## Instalación

```bash
git clone https://github.com/jpiti7/Fit33.git
cd Fit33
npm install
```

Crea `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=TU_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=TU_CLAVE
```

Ejecuta las migraciones SQL en orden, incluida:

```text
database/migrations/006_v3_platform.sql
```

Después:

```bash
npm run quality
npm run build
npm run dev
```

## Rutas principales

- `/` — Hoy
- `/entrenos` — Entrenamientos
- `/planificacion` — Plan semanal
- `/coach` — Informe del Coach
- `/coach/chat` — Conversación con el Coach
- `/nutricion` — Nutrición
- `/progreso` — Progreso
- `/logros` — Logros
- `/perfil/notificaciones` — Preferencias de avisos

## Límites actuales

El Coach conversacional usa reglas deterministas y no envía datos a servicios externos. Las notificaciones programadas en segundo plano requieren una futura integración Web Push. Apple Health requiere una aplicación nativa o un puente específico.

## Menús y lista de la compra

Fit33 v3.1.0 incorpora:

- planificador semanal en `/nutricion/planificador`;
- menús de 4 o 5 comidas adaptados a objetivos y preferencias;
- recetas con cantidades, macros y preparación;
- lista automática en `/nutricion/lista-compra`;
- persistencia privada en Supabase mediante RLS.

Antes de usar el módulo debe ejecutarse `database/migrations/007_meal_planner.sql`.
