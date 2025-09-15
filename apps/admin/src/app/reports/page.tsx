"use client";

import { Card } from "@repo/ui";
import { Activity, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";

interface MonthlyStats {
  month: string;
  students: number;
  revenue: number;
  plans: number;
  payments: number;
}

interface PaymentStats {
  paid: number;
  pending: number;
  overdue: number;
  total: number;
}

export default function ReportsPage() {
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [paymentStats, setPaymentStats] = useState<PaymentStats>({
    paid: 0,
    pending: 0,
    overdue: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("last_6_months");

  useEffect(() => {
    loadReportsData();
  }, [selectedPeriod]);

  const loadReportsData = async () => {
    try {
      setLoading(true);

      // Mock data for demonstration
      const mockMonthlyStats: MonthlyStats[] = [
        {
          month: "Mar 2025",
          students: 32,
          revenue: 2800,
          plans: 8,
          payments: 28,
        },
        {
          month: "Apr 2025",
          students: 35,
          revenue: 3100,
          plans: 9,
          payments: 31,
        },
        {
          month: "May 2025",
          students: 38,
          revenue: 3400,
          plans: 10,
          payments: 35,
        },
        {
          month: "Jun 2025",
          students: 41,
          revenue: 3600,
          plans: 11,
          payments: 38,
        },
        {
          month: "Jul 2025",
          students: 39,
          revenue: 3300,
          plans: 10,
          payments: 36,
        },
        {
          month: "Aug 2025",
          students: 42,
          revenue: 3800,
          plans: 12,
          payments: 40,
        },
      ];

      const mockPaymentStats: PaymentStats = {
        paid: 156,
        pending: 12,
        overdue: 3,
        total: 171,
      };

      setMonthlyStats(mockMonthlyStats);
      setPaymentStats(mockPaymentStats);
    } catch (error) {
      console.error("Error loading reports data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const currentMonth = monthlyStats[monthlyStats.length - 1];
  const previousMonth = monthlyStats[monthlyStats.length - 2];

  const growthStats =
    currentMonth && previousMonth
      ? {
          students: calculateGrowth(currentMonth.students, previousMonth.students),
          revenue: calculateGrowth(currentMonth.revenue, previousMonth.revenue),
          plans: calculateGrowth(currentMonth.plans, previousMonth.plans),
          payments: calculateGrowth(currentMonth.payments, previousMonth.payments),
        }
      : { students: 0, revenue: 0, plans: 0, payments: 0 };

  const totalRevenue = monthlyStats.reduce((sum, month) => sum + month.revenue, 0);
  const averageRevenue = totalRevenue / monthlyStats.length;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reportes y Análisis</h1>
            <p className="mt-1 text-sm text-gray-600">Analiza el rendimiento de tu negocio de entrenamiento personal</p>
          </div>
          <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-md text-sm">
            <option value="last_3_months">Últimos 3 meses</option>
            <option value="last_6_months">Últimos 6 meses</option>
            <option value="last_year">Último año</option>
          </select>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Estudiantes Activos</p>
                <p className="text-2xl font-bold text-gray-900">{currentMonth?.students || 0}</p>
              </div>
              <div className={`flex items-center ${growthStats.students >= 0 ? "text-green-600" : "text-red-600"}`}>
                {growthStats.students >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                <span className="text-sm font-medium">{Math.abs(growthStats.students).toFixed(1)}%</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">vs mes anterior</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ingresos Mensuales</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentMonth?.revenue || 0)}</p>
              </div>
              <div className={`flex items-center ${growthStats.revenue >= 0 ? "text-green-600" : "text-red-600"}`}>
                {growthStats.revenue >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                <span className="text-sm font-medium">{Math.abs(growthStats.revenue).toFixed(1)}%</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">vs mes anterior</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Planes Activos</p>
                <p className="text-2xl font-bold text-gray-900">{currentMonth?.plans || 0}</p>
              </div>
              <div className={`flex items-center ${growthStats.plans >= 0 ? "text-green-600" : "text-red-600"}`}>
                {growthStats.plans >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                <span className="text-sm font-medium">{Math.abs(growthStats.plans).toFixed(1)}%</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">vs mes anterior</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ingreso por Estudiante</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentMonth ? currentMonth.revenue / currentMonth.students : 0)}</p>
              </div>
              <div className="text-blue-600">
                <Activity className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">promedio mensual</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tendencia de Ingresos</h3>
            <div className="space-y-4">
              {monthlyStats.map((month, index) => (
                <div key={month.month} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-gray-700">{month.month}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{formatCurrency(month.revenue)}</div>
                    <div className="text-xs text-gray-500">{month.students} estudiantes</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Promedio mensual:</span>
                <span className="font-medium text-gray-900">{formatCurrency(averageRevenue)}</span>
              </div>
            </div>
          </Card>

          {/* Payment Status */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Estado de Pagos</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">Pagados</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">{paymentStats.paid}</div>
                  <div className="text-xs text-gray-500">{((paymentStats.paid / paymentStats.total) * 100).toFixed(1)}%</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">Pendientes</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">{paymentStats.pending}</div>
                  <div className="text-xs text-gray-500">{((paymentStats.pending / paymentStats.total) * 100).toFixed(1)}%</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">Vencidos</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">{paymentStats.overdue}</div>
                  <div className="text-xs text-gray-500">{((paymentStats.overdue / paymentStats.total) * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total de pagos:</span>
                <span className="font-medium text-gray-900">{paymentStats.total}</span>
              </div>
            </div>
          </Card>

          {/* Top Performing Plans */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Planes Más Populares</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="text-sm font-medium text-gray-900">Plan de Fuerza Básico</div>
                  <div className="text-xs text-gray-500">18 estudiantes</div>
                </div>
                <div className="text-sm font-semibold text-green-600">{formatCurrency(99.99)}</div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="text-sm font-medium text-gray-900">Cardio Intensivo</div>
                  <div className="text-xs text-gray-500">12 estudiantes</div>
                </div>
                <div className="text-sm font-semibold text-green-600">{formatCurrency(79.99)}</div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="text-sm font-medium text-gray-900">Tonificación Femenina</div>
                  <div className="text-xs text-gray-500">8 estudiantes</div>
                </div>
                <div className="text-sm font-semibold text-green-600">{formatCurrency(89.99)}</div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="text-sm font-medium text-gray-900">Powerlifting Avanzado</div>
                  <div className="text-xs text-gray-500">4 estudiantes</div>
                </div>
                <div className="text-sm font-semibold text-green-600">{formatCurrency(149.99)}</div>
              </div>
            </div>
          </Card>

          {/* Student Retention */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Retención de Estudiantes</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Estudiantes nuevos este mes:</span>
                <span className="text-sm font-semibold text-green-600">+7</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Estudiantes que se dieron de baja:</span>
                <span className="text-sm font-semibold text-red-600">-2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tasa de retención:</span>
                <span className="text-sm font-semibold text-blue-600">94.7%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tiempo promedio como cliente:</span>
                <span className="text-sm font-semibold text-gray-900">8.3 meses</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <strong className="text-gray-900">Insight:</strong> Tu tasa de retención está por encima del promedio de la industria (85%).
              </div>
            </div>
          </Card>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{formatCurrency(totalRevenue)}</div>
            <div className="text-sm text-gray-600">Ingresos Totales (6 meses)</div>
          </Card>

          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{Math.round(monthlyStats.reduce((sum, month) => sum + month.students, 0) / monthlyStats.length)}</div>
            <div className="text-sm text-gray-600">Promedio Estudiantes Activos</div>
          </Card>

          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{Math.round((paymentStats.paid / paymentStats.total) * 100)}%</div>
            <div className="text-sm text-gray-600">Tasa de Pagos Exitosos</div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
