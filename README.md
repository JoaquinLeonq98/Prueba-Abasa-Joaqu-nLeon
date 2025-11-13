# Prueba ABASA · Catálogo SSR con Astro + React

Aplicación SSR construida con **Astro 5**, **React 19** y **Tailwind CSS 4** para la prueba técnica de ABASA. El proyecto consume la API pública de [DummyJSON](https://dummyjson.com/products) y muestra un catálogo de productos con filtros, paginación y detalle individual.

## Características

- **SSR real** con `@astrojs/node` y rutas dinámicas `/item/[slug]`.
- **Integración React**: componentes interactivos (`ItemsList`, `ThemeToggle`) montados con `client:load`.
- **Tailwind CSS 4**: diseño minimalista y responsive, dark mode personalizado usando `@custom-variant dark`.
- **Catálogo**:
  - Datos desde DummyJSON (hasta 100 productos) cacheados en `src/lib/api.ts`.
  - Búsqueda por texto y filtro por categoría.
  - Paginación por query (`?page=n`) compatible con View Transitions nativas.
- **Detalle de producto**: renderizado en Astro, con fallback 404 y layout reutilizable.
- **Gestión de tema**: detección de preferencia del sistema, persistencia en `localStorage` y toggle manual.
- **Aliases TypeScript** (`@components/*`, `@utils/*`, etc.) para imports limpios (`tsconfig.json`).

## Estructura y arquitectura del proyecto

```text
prueba-abasa/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Astro/
│   │   │   ├── ItemDetail.astro
│   │   │   └── ThemeInitializer.astro
│   │   └── React/
│   │       ├── ItemsList.tsx
│   │       └── ThemeToggle.tsx
│   ├── layouts/
│   │   └── Layout.astro
│   ├── lib/
│   │   └── api.ts
│   ├── pages/
│   │   ├── index.astro
│   │   └── item/[slug].astro
│   └── utils/
│       └── theme.ts
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

## 🚀 Puesta en marcha

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build producción (dist/)
npm run build

# Vista previa producción
npm run preview
```

## Dependencias clave

- `astro` `^5.15.5`
- `@astrojs/react` `^4.4.2`
- `@astrojs/node` `^9.1.0`
- `tailwindcss` `^4.1.17` (via `@tailwindcss/vite`)
- `react` / `react-dom` `^19.2.0`

## Decisiones técnicas

- **Datos**: `fetchItems` cachea resultados en memoria para minimizar requests; `fetchItemBySlug` resuelve por ID.
- **Paginación**: enlaces SSR (`<a href="?page=n">`) sincronizan URL, facilitan SEO y permiten View Transitions.
- **Dark mode**: `@custom-variant dark` en Tailwind + `ThemeInitializer` para aplicar la preferencia antes de hidratar.
- **Tipos**: configuración estricta de TS con aliases para mantener imports consistentes.


