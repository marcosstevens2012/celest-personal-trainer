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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Gestión de Alumnos</h1>
            <p className="text-muted-foreground">
              Administra tus estudiantes y sus cuotas
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Importar CSV
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Importar Alumnos desde CSV</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Descarga la plantilla y completa los datos. Los campos
                    requeridos son: nombre, apellido, teléfono, cuota.
                  </p>
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Descargar Plantilla CSV
                  </Button>
                  <Input type="file" accept=".csv" />
                  <Button className="w-full">Importar Datos</Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Alumno
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Alumno</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateStudent} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
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
                    <div>
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

                  <div>
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
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
                    <div>
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
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
                    <div>
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

                  <div>
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

                  <div>
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

                  <div>
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
                    />
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Contacto de Emergencia</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
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
                      <div>
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
                    <div className="mt-2">
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

                  <div>
                    <Label htmlFor="notes">Observaciones</Label>
                    <Textarea
                      id="notes"
                      value={newStudent.notes}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, notes: e.target.value })
                      }
                      placeholder="Notas adicionales sobre el alumno..."
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">Crear Alumno</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Alumnos
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activos</CardTitle>
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.active}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pausados</CardTitle>
              <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.paused}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactivos</CardTitle>
              <div className="h-3 w-3 bg-red-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.inactive}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ingresos Activos
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-green-600">
                {formatCurrency(stats.totalRevenue)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
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
              <SelectItem value="ALL">Todos</SelectItem>
              <SelectItem value="ACTIVE">Activos</SelectItem>
              <SelectItem value="PAUSED">Pausados</SelectItem>
              <SelectItem value="INACTIVE">Inactivos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>Alumnos ({filteredStudents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-8">Cargando...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alumno</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Cuota</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha Alta</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
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
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {student.phone}
                          </div>
                          {student.email && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {student.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {formatCurrency(student.monthlyFee)}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(student.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {new Date(student.signUpDate).toLocaleDateString(
                            "es-AR"
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingStudent(student)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteStudent(student.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
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
