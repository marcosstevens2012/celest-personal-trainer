"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import {
  Plus,
  Copy,
  Edit,
  Trash2,
  Eye,
  Users,
  Calendar,
  Clock,
  Target,
  ChevronDown,
  Search
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";

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
  blockType: 'WARMUP' | 'CIRCUIT1' | 'CIRCUIT2' | 'CIRCUIT3' | 'EXTRA';
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
  planType: 'PERSONAL' | 'GROUP' | 'ONLINE';
  difficultyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  isTemplate: boolean;
  isActive: boolean;
  createdAt: string;
  student?: {
    id: string;
    name: string;
    lastName: string;
  };
  planDays: PlanDay[];
  weeklyStructure?: any;
}

const BLOCK_TYPES = [
  { key: 'WARMUP', label: 'Precalentamiento', color: 'bg-green-100' },
  { key: 'CIRCUIT1', label: 'Circuito 1', color: 'bg-blue-100' },
  { key: 'CIRCUIT2', label: 'Circuito 2', color: 'bg-purple-100' },
  { key: 'CIRCUIT3', label: 'Circuito 3', color: 'bg-orange-100' },
  { key: 'EXTRA', label: 'Extra', color: 'bg-gray-100' }
];

const DAYS_OF_WEEK = [
  'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
];

export default function PlansPage() {
  const { session } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      loadPlans();
    }
  }, [session]);

  const loadPlans = async () => {
    try {
      setLoading(true);
      // Por ahora usar datos de ejemplo
      const examplePlans: Plan[] = [
        {
          id: "1",
          name: "Plan Fuerza - Principiante",
          description: "Plan de entrenamiento enfocado en fuerza para principiantes",
          price: 25000,
          duration: "4 semanas",
          planType: "PERSONAL",
          difficultyLevel: "BEGINNER",
          isTemplate: true,
          isActive: true,
          createdAt: new Date().toISOString(),
          planDays: [
            {
              id: "day1",
              dayNumber: 1,
              name: "Lunes - Tren Superior",
              blocks: [
                {
                  id: "block1",
                  blockType: "WARMUP",
                  name: "Precalentamiento",
                  blockNumber: 1,
                  items: [
                    {
                      id: "item1",
                      name: "Caminata en cinta",
                      duration: 600, // 10 min
                      notes: "Ritmo moderado",
                      itemNumber: 1
                    },
                    {
                      id: "item2", 
                      name: "Movilidad articular",
                      duration: 300, // 5 min
                      notes: "Todos los grupos musculares",
                      itemNumber: 2
                    }
                  ]
                },
                {
                  id: "block2",
                  blockType: "CIRCUIT1",
                  name: "Circuito Principal",
                  blockNumber: 2,
                  items: [
                    {
                      id: "item3",
                      name: "Press de banca",
                      sets: 3,
                      reps: "12",
                      weight: "A determinar",
                      notes: "Técnica perfecta",
                      itemNumber: 1
                    },
                    {
                      id: "item4",
                      name: "Remo con barra", 
                      sets: 3,
                      reps: "12",
                      weight: "A determinar",
                      notes: "Espalda recta",
                      itemNumber: 2
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: "2",
          name: "Plan Cardio - Intermedio",
          description: "Plan enfocado en resistencia cardiovascular",
          price: 30000,
          duration: "6 semanas",
          planType: "PERSONAL", 
          difficultyLevel: "INTERMEDIATE",
          isTemplate: true,
          isActive: true,
          createdAt: new Date().toISOString(),
          planDays: []
        }
      ];
      
      setPlans(examplePlans);
    } catch (error) {
      console.error("Error loading plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || plan.planType === filterType;
    const matchesDifficulty = filterDifficulty === "all" || plan.difficultyLevel === filterDifficulty;
    
    return matchesSearch && matchesType && matchesDifficulty;
  });

  const handleDuplicatePlan = async (plan: Plan) => {
    const newName = prompt(`Duplicar plan "${plan.name}" como:`, `${plan.name} (Copia)`);
    if (newName) {
      const duplicatedPlan = {
        ...plan,
        id: Date.now().toString(),
        name: newName,
        createdAt: new Date().toISOString(),
        student: undefined,
      };
      setPlans([duplicatedPlan, ...plans]);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'bg-green-100 text-green-800';
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800';
      case 'ADVANCED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PERSONAL': return 'bg-blue-100 text-blue-800';
      case 'GROUP': return 'bg-purple-100 text-purple-800';
      case 'ONLINE': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Planes de Entrenamiento</h1>
            <p className="text-gray-600">Gestiona plantillas y planes personalizados</p>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Plan
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Buscar planes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="type">Tipo</Label>
              <select
                id="type"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los tipos</option>
                <option value="PERSONAL">Personal</option>
                <option value="GROUP">Grupal</option>
                <option value="ONLINE">Online</option>
              </select>
            </div>

            <div>
              <Label htmlFor="difficulty">Dificultad</Label>
              <select
                id="difficulty"
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas las dificultades</option>
                <option value="BEGINNER">Principiante</option>
                <option value="INTERMEDIATE">Intermedio</option>
                <option value="ADVANCED">Avanzado</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("all");
                  setFilterDifficulty("all");
                }}
                className="w-full"
              >
                Limpiar filtros
              </Button>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        {filteredPlans.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay planes</h3>
            <p className="text-gray-600 mb-4">
              {plans.length === 0 
                ? "Aún no has creado ningún plan de entrenamiento"
                : "No se encontraron planes con los filtros aplicados"
              }
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Crear primer plan
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => (
              <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {plan.name}
                      </CardTitle>
                      {plan.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {plan.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(plan.planType)}`}>
                        {plan.planType === 'PERSONAL' ? 'Personal' : 
                         plan.planType === 'GROUP' ? 'Grupal' : 'Online'}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-green-600">
                        {formatPrice(plan.price)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(plan.difficultyLevel)}`}>
                        {plan.difficultyLevel === 'BEGINNER' ? 'Principiante' : 
                         plan.difficultyLevel === 'INTERMEDIATE' ? 'Intermedio' : 'Avanzado'}
                      </span>
                    </div>

                    {plan.duration && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {plan.duration}
                      </div>
                    )}

                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {plan.planDays?.length || 0} días configurados
                    </div>

                    {plan.student && (
                      <div className="flex items-center text-sm text-blue-600">
                        <Users className="w-4 h-4 mr-2" />
                        Asignado a {plan.student.name} {plan.student.lastName}
                      </div>
                    )}

                    {plan.isTemplate && (
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Plantilla
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {/* TODO: Ver plan */}}
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {/* TODO: Editar plan */}}
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDuplicatePlan(plan)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create Plan Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Crear Nuevo Plan</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="planName">Nombre del plan</Label>
                    <Input
                      id="planName"
                      placeholder="Ej: Plan Fuerza - Principiante"
                    />
                  </div>

                  <div>
                    <Label htmlFor="planDescription">Descripción</Label>
                    <textarea
                      id="planDescription"
                      placeholder="Describe el objetivo y características del plan..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="planPrice">Precio (ARS)</Label>
                      <Input
                        id="planPrice"
                        type="number"
                        placeholder="25000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="planDuration">Duración</Label>
                      <Input
                        id="planDuration"
                        placeholder="4 semanas"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="planType">Tipo</Label>
                      <select
                        id="planType"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="PERSONAL">Personal</option>
                        <option value="GROUP">Grupal</option>
                        <option value="ONLINE">Online</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="planDifficulty">Dificultad</Label>
                      <select
                        id="planDifficulty"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="BEGINNER">Principiante</option>
                        <option value="INTERMEDIATE">Intermedio</option>
                        <option value="ADVANCED">Avanzado</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="isTemplate"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="isTemplate">Guardar como plantilla reutilizable</Label>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={() => {
                      // TODO: Crear plan
                      setShowCreateModal(false);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Crear Plan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}