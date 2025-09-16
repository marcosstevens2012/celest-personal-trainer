"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle,
  Copy,
  Dumbbell,
  ExternalLink,
  MessageCircle,
  PlayCircle,
  RotateCcw,
  Star,
  Target,
  Zap,
  User,
  Clock,
  Award,
  Share2,
  AlertCircle
} from "lucide-react";
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
    variant: "secondary" as const,
    icon: RotateCcw,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  CIRCUIT1: {
    label: "Circuito 1",
    variant: "default" as const,
    icon: PlayCircle,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  CIRCUIT2: {
    label: "Circuito 2",
    variant: "outline" as const,
    icon: Zap,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  CIRCUIT3: {
    label: "Circuito 3",
    variant: "destructive" as const,
    icon: Target,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  EXTRA: {
    label: "Extra",
    variant: "outline" as const,
    icon: Star,
    color: "text-gray-600",
    bg: "bg-gray-50",
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

  const getCompletedDaysCount = () => {
    return plan?.planDays.filter(day => day.completed).length || 0;
  };

  const getTotalDays = () => {
    return plan?.planDays.length || 0;
  };

  const getProgressPercentage = () => {
    const completed = getCompletedDaysCount();
    const total = getTotalDays();
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const currentDay = plan?.planDays[selectedDay];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <div className="space-y-2">
                <h3 className="font-semibold">Cargando tu plan</h3>
                <p className="text-sm text-muted-foreground">
                  Preparando tu entrenamiento personalizado...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="p-3 rounded-full bg-destructive/10">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Plan no encontrado</h3>
                <p className="text-sm text-muted-foreground">
                  {error || "El enlace que intentas acceder no es válido o ha expirado."}
                </p>
                <p className="text-xs text-muted-foreground">
                  Si crees que esto es un error, contacta a tu entrenador.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Dumbbell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">{plan.name}</h1>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Plan personalizado para {plan.student.name} {plan.student.lastName}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <Badge variant="outline" className="gap-1">
                  <Calendar className="w-3 h-3" />
                  {plan.duration}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Target className="w-3 h-3" />
                  {plan.difficultyLevel}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Award className="w-3 h-3" />
                  {plan.trainer.name}
                </Badge>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={shareUrl}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                {showCopySuccess ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    ¡Copiado!
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4" />
                    Compartir
                  </>
                )}
              </Button>
              
              {plan.trainer?.whatsapp && (
                <Button
                  onClick={openWhatsApp}
                  className="gap-2 bg-green-600 hover:bg-green-700"
                >
                  <MessageCircle className="h-4 w-4" />
                  Contactar Entrenador
                </Button>
              )}
            </div>
          </div>

          {/* Progress Overview */}
          <div className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">Tu Progreso</h3>
                    <p className="text-sm text-muted-foreground">
                      {getCompletedDaysCount()} de {getTotalDays()} días completados
                    </p>
                  </div>
                  <Badge variant={getProgressPercentage() === 100 ? "default" : "secondary"}>
                    {getProgressPercentage()}%
                  </Badge>
                </div>
                <Progress value={getProgressPercentage()} className="h-2" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Days Navigation Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Días de Entrenamiento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {plan.planDays.map((day, index) => {
                  const isCompleted = day.completed || false;
                  const isSelected = selectedDay === index;

                  return (
                    <Button
                      key={day.id}
                      onClick={() => setSelectedDay(index)}
                      variant={isSelected ? "default" : "ghost"}
                      className={`w-full justify-start h-auto p-3 ${
                        isSelected ? "" : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="text-left">
                          <div className="font-medium text-sm">
                            Día {index + 1}: {day.name}
                          </div>
                          <div className="text-xs opacity-75">
                            {day.blocks.length} bloque{day.blocks.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                        {isCompleted && (
                          <CheckCircle className="h-4 w-4 text-green-600 ml-2" />
                        )}
                      </div>
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Trainer Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Tu Entrenador
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{plan.trainer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Entrenador Personal
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  {plan.trainer.whatsapp && (
                    <Button
                      onClick={openWhatsApp}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start gap-2 text-green-600 hover:text-green-700 border-green-200"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Enviar WhatsApp
                    </Button>
                  )}
                  
                  {plan.trainer.instagram && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full justify-start gap-2"
                    >
                      <a
                        href={`https://instagram.com/${plan.trainer.instagram.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                        {plan.trainer.instagram}
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Plan Content */}
          <div className="xl:col-span-3 space-y-6">
            {currentDay ? (
              <>
                {/* Day Header */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight">
                          Día {selectedDay + 1}: {currentDay.name}
                        </h2>
                        {currentDay.description && (
                          <p className="text-muted-foreground">{currentDay.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setSelectedDay(Math.max(0, selectedDay - 1))}
                          disabled={selectedDay === 0}
                          variant="outline"
                          size="sm"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => setSelectedDay(Math.min(plan.planDays.length - 1, selectedDay + 1))}
                          disabled={selectedDay === plan.planDays.length - 1}
                          variant="outline"
                          size="sm"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Day Completion Section */}
                    <div className={`flex items-center justify-between p-4 rounded-lg ${
                      currentDay.completed ? 'bg-green-50 border border-green-200' : 'bg-muted'
                    }`}>
                      <div className="flex items-center gap-3">
                        {currentDay.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-muted-foreground rounded-full" />
                        )}
                        <div>
                          <p className={`font-medium ${
                            currentDay.completed ? 'text-green-700' : 'text-foreground'
                          }`}>
                            {currentDay.completed ? 'Día Completado' : 'Marcar día como completado'}
                          </p>
                          {currentDay.completedAt && (
                            <p className="text-xs text-muted-foreground">
                              Completado el {new Date(currentDay.completedAt).toLocaleDateString('es-AR')}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => markDayCompleted(currentDay.id, !currentDay.completed)}
                        disabled={updatingProgress === currentDay.id}
                        variant={currentDay.completed ? "outline" : "default"}
                        className={currentDay.completed ? "border-green-200 text-green-700" : ""}
                      >
                        {updatingProgress === currentDay.id ? (
                          "Guardando..."
                        ) : currentDay.completed ? (
                          "Marcar como pendiente"
                        ) : (
                          "Completar Día"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Training Blocks */}
                {currentDay.blocks.map((block, blockIndex) => {
                  const blockConfig = getBlockConfig(block.blockType);
                  const IconComponent = blockConfig.icon;

                  return (
                    <Card key={block.id} className="overflow-hidden">
                      <CardHeader className={`${blockConfig.bg} border-b`}>
                        <CardTitle className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-white/80`}>
                            <IconComponent className={`w-4 h-4 ${blockConfig.color}`} />
                          </div>
                          <div>
                            <span className={blockConfig.color}>{blockConfig.label}</span>
                            <div className="text-sm font-normal text-muted-foreground">
                              {block.items.length} ejercicio{block.items.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </CardTitle>
                        {block.description && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {block.description}
                          </p>
                        )}
                      </CardHeader>

                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {block.items.map((item, itemIndex) => (
                            <Card key={item.id} className="border border-muted">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <h4 className="font-semibold">{item.name}</h4>
                                  <Badge variant="outline" className="ml-2">
                                    #{itemIndex + 1}
                                  </Badge>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                                  {item.sets && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-muted-foreground">Series:</span>
                                      <Badge variant="secondary">{item.sets}</Badge>
                                    </div>
                                  )}
                                  {item.reps && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-muted-foreground">Reps:</span>
                                      <Badge variant="secondary">{item.reps}</Badge>
                                    </div>
                                  )}
                                  {item.weight && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-muted-foreground">Peso:</span>
                                      <Badge variant="secondary">{item.weight}</Badge>
                                    </div>
                                  )}
                                  {item.duration && (
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-3 w-3 text-muted-foreground" />
                                      <span className="text-muted-foreground">
                                        {formatDuration(item.duration)}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {item.notes && (
                                  <div className="mt-3 p-3 bg-muted rounded-lg">
                                    <p className="text-sm text-muted-foreground">
                                      <strong>Notas:</strong> {item.notes}
                                    </p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="space-y-4">
                    <div className="p-3 rounded-full bg-muted mx-auto w-fit">
                      <Calendar className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Selecciona un día</h3>
                      <p className="text-muted-foreground">
                        Elige un día de entrenamiento para ver los ejercicios
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
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
