"use client";

import { Button, Card, Input } from "@repo/ui";
import {
  AlertTriangle,
  Calendar,
  Edit,
  Mail,
  Phone,
  Plus,
  Search,
  Target,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";

interface Student {
  id: string;
  name: string;
  email: string;
  status?: "active" | "inactive";
  createdAt: string;
  plans: { name: string; isActive: boolean }[];
  payments: { status: string; dueDate: string }[];
  phone?: string;
  birthDate?: string;
  goals?: string[];
  medicalConditions?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  isActive?: boolean;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Get trainer ID - in a real app, this would come from authentication
  const [trainerId, setTrainerId] = useState<string>("trainer-1");

  // Initialize trainer if needed
  useEffect(() => {
    const initializeTrainer = async () => {
      try {
        // Try to get existing trainer or create one
        const response = await fetch("/api/trainers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "Personal Trainer",
            email: "trainer@example.com",
            bio: "Entrenador personal certificado",
            specialties: ["Fuerza", "Cardio", "Pérdida de peso"],
            certifications: ["NASM-CPT", "Nutrition Specialist"],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setTrainerId(data.data.id);
          }
        }
      } catch (error) {
        console.error("Error initializing trainer:", error);
        // Use fallback trainer ID
        setTrainerId("trainer-1");
      }
    };

    initializeTrainer();
  }, []);

  useEffect(() => {
    loadStudents();
  }, [currentPage, searchTerm]);

  const loadStudents = async () => {
    try {
      setLoading(true);

      // Use real API call instead of mock data
      const response = await fetch(
        `/api/students?trainerId=${trainerId}&page=${currentPage}&search=${searchTerm}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const data = await response.json();

      if (data.success) {
        setStudents(data.data || []);
        setTotalPages(Math.ceil((data.totalCount || 0) / 10));
      } else {
        console.error("Error loading students:", data.error);
        setStudents([]);
      }
    } catch (error) {
      console.error("Error loading students:", error);
      // Fallback to empty array if API fails
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setShowAddModal(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setShowAddModal(true);
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este estudiante?")) {
      try {
        // In a real app, call the API
        // await studentsApi.delete(studentId);
        setStudents(students.filter((s) => s.id !== studentId));
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateString));
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "text-green-600 bg-green-100";
      case "PENDING":
        return "text-yellow-600 bg-yellow-100";
      case "OVERDUE":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case "PAID":
        return "Pagado";
      case "PENDING":
        return "Pendiente";
      case "OVERDUE":
        return "Vencido";
      default:
        return status;
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg h-64"></div>
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
            <h1 className="text-2xl font-bold text-gray-900">Estudiantes</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gestiona tus estudiantes y su información
            </p>
          </div>
          <Button
            onClick={handleAddStudent}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Agregar Estudiante
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar estudiantes por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Activos
              </Button>
              <Button variant="ghost" size="sm">
                Inactivos
              </Button>
            </div>
          </div>
        </Card>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <Card
              key={student.id}
              className="p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {student.name}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <Mail className="h-4 w-4 mr-1" />
                    {student.email}
                  </p>
                  {student.phone && (
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <Phone className="h-4 w-4 mr-1" />
                      {student.phone}
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditStudent(student)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteStudent(student.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>

              {student.birthDate && (
                <p className="text-sm text-gray-600 flex items-center mb-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(student.birthDate)}
                </p>
              )}

              {student.goals && student.goals.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 flex items-center mb-1">
                    <Target className="h-4 w-4 mr-1" />
                    Objetivos:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {student.goals.map((goal, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {student.medicalConditions && (
                <div className="mb-3">
                  <p className="text-sm text-gray-600 flex items-start">
                    <AlertTriangle className="h-4 w-4 mr-1 mt-0.5 text-amber-500" />
                    <span className="text-xs">{student.medicalConditions}</span>
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  Planes activos: {student.plans.length}
                </div>
                <div className="flex items-center gap-2">
                  {student.payments.length > 0 && (
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(student.payments[0].status)}`}
                    >
                      {getPaymentStatusText(student.payments[0].status)}
                    </span>
                  )}
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      student.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {student.isActive ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span className="px-4 py-2 text-sm text-gray-600">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        )}

        {/* Add/Edit Modal - TODO: Create modal component */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4 p-6">
              <h2 className="text-lg font-semibold mb-4">
                {editingStudent ? "Editar Estudiante" : "Agregar Estudiante"}
              </h2>
              <div className="space-y-4">
                <Input placeholder="Nombre completo" />
                <Input placeholder="Email" type="email" />
                <Input placeholder="Teléfono" type="tel" />
                <Input placeholder="Fecha de nacimiento" type="date" />
                <textarea
                  placeholder="Objetivos (separados por comas)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                />
                <textarea
                  placeholder="Condiciones médicas"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={2}
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancelar
                </Button>
                <Button>{editingStudent ? "Actualizar" : "Crear"}</Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
