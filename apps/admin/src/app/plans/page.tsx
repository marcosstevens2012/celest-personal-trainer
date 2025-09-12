"use client";

import { Button, Card, Input } from "@repo/ui";
import {
  Calendar,
  Clock,
  Copy,
  Edit,
  Eye,
  FileText,
  Plus,
  Search,
  Share,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  status?: "draft" | "published";
  createdAt: string;
  planDays: unknown[];
  features?: string[];
  planType?: string;
  difficultyLevel?: string;
  categoryTags?: string[];
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  student?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlanType, setSelectedPlanType] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Get trainer ID - in a real app, this would come from authentication
  const [trainerId, setTrainerId] = useState<string>("trainer-1");

  // Initialize trainer if needed
  useEffect(() => {
    const initializeTrainer = async () => {
      try {
        // Use the same trainer ID as students page
        setTrainerId("trainer-1");
      } catch (error) {
        console.error("Error initializing trainer:", error);
        setTrainerId("trainer-1");
      }
    };

    initializeTrainer();
  }, []);

  useEffect(() => {
    loadPlans();
  }, [currentPage, searchTerm, selectedPlanType, selectedDifficulty]);

  const loadPlans = async () => {
    try {
      setLoading(true);

      // Use real API call instead of mock data
      const queryParams = new URLSearchParams({
        trainerId: trainerId,
        page: currentPage.toString(),
        search: searchTerm,
      });

      if (selectedPlanType !== "all") {
        queryParams.append("planType", selectedPlanType);
      }

      if (selectedDifficulty !== "all") {
        queryParams.append("difficultyLevel", selectedDifficulty);
      }

      const response = await fetch(`/api/plans?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch plans");
      }

      const data = await response.json();

      if (data.success) {
        setPlans(data.data || []);
      } else {
        console.error("Error loading plans:", data.error);
        setPlans([]);
      }
    } catch (error) {
      console.error("Error loading plans:", error);
      // Fallback to empty array if API fails
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlan = () => {
    setEditingPlan(null);
    setShowAddModal(true);
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setShowAddModal(true);
  };

  const handleDuplicatePlan = async (plan: Plan) => {
    try {
      const newName = prompt(
        `Duplicar plan "${plan.name}" como:`,
        `${plan.name} (Copia)`
      );
      if (newName) {
        // In a real app, call the API
        // await plansApi.duplicate(plan.id, newName);
        const duplicatedPlan = {
          ...plan,
          id: Date.now().toString(),
          name: newName,
          createdAt: new Date().toISOString(),
          student: undefined,
        };
        setPlans([duplicatedPlan, ...plans]);
      }
    } catch (error) {
      console.error("Error duplicating plan:", error);
    }
  };

  const handleSharePlan = (plan: Plan) => {
    const message =
      `¡Hola! Te comparto tu plan de entrenamiento: *${plan.name}*\n\n` +
      `📋 Descripción: ${plan.description}\n` +
      `⏱️ Duración: ${plan.duration}\n` +
      `💰 Precio: €${plan.price}\n` +
      `📅 Días de entrenamiento: ${plan.planDays.length}\n\n` +
      `¡Comencemos a entrenar! 💪`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleDeletePlan = async (planId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este plan?")) {
      try {
        // In a real app, call the API
        // await plansApi.delete(planId);
        setPlans(plans.filter((p) => p.id !== planId));
      } catch (error) {
        console.error("Error deleting plan:", error);
      }
    }
  };

  const getPlanTypeLabel = (type: string | undefined) => {
    if (!type) return "Sin tipo";
    switch (type) {
      case "PERSONAL":
        return "Personal";
      case "GROUP":
        return "Grupal";
      case "ONLINE":
        return "Online";
      default:
        return type;
    }
  };

  const getDifficultyLabel = (level: string | undefined) => {
    if (!level) return "Sin nivel";
    switch (level) {
      case "BEGINNER":
        return "Principiante";
      case "INTERMEDIATE":
        return "Intermedio";
      case "ADVANCED":
        return "Avanzado";
      default:
        return level;
    }
  };

  const getDifficultyColor = (level: string | undefined) => {
    if (!level) return "text-gray-700 bg-gray-100";
    switch (level) {
      case "BEGINNER":
        return "text-green-700 bg-green-100";
      case "INTERMEDIATE":
        return "text-yellow-700 bg-yellow-100";
      case "ADVANCED":
        return "text-red-700 bg-red-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  const filteredPlans = plans.filter((plan) => {
    const matchesSearch =
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedPlanType === "all" || plan.planType === selectedPlanType;
    const matchesDifficulty =
      selectedDifficulty === "all" ||
      plan.difficultyLevel === selectedDifficulty;

    return matchesSearch && matchesType && matchesDifficulty;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg h-80"></div>
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
              Planes de Entrenamiento
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Gestiona tus planes y asígnalos a estudiantes
            </p>
          </div>
          <Button onClick={handleAddPlan} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Crear Plan
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar planes por nombre o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedPlanType}
                onChange={(e) => setSelectedPlanType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">Todos los tipos</option>
                <option value="PERSONAL">Personal</option>
                <option value="GROUP">Grupal</option>
                <option value="ONLINE">Online</option>
              </select>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">Todas las dificultades</option>
                <option value="BEGINNER">Principiante</option>
                <option value="INTERMEDIATE">Intermedio</option>
                <option value="ADVANCED">Avanzado</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <Card
              key={plan.id}
              className="p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {plan.description}
                  </p>
                </div>
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditPlan(plan)}
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDuplicatePlan(plan)}
                    title="Duplicar"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSharePlan(plan)}
                    title="Compartir por WhatsApp"
                  >
                    <Share className="h-4 w-4 text-green-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePlan(plan.id)}
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">
                    €{plan.price}
                  </span>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                      {getPlanTypeLabel(plan.planType)}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(plan.difficultyLevel)}`}
                    >
                      {getDifficultyLabel(plan.difficultyLevel)}
                    </span>
                  </div>
                </div>

                {plan.duration && (
                  <p className="text-sm text-gray-600 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {plan.duration}
                  </p>
                )}

                <p className="text-sm text-gray-600 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {plan.planDays.length} días de entrenamiento
                </p>

                {plan.student && (
                  <p className="text-sm text-gray-600 flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Asignado a: {plan.student.name}
                  </p>
                )}

                {plan.features && plan.features.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Características:
                    </p>
                    <div className="space-y-1">
                      {plan.features.slice(0, 3).map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center text-xs text-gray-600"
                        >
                          <Star className="h-3 w-3 mr-1 text-yellow-500" />
                          {feature}
                        </div>
                      ))}
                      {plan.features.length > 3 && (
                        <p className="text-xs text-gray-500">
                          +{plan.features.length - 3} más...
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {plan.categoryTags && plan.categoryTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2">
                    {plan.categoryTags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  Creado: {new Date(plan.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Ver Detalles
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredPlans.length === 0 && (
          <Card className="p-8 text-center">
            <div className="text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">
                No se encontraron planes
              </p>
              <p className="text-sm mb-4">
                {searchTerm
                  ? "Intenta con otros términos de búsqueda"
                  : "Comienza creando tu primer plan de entrenamiento"}
              </p>
              <Button onClick={handleAddPlan}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Plan
              </Button>
            </div>
          </Card>
        )}

        {/* Add/Edit Modal - TODO: Create modal component */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg font-semibold mb-4">
                {editingPlan ? "Editar Plan" : "Crear Nuevo Plan"}
              </h2>
              <div className="space-y-4">
                <Input placeholder="Nombre del plan" />
                <textarea
                  placeholder="Descripción del plan"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                />
                <Input placeholder="Precio" type="number" step="0.01" />
                <Input placeholder="Duración (ej: 8 semanas)" />
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="">Seleccionar tipo</option>
                  <option value="PERSONAL">Personal</option>
                  <option value="GROUP">Grupal</option>
                  <option value="ONLINE">Online</option>
                </select>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="">Seleccionar dificultad</option>
                  <option value="BEGINNER">Principiante</option>
                  <option value="INTERMEDIATE">Intermedio</option>
                  <option value="ADVANCED">Avanzado</option>
                </select>
                <textarea
                  placeholder="Características (separadas por comas)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={2}
                />
                <Input placeholder="Tags/Etiquetas (separadas por comas)" />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancelar
                </Button>
                <Button>{editingPlan ? "Actualizar" : "Crear Plan"}</Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
