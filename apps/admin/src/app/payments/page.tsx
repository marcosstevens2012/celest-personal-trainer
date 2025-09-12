"use client";

import {
  Badge,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@repo/ui";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  Plus,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";

interface Payment {
  id: string;
  studentName: string;
  planName: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  dueDate: string;
  paidDate?: string;
  method?: "card" | "transfer" | "cash";
  invoiceNumber: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "paid" | "pending" | "overdue"
  >("all");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [payments, searchTerm, statusFilter]);

  const loadPayments = async () => {
    try {
      setLoading(true);

      // Mock data for demonstration
      const mockPayments: Payment[] = [
        {
          id: "1",
          studentName: "María García",
          planName: "Plan de Fuerza Básico",
          amount: 99.99,
          status: "paid",
          dueDate: "2025-01-15",
          paidDate: "2025-01-14",
          method: "card",
          invoiceNumber: "INV-2025-001",
        },
        {
          id: "2",
          studentName: "Carlos López",
          planName: "Cardio Intensivo",
          amount: 79.99,
          status: "pending",
          dueDate: "2025-01-20",
          invoiceNumber: "INV-2025-002",
        },
        {
          id: "3",
          studentName: "Ana Martínez",
          planName: "Tonificación Femenina",
          amount: 89.99,
          status: "overdue",
          dueDate: "2025-01-10",
          invoiceNumber: "INV-2025-003",
        },
        {
          id: "4",
          studentName: "Pedro Rodríguez",
          planName: "Powerlifting Avanzado",
          amount: 149.99,
          status: "paid",
          dueDate: "2025-01-18",
          paidDate: "2025-01-17",
          method: "transfer",
          invoiceNumber: "INV-2025-004",
        },
        {
          id: "5",
          studentName: "Laura Sánchez",
          planName: "Plan de Fuerza Básico",
          amount: 99.99,
          status: "pending",
          dueDate: "2025-01-25",
          invoiceNumber: "INV-2025-005",
        },
        {
          id: "6",
          studentName: "Javier Fernández",
          planName: "Cardio Intensivo",
          amount: 79.99,
          status: "paid",
          dueDate: "2025-01-12",
          paidDate: "2025-01-11",
          method: "cash",
          invoiceNumber: "INV-2025-006",
        },
      ];

      setPayments(mockPayments);
    } catch (error) {
      console.error("Error loading payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterPayments = () => {
    let filtered = payments;

    if (searchTerm) {
      filtered = filtered.filter(
        (payment) =>
          payment.studentName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          payment.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((payment) => payment.status === statusFilter);
    }

    setFilteredPayments(filtered);
  };

  const handleMarkAsPaid = async (paymentId: string) => {
    try {
      const updatedPayments = payments.map((payment) =>
        payment.id === paymentId
          ? {
              ...payment,
              status: "paid" as const,
              paidDate: new Date().toISOString().split("T")[0],
              method: "transfer" as const,
            }
          : payment
      );
      setPayments(updatedPayments);
    } catch (error) {
      console.error("Error marking payment as paid:", error);
    }
  };

  const getStatusBadge = (status: Payment["status"]) => {
    const variants = {
      paid: { variant: "default" as const, icon: CheckCircle, text: "Pagado" },
      pending: {
        variant: "secondary" as const,
        icon: Clock,
        text: "Pendiente",
      },
      overdue: {
        variant: "destructive" as const,
        icon: AlertCircle,
        text: "Vencido",
      },
    };

    const config = variants[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const getPaymentMethodIcon = (method?: Payment["method"]) => {
    switch (method) {
      case "card":
        return <CreditCard className="h-4 w-4" />;
      case "transfer":
        return <DollarSign className="h-4 w-4" />;
      case "cash":
        return <DollarSign className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const totalPaid = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = payments
    .filter((p) => p.status === "overdue")
    .reduce((sum, p) => sum + p.amount, 0);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg h-24"></div>
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
            <h1 className="text-2xl font-bold text-gray-900">
              Gestión de Pagos
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Administra los pagos de tus estudiantes
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Pago
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">
                  Pagos Recibidos
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalPaid)}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">
                  Pagos Pendientes
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalPending)}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">
                  Pagos Vencidos
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalOverdue)}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar por estudiante, plan o número de factura..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">Todos los estados</option>
              <option value="paid">Pagados</option>
              <option value="pending">Pendientes</option>
              <option value="overdue">Vencidos</option>
            </select>
          </div>
        </Card>

        {/* Payments List */}
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudiante / Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vencimiento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Factura
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {payment.studentName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.planName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {payment.method && getPaymentMethodIcon(payment.method)}
                        <span className="ml-2 text-sm font-medium text-gray-900">
                          {formatCurrency(payment.amount)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {formatDate(payment.dueDate)}
                      </div>
                      {payment.paidDate && (
                        <div className="text-xs text-green-600">
                          Pagado: {formatDate(payment.paidDate)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedPayment(payment);
                            setShowPaymentModal(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {payment.status !== "paid" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsPaid(payment.id)}
                          >
                            Marcar como Pagado
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No se encontraron pagos
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== "all"
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "Comienza agregando tu primer pago"}
              </p>
            </div>
          )}
        </Card>

        {/* Payment Detail Modal */}
        <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Detalles del Pago</DialogTitle>
            </DialogHeader>
            {selectedPayment && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Estado:</span>
                  {getStatusBadge(selectedPayment.status)}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Estudiante:</span>
                    <span className="text-sm font-medium">
                      {selectedPayment.studentName}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Plan:</span>
                    <span className="text-sm font-medium">
                      {selectedPayment.planName}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Monto:</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(selectedPayment.amount)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Vencimiento:</span>
                    <span className="text-sm font-medium">
                      {formatDate(selectedPayment.dueDate)}
                    </span>
                  </div>

                  {selectedPayment.paidDate && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Fecha de pago:
                      </span>
                      <span className="text-sm font-medium">
                        {formatDate(selectedPayment.paidDate)}
                      </span>
                    </div>
                  )}

                  {selectedPayment.method && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Método:</span>
                      <span className="text-sm font-medium capitalize">
                        {selectedPayment.method}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Factura:</span>
                    <span className="text-sm font-medium">
                      {selectedPayment.invoiceNumber}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowPaymentModal(false)}
                  >
                    Cerrar
                  </Button>
                  {selectedPayment.status !== "paid" && (
                    <Button
                      className="flex-1"
                      onClick={() => {
                        handleMarkAsPaid(selectedPayment.id);
                        setShowPaymentModal(false);
                      }}
                    >
                      Marcar como Pagado
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
