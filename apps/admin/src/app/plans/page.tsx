"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Copy, Edit, ExternalLink, MessageCircle, Plus, QrCode, Search, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import QRModal from "../../components/QRModal";

interface PlanItem {
  id: string;
  name: string;
  sets?: number;
  reps?: string;
  weight?: string;
  duration?: number;
  notes?: string;
  itemNumber: number;
}

interface PlanBlock {
  id: string;
  blockType: "WARMUP" | "CIRCUIT1" | "CIRCUIT2" | "CIRCUIT3" | "EXTRA";
  name: string;
  description?: string;
  items: PlanItem[];
  blockNumber: number;
}

interface PlanDay {
  id: string;
  dayNumber: number;
  name: string;
  description?: string;
  blocks: PlanBlock[];
}

interface Plan {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration?: string;
  planType: "PERSONAL" | "GROUP" | "ONLINE";
  difficultyLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  isTemplate: boolean;
  isActive: boolean;
  publicToken?: string;
  createdAt: string;
  student?: {
    id: string;
    name: string;
    lastName: string;
    phone?: string;
  };
  planDays: PlanDay[];
}

export default function PlansPage() {
  const { session } = useAuth();
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [showCopySuccess, setShowCopySuccess] = useState<string | null>(null);
  const [qrModal, setQrModal] = useState<{ isOpen: boolean; plan: Plan | null }>({
    isOpen: false,
    plan: null,
  });

  useEffect(() => {
    if (session?.user?.id) {
      loadPlans();
    }
  }, [session]);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/plans?trainerId=${session?.user?.id}`);

      if (response.ok) {
        const result = await response.json();
        setPlans(result.data || []);
      } else {
        console.error("Error loading plans");
      }
    } catch (error) {
      console.error("Error loading plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyPublicLink = async (plan: Plan) => {
    if (!plan.publicToken) {
      console.error("Plan doesn't have a public token");
      return;
    }

    const publicUrl = `${window.location.origin}/p/${plan.publicToken}`;

    try {
      await navigator.clipboard.writeText(publicUrl);
      setShowCopySuccess(plan.id);
      setTimeout(() => setShowCopySuccess(null), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  const openPublicLink = (plan: Plan) => {
    if (!plan.publicToken) return;
    const publicUrl = `${window.location.origin}/p/${plan.publicToken}`;
    window.open(publicUrl, "_blank");
  };

  const openQRModal = (plan: Plan) => {
    setQrModal({ isOpen: true, plan });
  };

  const closeQRModal = () => {
    setQrModal({ isOpen: false, plan: null });
  };

  const sendWhatsAppMessage = (plan: Plan) => {
    if (!plan.student?.phone) {
      alert("El estudiante no tiene número de WhatsApp registrado");
      return;
    }

    const publicUrl = `${window.location.origin}/p/${plan.publicToken}`;
    const message = `¡Hola ${plan.student.name}! 👋

Te envío tu plan de entrenamiento personalizado: *${plan.name}*

🎯 Tipo: ${plan.planType === "PERSONAL" ? "Personal" : plan.planType === "GROUP" ? "Grupal" : "Online"}
💪 Nivel: ${plan.difficultyLevel === "BEGINNER" ? "Principiante" : plan.difficultyLevel === "INTERMEDIATE" ? "Intermedio" : "Avanzado"}
📅 Días de entrenamiento: ${plan.planDays?.length || 0}

Accede a tu plan aquí: ${publicUrl}

¿Tienes alguna pregunta sobre los ejercicios? ¡Escríbeme! 💪`;

    const phoneNumber = plan.student.phone.replace(/[^0-9]/g, "");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
  };

  const filteredPlans = plans.filter((plan) => {
    const matchesSearch =
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.student?.lastName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || plan.planType === filterType;
    const matchesDifficulty = filterDifficulty === "all" || plan.difficultyLevel === filterDifficulty;

    return matchesSearch && matchesType && matchesDifficulty;
  });

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "BEGINNER":
        return "bg-green-100 text-green-800";
      case "INTERMEDIATE":
        return "bg-yellow-100 text-yellow-800";
      case "ADVANCED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "PERSONAL":
        return "bg-blue-100 text-blue-800";
      case "GROUP":
        return "bg-purple-100 text-purple-800";
      case "ONLINE":
        return "bg-cyan-100 text-cyan-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price);
  };

  if (!session) {
    return (
      <DashboardLayout>
        <div className="text-center">
          <p>Debes iniciar sesión para ver los planes.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Planes de Entrenamiento</h1>
            <p className="mt-1 text-sm text-gray-600">Gestiona y crea planes personalizados para tus estudiantes</p>
          </div>
          <Button onClick={() => router.push("/plans/new")} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Plan
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input type="text" placeholder="Buscar planes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>

          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">Todos los tipos</option>
            <option value="PERSONAL">Personal</option>
            <option value="GROUP">Grupal</option>
            <option value="ONLINE">Online</option>
          </select>

          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">Todas las dificultades</option>
            <option value="BEGINNER">Principiante</option>
            <option value="INTERMEDIATE">Intermedio</option>
            <option value="ADVANCED">Avanzado</option>
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            <span>
              {filteredPlans.length} plan{filteredPlans.length !== 1 ? "es" : ""}
            </span>
          </div>
        </div>

        {/* Plans Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredPlans.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Target className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{searchTerm || filterType !== "all" || filterDifficulty !== "all" ? "No se encontraron planes" : "No tienes planes creados"}</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterType !== "all" || filterDifficulty !== "all" ? "Intenta ajustar los filtros de búsqueda" : "Comienza creando tu primer plan de entrenamiento"}
            </p>
            {!searchTerm && filterType === "all" && filterDifficulty === "all" && <Button onClick={() => router.push("/plans/new")}>Crear mi primer plan</Button>}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => (
              <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      {plan.student && (
                        <p className="text-sm text-gray-600 mt-1">
                          {plan.student.name} {plan.student.lastName}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(plan.planType)}`}>
                        {plan.planType === "PERSONAL" ? "Personal" : plan.planType === "GROUP" ? "Grupal" : "Online"}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {plan.description && <p className="text-sm text-gray-600 line-clamp-2">{plan.description}</p>}

                    <div className="flex items-center justify-between text-sm">
                      <span className={`px-2 py-1 rounded-full ${getDifficultyColor(plan.difficultyLevel)}`}>
                        {plan.difficultyLevel === "BEGINNER" ? "Principiante" : plan.difficultyLevel === "INTERMEDIATE" ? "Intermedio" : "Avanzado"}
                      </span>
                      <span className="font-bold text-lg text-gray-900">{formatPrice(plan.price)}</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{plan.planDays?.length || 0} días</span>
                      </div>
                      {plan.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{plan.duration}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t">
                      <Button variant="outline" size="sm" onClick={() => router.push(`/plans/${plan.id}/edit`)} className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>

                      {plan.publicToken && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => copyPublicLink(plan)} className="flex items-center gap-1" title="Copiar enlace público">
                            {showCopySuccess === plan.id ? <span className="text-green-600 text-xs">¡Copiado!</span> : <Copy className="h-4 w-4" />}
                          </Button>

                          <Button variant="outline" size="sm" onClick={() => openPublicLink(plan)} className="flex items-center gap-1" title="Ver enlace público">
                            <ExternalLink className="h-4 w-4" />
                          </Button>

                          <Button variant="outline" size="sm" onClick={() => openQRModal(plan)} className="flex items-center gap-1" title="Generar código QR">
                            <QrCode className="h-4 w-4" />
                          </Button>

                          {plan.student?.phone && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => sendWhatsAppMessage(plan)}
                              className="flex items-center gap-1 text-green-600 hover:text-green-700 hover:border-green-300"
                              title="Enviar por WhatsApp">
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* QR Modal */}
      {qrModal.isOpen && qrModal.plan && <QRModal isOpen={qrModal.isOpen} onClose={closeQRModal} publicUrl={`${window.location.origin}/p/${qrModal.plan.publicToken}`} planName={qrModal.plan.name} />}
    </DashboardLayout>
  );
}
