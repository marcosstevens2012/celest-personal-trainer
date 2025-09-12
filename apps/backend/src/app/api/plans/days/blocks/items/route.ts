import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../../../lib/prisma";

// Validation schemas
const createPlanItemSchema = z.object({
  planBlockId: z.string().min(1, "Plan block ID is required"),
  exerciseName: z.string().min(1, "Exercise name is required"),
  exerciseType: z
    .enum([
      "STRENGTH",
      "CARDIO",
      "FLEXIBILITY",
      "BALANCE",
      "PLYOMETRIC",
      "OTHER",
    ])
    .default("STRENGTH"),
  sets: z.number().int().min(1, "Sets must be at least 1").optional(),
  reps: z.string().optional(), // Can be "10", "8-12", "to failure", etc.
  weight: z.string().optional(), // Can be "20kg", "bodyweight", "medium resistance", etc.
  duration: z.string().optional(), // For cardio: "30 seconds", "5 minutes", etc.
  distance: z.string().optional(), // For cardio: "100m", "1 mile", etc.
  restTime: z
    .number()
    .int()
    .min(0, "Rest time must be 0 or greater")
    .optional(),
  order: z.number().int().min(0, "Order must be 0 or greater"),
  notes: z.string().optional(),
  equipment: z.array(z.string()).optional().default([]),
  targetMuscles: z.array(z.string()).optional().default([]),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional().default("MEDIUM"),
});

// GET /api/plans/days/blocks/items - List plan items for a plan block
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const planBlockId = searchParams.get("planBlockId");

    if (!planBlockId) {
      return NextResponse.json(
        { success: false, error: "Plan block ID is required" },
        { status: 400 }
      );
    }

    const planItems = await prisma.planItem.findMany({
      where: { planBlockId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: planItems,
    });
  } catch (error) {
    console.error("Error fetching plan items:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/plans/days/blocks/items - Create new plan item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = createPlanItemSchema.safeParse(body);
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

    // Check if plan block exists
    const planBlock = await prisma.planBlock.findUnique({
      where: { id: data.planBlockId },
    });

    if (!planBlock) {
      return NextResponse.json(
        { success: false, error: "Plan block not found" },
        { status: 404 }
      );
    }

    const planItem = await prisma.planItem.create({
      data: {
        planBlockId: data.planBlockId,
        exerciseName: data.exerciseName,
        exerciseType: data.exerciseType,
        sets: data.sets,
        reps: data.reps,
        weight: data.weight,
        duration: data.duration,
        distance: data.distance,
        restTime: data.restTime,
        order: data.order,
        notes: data.notes,
        equipment: data.equipment,
        targetMuscles: data.targetMuscles,
        difficulty: data.difficulty,
      },
    });

    return NextResponse.json({
      success: true,
      data: planItem,
      message: "Plan item created successfully",
    });
  } catch (error) {
    console.error("Error creating plan item:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/plans/days/blocks/items - Update plan item
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const planItemId = searchParams.get("id");

    if (!planItemId) {
      return NextResponse.json(
        { success: false, error: "Plan item ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const updateData: Record<string, unknown> = {};
    if (body.exerciseName) updateData.exerciseName = body.exerciseName;
    if (body.exerciseType) updateData.exerciseType = body.exerciseType;
    if (body.sets !== undefined) updateData.sets = body.sets;
    if (body.reps !== undefined) updateData.reps = body.reps;
    if (body.weight !== undefined) updateData.weight = body.weight;
    if (body.duration !== undefined) updateData.duration = body.duration;
    if (body.distance !== undefined) updateData.distance = body.distance;
    if (body.restTime !== undefined) updateData.restTime = body.restTime;
    if (body.order !== undefined) updateData.order = body.order;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.equipment) updateData.equipment = body.equipment;
    if (body.targetMuscles) updateData.targetMuscles = body.targetMuscles;
    if (body.difficulty) updateData.difficulty = body.difficulty;

    const planItem = await prisma.planItem.update({
      where: { id: planItemId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: planItem,
      message: "Plan item updated successfully",
    });
  } catch (error) {
    console.error("Error updating plan item:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/plans/days/blocks/items - Delete plan item
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const planItemId = searchParams.get("id");

    if (!planItemId) {
      return NextResponse.json(
        { success: false, error: "Plan item ID is required" },
        { status: 400 }
      );
    }

    await prisma.planItem.delete({
      where: { id: planItemId },
    });

    return NextResponse.json({
      success: true,
      message: "Plan item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting plan item:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
