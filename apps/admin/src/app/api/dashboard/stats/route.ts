import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here";

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "No authorization header" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const trainerId = decoded.userId;

    // Obtener estadísticas del trainer
    const [totalStudents, totalPlans, activePlans, recentActivities] = await Promise.all([
      // Total de estudiantes
      prisma.student.count({
        where: { trainerId },
      }),

      // Total de planes
      prisma.plan.count({
        where: { trainerId },
      }),

      // Planes activos
      prisma.plan.count({
        where: {
          trainerId,
          isActive: true,
        },
      }),

      // Actividades recientes (últimos planes creados, estudiantes, etc.)
      Promise.all([
        prisma.student.findMany({
          where: { trainerId },
          orderBy: { createdAt: "desc" },
          take: 3,
          select: {
            id: true,
            name: true,
            lastName: true,
            createdAt: true,
          },
        }),
        prisma.plan.findMany({
          where: { trainerId },
          orderBy: { createdAt: "desc" },
          take: 3,
          select: {
            id: true,
            name: true,
            createdAt: true,
            student: {
              select: {
                name: true,
                lastName: true,
              },
            },
          },
        }),
      ]),
    ]);

    const [recentStudents, recentPlans] = recentActivities;

    // Calcular estadísticas adicionales
    const activeStudents = totalStudents; // Por ahora consideramos todos activos
    const monthlyRevenue = 25000; // Mock por ahora, luego se puede calcular con pagos reales

    // Generar actividades recientes
    const activities = [];

    // Agregar estudiantes recientes
    recentStudents.forEach((student) => {
      activities.push({
        id: `student-${student.id}`,
        type: "student" as const,
        message: `Nuevo estudiante registrado: ${student.name} ${student.lastName}`,
        date: student.createdAt.toISOString(),
      });
    });

    // Agregar planes recientes
    recentPlans.forEach((plan) => {
      activities.push({
        id: `plan-${plan.id}`,
        type: "plan" as const,
        message: `Plan '${plan.name}' ${plan.student ? `asignado a ${plan.student.name} ${plan.student.lastName}` : "creado"}`,
        date: plan.createdAt.toISOString(),
      });
    });

    // Ordenar por fecha más reciente
    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({
      success: true,
      data: {
        kpiData: {
          totalStudents,
          activeStudents,
          totalPlans,
          activePlans,
          monthlyRevenue,
          pendingPayments: 0, // Mock por ahora
          overduePayments: 0, // Mock por ahora
        },
        recentActivity: activities.slice(0, 5), // Últimas 5 actividades
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
