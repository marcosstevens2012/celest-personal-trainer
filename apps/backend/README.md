# Personal Trainer Backend API

Backend API para la plataforma de entrenamiento personal, construida con Next.js 14 y Prisma ORM.

## Estructura de la Base de Datos

### Modelos Principales

- **Trainers**: Entrenadores personales
- **Students**: Estudiantes/clientes de los entrenadores
- **Plans**: Planes de entrenamiento
- **PlanDays**: Días específicos dentro de un plan
- **PlanBlocks**: Bloques de ejercicios dentro de un día
- **PlanItems**: Ejercicios individuales dentro de un bloque
- **Payments**: Pagos y facturación

## Endpoints de la API

### 🏋️ Trainers (`/api/trainers`)

| Método | Endpoint                | Descripción                         |
| ------ | ----------------------- | ----------------------------------- |
| GET    | `/api/trainers`         | Lista todos los entrenadores        |
| GET    | `/api/trainers?id={id}` | Obtiene un entrenador específico    |
| POST   | `/api/trainers`         | Crea un nuevo entrenador            |
| PUT    | `/api/trainers?id={id}` | Actualiza un entrenador             |
| DELETE | `/api/trainers?id={id}` | Elimina un entrenador (soft delete) |

#### Parámetros de consulta para GET:

- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)
- `search`: Búsqueda por nombre, email o bio
- `isActive`: Filtrar por estado activo (true/false)
- `specialization`: Filtrar por especialización

### 👥 Students (`/api/students`)

| Método | Endpoint                       | Descripción                         |
| ------ | ------------------------------ | ----------------------------------- |
| GET    | `/api/students?trainerId={id}` | Lista estudiantes de un entrenador  |
| POST   | `/api/students`                | Crea un nuevo estudiante            |
| PUT    | `/api/students?id={id}`        | Actualiza un estudiante             |
| DELETE | `/api/students?id={id}`        | Elimina un estudiante (soft delete) |

#### Parámetros de consulta para GET:

- `trainerId`: ID del entrenador (requerido)
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)
- `search`: Búsqueda por nombre o email
- `isActive`: Filtrar por estado activo (true/false)

### 📋 Plans (`/api/plans`)

| Método | Endpoint                    | Descripción                   |
| ------ | --------------------------- | ----------------------------- |
| GET    | `/api/plans?trainerId={id}` | Lista planes de un entrenador |
| POST   | `/api/plans`                | Crea un nuevo plan            |
| PUT    | `/api/plans?id={id}`        | Actualiza un plan             |
| DELETE | `/api/plans?id={id}`        | Elimina un plan (soft delete) |

#### Parámetros de consulta para GET:

- `trainerId`: ID del entrenador (requerido)
- `studentId`: Filtrar por estudiante específico
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)
- `search`: Búsqueda por nombre o descripción
- `planType`: Filtrar por tipo de plan (PERSONAL, GROUP, ONLINE)
- `difficultyLevel`: Filtrar por dificultad (BEGINNER, INTERMEDIATE, ADVANCED)

### 📅 Plan Days (`/api/plans/days`)

| Método | Endpoint                      | Descripción               |
| ------ | ----------------------------- | ------------------------- |
| GET    | `/api/plans/days?planId={id}` | Lista días de un plan     |
| POST   | `/api/plans/days`             | Crea un nuevo día de plan |
| PUT    | `/api/plans/days?id={id}`     | Actualiza un día de plan  |
| DELETE | `/api/plans/days?id={id}`     | Elimina un día de plan    |

### 🏗️ Plan Blocks (`/api/plans/days/blocks`)

| Método | Endpoint                                | Descripción             |
| ------ | --------------------------------------- | ----------------------- |
| GET    | `/api/plans/days/blocks?planDayId={id}` | Lista bloques de un día |
| POST   | `/api/plans/days/blocks`                | Crea un nuevo bloque    |
| PUT    | `/api/plans/days/blocks?id={id}`        | Actualiza un bloque     |
| DELETE | `/api/plans/days/blocks?id={id}`        | Elimina un bloque       |

### 💪 Plan Items (`/api/plans/days/blocks/items`)

| Método | Endpoint                                        | Descripción                   |
| ------ | ----------------------------------------------- | ----------------------------- |
| GET    | `/api/plans/days/blocks/items?planBlockId={id}` | Lista ejercicios de un bloque |
| POST   | `/api/plans/days/blocks/items`                  | Crea un nuevo ejercicio       |
| PUT    | `/api/plans/days/blocks/items?id={id}`          | Actualiza un ejercicio        |
| DELETE | `/api/plans/days/blocks/items?id={id}`          | Elimina un ejercicio          |

### 💰 Payments (`/api/payments`)

| Método | Endpoint                | Descripción        |
| ------ | ----------------------- | ------------------ |
| GET    | `/api/payments`         | Lista pagos        |
| POST   | `/api/payments`         | Crea un nuevo pago |
| PUT    | `/api/payments?id={id}` | Actualiza un pago  |
| DELETE | `/api/payments?id={id}` | Elimina un pago    |

#### Parámetros de consulta para GET:

- `trainerId`: ID del entrenador (para ver pagos de sus estudiantes)
- `studentId`: ID del estudiante específico
- `status`: Estado del pago (PENDING, PAID, OVERDUE, CANCELLED)
- `startDate`: Fecha de inicio para filtrar
- `endDate`: Fecha de fin para filtrar
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)

## Ejemplos de Uso

### Crear un nuevo estudiante

```bash
curl -X POST http://localhost:3001/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "trainerId": "trainer-uuid",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "+34612345678",
    "goals": ["Perder peso", "Ganar músculo"],
    "medicalConditions": "Ninguna conocida"
  }'
```

### Crear un nuevo plan

```bash
curl -X POST http://localhost:3001/api/plans \
  -H "Content-Type: application/json" \
  -d '{
    "trainerId": "trainer-uuid",
    "name": "Plan de Fuerza Básico",
    "description": "Plan para principiantes enfocado en fuerza",
    "price": 99.99,
    "planType": "PERSONAL",
    "difficultyLevel": "BEGINNER",
    "features": ["3 días por semana", "Ejercicios básicos", "Seguimiento personalizado"]
  }'
```

### Crear un día de plan

```bash
curl -X POST http://localhost:3001/api/plans/days \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "plan-uuid",
    "dayNumber": 1,
    "name": "Día 1 - Tren Superior",
    "description": "Enfoque en pecho, espalda y brazos"
  }'
```

### Crear un bloque de ejercicios

```bash
curl -X POST http://localhost:3001/api/plans/days/blocks \
  -H "Content-Type: application/json" \
  -d '{
    "planDayId": "planday-uuid",
    "name": "Calentamiento",
    "blockType": "WARMUP",
    "order": 0,
    "restBetweenSets": 30
  }'
```

### Crear un ejercicio específico

```bash
curl -X POST http://localhost:3001/api/plans/days/blocks/items \
  -H "Content-Type: application/json" \
  -d '{
    "planBlockId": "planblock-uuid",
    "exerciseName": "Press de banca",
    "exerciseType": "STRENGTH",
    "sets": 3,
    "reps": "8-12",
    "weight": "70% 1RM",
    "restTime": 120,
    "order": 0,
    "equipment": ["Barra olímpica", "Banco"],
    "targetMuscles": ["Pecho", "Tríceps", "Deltoides anterior"]
  }'
```

## Configuración del Entorno

Copia el archivo `.env.example` a `.env.local` y configura las variables:

```bash
cp .env.example .env.local
```

### Variables Importantes

- `DATABASE_URL`: URL de conexión a PostgreSQL/Supabase
- `SUPABASE_URL`: URL de tu proyecto Supabase
- `SUPABASE_ANON_KEY`: Clave anónima de Supabase
- `NEXTAUTH_SECRET`: Secreto para NextAuth.js

## Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Ejecutar migraciones de Prisma
npx prisma migrate dev

# Generar cliente de Prisma
npx prisma generate

# Reiniciar base de datos (desarrollo)
npx prisma migrate reset

# Abrir Prisma Studio
npx prisma studio
```

## Estructura de Respuestas

Todas las respuestas siguen el siguiente formato:

### Respuesta Exitosa

```json
{
  "success": true,
  "data": {
    /* datos solicitados */
  },
  "message": "Operación completada exitosamente",
  "pagination": {
    /* solo para endpoints con paginación */ "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### Respuesta de Error

```json
{
  "success": false,
  "error": "Descripción del error",
  "details": [
    /* detalles adicionales si es error de validación */
  ]
}
```

## Validación

Todos los endpoints utilizan **Zod** para validación de datos de entrada. Los errores de validación devuelven un código 400 con detalles específicos de los campos que fallaron.

## Base de Datos

El proyecto utiliza **Prisma ORM** con **PostgreSQL** (via Supabase). El esquema está definido en `prisma/schema.prisma`.

### Relaciones Principales

- Un **Trainer** puede tener muchos **Students** y **Plans**
- Un **Student** puede tener muchos **Plans** y **Payments**
- Un **Plan** pertenece a un **Trainer** y puede tener un **Student** asignado
- Un **Plan** tiene muchos **PlanDays**
- Un **PlanDay** tiene muchos **PlanBlocks**
- Un **PlanBlock** tiene muchos **PlanItems**

## Puerto de Desarrollo

El backend se ejecuta en: `http://localhost:3001`
