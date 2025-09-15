import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { CreateStudentDto } from "@repo/types";
import { z } from "zod";

// Validation schemas
const createStudentSchema = z.object({
  trainerId: z.string().min(1, "Trainer ID is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  goals: z.array(z.string()),
  medicalConditions: z.string().optional(),
  emergencyContact: z.object({
    name: z.string(),
    phone: z.string(),
    relationship: z.string(),
  }).optional(),
});

// GET /api/students - List students for a trainer
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trainerId = searchParams.get("trainerId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const isActive = searchParams.get("isActive");

    if (!trainerId) {
      return NextResponse.json(
        { success: false, error: "Trainer ID is required" },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { trainerId };
    
    if (isActive !== null) {
      where.isActive = isActive === "true";
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [students, totalCount] = await Promise.all([
      prisma.student.findMany({
        where,
        include: {
          plans: {
            where: { isActive: true },
            select: {
              id: true,
              name: true,
              startDate: true,
              endDate: true,
              price: true,
            },
          },
          payments: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: {
              id: true,
              status: true,
              dueDate: true,
              paidDate: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.student.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: students,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/students - Create new student
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validation = createStudentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Validation error",
          details: validation.error.errors 
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Check if trainer exists
    const trainer = await prisma.trainer.findUnique({
      where: { id: data.trainerId },
    });

    if (!trainer) {
      return NextResponse.json(
        { success: false, error: "Trainer not found" },
        { status: 404 }
      );
    }

    // Check if email is already taken
    const existingStudent = await prisma.student.findFirst({
      where: {
        email: data.email,
        trainerId: data.trainerId,
      },
    });

    if (existingStudent) {
      return NextResponse.json(
        { success: false, error: "Student with this email already exists" },
        { status: 409 }
      );
    }

    const student = await prisma.student.create({
      data: {
        trainerId: data.trainerId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        goals: data.goals,
        medicalConditions: data.medicalConditions,
        emergencyContact: data.emergencyContact,
      },
      include: {
        plans: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true,
            price: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: student,
      message: "Student created successfully",
    });
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/students - Update student
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("id");

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: "Student ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    const updateData: any = {};
    if (body.name) updateData.name = body.name;
    if (body.email) updateData.email = body.email;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.birthDate) updateData.birthDate = new Date(body.birthDate);
    if (body.goals) updateData.goals = body.goals;
    if (body.medicalConditions !== undefined) updateData.medicalConditions = body.medicalConditions;
    if (body.emergencyContact !== undefined) updateData.emergencyContact = body.emergencyContact;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const student = await prisma.student.update({
      where: { id: studentId },
      data: updateData,
      include: {
        plans: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true,
            price: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: student,
      message: "Student updated successfully",
    });
  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/students - Delete student (soft delete)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("id");

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: "Student ID is required" },
        { status: 400 }
      );
    }

    const student = await prisma.student.update({
      where: { id: studentId },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      data: student,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
