"use client";

import { ArrowLeft, ArrowRight, Calendar, CheckCircle, Copy, Dumbbell, ExternalLink, MessageCircle, PlayCircle, RotateCcw, Star, Target, Zap } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface PlanItem {
  id: string;
  name: string;
  sets?: number;
  reps?: string;
  weight?: string;
  duration?: number;
  notes?: string;
}

interface PlanBlock {
  id: string;
  blockType: "WARMUP" | "CIRCUIT1" | "CIRCUIT2" | "CIRCUIT3" | "EXTRA";
  name: string;
  description?: string;
  items: PlanItem[];
}

interface PlanProgress {
  id: string;
  completed: boolean;
  completedAt?: string;
  rating?: number;
  notes?: string;
}

interface PlanDay {
  id: string;
  dayNumber: number;
  name: string;
  description?: string;
  blocks: PlanBlock[];
  completed?: boolean;
  completedAt?: string;
  progress?: PlanProgress;
}

interface Student {
  id: string;
  name: string;
  lastName: string;
}

interface Trainer {
  id: string;
  name: string;
  phone?: string;
  whatsapp?: string;
  instagram?: string;
}

interface Plan {
  id: string;
  name: string;
  description?: string;
  duration?: string;
  difficultyLevel: string;
  student: Student;
  trainer: Trainer;
  planDays: PlanDay[];
  publicToken: string;
}

const BLOCK_TYPES = {
  WARMUP: {
    label: "Precalentamiento",
    color: "bg-green-50 border-green-200",
    textColor: "text-green-800",
    icon: RotateCcw,
  },
  CIRCUIT1: {
    label: "Circuito 1",
    color: "bg-blue-50 border-blue-200",
    textColor: "text-blue-800",
    icon: PlayCircle,
  },
  CIRCUIT2: {
    label: "Circuito 2",
    color: "bg-purple-50 border-purple-200",
    textColor: "text-purple-800",
    icon: Zap,
  },
  CIRCUIT3: {
    label: "Circuito 3",
    color: "bg-orange-50 border-orange-200",
    textColor: "text-orange-800",
    icon: Target,
  },
  EXTRA: {
    label: "Extra",
    color: "bg-gray-50 border-gray-200",
    textColor: "text-gray-800",
    icon: Star,
  },
};

export default function PublicPlanPage() {
  const params = useParams();
  const token = params.token as string;

  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [updatingProgress, setUpdatingProgress] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      loadPlan();
    }
  }, [token]);

  const loadPlan = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/public/plans/${token}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("Plan no encontrado o el enlace ha expirado");
        } else {
          setError("Error al cargar el plan de entrenamiento");
        }
        return;
      }

      const data = await response.json();
      setPlan(data);
    } catch (error) {
      console.error("Error loading plan:", error);
      setError("No se pudo cargar el plan de entrenamiento");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  const openWhatsApp = () => {
    if (plan?.trainer?.whatsapp) {
      const currentDayProgress = progress[plan.planDays[selectedDay]?.id];
      const completedDays = Object.values(progress).filter((p) => p.completed).length;
      const totalDays = plan.planDays.length;

      let message = `Hola ${plan.trainer.name}! 👋\n\n`;
      message += `Te escribo sobre mi plan de entrenamiento: *${plan.name}*\n\n`;
      message += `📊 Mi progreso actual:\n`;
      message += `✅ Días completados: ${completedDays}/${totalDays}\n`;

      if (currentDayProgress?.completed) {
        message += `🎯 Acabo de completar: ${plan.planDays[selectedDay]?.name}\n`;
        if (currentDayProgress.rating) {
          message += `⭐ Mi calificación: ${currentDayProgress.rating}/5\n`;
        }
        if (currentDayProgress.notes) {
          message += `📝 Mis notas: ${currentDayProgress.notes}\n`;
        }
      }

      message += `\n¿Podrías darme algunos consejos? 💪`;

      const url = `https://wa.me/${plan.trainer.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
    }
  };

  const shareUrl = () => {
    const url = window.location.href;
    copyToClipboard(url);
  };

  const markDayCompleted = async (dayId: string, completed: boolean) => {
    if (!plan) return;

    setUpdatingProgress(dayId);

    try {
      const response = await fetch(`/api/public/plans/${token}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dayId,
          completed,
        }),
      });

      if (response.ok) {
        // Actualizar el estado local
        setPlan((prevPlan) => {
          if (!prevPlan) return prevPlan;

          return {
            ...prevPlan,
            planDays: prevPlan.planDays.map((day) =>
              day.id === dayId
                ? {
                    ...day,
                    completed,
                    completedAt: completed ? new Date().toISOString() : undefined,
                    progress: {
                      id: day.progress?.id || "temp",
                      completed,
                      completedAt: completed ? new Date().toISOString() : undefined,
                    },
                  }
                : day
            ),
          };
        });
      } else {
        console.error("Failed to update progress");
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    } finally {
      setUpdatingProgress(null);
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "";
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const getBlockConfig = (blockType: string) => {
    return BLOCK_TYPES[blockType as keyof typeof BLOCK_TYPES] || BLOCK_TYPES.CIRCUIT1;
  };

  const currentDay = plan?.planDays[selectedDay];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tu plan de entrenamiento...</p>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Plan no encontrado</h1>
          <p className="text-gray-600 mb-4">{error || "El enlace que intentas acceder no es válido o ha expirado."}</p>
          <p className="text-sm text-gray-500">Si crees que esto es un error, contacta a tu entrenador.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{plan.name}</h1>
              <p className="text-gray-600 mt-1">
                Plan para {plan.student.name} {plan.student.lastName}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {plan.duration}
                </span>
                <span className="flex items-center">
                  <Target className="w-4 h-4 mr-1" />
                  {plan.difficultyLevel}
                </span>
                <span className="flex items-center">
                  <Dumbbell className="w-4 h-4 mr-1" />
                  {plan.planDays.length} días
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={shareUrl}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <Copy className="w-4 h-4 mr-2" />
                {showCopySuccess ? "¡Copiado!" : "Copiar enlace"}
              </button>

              {plan.trainer.whatsapp && (
                <button
                  onClick={openWhatsApp}
                  className="flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Days Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Días de Entrenamiento</h3>
              <div className="space-y-2">
                {plan.planDays.map((day, index) => {
                  const dayProgress = progress[day.id];
                  const isCompleted = dayProgress?.completed || false;

                  return (
                    <button
                      key={day.id}
                      onClick={() => setSelectedDay(index)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedDay === index ? "bg-blue-50 border-blue-200 text-blue-900" : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                      }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{day.name}</div>
                          <div className="text-xs text-gray-600">{day.blocks.length} bloques</div>
                        </div>
                        {isCompleted && <CheckCircle className="w-4 h-4 text-green-600" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Trainer Info */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mt-4">
              <h3 className="font-semibold text-gray-900 mb-3">Tu Entrenador</h3>
              <div className="space-y-2">
                <p className="font-medium">{plan.trainer.name}</p>
                {plan.trainer.whatsapp && (
                  <button onClick={openWhatsApp} className="flex items-center text-sm text-green-600 hover:text-green-700">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Enviar mensaje
                  </button>
                )}
                {plan.trainer.instagram && (
                  <a
                    href={`https://instagram.com/${plan.trainer.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-purple-600 hover:text-purple-700">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {plan.trainer.instagram}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Plan Content */}
          <div className="lg:col-span-3">
            {currentDay ? (
              <div className="space-y-6">
                {/* Day Header */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{currentDay.name}</h2>
                      {currentDay.description && <p className="text-gray-600 mt-1">{currentDay.description}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedDay(Math.max(0, selectedDay - 1))}
                        disabled={selectedDay === 0}
                        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setSelectedDay(Math.min(plan.planDays.length - 1, selectedDay + 1))}
                        disabled={selectedDay === plan.planDays.length - 1}
                        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Day Completion Section */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {progress[currentDay.id]?.completed || false ? <CheckCircle className="w-5 h-5 text-green-600" /> : <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>}
                      <span className={`font-medium ${progress[currentDay.id]?.completed || false ? "text-green-700" : "text-gray-700"}`}>
                        {progress[currentDay.id]?.completed || false ? "Día Completado" : "Marcar día como completado"}
                      </span>
                    </div>
                    <button
                      onClick={() => markDayCompleted(currentDay.id)}
                      disabled={updatingProgress === currentDay.id || progress[currentDay.id]?.completed || false}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        progress[currentDay.id]?.completed || false ? "bg-green-100 text-green-700 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                      }`}>
                      {updatingProgress === currentDay.id ? "Guardando..." : progress[currentDay.id]?.completed || false ? "Completado" : "Completar Día"}
                    </button>
                  </div>
                </div>

                {/* Blocks */}
                {currentDay.blocks.map((block) => {
                  const blockConfig = getBlockConfig(block.blockType);
                  const IconComponent = blockConfig.icon;

                  return (
                    <div key={block.id} className={`bg-white rounded-lg shadow-sm border-2 ${blockConfig.color}`}>
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <IconComponent className={`w-5 h-5 ${blockConfig.textColor}`} />
                          <h3 className={`font-semibold ${blockConfig.textColor}`}>{block.name}</h3>
                        </div>
                        {block.description && <p className="text-gray-600 mt-1 text-sm">{block.description}</p>}
                      </div>

                      <div className="p-4">
                        <div className="space-y-4">
                          {block.items.map((item, index) => (
                            <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium text-gray-900">{item.name}</h4>
                                <span className="text-sm text-gray-500">#{index + 1}</span>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                {item.sets && (
                                  <div>
                                    <span className="text-gray-600">Series:</span>
                                    <span className="ml-1 font-medium">{item.sets}</span>
                                  </div>
                                )}
                                {item.reps && (
                                  <div>
                                    <span className="text-gray-600">Reps:</span>
                                    <span className="ml-1 font-medium">{item.reps}</span>
                                  </div>
                                )}
                                {item.weight && (
                                  <div>
                                    <span className="text-gray-600">Peso:</span>
                                    <span className="ml-1 font-medium">{item.weight}</span>
                                  </div>
                                )}
                                {item.duration && (
                                  <div>
                                    <span className="text-gray-600">Tiempo:</span>
                                    <span className="ml-1 font-medium">{formatDuration(item.duration)}</span>
                                  </div>
                                )}
                              </div>

                              {item.notes && (
                                <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-200">
                                  <p className="text-sm text-blue-800">
                                    <strong>Nota:</strong> {item.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona un día</h3>
                <p className="text-gray-600">Elige un día de entrenamiento para ver los ejercicios</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
