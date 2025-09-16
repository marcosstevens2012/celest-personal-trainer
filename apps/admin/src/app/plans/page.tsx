"use client";

import { useAuth } from "@/components/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, Copy, Edit, ExternalLink, Filter, MessageCircle, Plus, QrCode, Search, Target, User, Zap } from "lucide-react";
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
        return "default"; // Green variant
      case "INTERMEDIATE":
        return "secondary"; // Yellow variant
      case "ADVANCED":
        return "destructive"; // Red variant
      default:
        return "outline";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "PERSONAL":
        return User;
      case "GROUP":
        return Target;
      case "ONLINE":
        return Zap;
      default:
        return Target;
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
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Target className="h-12 w-12 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Sesión requerida</h3>
              <p className="text-muted-foreground">Debes iniciar sesión para ver los planes.</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Planes de Entrenamiento</h1>
            <p className="text-muted-foreground">Gestiona y crea planes personalizados para tus estudiantes</p>
          </div>
          <Button onClick={() => router.push("/plans/new")} size="lg" className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Plan
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input type="text" placeholder="Buscar planes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="PERSONAL">Personal</SelectItem>
                <SelectItem value="GROUP">Grupal</SelectItem>
                <SelectItem value="ONLINE">Online</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Dificultad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las dificultades</SelectItem>
                <SelectItem value="BEGINNER">Principiante</SelectItem>
                <SelectItem value="INTERMEDIATE">Intermedio</SelectItem>
                <SelectItem value="ADVANCED">Avanzado</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>
                {filteredPlans.length} plan{filteredPlans.length !== 1 ? "es" : ""}
              </span>
            </div>
          </div>
        </Card>

        {/* Plans Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-9 flex-1" />
                    <Skeleton className="h-9 w-9" />
                    <Skeleton className="h-9 w-9" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredPlans.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-3 rounded-full bg-muted">
                <Target className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{searchTerm || filterType !== "all" || filterDifficulty !== "all" ? "No se encontraron planes" : "No tienes planes creados"}</h3>
                <p className="text-muted-foreground max-w-md">
                  {searchTerm || filterType !== "all" || filterDifficulty !== "all"
                    ? "Intenta ajustar los filtros de búsqueda para encontrar lo que buscas"
                    : "Comienza creando tu primer plan de entrenamiento personalizado"}
                </p>
              </div>
              {!searchTerm && filterType === "all" && filterDifficulty === "all" && (
                <Button onClick={() => router.push("/plans/new")} size="lg" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Crear mi primer plan
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => {
              const TypeIcon = getTypeIcon(plan.planType);
              return (
                <Card key={plan.id} className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2 flex-1 min-w-0">
                        <CardTitle className="text-lg leading-tight line-clamp-2">{plan.name}</CardTitle>
                        {plan.student && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {plan.student.name} {plan.student.lastName}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Badge variant="outline" className="gap-1">
                          <TypeIcon className="h-3 w-3" />
                          {plan.planType === "PERSONAL" ? "Personal" : plan.planType === "GROUP" ? "Grupal" : "Online"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {plan.description && <p className="text-sm text-muted-foreground line-clamp-2">{plan.description}</p>}

                    <div className="flex items-center justify-between">
                      <Badge variant={getDifficultyColor(plan.difficultyLevel)}>
                        {plan.difficultyLevel === "BEGINNER" ? "Principiante" : plan.difficultyLevel === "INTERMEDIATE" ? "Intermedio" : "Avanzado"}
                      </Badge>
                      <span className="text-lg font-bold">{formatPrice(plan.price)}</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
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

                    <div className="flex items-center gap-2 pt-2">
                      <Button variant="outline" size="sm" onClick={() => router.push(`/plans/${plan.id}/edit`)} className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>

                      {plan.publicToken && (
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" onClick={() => copyPublicLink(plan)} title="Copiar enlace público">
                            {showCopySuccess === plan.id ? <span className="text-green-600 text-xs">✓</span> : <Copy className="h-4 w-4" />}
                          </Button>

                          <Button variant="outline" size="sm" onClick={() => openPublicLink(plan)} title="Ver enlace público">
                            <ExternalLink className="h-4 w-4" />
                          </Button>

                          <Button variant="outline" size="sm" onClick={() => openQRModal(plan)} title="Generar código QR">
                            <QrCode className="h-4 w-4" />
                          </Button>

                          {plan.student?.phone && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => sendWhatsAppMessage(plan)}
                              className="text-green-600 hover:text-green-700 hover:border-green-300"
                              title="Enviar por WhatsApp">
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* QR Modal */}
      {qrModal.isOpen && qrModal.plan && <QRModal isOpen={qrModal.isOpen} onClose={closeQRModal} publicUrl={`${window.location.origin}/p/${qrModal.plan.publicToken}`} planName={qrModal.plan.name} />}
    </DashboardLayout>
  );
}
