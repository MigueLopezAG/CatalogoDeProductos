# Backend - Catálogo de Productos

API RESTful y GraphQL para el sistema de catálogo de productos, desarrollada con NestJS y MongoDB.

## Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **NestJS** | ^10.0.0 | Framework backend con TypeScript |
| **MongoDB** | ^6.0.0 | Base de datos NoSQL |
| **Mongoose** | ^8.0.0 | ODM para MongoDB |
| **JWT** | ^9.0.0 | Autenticación con tokens |
| **GraphQL** | ^12.0.0 | API GraphQL alternativa |
| **Class Validator** | ^0.14.0 | Validación de DTOs |
| **Bcrypt** | ^5.1.0 | Hash de contraseñas |
| **Axios** | ^1.5.0 | Cliente HTTP para API externa |

## Estructura del Proyecto
backend/
├── src/
│ ├── auth/ # Módulo de autenticación
│ │ ├── dto/ # Data Transfer Objects
│ │ ├── guards/ # Guards de autorización
│ │ ├── strategies/ # Estrategia JWT
│ │ └── schemas/ # Esquemas de usuario
│ ├── products/ # Módulo de productos
│ │ ├── dto/ # DTOs para productos
│ │ ├── schemas/ # Esquemas de producto
│ │ └── services/ # Lógica de negocio
│ ├── app.module.ts # Módulo principal
│ └── main.ts # Punto de entrada
├── test/ # Tests unitarios e integración
└── package.json

## Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- MongoDB 6.0+
- npm o yarn

### Pasos de Instalación

1. **Instalar dependencias**
```bash
cd backend
npm install
```
2. **Configurar variables de entorno**
```bash
cp .env.example .env
```

3. **Configurar .env**
```bash
MONGODB_URI=mongodb://localhost:27017/product-catalog
JWT_SECRET=tu-clave-secreta-super-segura
NODE_ENV=development
```

4. **Ejecutar en desarrollo**
```bash
# Modo desarrollo
npm run start
```
## GraphQL API
También disponible GraphQL en /graphql:

```bash
  query {
    products(filter: { search: "phone", minPrice: 200 }) {
      _id
      title
      price
      brand
    }
    
    product(id: "product-id") {
      title
      description
      price
    }
    
    categories
    brands
  }
```

## Testing

```bash
# Ejecutar tests unitarios
npm run test

# Tests con cobertura
npm run test:cov

# Tests e2e
npm run test:e2e

# Tests en modo watch
npm run test:watch
```