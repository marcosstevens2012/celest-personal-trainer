import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { token: string } }) {
  const { token } = params;

  try {
    const { dayId, completed, rating, notes } = await request.json();

    // Verificar que el plan existe con el token
    const plan = await prisma.plan.findFirst({
      where: { publicToken: token },
      include: {
        student: true,
        days: true,
      },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // Verificar que el día pertenece al plan
    const planDay = plan.days.find((day) => day.id === dayId);
    if (!planDay) {
      return NextResponse.json({ error: "Plan day not found" }, { status: 404 });
    }

    if (!plan.student) {
      return NextResponse.json({ error: "No student assigned to this plan" }, { status: 400 });
    }

    // Crear o actualizar el progreso
    const progress = await prisma.planDayProgress.upsert({
      where: {
        planDayId_studentId: {
          planDayId: dayId,
          studentId: plan.student.id,
        },
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null,
        rating: rating || null,
        notes: notes || null,
      },
      create: {
        planDayId: dayId,
        planId: plan.id,
        studentId: plan.student.id,
        completed,
        completedAt: completed ? new Date() : null,
        rating: rating || null,
        notes: notes || null,
      },
    });

    // Actualizar el campo completed en PlanDay si está completado
    if (completed) {
      await prisma.planDay.update({
        where: { id: dayId },
        data: {
          completed: true,
          completedAt: new Date(),
        },
      });
    } else {
      await prisma.planDay.update({
        where: { id: dayId },
        data: {
          completed: false,
          completedAt: null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
