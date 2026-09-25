# Lab – React Client for Blueprints (Redux + Axios + JWT)

**Autores:** Juan David Rangel · Hernan Cortes

> Basado en el cliente HTML/JS del repo de referencia, este laboratorio moderniza el _frontend_ con **React + Vite**, **Redux Toolkit**, **Axios** (con interceptores y JWT), **React Router** y pruebas con **Vitest + Testing Library**.

## Objetivos de aprendizaje

- Diseñar una SPA en React aplicando **componetización** y **Redux (reducers/slices)**.
- Consumir APIs REST de Blueprints con **Axios** y manejar **estados de carga/errores**.
- Integrar **autenticación JWT** con interceptores y rutas protegidas.
- Aplicar buenas prácticas: estructura de carpetas, `.env`, linters, testing, CI.

## Requisitos previos

- Tener corriendo el backend de Blueprints de los **Labs 3 y 4** (APIs + seguridad).
- Node.js 18+ y npm.

Ver la especificación de glosario clave, consulta las [Definiciones del laboratorio](./DEFINICIONES.md).

## Guía de ejecución para el lector

Este repositorio es **solo el frontend** (React + Vite). El backend vive en el repo aparte `Lab_P2_BluePrints_Java21_API_Security_JWT` (Spring Boot 3 / Java 21 + seguridad JWT). Hay tres formas de correr el proyecto:

### Opción A — Front contra el backend desplegado en Azure (recomendada para la revisión)

El backend ya está desplegado y no requiere nada local:

1. `npm install`
2. Crear `.env` con:

```variable
VITE_API_BASE_URL=http://68.155.159.205:8080
VITE_USE_MOCK=false
```

3. `npm run dev` y abrir `http://localhost:5173`.
4. **Login** con `student` / `student123` (el token JWT queda en `localStorage` y viaja como `Authorization: Bearer` en cada request).

> Si la VM de Azure está apagada, el front muestra el error "Servidor no disponible". Para encenderla: `az vm start -g ARSW-bluepritns -n arsw-vm`. Alternativamente usa la Opción B.

### Opción B — Solo mock (sin backend)

1. `npm install`
2. En `.env`: `VITE_USE_MOCK=true` (y `VITE_API_BASE_URL=` vacío).
3. `npm run dev`. No necesita backend ni login; autores de prueba: `juan` y `hernan`.

### Opción C — Backend local + front con proxy

1. En la carpeta del backend (`Lab_P2_BluePrints_Java21_API_Security_JWT`):

```bash
mvn -q -DskipTests spring-boot:run
```

   Con el perfil por defecto (`dev,identity`) los planos viven en memoria y vienen sembrados (`john/house`, `john/garage`, `jane/garden`). Si se quiere PostgreSQL: `docker compose up -d` y arrancar con `SPRING_PROFILES_ACTIVE=pg,identity`.

2. En el front: `.env` con `VITE_API_BASE_URL=` (vacío) y `VITE_USE_MOCK=false`; `npm run dev`. El proxy de Vite reenvía `/api` y `/auth` a `http://localhost:8080` (sin problemas de CORS).

### Recorrido de prueba sugerido

1. Abrir `/login` → entrar con `student` / `student123`.
2. En la página principal pulsar **Get blueprints** con el campo vacío → lista todos los blueprints (columna Author incluida).
3. Buscar el autor `john` (o `felipechavarro` / `Diego` en Azure) → tabla con nombre, número de puntos y botones **Open** / **Delete**.
4. Buscar un autor inexistente (ej. `jane` en Azure) → banner con mensaje amable y botón **Reintentar**.
5. Pulsar **Open** → página protegida `/blueprints/:author/:name` con el canvas interactivo: cada click agrega un punto y **Guardar puntos** los persiste (PUT); **Descartar** los descarta; **Eliminar blueprint** borra (optimistic update con rollback).
6. Ir a **Nuevo Blueprint** (`/blueprints/new`, ruta protegida: sin token redirige a `/login`) → crear un plano con puntos en JSON.
7. Revisar la tarjeta **Top 5 por puntos** (memo selector) y el total de puntos.
8. Alternar **modo oscuro/claro** con el botón sol/luna (logo y paleta cambian; el estado queda en `localStorage`).

### Verificación (calidad)

```bash
npm test          # Vitest + Testing Library: 8 pruebas (slice, selectors, canvas, form, página)
npm run lint      # ESLint
npm run build     # build de producción con Vite
```

El workflow de CI en `.github/workflows/ci.yml` corre lint + test + build en cada push/PR.

## Endpoints esperados (ajústalos si tu backend quedo diferente)

*Se modifican los endpoints debido al formato manejado en los dos laboratorios anteriores:*

- `GET /api/blueprints` → lista general o catálogo para derivar autores.
- `GET /api/blueprints/{author}`
- `GET /api/blueprints/{author}/{bpname}`
- `POST /api/blueprints` (requiere JWT)
- `PUT /api/blueprints/{author}/{bpname}/points` (requiere JWT)
- `POST /auth/login` → `{ access_token, token_type, expires_in }`

> Todas las respuestas de `/api/**` vienen envueltas en `{ code, message, data }`; `apiclient` ya las desempaqueta para devolver solo `data`.

Configura la URL base en `.env`.

## Cómo arrancar

```bash
npm install
copy .env.example .env   # en Windows; en Linux/macOS usar cp
npm run dev
```

Con `VITE_API_BASE_URL` vacío, el proxy de Vite reenvía `/api` y `/auth` al backend local en `http://localhost:8080`.

Abre `http://localhost:5173`

## Variables de entorno

Crea un archivo `.env` en la raíz:

```variable
VITE_API_BASE_URL=
VITE_USE_MOCK=false
```

- `VITE_USE_MOCK=true` → usa `apimock` (datos en memoria, sin backend).
- `VITE_USE_MOCK=false` → usa `apiclient` contra el backend real.
- `VITE_API_BASE_URL` → URL del API vista desde el navegador. Déjala **vacía** en desarrollo: el proxy de Vite reenvía `/api` y `/auth` a `http://localhost:8080`, lo que evita problemas de CORS. En producción apúntala a la URL completa (ej. `https://tu-host/api`).

> **Tip:** en producción usa variables seguras o un _reverse proxy_.

## Estructura

```carpetas
blueprints-react-lab/
├─ src/
│  ├─ components/
│  ├─ features/blueprints/blueprintsSlice.js
│  ├─ pages/
│  ├─ services/httpClient.js   # axios + interceptores JWT
│  ├─ store/index.js          # Redux Toolkit
│  ├─ App.jsx, main.jsx, styles.css
├─ tests/
├─ .github/workflows/ci.yml
├─ index.html, package.json, vite.config.js, README.md
```

## 📌 Requerimientos del laboratorio

## 1. Canvas (lienzo)

- Agregar un lienzo (Canvas) a la página.
- Incluir un componente `BlueprintCanvas` con un identificador propio.
- Definir dimensiones adecuadas (ej. `520×360`) para que no ocupe toda la pantalla pero permita dibujar los planos.

## 2. Listar los planos de un autor

- Permitir ingresar el nombre de un autor y consultar sus planos desde el backend (o mock).
- Mostrar los resultados en una tabla con las siguientes columnas:
  - Nombre del plano
  - Número de puntos
  - Botón `Open` para abrirlo

## 3. Seleccionar un plano y graficarlo

Al hacer clic en el botón `Open`, debe:

- Actualizar un campo de texto con el nombre del plano actual.
- Obtener los puntos del plano correspondiente.
- Dibujar consecutivamente los segmentos de recta en el canvas y marcar cada punto.

## 4. Servicios: `apimock` y `apiclient`

- Implementar dos servicios con la misma interfaz:
  - `apimock`: retorna datos de prueba desde memoria.
  - `apiclient`: consume el API REST real con Axios.
- La interfaz de ambos debe incluir los métodos:
  - `getAll`
  - `getByAuthor`
  - `getByAuthorAndName`
  - `create`
- Habilitar el cambio entre `apimock` y `apiclient` con una sola línea de código:
  - Definir un módulo `blueprintsService.js` que importe uno u otro según una variable en `.env`.
  - Ejemplo en `.env` (Vite):

```env
VITE_USE_MOCK=true
```

- `VITE_USE_MOCK=true` usa el mock.
- `VITE_USE_MOCK=false` usa el API real.

## 5. Interfaz con React

- El nombre del plano actual debe mostrarse en el DOM como parte del estado global (Redux).
- Evitar manipular directamente el DOM; usar componentes y props/estado.

## 6. Estilos

- Agregar estilos para mejorar la presentación.
- Se puede usar Bootstrap u otro framework CSS.
- Ajustar la tabla, botones y tarjetas para acercarse al mock de referencia.

## 7. Pruebas unitarias

- Agregar pruebas con Vitest + Testing Library para validar:
  - Render del canvas.
  - Envío de formularios.
  - Interacciones básicas con Redux (por ejemplo: dispatch de `fetchByAuthor`).

---

### Notas rápidas y recomendaciones

- Para el canvas en tests con jsdom: agregar un mock de `HTMLCanvasElement.prototype.getContext` en `tests/setup.js`.
- Para usar `@testing-library/jest-dom` con Vitest: en `tests/setup.js` importar `import '@testing-library/jest-dom'` y asegurarse de que Vitest provea el global `expect` (configurar `vitest.config.js` con la opción `test: { globals: true, setupFiles: './tests/setup.js' }`).
- Para la conmutación de servicios en Vite, usar `import.meta.env.VITE_USE_MOCK` para leer la variable en tiempo de ejecución.

## 📌 Recomendaciones y actividades sugeridas para el exito del laboratorio

1. **Redux avanzado**
   - [x] Agrega estados `loading/error` por _thunk_ y muéstralos en la UI.
   - [x] Implementa _memo selectors_ para derivar el top-5 de blueprints por cantidad de puntos.
2. **Rutas protegidas**
   - [x] Crea un componente `<PrivateRoute>` y protege la creación/edición.
3. **CRUD completo**
   - [x] Implementa `PUT /api/blueprints/{author}/{name}/points` y `DELETE ...` en el slice y en la UI.
   - [x] Optimistic updates (revertir si falla).
4. **Dibujo interactivo**
   - [x] Reemplaza el `svg` por un lienzo donde el usuario haga _click_ para agregar puntos.
   - [x] Botón “Guardar” que envíe el blueprint.
5. **Errores y _Retry_**
   - [x] Si `GET` falla, muestra un banner y un botón **Reintentar** que dispare el thunk.
6. **Testing**
   - [ ] Pruebas de `blueprintsSlice` (reducers puros).
   - [ ] Pruebas de componentes con Testing Library (render, interacción).
7. **CI/Lint/Format**
   - [x] Activa **GitHub Actions** (workflow incluido) → lint + test + build.
8. **Docker (opcional)**
   - [ ] Crea `Dockerfile` (+ `compose`) para front + backend.

## Criterios de evaluación

- Funcionalidad y cobertura de casos (30%)
- Calidad de código y arquitectura (Redux, componentes, servicios) (25%)
- Manejo de estado, errores, UX (15%)
- Pruebas automatizadas (15%)
- Seguridad (JWT/Interceptores/Rutas protegidas) (10%)
- CI/Lint/Format (5%)

## Scripts

- `npm run dev` – servidor de desarrollo Vite
- `npm run build` – build de producción
- `npm run preview` – previsualizar build
- `npm run lint` – ESLint
- `npm run format` – Prettier
- `npm test` – Vitest

## Cambios realizados

### 1. Canvas (lienzo)

- **Lienzo en la página:** el componente `BlueprintCanvas` está montado dentro de `BlueprintsPage.jsx`.
- **Componente con identificador propio:** en `BlueprintCanvas.jsx` el `<canvas>` lleva `id="blueprint-canvas"`. Era lo único que le faltaba al andamiaje y lo agregamos nosotros.
- **Dimensiones adecuadas:** el canvas mide 520×360, que son los valores por defecto del componente.

### 2. Listar los planos de un autor

Este punto ya venía resuelto en el andamiaje, así que no tocamos código.

- **Ingresar el nombre del autor y consultar sus planos:** en `BlueprintsPage.jsx` está el input del autor y el botón "Get blueprints". El botón llama a `fetchByAuthor`, que en `blueprintsSlice.js` pide `GET /api/blueprints/{author}` y guarda la respuesta en el estado.
- **Tabla con el nombre del plano:** la primera columna de la tabla muestra `bp.name`.
- **Tabla con el número de puntos:** la segunda columna muestra `bp.points.length`.
- **Botón Open:** la tercera columna tiene el botón `Open`, que llama a `openBlueprint` con el plano de esa fila.

### 3. Seleccionar un plano y graficarlo

- **Actualizar un campo de texto con el nombre del plano:** en `BlueprintsPage.jsx` el nombre del plano se muestra en un `<input>` de solo lectura. Su `value` sale de `current.name`, que es el estado global de Redux, así que se actualiza solo cuando cambia el plano seleccionado.
- **Obtener los puntos del plano:** el botón `Open` llama a `openBlueprint`, que hace `dispatch(fetchBlueprint)`. Ese thunk pide `GET /api/blueprints/{author}/{name}` y guarda el plano completo en `current`.
- **Dibujar los segmentos y marcar cada punto:** `BlueprintCanvas` recibe los puntos por props y los dibuja en un `useEffect`. Con `moveTo` y `lineTo` traza las líneas entre puntos consecutivos, y después marca cada punto con un círculo.

### 4. Servicios: `apimock` y `apiclient`

Creamos la carpeta `src/services/` con los tres módulos que pide el punto.

- **Los dos servicios con la misma interfaz:** `apimock.js` guarda planos de prueba en memoria y devuelve copias de esos datos, y `apiclient.js` consume el API REST real usando `httpClient`, que es el axios con los interceptores que agregan el token JWT. Los dos exponen los mismos cuatro métodos, así que son intercambiables.
- **Los cuatro métodos:** `getAll` devuelve todos los planos, `getByAuthor` los de un autor, `getByAuthorAndName` un plano puntual y `create` agrega uno nuevo.
- **Cambiar entre uno y otro:** `blueprintsService.js` importa los dos y elige según `VITE_USE_MOCK`. Ese módulo es el único que sabe cuál está activo.
- **Cómo llega eso a la aplicación:** en `blueprintsSlice.js` los thunks ya no llaman a axios directo, ahora usan `blueprintsService`. El slice sigue haciendo lo mismo de antes, pero deja de saber cómo se piden los datos.

Con `VITE_USE_MOCK=true` en el `.env` la app funciona con el mock, sin necesidad de tener el backend levantado. Con `VITE_USE_MOCK=false` sale contra el API real.

### 5. Conexión con el backend real

Para que el front funcionara contra el API Spring Boot (Labs 3 y 4) hicimos cuatro ajustes:

- **Proxy de Vite para CORS:** en `vite.config.js` agregamos un proxy que reenvía `/api` y `/auth` a `http://localhost:8080`. Como el navegador solo habla con el dev server, ya no hay bloqueo de CORS.
- **`httpClient.js` con base relativa:** la `baseURL` quedó vacía (`''`) para que las peticiones pasen por el proxy. `VITE_API_BASE_URL` permite apuntar a otro backend (ej. uno desplegado en Azure) sin tocar el código.
- **`apiclient.js` desempaqueta la respuesta:** el backend envuelve todo en `{ code, message, data }`; `apiclient` extrae `data` para mantener la misma interfaz que `apimock`.
- **Login corregido:** `LoginPage` ahora llama a `POST /auth/login` (sin el prefijo `/api`) y guarda `access_token` (antes esperaba `token`). El interceptor de `httpClient` lo envía como `Authorization: Bearer` en cada request.

### 6. Extras (rutas protegidas, CRUD, canvas interactivo y Bootstrap)

- **Estados `loading/error` por thunk:** el slice ahora lleva `status/error` para la lista, `detailStatus/detailError` para el detalle y `saveStatus/saveError` para las mutaciones, y la UI los muestra (spinners, banners y alerts).
- **Memo selectors:** en `features/blueprints/selectors.js`, `selectTop5ByPoints` deriva el top-5 de blueprints por cantidad de puntos con `createSelector` y se muestra en `BlueprintsPage`.
- **Rutas protegidas:** `components/PrivateRoute.jsx` redirige a `/login` si no hay token. Protege `/blueprints/new` (creación) y `/blueprints/:author/:name` (edición).
- **CRUD completo:**
  - `apimock` y `apiclient` exponen ahora `updatePoints` (`PUT /api/blueprints/{author}/{name}/points`) y `delete` (`DELETE /api/blueprints/{author}/{name}`).
  - El slice agrega `updateBlueprintPoints` y `deleteBlueprint` con _optimistic updates_: al agregar puntos o eliminar se actualiza el estado de inmediato y, si el backend falla, se revierte (`_rollback`).
  - Nota: el backend del Lab_P2 solo implementa el `PUT .../points`; el `DELETE` funciona contra el mock y contra el API real devolverá 405 hasta que el backend lo exponga.
- **Dibujo interactivo:** `BlueprintDetailPage` reemplazó el `svg` por el `BlueprintCanvas` interactivo: cada click agrega un punto y el botón **Guardar puntos** los envía (vía `updateBlueprintPoints`). El canvas del listado sigue siendo de solo lectura.
- **Errores y Retry:** si `fetchByAuthor` o `fetchBlueprint` fallan, la UI muestra un banner con el error y un botón **Reintentar** que vuelve a disparar el thunk.
- **Bootstrap:** se instaló `bootstrap` (tema oscuro con `data-bs-theme="dark"`) y todos los componentes se migraron a sus clases (`btn`, `card`, `table`, `form-control`, `alert`, `spinner-border`).
- **Pruebas:** se agregaron tests del slice (rollback optimista de delete y de puntos, selector top-5) y quedaron 8 tests pasando.

---

### Extensiones propuestas del reto

- **Redux Toolkit Query** para _caching_ de requests.
- **MSW** para _mocks_ sin backend.
- **Dark mode** y diseño responsive.

> Este proyecto es un punto de partida para que tus estudiantes evolucionen el cliente clásico de Blueprints a una SPA moderna con prácticas de la industria.
