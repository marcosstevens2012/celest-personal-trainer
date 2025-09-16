"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
          <p className="text-muted-foreground">
            Gestiona tu perfil y preferencias de la aplicación
          </p>
        </div>

        <Separator />

        {/* Tab Navigation */}
        <div>
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </Button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Image */}
                <div className="flex items-center space-x-6">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    {profile.profileImage ? (
                      <img
                        src={profile.profileImage}
                        alt="Profile"
                        className="h-20 w-20 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Cambiar Foto
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      JPG, GIF o PNG. Máximo 1MB.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input
                      id="name"
                      type="text"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Ubicación</Label>
                    <Input
                      id="address"
                      type="text"
                      value={profile.address}
                      onChange={(e) =>
                        setProfile({ ...profile, address: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biografía</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Certificaciones</Label>
                  <div className="flex flex-wrap gap-2">
                    {profile.certifications.map((cert, index) => (
                      <Badge key={index} variant="secondary">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />
                
                <div className="flex justify-end">
                  <Button onClick={handleProfileSave} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Preferencias de Notificación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Notificaciones por Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibir notificaciones en tu email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        emailNotifications: checked,
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Notificaciones SMS</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibir notificaciones por mensaje de texto
                    </p>
                  </div>
                  <Switch
                    checked={notifications.smsNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        smsNotifications: checked,
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Recordatorios de Pagos</Label>
                    <p className="text-sm text-muted-foreground">
                      Alertas sobre pagos pendientes y vencidos
                    </p>
                  </div>
                  <Switch
                    checked={notifications.paymentReminders}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        paymentReminders: checked,
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Vencimiento de Planes</Label>
                    <p className="text-sm text-muted-foreground">
                      Alertas cuando los planes están por vencer
                    </p>
                  </div>
                  <Switch
                    checked={notifications.planExpirations}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        planExpirations: checked,
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button onClick={handleNotificationsSave} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </div>
              </CardContent>
            </Card>
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
