import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../lib/prisma";

// Validation schemas
const createPlanDaySchema = z.object({
  planId: z.string().min(1, "Plan ID is required"),
  dayNumber: z.number().int().min(1, "Day number must be at least 1"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  restDay: z.boolean().optional().default(false),
});

// GET /api/plans/days - List plan days for a plan
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const planId = searchParams.get("planId");

    if (!planId) {
      return NextResponse.json(
        { success: false, error: "Plan ID is required" },
        { status: 400 }
      );
    }

    const planDays = await prisma.planDay.findMany({
      where: { planId },
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
      orderBy: { dayNumber: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: planDays,
    });
  } catch (error) {
    console.error("Error fetching plan days:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/plans/days - Create new plan day
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = createPlanDaySchema.safeParse(body);
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

    // Check if plan exists
    const plan = await prisma.plan.findUnique({
      where: { id: data.planId },
    });

    if (!plan) {
      return NextResponse.json(
        { success: false, error: "Plan not found" },
        { status: 404 }
      );
    }

    // Check if day number already exists for this plan
    const existingDay = await prisma.planDay.findFirst({
      where: {
        planId: data.planId,
        dayNumber: data.dayNumber,
      },
    });

    if (existingDay) {
      return NextResponse.json(
        { success: false, error: "Day number already exists for this plan" },
        { status: 409 }
      );
    }

    const planDay = await prisma.planDay.create({
      data: {
        planId: data.planId,
        dayNumber: data.dayNumber,
        name: data.name,
        description: data.description,
        restDay: data.restDay,
      },
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
    });

    return NextResponse.json({
      success: true,
      data: planDay,
      message: "Plan day created successfully",
    });
  } catch (error) {
    console.error("Error creating plan day:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/plans/days - Update plan day
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const planDayId = searchParams.get("id");

    if (!planDayId) {
      return NextResponse.json(
        { success: false, error: "Plan day ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const updateData: Record<string, unknown> = {};
    if (body.dayNumber) updateData.dayNumber = body.dayNumber;
    if (body.name) updateData.name = body.name;
    if (body.description !== undefined)
      updateData.description = body.description;
    if (body.restDay !== undefined) updateData.restDay = body.restDay;

    const planDay = await prisma.planDay.update({
      where: { id: planDayId },
      data: updateData,
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
    });

    return NextResponse.json({
      success: true,
      data: planDay,
      message: "Plan day updated successfully",
    });
  } catch (error) {
    console.error("Error updating plan day:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/plans/days - Delete plan day
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const planDayId = searchParams.get("id");

    if (!planDayId) {
      return NextResponse.json(
        { success: false, error: "Plan day ID is required" },
        { status: 400 }
      );
    }

    // Delete all related plan blocks and items first
    await prisma.planItem.deleteMany({
      where: {
        planBlock: {
          planDayId,
        },
      },
    });

    await prisma.planBlock.deleteMany({
      where: { planDayId },
    });

    await prisma.planDay.delete({
      where: { id: planDayId },
    });

    return NextResponse.json({
      success: true,
      message: "Plan day deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting plan day:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
