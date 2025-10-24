# Frontend - Catálogo de Productos

Interfaz web moderna desarrollada con Next.js 13 para el sistema de catálogo de productos.

## Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Next.js** | 13.5+ | React framework con App Router |
| **TypeScript** | ^5.0.0 | Tipado estático |
| **Tailwind CSS** | ^3.3.0 | Framework CSS utility-first |
| **React Query** | ^4.32.0 | Gestión de estado del servidor |
| **Axios** | ^1.5.0 | Cliente HTTP para API |
| **Headless UI** | ^1.7.0 | Componentes UI accesibles |

## Características de la UI

- **App Router**: Nuevo sistema de routing de Next.js 13
- **Responsive Design**: Compatible con todos los dispositivos
- **Design System**: Consistente con Tailwind CSS
- **Performance**: Optimizado con React Query y caching
- **Seguridad**: Protección de rutas y manejo de tokens

## Estructura del Proyecto
frontend/
├── src/
│ ├── app/ # App Router (Next.js 13)
│ │ ├── dashboard/ # Dashboard principal
│ │ ├── login/ # Página de login
│ │ ├── register/ # Página de registro
│ │ ├── products/ # Gestión de productos
│ │ │ ├── [id]/ # Detalle de producto (dinámico)
│ │ │ └── create/ # Crear producto (admin)
│ │ ├── layout.tsx # Layout principal
│ │ └── page.tsx # Página de inicio
│ ├── components/ # Componentes reutilizables
│ │ ├── layout/ # Componentes de layout
│ │ └── ui/ # Componentes UI básicos
│ ├── context/ # React Context
│ │ └── AuthContext.tsx # Context de autenticación
│ ├── lib/ # Utilidades y configuraciones
│ │ ├── api.ts # Configuración de Axios
│ │ ├── auth.ts # Servicios de autenticación
│ │ └── products.ts # Servicios de productos
│ └── types/ # Definiciones TypeScript
│ └── index.ts # Tipos globales
├── public/ # Archivos estáticos
└── package.json

text

## Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- Backend ejecutándose en puerto 3000

### Pasos de Instalación

1. **Instalar dependencias**
```bash
cd frontend
npm install
```
2 **Configurar variables de entorno**


```bash
cp .env.local.example .env.local
```
3 **Configurar .env.local**


```bash
NEST_PUBLIC_API_URL=http://localhost:3000
```
## Páginas y Rutas
### Públicas
/ - Página de inicio (landing)

/login - Inicio de sesión

/register - Registro de usuarios

### Protegidas
/dashboard - Dashboard principal

/products - Lista de productos

/products/[id] - Detalle de producto

/products/create - Crear producto (solo admin)

/products/[id]/edit - Editar producto (solo admin)

## Sistema de Autenticación
### AuthContext
Context global que maneja el estado de autenticación:


```bash
const { user, login, register, logout, isLoading } = useAuth()
```

### Protección de Rutas
Las rutas protegidas redirigen automáticamente al login si el usuario no está autenticado.

## Gestión de Estado
### React Query
Para el estado del servidor y caching:

```bash
// Ejemplo: Obtener productos con filtros
const { data, isLoading, error } = useQuery({
  queryKey: ['products', filters],
  queryFn: () => productService.getProducts(filters)
})

// Ejemplo: Mutación para crear producto
const mutation = useMutation({
  mutationFn: productService.createProduct,
  onSuccess: () => {
    queryClient.invalidateQueries(['products'])
  }
})
```
## Componentes Principales
### Navbar
Barra de navegación responsive con:

Logo y nombre de la app

Menú de navegación según rol

Botón de logout

### ProductList
Lista de productos con:

Paginación

Filtros por nombre y precio

Cards responsivas

Acciones según rol de usuario

### ProductForm
Formulario para crear/editar productos con validación.

### Integración con API
Servicios Implementados
### Auth Service

```bash
authService.login({ email, password })
authService.register({ email, password, role })
```
### Products Service

```bash
productService.getProducts(filters)
productService.getProduct(id)
productService.createProduct(productData)
productService.updateProduct(id, productData)
productService.deleteProduct(id)
productService.getCategories()
productService.getBrands()

```
### Interceptores Axios
Request: Agrega automáticamente token JWT

Response: Maneja errores de autenticación (redirige al login)