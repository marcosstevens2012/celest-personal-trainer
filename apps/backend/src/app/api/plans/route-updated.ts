import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";

// Validation schemas
const createPlanSchema = z.object({
  trainerId: z.string().min(1, "Trainer ID is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  duration: z.string().optional(),
  features: z.array(z.string()),
  planType: z
    .enum(["PERSONAL", "GROUP", "ONLINE"])
    .optional()
    .default("PERSONAL"),
  difficultyLevel: z
    .enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"])
    .optional()
    .default("BEGINNER"),
  categoryTags: z.array(z.string()).optional().default([]),
  notes: z.string().optional(),
});

// GET /api/plans - List plans for a trainer
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trainerId = searchParams.get("trainerId");
    const studentId = searchParams.get("studentId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const isActive = searchParams.get("isActive");
    const planType = searchParams.get("planType");
    const difficultyLevel = searchParams.get("difficultyLevel");

    if (!trainerId) {
      return NextResponse.json(
        { success: false, error: "Trainer ID is required" },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = { trainerId };

    if (isActive !== null) {
      where.isActive = isActive === "true";
    }

    if (planType) {
      where.planType = planType;
    }

    if (difficultyLevel) {
      where.difficultyLevel = difficultyLevel;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // If studentId is provided, filter plans assigned to that student
    if (studentId) {
      where.studentId = studentId;
    }

    const [plans, totalCount] = await Promise.all([
      prisma.plan.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          planDays: {
            orderBy: { dayNumber: "asc" },
            include: {
              planBlocks: {
                orderBy: { order: "asc" },
                include: {
                  planItems: {
                    orderBy: { order: "asc" },
                  },
                },
              },
            },
          },
          _count: {
            select: {
              planDays: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.plan.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: plans,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/plans - Create new plan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = createPlanSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          details: validation.error.errors,
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

    const plan = await prisma.plan.create({
      data: {
        trainerId: data.trainerId,
        name: data.name,
        description: data.description,
        price: data.price,
        duration: data.duration,
        features: data.features,
        planType: data.planType,
        difficultyLevel: data.difficultyLevel,
        categoryTags: data.categoryTags,
        notes: data.notes,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        studentId: body.studentId || null,
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        planDays: {
          orderBy: { dayNumber: "asc" },
          include: {
            planBlocks: {
              orderBy: { order: "asc" },
              include: {
                planItems: {
                  orderBy: { order: "asc" },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: plan,
      message: "Plan created successfully",
    });
  } catch (error) {
    console.error("Error creating plan:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/plans - Update plan
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const planId = searchParams.get("id");

    if (!planId) {
      return NextResponse.json(
        { success: false, error: "Plan ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const updateData: Record<string, unknown> = {};
    if (body.name) updateData.name = body.name;
    if (body.description !== undefined)
      updateData.description = body.description;
    if (body.price) updateData.price = body.price;
    if (body.duration) updateData.duration = body.duration;
    if (body.features) updateData.features = body.features;
    if (body.planType) updateData.planType = body.planType;
    if (body.difficultyLevel) updateData.difficultyLevel = body.difficultyLevel;
    if (body.categoryTags) updateData.categoryTags = body.categoryTags;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.startDate) updateData.startDate = new Date(body.startDate);
    if (body.endDate) updateData.endDate = new Date(body.endDate);
    if (body.studentId !== undefined) updateData.studentId = body.studentId;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const plan = await prisma.plan.update({
      where: { id: planId },
      data: updateData,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        planDays: {
          orderBy: { dayNumber: "asc" },
          include: {
            planBlocks: {
              orderBy: { order: "asc" },
              include: {
                planItems: {
                  orderBy: { order: "asc" },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: plan,
      message: "Plan updated successfully",
    });
  } catch (error) {
    console.error("Error updating plan:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/plans - Delete plan (soft delete)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const planId = searchParams.get("id");

    if (!planId) {
      return NextResponse.json(
        { success: false, error: "Plan ID is required" },
        { status: 400 }
      );
    }

    const plan = await prisma.plan.update({
      where: { id: planId },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      data: plan,
      message: "Plan deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting plan:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
