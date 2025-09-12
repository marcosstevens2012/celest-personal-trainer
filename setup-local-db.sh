#!/bin/bash

echo "🚀 Configurando base de datos local para desarrollo..."

# Backup current files
echo "📦 Creando backup de archivos actuales..."
cp .env.local .env.local.backup 2>/dev/null || echo "No .env.local found"
cp apps/backend/prisma/schema.prisma apps/backend/prisma/schema.prisma.backup

# Use temporary configurations
echo "⚙️ Configurando archivos temporales..."
cp .env.local.temp .env.local
cp apps/backend/prisma/schema-sqlite.prisma apps/backend/prisma/schema.prisma

# Go to backend directory
cd apps/backend

echo "🗄️ Generando cliente Prisma..."
npx prisma generate

echo "🔄 Creando base de datos..."
npx prisma db push --force-reset

echo "📚 Insertando datos de ejemplo..."
npm run db:seed

echo "✅ ¡Base de datos local configurada!"
echo ""
echo "🌐 Puedes iniciar la aplicación con:"
echo "   npm run dev"
echo ""
echo "📱 URLs disponibles:"
echo "   Admin Panel:  http://localhost:3000"
echo "   Backend API:  http://localhost:3001" 
echo "   Landing:      http://localhost:3002"
echo ""
echo "🔄 Para volver a Supabase más tarde:"
echo "   1. Configura tu contraseña en .env.local"
echo "   2. Restaura schema.prisma desde el backup"
echo "   3. Ejecuta: cd apps/backend && npm run db:push && npm run db:seed"
