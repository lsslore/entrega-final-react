# Proyecto final de React JS con Vite - Talento Tech

Tienda de tecnología desarrollada con React y Vite. Permite consultar productos y categorías, ver detalles y opiniones, gestionar un carrito, crear una cuenta e iniciar sesión. Los usuarios administradores pueden administrar el catálogo desde un panel.

## Requisitos

- Node.js
- pnpm
- Un proyecto de Firebase con Authentication y Cloud Firestore habilitados
- Una clave de ImgBB para subir imágenes de productos

## Instalación

Desde la carpeta del proyecto, instala las dependencias declaradas en `package.json`:

```bash
pnpm install
```

Las dependencias principales instaladas para la aplicación son:

```bash
pnpm add firebase react-router-dom
```

React, React DOM, Vite y las herramientas de desarrollo están declaradas en `package.json` y se instalan con `pnpm install`.

## Configuración de Firebase e ImgBB

1. Copia `.env.example` como `.env.local`.
2. Completa las variables con la configuración de tu proyecto Firebase y tu clave de ImgBB:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_IMGBB_API_KEY=...
```

3. En Firebase, habilita el método de inicio de sesión **Correo electrónico/contraseña** y configura Cloud Firestore.
4. Reinicia Vite si ya estaba ejecutándose.

La aplicación utiliza las colecciones `productos`, `usuarios` y `opiniones` de Firestore. El registro crea el perfil del usuario en `usuarios`; el acceso al panel se determina mediante el campo `rol` con valor `admin`.

> Las variables con prefijo `VITE_` se incluyen en el código del navegador. No guardes contraseñas ni secretos privados en ellas. La clave de ImgBB se usa desde el frontend para esta práctica.

## Comandos

```bash
pnpm run dev   # Inicia el servidor de desarrollo de Vite

```

## Funcionalidades implementadas

### Carrito con Context API

`CarritoContext` mantiene el estado global del carrito. Permite agregar productos, cambiar sus cantidades, eliminar productos individualmente y vaciar el carrito. También calcula la cantidad total y el importe a pagar.

El carrito se guarda en `localStorage` y utiliza una clave distinta para cada usuario autenticado.

### Autenticación y rutas protegidas

`AuthContext` centraliza el estado de sesión y las operaciones de registro, inicio y cierre de sesión mediante Firebase Authentication. El registro guarda nombre, apellido, correo y rol en Firestore.

`RutaProtegida` limita el acceso a páginas de usuarios autenticados y permite restringir rutas por rol. El panel de administración requiere el rol `admin`.

### Catálogo y CRUD de productos con Firestore

El panel permite crear, consultar, editar y eliminar productos. El formulario valida los campos requeridos, incluido un precio mayor que cero y un stock no negativo. Antes de eliminar un producto se solicita confirmación.

Al crear un producto, la imagen se sube a ImgBB y su URL se guarda junto con los datos del producto en Firestore. Al editar, se puede conservar la imagen existente o reemplazarla.

Las vistas que consultan Firebase muestran estados de carga y mensajes de error cuando corresponde.

### Categorías, detalles y opiniones

Los productos se pueden consultar en el catálogo general y filtrar por categoría. Cada producto tiene una página de detalle con descripción y opiniones asociadas a su ID, consultadas desde la colección `opiniones` de Firestore.

### Estilos y diseño adaptable

Se usan **CSS Modules** para encapsular los estilos de componentes y páginas. Los archivos siguen el formato `Nombre.module.css` y se importan en React como módulos, por ejemplo:

```jsx
import styles from "./Item.module.css";
```

Los estilos globales, como variables de color y reglas base, están en `src/index.css`. También se agregaron ajustes responsivos para que el catálogo, el encabezado, el carrito y el panel se adapten a pantallas pequeñas.

## Rutas principales

| Ruta | Acceso | Contenido |
| --- | --- | --- |
| `/` | Público | Inicio y catálogo |
| `/productos` | Usuario autenticado | Listado general de productos |
| `/:idCategoria` | Usuario autenticado | Productos de la categoría |
| `/producto/:id` | Usuario autenticado | Detalle y opiniones del producto |
| `/carrito` | Usuario autenticado | Carrito de compras |
| `/login` | Público | Inicio de sesión |
| `/registro` | Público | Registro de usuario |
| `/panel` | Solo administrador | Administración de productos |

## Organización del código

```text
src/
├── components/
│   ├── layout/       # Layout, encabezado, navegación y pie de página
│   └── products/     # Tarjetas, catálogo, detalle, opiniones y formularios
├── context/          # AuthContext y CarritoContext
├── firebase/         # Inicialización de Firebase
├── pages/            # Páginas de carrito, categorías, acceso, registro y panel
├── App.jsx           # Definición de rutas
└── main.jsx          # Montaje de React y proveedores globales
```
