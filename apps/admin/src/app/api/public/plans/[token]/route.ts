import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  const { token } = params;

  if (!token) {
    return NextResponse.json(
      { error: "Token is required" },
      { status: 400 }
    );
  }

  try {
    // Buscar el plan por el token público
    const plan = await prisma.plan.findFirst({
      where: {
        publicToken: token,
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            lastName: true,
          },
        },
        trainer: {
          select: {
            id: true,
            name: true,
            phone: true,
            whatsapp: true,
            instagram: true,
          },
        },
        planDays: {
          orderBy: {
            dayNumber: 'asc',
          },
          include: {
            blocks: {
              orderBy: {
                createdAt: 'asc',
              },
              include: {
                items: {
                  orderBy: {
                    createdAt: 'asc',
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    // Formatear la respuesta para el frontend
    const formattedPlan = {
      id: plan.id,
      name: plan.name,
      description: plan.description,
      duration: plan.duration,
      difficultyLevel: plan.difficultyLevel,
      publicToken: plan.publicToken,
      student: plan.student,
      trainer: plan.trainer,
      planDays: plan.planDays.map(day => ({
        id: day.id,
        dayNumber: day.dayNumber,
        name: day.name,
        description: day.description,
        completed: day.completed || false,
        blocks: day.blocks.map(block => ({
          id: block.id,
          blockType: block.blockType,
          name: block.name,
          description: block.description,
          items: block.items.map(item => ({
            id: item.id,
            name: item.name,
            sets: item.sets,
            reps: item.reps,
            weight: item.weight,
            duration: item.duration,
            notes: item.notes,
          })),
        })),
      })),
    };

    return NextResponse.json(formattedPlan);
  } catch (error) {
    console.error("Error fetching public plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}