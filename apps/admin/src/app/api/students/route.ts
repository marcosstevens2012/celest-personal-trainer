import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../backend/src/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const students = await prisma.student.findMany({
      include: {
        trainer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Error fetching students" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get the first trainer (for single-tenant setup)
    const trainer = await prisma.trainer.findFirst();

    if (!trainer) {
      return NextResponse.json(
        { error: "No trainer found. Please create a trainer first." },
        { status: 400 }
      );
    }

    const student = await prisma.student.create({
      data: {
        name: body.name,
        lastName: body.lastName,
        alias: body.alias || null,
        phone: body.phone,
        email: body.email || null,
        monthlyFee: body.monthlyFee,
        status: body.status || "ACTIVE",
        notes: body.notes || null,
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
        goals: body.goals || "[]",
        medicalConditions: body.medicalConditions || null,
        emergencyContact: body.emergencyContact || null,
        trainerId: trainer.id,
      },
      include: {
        trainer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json(
      { error: "Error creating student" },
      { status: 500 }
    );
  }
}
