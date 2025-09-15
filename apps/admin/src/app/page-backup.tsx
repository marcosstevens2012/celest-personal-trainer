"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si no está autenticado, redirigir al login
    if (!loading && !isAuthenticated) {
      router.push("/auth/signin");
    }
  }, [loading, isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/auth/signin");
  };

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si no está autenticado, no mostrar nada (se redirige)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              ¡Bienvenido, {user?.name}!
            </h1>
            <p className="text-gray-600 mt-1">
              Panel de administración de Celest Personal Trainer
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Cerrar Sesión
          </Button>
        </div>

        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Usuario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Nombre</p>
                <p className="text-base text-gray-900">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-base text-gray-900">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Rol</p>
                <p className="text-base text-gray-900 capitalize">
                  {user?.role}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">ID</p>
                <p className="text-base text-gray-900 font-mono">{user?.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">Estudiantes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Gestionar estudiantes y clientes</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">Planes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Crear y administrar planes de entrenamiento
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">Pagos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Control de pagos y facturación</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">Reportes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Estadísticas y reportes</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">Configuración</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Ajustes del perfil y preferencias</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-sm text-gray-600">Estudiantes Activos</div>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="text-2xl font-bold text-green-600">8</div>
            <div className="text-sm text-gray-600">Planes Vigentes</div>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="text-2xl font-bold text-orange-600">$45,000</div>
            <div className="text-sm text-gray-600">Ingresos del Mes</div>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="text-2xl font-bold text-purple-600">95%</div>
            <div className="text-sm text-gray-600">Satisfacción</div>
          </div>
        </div>
      </div>
    </div>
  );
}
