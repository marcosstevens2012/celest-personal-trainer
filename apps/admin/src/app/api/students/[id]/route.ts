import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../backend/src/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const student = await prisma.student.findUnique({
      where: { id: params.id },
      include: {
        trainer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json(
      { error: "Error fetching student" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const student = await prisma.student.update({
      where: { id: params.id },
      data: {
        name: body.name,
        lastName: body.lastName,
        alias: body.alias || null,
        phone: body.phone,
        email: body.email || null,
        monthlyFee: body.monthlyFee,
        status: body.status,
        notes: body.notes || null,
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
        goals: body.goals || "[]",
        medicalConditions: body.medicalConditions || null,
        emergencyContact: body.emergencyContact || null,
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
    console.error("Error updating student:", error);
    return NextResponse.json(
      { error: "Error updating student" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.student.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { error: "Error deleting student" },
      { status: 500 }
    );
  }
}
