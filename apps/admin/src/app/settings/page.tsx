"use client";

import { Badge, Button, Card } from "@repo/ui";
import {
  Bell,
  Calendar,
  Camera,
  CreditCard,
  Globe,
  Mail,
  MessageSquare,
  Save,
  Shield,
  User,
} from "lucide-react";
import { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  certifications: string[];
  profileImage?: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  paymentReminders: boolean;
  planExpirations: boolean;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "Marco Stevens",
    email: "marco@personaltrainer.com",
    phone: "+34 612 345 678",
    address: "Madrid, España",
    bio: "Entrenador personal certificado con más de 5 años de experiencia. Especializado en entrenamiento de fuerza y acondicionamiento físico.",
    certifications: ["NASM-CPT", "CSCS", "FMS Level 2"],
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    paymentReminders: true,
    planExpirations: true,
  });

  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);

  const handleProfileSave = async () => {
    setLoading(true);
    try {
      // Here you would save the profile data
      console.log("Saving profile:", profile);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSave = async () => {
    setLoading(true);
    try {
      // Here you would save the notification settings
      console.log("Saving notifications:", notifications);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
    } catch (error) {
      console.error("Error saving notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "profile", name: "Perfil", icon: User },
    { id: "notifications", name: "Notificaciones", icon: Bell },
    { id: "security", name: "Seguridad", icon: Shield },
    { id: "billing", name: "Facturación", icon: CreditCard },
    { id: "integrations", name: "Integraciones", icon: Globe },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gestiona tu perfil y preferencias de la aplicación
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Información Personal
              </h3>

              {/* Profile Image */}
              <div className="flex items-center space-x-6 mb-6">
                <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                  {profile.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt="Profile"
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Cambiar Foto
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    JPG, GIF o PNG. Máximo 1MB.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) =>
                      setProfile({ ...profile, address: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biografía
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certificaciones
                </label>
                <div className="flex flex-wrap gap-2">
                  {profile.certifications.map((cert, index) => (
                    <Badge key={index} variant="secondary">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button onClick={handleProfileSave} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Preferencias de Notificación
              </h3>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Notificaciones por Email
                    </h4>
                    <p className="text-sm text-gray-500">
                      Recibir notificaciones en tu email
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.emailNotifications}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          emailNotifications: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Notificaciones SMS
                    </h4>
                    <p className="text-sm text-gray-500">
                      Recibir notificaciones por mensaje de texto
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.smsNotifications}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          smsNotifications: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Recordatorios de Pagos
                    </h4>
                    <p className="text-sm text-gray-500">
                      Alertas sobre pagos pendientes y vencidos
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.paymentReminders}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          paymentReminders: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Vencimiento de Planes
                    </h4>
                    <p className="text-sm text-gray-500">
                      Alertas cuando los planes están por vencer
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.planExpirations}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          planExpirations: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button onClick={handleNotificationSave} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Guardando..." : "Guardar Preferencias"}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Seguridad de la Cuenta
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Cambiar Contraseña
                  </h4>
                  <div className="space-y-4">
                    <input
                      type="password"
                      placeholder="Contraseña actual"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="password"
                      placeholder="Nueva contraseña"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="password"
                      placeholder="Confirmar nueva contraseña"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Button variant="outline">Actualizar Contraseña</Button>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Autenticación de Dos Factores
                  </h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Agrega una capa extra de seguridad a tu cuenta
                  </p>
                  <Button variant="outline">Configurar 2FA</Button>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Sesiones Activas
                  </h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Gestiona dónde has iniciado sesión
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 border border-gray-200 rounded-md">
                      <div>
                        <div className="text-sm font-medium">
                          Navegador Chrome - Madrid, España
                        </div>
                        <div className="text-xs text-gray-500">
                          Sesión actual • Hace 2 minutos
                        </div>
                      </div>
                      <Badge variant="default">Activa</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "billing" && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Información de Facturación
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-4">
                    Plan Actual
                  </h4>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Plan Professional</div>
                        <div className="text-sm text-gray-500">
                          Hasta 100 estudiantes
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">€29.99/mes</div>
                        <Badge variant="default">Activo</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-4">
                    Método de Pago
                  </h4>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium">
                            •••• •••• •••• 1234
                          </div>
                          <div className="text-xs text-gray-500">
                            Expira 12/2028
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Cambiar
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-4">
                    Historial de Facturación
                  </h4>
                  <div className="space-y-2">
                    {[
                      {
                        date: "15 Ene 2025",
                        amount: "€29.99",
                        status: "Pagado",
                      },
                      {
                        date: "15 Dic 2024",
                        amount: "€29.99",
                        status: "Pagado",
                      },
                      {
                        date: "15 Nov 2024",
                        amount: "€29.99",
                        status: "Pagado",
                      },
                    ].map((invoice, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 border border-gray-200 rounded-md"
                      >
                        <div className="text-sm">
                          <div className="font-medium">{invoice.date}</div>
                          <div className="text-gray-500">Plan Professional</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {invoice.amount}
                          </div>
                          <Badge variant="default">{invoice.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "integrations" && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Integraciones Disponibles
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <MessageSquare className="h-8 w-8 text-green-500 mr-3" />
                    <div>
                      <div className="font-medium">WhatsApp Business API</div>
                      <div className="text-sm text-gray-500">
                        Envía planes y comunicaciones directamente
                      </div>
                    </div>
                  </div>
                  <Badge variant="default">Conectado</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <Mail className="h-8 w-8 text-blue-500 mr-3" />
                    <div>
                      <div className="font-medium">Email Marketing</div>
                      <div className="text-sm text-gray-500">
                        Automatiza emails y newsletters
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Conectar
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-purple-500 mr-3" />
                    <div>
                      <div className="font-medium">Google Calendar</div>
                      <div className="text-sm text-gray-500">
                        Sincroniza sesiones de entrenamiento
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Conectar
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <CreditCard className="h-8 w-8 text-yellow-500 mr-3" />
                    <div>
                      <div className="font-medium">Stripe Payments</div>
                      <div className="text-sm text-gray-500">
                        Procesa pagos de forma segura
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Conectar
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
