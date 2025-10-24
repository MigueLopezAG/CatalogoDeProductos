## Descripción del Proyecto

Sistema completo de catálogo de productos que permite la gestión de inventarios con control de acceso basado en roles.

### Funcionalidades Principales

- **Autenticación Segura**: Sistema de login con JWT y roles de usuario
- **Control de Acceso**: Diferentes permisos para Administradores y Usuarios
- **Gestión de Productos**: CRUD completo con sincronización externa
- **Búsqueda Avanzada**: Filtros por nombre, precio y categoría 
- **Sincronización**: Integración con API externa DummyJSON

### Arquitectura del Sistema

catalogo-de-productos/
├── backend/ # API REST/GraphQL con NestJS
├── frontend/ # Interfaz web con Next.js 13
└── README.md # Este archivo

### Stack Tecnológico

| Capa | Tecnologías |
|------|-------------|
| **Backend** | NestJS, MongoDB, Mongoose, JWT, GraphQL |
| **Frontend** | Next.js 13, TypeScript, Tailwind CSS, React Query |
| **Base de Datos** | MongoDB con Mongoose ODM |
| **Autenticación** | JWT (JSON Web Tokens) |
| **API Externa** | DummyJSON Products API |

### Roles de Usuario

#### Administrador
- Crear, editar y eliminar productos
- Sincronizar productos con API externa
- Acceso completo al sistema

#### Usuario Regular
- Ver listado de productos
- Buscar y filtrar productos
- Ver detalles de productos

### Inicio Rápido

```bash
# Clonar el proyecto
git clone <repository-url>
cd catalogo-de-productos

# Configurar backend
cd backend
npm install
npm run start:dev

# Configurar frontend (en otra terminal)
cd frontend
npm install
npm run dev

```
#### Documentación Detallada
Backend Documentation - Instalación y API

Frontend Documentation - Guía de desarrollo

#### Endpoints Principales
Autenticación
POST /auth/login - Iniciar sesión

POST /auth/register - Registrar usuario

Productos
GET /products - Listar productos (con filtros)

GET /products/:id - Obtener producto específico

POST /products - Crear producto (Admin)

PUT /products/:id - Actualizar producto (Admin)

DELETE /products/:id - Eliminar producto (Admin)

POST /products/sync - Sincronizar con API externa (Admin)

#### Seguridad
Autenticación JWT con expiración

Validación de datos en backend y frontend

Protección de rutas por roles

Sanitización de inputs

#### Características Técnicas
TypeScript: Tipado estático en todo el proyecto

GraphQL: Alternativa a REST para consultas flexibles

MongoDB: Base de datos NoSQL para flexibilidad

Tailwind CSS: Utility-first CSS framework

React Query: Gestión de estado del servidor

