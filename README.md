# 🏋️‍♂️ Celest Personal Trainer Platform

A comprehensive personal training management platform built with modern web technologies. This monorepo contains all the applications needed to run a complete personal training business.

## 🚀 Applications

### Monorepo Structure

```
celest-personal-trainer/
├── apps/
│   ├── backend/     # API central (Next.js API routes)
│   ├── admin/       # Panel del entrenador (Next.js)
│   └── landing/     # Landing institucional (Next.js SSG)
├── packages/
│   ├── ui/          # Componentes UI compartidos (ShadCN + Tailwind)
│   ├── config/      # Configuración compartida
│   └── types/       # Definiciones TypeScript
```

### Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS + ShadCN/UI
- **Database**: Supabase/PostgreSQL
- **ORM**: Prisma
- **Monorepo**: Turborepo
- **Deploy**: Vercel
- **Language**: TypeScript

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- npm 9+

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd celest-personal-trainer

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
```

### Desarrollo

```bash
# Ejecutar todas las aplicaciones
npm run dev

# Ejecutar aplicación específica
npm run dev --filter=@repo/admin
npm run dev --filter=@repo/backend
npm run dev --filter=@repo/landing
```

### Build

```bash
# Build todas las aplicaciones
npm run build

# Build aplicación específica
npm run build --filter=@repo/admin
```

## 📱 Aplicaciones

### Backend (Puerto 3001)

API central con Next.js API Routes

- Gestión de estudiantes
- Gestión de planes
- Sistema de pagos
- Autenticación

### Admin Panel (Puerto 3000)

Panel de administración para el entrenador

- Dashboard con estadísticas
- ABM de estudiantes
- Gestión de planes
- Seguimiento de pagos
- Generación de links de WhatsApp
- Importador CSV

### Landing Page (Puerto 3002)

Sitio web institucional

- Página de inicio optimizada para SEO
- Presentación de servicios
- Planes y precios
- Formulario de contacto
- Integración con WhatsApp

## 📦 Packages

### @repo/ui

Librería de componentes UI compartidos

- Componentes base de ShadCN
- Estilos personalizados con Tailwind
- Sistema de tokens de diseño

### @repo/types

Definiciones TypeScript compartidas

- Modelos de datos
- DTOs para APIs
- Tipos de respuesta

### @repo/config

Configuración compartida

- Variables de entorno
- Configuración de Tailwind
- Settings de la aplicación

## 🗄️ Base de Datos

### Esquema Principal

- **Trainers**: Datos del entrenador
- **Students**: Información de estudiantes
- **Plans**: Planes de entrenamiento
- **StudentPlans**: Relación estudiante-plan
- **Payments**: Gestión de pagos
- **Workouts**: Rutinas de ejercicio
- **Progress**: Seguimiento de progreso

### Configuración Prisma

```bash
# Generar cliente Prisma
cd apps/backend
npx prisma generate

# Aplicar migraciones
npx prisma db push

# Abrir Prisma Studio
npx prisma studio
```

## 🌍 Variables de Entorno

Crear archivo `.env.local` en la raíz:

```env
# Database
DATABASE_URL="postgresql://..."

# Supabase
SUPABASE_URL="https://..."
SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."

# NextAuth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
```

## 📋 Scripts Disponibles

```bash
# Desarrollo
npm run dev           # Ejecutar todas las apps
npm run dev:admin     # Solo panel admin
npm run dev:backend   # Solo backend
npm run dev:landing   # Solo landing

# Build
npm run build         # Build todas las apps
npm run build:admin   # Solo panel admin

# Linting y formato
npm run lint          # Lint todas las apps
npm run format        # Formatear código
npm run type-check    # Verificar tipos

# Base de datos
npm run db:generate   # Generar cliente Prisma
npm run db:push       # Aplicar cambios de schema
npm run db:studio     # Abrir Prisma Studio
```

## 🚀 Deployment

### Vercel (Recomendado)

1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático en cada push

### Configuración por aplicación:

- **Admin**: `/apps/admin`
- **Landing**: `/apps/landing`
- **Backend**: `/apps/backend`

## 🎯 Funcionalidades MVP

### Panel Admin

- [x] Dashboard con estadísticas
- [x] Gestión de estudiantes (CRUD)
- [x] Gestión de planes
- [x] Sistema de pagos
- [ ] Generador de links WhatsApp
- [ ] Importador CSV
- [ ] Reportes mensuales

### Landing Page

- [x] Hero section
- [x] Sección de servicios
- [x] Planes y precios
- [x] Formulario de contacto
- [ ] Testimonios
- [ ] Blog/Artículos
- [ ] SEO optimización

### Backend API

- [x] Autenticación
- [x] API de estudiantes
- [x] API de planes
- [x] API de pagos
- [ ] API de rutinas
- [ ] API de progreso
- [ ] Integración WhatsApp

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

Para soporte técnico o preguntas:

- Crear un issue en GitHub
- Email: soporte@celestpersonaltrainer.com
- WhatsApp: +1234567890
