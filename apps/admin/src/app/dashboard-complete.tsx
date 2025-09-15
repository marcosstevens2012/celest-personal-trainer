"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Calendar, DollarSign, FileText, LogOut, TrendingUp, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface KPIData {
  totalStudents: number;
  activeStudents: number;
  totalPlans: number;
  activePlans: number;
  monthlyRevenue: number;
  pendingPayments: number;
  overduePayments: number;
}

interface RecentActivity {
  id: string;
  type: "student" | "plan" | "payment";
  message: string;
  date: string;
}

export default function Dashboard() {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [kpiData, setKpiData] = useState<KPIData>({
    totalStudents: 0,
    activeStudents: 0,
    totalPlans: 0,
    activePlans: 0,
    monthlyRevenue: 0,
    pendingPayments: 0,
    overduePayments: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    // Si no está autenticado, redirigir al login
    if (!loading && !isAuthenticated) {
      router.push("/auth/signin");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    await logout();
    router.push("/auth/signin");
  };

  const loadDashboardData = async () => {
    try {
      setDataLoading(true);

      // Mock data for demonstration - replace with real API calls
      setKpiData({
        totalStudents: 45,
        activeStudents: 38,
        totalPlans: 12,
        activePlans: 8,
        monthlyRevenue: 3200,
        pendingPayments: 5,
        overduePayments: 2,
      });

      setRecentActivity([
        {
          id: "1",
          type: "student",
          message: "Nuevo estudiante registrado: María González",
          date: "2025-09-11T10:30:00Z",
        },
        {
          id: "2",
          type: "payment",
          message: "Pago recibido de Juan Pérez - $80",
          date: "2025-09-11T09:15:00Z",
        },
        {
          id: "3",
          type: "plan",
          message: "Plan 'Fuerza Avanzada' asignado a Carlos Ruiz",
          date: "2025-09-10T16:45:00Z",
        },
        {
          id: "4",
          type: "student",
          message: "Estudiante Ana López completó evaluación inicial",
          date: "2025-09-10T14:20:00Z",
        },
      ]);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
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

  const kpiCards = [
    {
      title: "Estudiantes Activos",
      value: `${kpiData.activeStudents}/${kpiData.totalStudents}`,
      change: "+12% este mes",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Planes Activos",
      value: kpiData.activePlans.toString(),
      change: `${kpiData.totalPlans} planes totales`,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Ingresos del Mes",
      value: formatCurrency(kpiData.monthlyRevenue),
      change: "+8% vs mes anterior",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Pagos Pendientes",
      value: kpiData.pendingPayments.toString(),
      change: `${kpiData.overduePayments} vencidos`,
      icon: AlertCircle,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
  ];

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg h-32"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">¡Bienvenido, {user?.name}!</h1>
            <p className="mt-1 text-lg text-gray-600">Resumen de tu actividad como entrenador personal</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>

        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiCards.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <Card key={kpi.title}>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className={`${kpi.bgColor} rounded-md p-3`}>
                        <Icon className={`h-6 w-6 ${kpi.color}`} />
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                        <p className="text-2xl font-semibold text-gray-900">{kpi.value}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">{kpi.change}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => {
                    let icon;
                    let iconColor;

                    switch (activity.type) {
                      case "student":
                        icon = Users;
                        iconColor = "text-blue-500";
                        break;
                      case "plan":
                        icon = FileText;
                        iconColor = "text-green-500";
                        break;
                      case "payment":
                        icon = DollarSign;
                        iconColor = "text-emerald-500";
                        break;
                      default:
                        icon = Calendar;
                        iconColor = "text-gray-500";
                    }

                    const ActivityIcon = icon;

                    return (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <ActivityIcon className={`h-5 w-5 ${iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500">{formatDate(activity.date)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-blue-500 mr-3" />
                      <span className="text-sm font-medium">Agregar Estudiante</span>
                    </div>
                    <span className="text-xs text-gray-500">→</span>
                  </button>

                  <button className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-sm font-medium">Crear Plan</span>
                    </div>
                    <span className="text-xs text-gray-500">→</span>
                  </button>

                  <button className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-emerald-500 mr-3" />
                      <span className="text-sm font-medium">Registrar Pago</span>
                    </div>
                    <span className="text-xs text-gray-500">→</span>
                  </button>

                  <button className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-purple-500 mr-3" />
                      <span className="text-sm font-medium">Ver Reportes</span>
                    </div>
                    <span className="text-xs text-gray-500">→</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Mes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{kpiData.activeStudents}</div>
                  <div className="text-sm text-gray-600 mt-1">Estudiantes Activos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{formatCurrency(kpiData.monthlyRevenue)}</div>
                  <div className="text-sm text-gray-600 mt-1">Ingresos Generados</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{formatCurrency(Math.round(kpiData.monthlyRevenue / kpiData.activeStudents))}</div>
                  <div className="text-sm text-gray-600 mt-1">Ingreso Promedio por Estudiante</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
