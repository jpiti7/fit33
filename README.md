# Fit33

Aplicación personal de entrenamiento, nutrición y seguimiento corporal construida con Next.js, TypeScript y Supabase.

## Estado

Versión preparada: `v0.8.2`

### Funcionalidades disponibles

- Dashboard PRO con métricas semanales y Coach Fit33.

- Autenticación y rutas protegidas.
- Datos privados por usuario mediante RLS.
- Registro de peso, cintura y grasa corporal.
- Dashboard, historial y gráfica de peso.
- Rutinas Push, Pull, Pierna A y Pierna B + hombro.
- Registro completo de entrenamientos en Supabase.
- Historial de sesiones.
- Workout Session Manager con cronómetro, descanso automático y autosave.
- ESLint, Prettier, Husky y GitHub Actions.

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

Ejecuta:

```bash
npm run dev
```

## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run format:check
npm run build
```

## Estructura

- `app`: rutas y páginas.
- `components`: interfaz compartida.
- `features`: módulos funcionales.
- `database`: migraciones SQL.
- `lib`: infraestructura y Supabase.
- `docs`: documentación.

- Historial profesional de sesiones con detalle y comparación.

## Coach Fit33

El motor de reglas analiza adherencia, frecuencia, volumen, progresión, peso y recuperación para generar recomendaciones accionables.
