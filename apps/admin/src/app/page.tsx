"use client";

import { useAuth } from "@/components/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, AlertCircle, ArrowRight, Calendar, Clock, DollarSign, FileText, LogOut, TrendingUp, Users } from "lucide-react";
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

      // Obtener el token de auth
      const token = localStorage.getItem("auth_token");
      if (!token) {
        router.push("/auth/signin");
        return;
      }

      // Llamar a la API real
      const response = await fetch("/api/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        setKpiData(result.data.kpiData);
        setRecentActivity(result.data.recentActivity);
      } else {
        console.error("Error loading dashboard data");
        // Fallback a datos básicos
        setKpiData({
          totalStudents: 0,
          activeStudents: 0,
          totalPlans: 0,
          activePlans: 0,
          monthlyRevenue: 0,
          pendingPayments: 0,
          overduePayments: 0,
        });
        setRecentActivity([]);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      // Fallback en caso de error
      setKpiData({
        totalStudents: 0,
        activeStudents: 0,
        totalPlans: 0,
        activePlans: 0,
        monthlyRevenue: 0,
        pendingPayments: 0,
        overduePayments: 0,
      });
      setRecentActivity([]);
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Cargando...</p>
        </div>
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
      value: `${kpiData.activeStudents}`,
      subtitle: `de ${kpiData.totalStudents} totales`,
      change: "+12% este mes",
      changeType: "positive" as const,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Planes Activos",
      value: kpiData.activePlans.toString(),
      subtitle: `${kpiData.totalPlans} planes totales`,
      change: "+2 nuevos",
      changeType: "positive" as const,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Ingresos del Mes",
      value: formatCurrency(kpiData.monthlyRevenue),
      subtitle: "Revenue mensual",
      change: "+8% vs mes anterior",
      changeType: "positive" as const,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Pagos Pendientes",
      value: kpiData.pendingPayments.toString(),
      subtitle: `${kpiData.overduePayments} vencidos`,
      change: kpiData.overduePayments > 0 ? "Requiere atención" : "Todo al día",
      changeType: kpiData.overduePayments > 0 ? ("negative" as const) : ("positive" as const),
      icon: AlertCircle,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
  ];
  if (dataLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>

            {/* KPI Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional content skeletons */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <div className="space-y-1 flex-1">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full rounded-lg" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">¡Bienvenido, {user?.name}!</h1>
            <p className="text-lg text-muted-foreground">Resumen de tu actividad como entrenador personal</p>
          </div>
          <Button onClick={handleLogout} variant="outline" size="lg" className="gap-2">
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>

        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {kpiCards.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <Card key={kpi.title} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                        <div className="space-y-1">
                          <p className="text-2xl font-bold tracking-tight">{kpi.value}</p>
                          {kpi.subtitle && <p className="text-xs text-muted-foreground">{kpi.subtitle}</p>}
                        </div>
                        <Badge variant={kpi.changeType === "positive" ? "default" : "destructive"} className="text-xs">
                          {kpi.change}
                        </Badge>
                      </div>
                      <div className={`${kpi.bgColor} rounded-lg p-3`}>
                        <Icon className={`h-6 w-6 ${kpi.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Actividad Reciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Clock className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No hay actividad reciente</p>
                  </div>
                ) : (
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
                          iconColor = "text-muted-foreground";
                      }

                      const ActivityIcon = icon;

                      return (
                        <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="p-1.5 rounded-full bg-background shadow-sm">
                              <ActivityIcon className={`h-4 w-4 ${iconColor}`} />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <p className="text-sm font-medium leading-5">{activity.message}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(activity.date)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <Button onClick={() => router.push("/students")} variant="ghost" className="h-auto p-4 justify-start hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3 w-full">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium">Gestionar Estudiantes</p>
                        <p className="text-sm text-muted-foreground">Agregar o editar estudiantes</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Button>

                  <Button onClick={() => router.push("/plans/new")} variant="ghost" className="h-auto p-4 justify-start hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3 w-full">
                      <div className="p-2 rounded-lg bg-green-100">
                        <FileText className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium">Crear Plan</p>
                        <p className="text-sm text-muted-foreground">Diseñar nuevo plan de entrenamiento</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Button>

                  <Button onClick={() => router.push("/payments")} variant="ghost" className="h-auto p-4 justify-start hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3 w-full">
                      <div className="p-2 rounded-lg bg-emerald-100">
                        <DollarSign className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium">Registrar Pago</p>
                        <p className="text-sm text-muted-foreground">Gestionar pagos de estudiantes</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Button>

                  <Button onClick={() => router.push("/reports")} variant="ghost" className="h-auto p-4 justify-start hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3 w-full">
                      <div className="p-2 rounded-lg bg-purple-100">
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium">Ver Reportes</p>
                        <p className="text-sm text-muted-foreground">Analizar métricas y estadísticas</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Overview */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Resumen del Mes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-blue-600 tracking-tight">{kpiData.activeStudents}</div>
                  <div className="text-sm text-muted-foreground font-medium">Estudiantes Activos</div>
                  <div className="w-full bg-blue-100 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${kpiData.totalStudents > 0 ? (kpiData.activeStudents / kpiData.totalStudents) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-green-600 tracking-tight">{formatCurrency(kpiData.monthlyRevenue)}</div>
                  <div className="text-sm text-muted-foreground font-medium">Ingresos Generados</div>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    +8% vs mes anterior
                  </Badge>
                </div>

                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-purple-600 tracking-tight">
                    {kpiData.activeStudents > 0 ? formatCurrency(Math.round(kpiData.monthlyRevenue / kpiData.activeStudents)) : formatCurrency(0)}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">Ingreso Promedio por Estudiante</div>
                  <p className="text-xs text-muted-foreground">Calculado sobre estudiantes activos</p>
                </div>
              </div>

              {kpiData.overduePayments > 0 && (
                <>
                  <Separator className="my-6" />
                  <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Atención requerida</p>
                      <p className="text-xs text-amber-600">Tienes {kpiData.overduePayments} pagos vencidos pendientes de gestión</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
