"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  DollarSign,
  Edit,
  FileText,
  Mail,
  Phone,
  Plus,
  Search,
  Trash2,
  Upload,
  Users,
  User,
  Filter,
  MoreVertical,
  Eye,
  Activity
} from "lucide-react";
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";

interface Student {
  id: string;
  name: string;
  lastName: string;
  alias?: string;
  phone: string;
  email?: string;
  monthlyFee: number;
  status: "ACTIVE" | "PAUSED" | "INACTIVE";
  notes?: string;
  birthDate?: string;
  goals?: string; // JSON string in SQLite
  medicalConditions?: string;
  emergencyContact?: string; // JSON string in SQLite
  signUpDate: string;
  createdAt: string;
  updatedAt: string;
  trainer?: {
    id: string;
    name: string;
  };
}

interface NewStudent {
  name: string;
  lastName: string;
  alias?: string;
  phone: string;
  email?: string;
  monthlyFee: number;
  status: "ACTIVE" | "PAUSED" | "INACTIVE";
  notes?: string;
  birthDate?: string;
  goals?: string; // Will be converted to JSON
  medicalConditions?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "PAUSED" | "INACTIVE"
  >("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [newStudent, setNewStudent] = useState<NewStudent>({
    name: "",
    lastName: "",
    alias: "",
    phone: "",
    email: "",
    monthlyFee: 0,
    status: "ACTIVE",
    notes: "",
    birthDate: "",
    goals: "",
    medicalConditions: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
  });

  // Cargar estudiantes
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/students");
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  // Crear nuevo estudiante
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const studentData = {
        ...newStudent,
        monthlyFee: Number(newStudent.monthlyFee),
        goals: newStudent.goals
          ? JSON.stringify(
              newStudent.goals
                .split(",")
                .map((g) => g.trim())
                .filter((g) => g)
            )
          : "[]",
        emergencyContact:
          newStudent.emergencyContactName && newStudent.emergencyContactPhone
            ? JSON.stringify({
                name: newStudent.emergencyContactName,
                phone: newStudent.emergencyContactPhone,
                relationship:
                  newStudent.emergencyContactRelationship || "No especificado",
              })
            : null,
      };

      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      });

      if (response.ok) {
        await fetchStudents();
        setShowAddModal(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error creating student:", error);
    }
  };

  // Actualizar estudiante
  const handleUpdateStudent = async (
    studentId: string,
    updates: Partial<NewStudent>
  ) => {
    try {
      const response = await fetch(`/api/students/${studentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        await fetchStudents();
        setEditingStudent(null);
      }
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  // Eliminar estudiante
  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este alumno?")) return;

    try {
      const response = await fetch(`/api/students/${studentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchStudents();
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const resetForm = () => {
    setNewStudent({
      name: "",
      lastName: "",
      alias: "",
      phone: "",
      email: "",
      monthlyFee: 0,
      status: "ACTIVE",
      notes: "",
      birthDate: "",
      goals: "",
      medicalConditions: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelationship: "",
    });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filtrar estudiantes
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.alias &&
        student.alias.toLowerCase().includes(searchTerm.toLowerCase())) ||
      student.phone.includes(searchTerm);

    const matchesStatus =
      statusFilter === "ALL" || student.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Estadísticas rápidas
  const stats = {
    total: students.length,
    active: students.filter((s) => s.status === "ACTIVE").length,
    paused: students.filter((s) => s.status === "PAUSED").length,
    inactive: students.filter((s) => s.status === "INACTIVE").length,
    totalRevenue: students
      .filter((s) => s.status === "ACTIVE")
      .reduce((sum, s) => sum + s.monthlyFee, 0),
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Activo
          </Badge>
        );
      case "PAUSED":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pausado
          </Badge>
        );
      case "INACTIVE":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Inactivo
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              Gestión de Estudiantes
            </h1>
            <p className="text-muted-foreground">
              Administra tus estudiantes, cuotas y progreso
            </p>
          </div>
          <div className="flex gap-3">
            <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Importar CSV
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Importar Estudiantes desde CSV</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Descarga la plantilla y completa los datos. Los campos
                    requeridos son: nombre, apellido, teléfono, cuota.
                  </p>
                  <Button variant="outline" className="w-full gap-2">
                    <FileText className="h-4 w-4" />
                    Descargar Plantilla CSV
                  </Button>
                  <Input type="file" accept=".csv" />
                  <Button className="w-full">Importar Datos</Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nuevo Estudiante
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Estudiante</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateStudent} className="space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Información Básica
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre *</Label>
                        <Input
                          id="name"
                          value={newStudent.name}
                          onChange={(e) =>
                            setNewStudent({ ...newStudent, name: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Apellido *</Label>
                        <Input
                          id="lastName"
                          value={newStudent.lastName}
                          onChange={(e) =>
                            setNewStudent({
                              ...newStudent,
                              lastName: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="alias">Alias</Label>
                      <Input
                        id="alias"
                        value={newStudent.alias}
                        onChange={(e) =>
                          setNewStudent({ ...newStudent, alias: e.target.value })
                        }
                        placeholder="Apodo o nombre preferido"
                      />
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Información de Contacto
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono (WhatsApp) *</Label>
                        <Input
                          id="phone"
                          value={newStudent.phone}
                          onChange={(e) =>
                            setNewStudent({
                              ...newStudent,
                              phone: e.target.value,
                            })
                          }
                          placeholder="+54 9 11 xxxx-xxxx"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newStudent.email}
                          onChange={(e) =>
                            setNewStudent({
                              ...newStudent,
                              email: e.target.value,
                            })
                          }
                          placeholder="email@ejemplo.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Business Info */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Información Comercial
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="monthlyFee">Cuota Mensual (ARS) *</Label>
                        <Input
                          id="monthlyFee"
                          type="number"
                          value={newStudent.monthlyFee}
                          onChange={(e) =>
                            setNewStudent({
                              ...newStudent,
                              monthlyFee: Number(e.target.value),
                            })
                          }
                          placeholder="15000"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Estado *</Label>
                        <Select
                          value={newStudent.status}
                          onValueChange={(
                            value: "ACTIVE" | "PAUSED" | "INACTIVE"
                          ) => setNewStudent({ ...newStudent, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ACTIVE">Activo</SelectItem>
                            <SelectItem value="PAUSED">Pausado</SelectItem>
                            <SelectItem value="INACTIVE">Inactivo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Información Adicional
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={newStudent.birthDate}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            birthDate: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="goals">
                        Objetivos (separados por comas)
                      </Label>
                      <Input
                        id="goals"
                        value={newStudent.goals}
                        onChange={(e) =>
                          setNewStudent({ ...newStudent, goals: e.target.value })
                        }
                        placeholder="Bajar de peso, Ganar masa muscular, Mejorar resistencia"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="medicalConditions">
                        Condiciones Médicas
                      </Label>
                      <Textarea
                        id="medicalConditions"
                        value={newStudent.medicalConditions}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            medicalConditions: e.target.value,
                          })
                        }
                        placeholder="Lesiones, alergias, condiciones médicas relevantes..."
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Contacto de Emergencia
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emergencyName">Nombre</Label>
                        <Input
                          id="emergencyName"
                          value={newStudent.emergencyContactName}
                          onChange={(e) =>
                            setNewStudent({
                              ...newStudent,
                              emergencyContactName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergencyPhone">Teléfono</Label>
                        <Input
                          id="emergencyPhone"
                          value={newStudent.emergencyContactPhone}
                          onChange={(e) =>
                            setNewStudent({
                              ...newStudent,
                              emergencyContactPhone: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyRelationship">Relación</Label>
                      <Input
                        id="emergencyRelationship"
                        value={newStudent.emergencyContactRelationship}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            emergencyContactRelationship: e.target.value,
                          })
                        }
                        placeholder="Madre, Padre, Pareja, etc."
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Observaciones</Label>
                    <Textarea
                      id="notes"
                      value={newStudent.notes}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, notes: e.target.value })
                      }
                      placeholder="Notas adicionales sobre el estudiante..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">
                      Crear Estudiante
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Estudiantes
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Estudiantes registrados
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activos</CardTitle>
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.active}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Entrenando actualmente
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pausados</CardTitle>
              <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.paused}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Temporalmente inactivos
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactivos</CardTitle>
              <div className="h-3 w-3 bg-red-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.inactive}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Sin entrenamientos
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ingresos Mensuales
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-green-600">
                {formatCurrency(stats.totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Solo estudiantes activos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={statusFilter}
                onValueChange={(value: "ALL" | "ACTIVE" | "PAUSED" | "INACTIVE") =>
                  setStatusFilter(value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos los estados</SelectItem>
                  <SelectItem value="ACTIVE">Activos</SelectItem>
                  <SelectItem value="PAUSED">Pausados</SelectItem>
                  <SelectItem value="INACTIVE">Inactivos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Students Table */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Estudiantes ({filteredStudents.length})
              </CardTitle>
              {filteredStudents.length > 0 && (
                <Badge variant="outline">
                  {filteredStudents.length} de {students.length}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 py-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-3 rounded-full bg-muted mb-4">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    {searchTerm || statusFilter !== "ALL" 
                      ? "No se encontraron estudiantes" 
                      : "No tienes estudiantes registrados"
                    }
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    {searchTerm || statusFilter !== "ALL" 
                      ? "Intenta ajustar los filtros de búsqueda para encontrar lo que buscas" 
                      : "Comienza agregando tu primer estudiante para empezar a gestionar tu negocio"
                    }
                  </p>
                </div>
                {!searchTerm && statusFilter === "ALL" && (
                  <Button 
                    onClick={() => setShowAddModal(true)} 
                    size="lg" 
                    className="gap-2 mt-4"
                  >
                    <Plus className="h-4 w-4" />
                    Agregar primer estudiante
                  </Button>
                )}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Estudiante</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Cuota Mensual</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha de Alta</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                              <User className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <div className="font-medium">
                                {student.name} {student.lastName}
                              </div>
                              {student.alias && (
                                <div className="text-sm text-muted-foreground">
                                  "{student.alias}"
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span className="font-mono">{student.phone}</span>
                            </div>
                            {student.email && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                <span className="truncate max-w-[200px]">{student.email}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-lg">
                            {formatCurrency(student.monthlyFee)}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(student.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(student.signUpDate).toLocaleDateString("es-AR")}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingStudent(student)}
                              title="Editar estudiante"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost" 
                              size="sm"
                              title="Ver detalles"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteStudent(student.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Eliminar estudiante"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
                </TableBody>
              </Table>
            )}

            {!loading && filteredStudents.length === 0 && (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No hay alumnos</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== "ALL"
                    ? "No se encontraron alumnos con los filtros aplicados."
                    : "Comienza agregando tu primer alumno."}
                </p>
                {!searchTerm && statusFilter === "ALL" && (
                  <Button onClick={() => setShowAddModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Alumno
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
