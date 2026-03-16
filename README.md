# Price Controller Backend

## Descripción

API REST desarrollada con NestJS para la gestión de precios de productos con conversión automática de divisas (USD a VES). El sistema permite controlar el inventario de productos, organizarlos por categorías, configurar márgenes de ganancia tanto globales como individuales, y mantener un historial completo de los cambios de precios. Incluye actualización automática de tasas de cambio y exportación de datos a Excel.

## Tecnologías

- **NestJS**: Framework principal para la API
- **PostgreSQL**: Base de datos relacional
- **Prisma**: ORM para manejo de base de datos
- **JWT + Passport**: Sistema de autenticación
- **class-validator**: Validación de datos
- **XLSX**: Exportación a Excel
- **Docker**: Containerización

## Requisitos Previos

- Node.js v18 o superior
- PostgreSQL (local o remoto)
- pnpm (gestor de paquetes recomendado)

## Instalación

1. Clonar el repositorio e instalar dependencias:

```bash
pnpm install
```

2. Configurar variables de entorno creando un archivo `.env` en la raíz:

```env
DATABASE_URL="tu-url-de-base-de-datos"
JWT_SECRET="tu-clave-secreta-segura"
PORT=3000
```

3. Ejecutar migraciones de Prisma para crear las tablas:

```bash
pnpm prisma migrate dev
```

4. (Opcional) Poblar la base de datos con datos iniciales:

```bash
pnpm run prisma:seed
```

## Ejecución

### Modo Desarrollo
Inicia el servidor con hot-reload:
```bash
pnpm run start:dev
```
La API estará disponible en `http://localhost:3000`

### Modo Producción
Compilar y ejecutar:
```bash
pnpm run build
pnpm run start:prod
```

### Con Docker
Levantar contenedores de la aplicación y base de datos:
```bash
docker-compose up -d
```

## Estructura del Proyecto

```
src/
├── auth/              # Autenticación y autorización con JWT
├── categories/        # CRUD de categorías de productos
├── global-profit/     # Gestión del margen de ganancia global
├── history-prices/    # Registro histórico de cambios de precios
├── products/          # CRUD de productos y cálculo de precios
├── rates/             # Tasas de cambio USD/VES
├── users/             # Gestión de usuarios del sistema
└── prisma/            # Configuración y cliente de Prisma
```

Cada módulo contiene su controlador, servicio y módulo siguiendo la arquitectura de NestJS.

## API Endpoints

### Autenticación
- `POST /auth/login` - Iniciar sesión y obtener token JWT
- `POST /auth/register` - Registrar nuevo usuario

### Productos
- `GET /products` - Listar todos los productos
- `GET /products/:id` - Obtener un producto específico
- `POST /products` - Crear nuevo producto
- `PATCH /products/:id` - Actualizar producto existente
- `DELETE /products/:id` - Eliminar producto (soft delete)
- `POST /products/import-excel` - Importar productos desde Excel

### Categorías
- `GET /categories` - Listar todas las categorías
- `POST /categories` - Crear nueva categoría
- `PATCH /categories/:id` - Actualizar categoría
- `DELETE /categories/:id` - Eliminar categoría

### Tasas de Cambio
- `POST /rates` - Obtener tasa de cambio actual y crear registro
- `GET /rates/actual` - Obtener tasa de cambio actual
- `SSE /rates/cron-update` - Endpoint SSE para notificaciones de actualización automática

### Margen de Ganancia Global
- `GET /global-margin` - Obtener margen global actual
- `POST /global-margin` - Actualizar margen global

## Scripts Disponibles

```bash
pnpm run start:dev      # Inicia servidor en modo desarrollo con hot-reload
pnpm run build          # Compila el proyecto TypeScript a JavaScript
pnpm run start:prod     # Ejecuta la versión compilada en producción
pnpm run lint           # Ejecuta ESLint para verificar código
pnpm run format         # Formatea código con Prettier
pnpm run test           # Ejecuta tests unitarios con Jest
pnpm run prisma:seed    # Pobla la base de datos con datos de prueba
```

## Características Destacadas

- Conversión automática de precios USD a VES basada en tasa de cambio actual
- Cálculo automático de precio final aplicando margen de ganancia
- Sistema de autenticación con JWT y cookies
- Validación de datos con decoradores de class-validator
- Soft deletes para mantener integridad de datos
- Importación de inventario mediante archivo Excel
