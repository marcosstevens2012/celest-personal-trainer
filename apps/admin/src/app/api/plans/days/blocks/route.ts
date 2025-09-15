import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../../lib/prisma";

// Validation schemas
const createPlanBlockSchema = z.object({
  planDayId: z.string().min(1, "Plan day ID is required"),
  name: z.string().min(1, "Name is required"),
  blockType: z
    .enum(["WARMUP", "MAIN", "COOLDOWN", "CARDIO", "STRENGTH"])
    .default("MAIN"),
  order: z.number().int().min(0, "Order must be 0 or greater"),
  restBetweenSets: z
    .number()
    .int()
    .min(0, "Rest between sets must be 0 or greater")
    .optional()
    .default(60),
  notes: z.string().optional(),
});

// GET /api/plans/days/blocks - List plan blocks for a plan day
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const planDayId = searchParams.get("planDayId");

    if (!planDayId) {
      return NextResponse.json(
        { success: false, error: "Plan day ID is required" },
        { status: 400 }
      );
    }

    const planBlocks = await prisma.planBlock.findMany({
      where: { planDayId },
      include: {
        planItems: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: planBlocks,
    });
  } catch (error) {
    console.error("Error fetching plan blocks:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/plans/days/blocks - Create new plan block
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = createPlanBlockSchema.safeParse(body);
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

    // Check if plan day exists
    const planDay = await prisma.planDay.findUnique({
      where: { id: data.planDayId },
    });

    if (!planDay) {
      return NextResponse.json(
        { success: false, error: "Plan day not found" },
        { status: 404 }
      );
    }

    const planBlock = await prisma.planBlock.create({
      data: {
        planDayId: data.planDayId,
        name: data.name,
        blockType: data.blockType,
        order: data.order,
        restBetweenSets: data.restBetweenSets,
        notes: data.notes,
      },
      include: {
        planItems: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: planBlock,
      message: "Plan block created successfully",
    });
  } catch (error) {
    console.error("Error creating plan block:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/plans/days/blocks - Update plan block
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const planBlockId = searchParams.get("id");

    if (!planBlockId) {
      return NextResponse.json(
        { success: false, error: "Plan block ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const updateData: Record<string, unknown> = {};
    if (body.name) updateData.name = body.name;
    if (body.blockType) updateData.blockType = body.blockType;
    if (body.order !== undefined) updateData.order = body.order;
    if (body.restBetweenSets !== undefined)
      updateData.restBetweenSets = body.restBetweenSets;
    if (body.notes !== undefined) updateData.notes = body.notes;

    const planBlock = await prisma.planBlock.update({
      where: { id: planBlockId },
      data: updateData,
      include: {
        planItems: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: planBlock,
      message: "Plan block updated successfully",
    });
  } catch (error) {
    console.error("Error updating plan block:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/plans/days/blocks - Delete plan block
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const planBlockId = searchParams.get("id");

    if (!planBlockId) {
      return NextResponse.json(
        { success: false, error: "Plan block ID is required" },
        { status: 400 }
      );
    }

    // Delete all related plan items first
    await prisma.planItem.deleteMany({
      where: { planBlockId },
    });

    await prisma.planBlock.delete({
      where: { id: planBlockId },
    });

    return NextResponse.json({
      success: true,
      message: "Plan block deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting plan block:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
