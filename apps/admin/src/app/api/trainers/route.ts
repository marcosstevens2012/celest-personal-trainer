import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";

// Validation schemas
const createTrainerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  bio: z.string().optional(),
  specializations: z.array(z.string()).optional().default([]),
  certifications: z.array(z.string()).optional().default([]),
  profileImage: z.string().optional(),
  hourlyRate: z.number().positive("Hourly rate must be positive").optional(),
  experience: z
    .number()
    .int()
    .min(0, "Experience must be 0 or greater")
    .optional(),
  location: z.string().optional(),
  availability: z.record(z.any()).optional(),
});

// GET /api/trainers - List all trainers or get specific trainer
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trainerId = searchParams.get("id");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const isActive = searchParams.get("isActive");
    const specialization = searchParams.get("specialization");

    if (trainerId) {
      // Get specific trainer with related data
      const trainer = await prisma.trainer.findUnique({
        where: { id: trainerId },
        include: {
          students: {
            where: { isActive: true },
            select: {
              id: true,
              name: true,
              email: true,
              createdAt: true,
            },
          },
          plans: {
            where: { isActive: true },
            select: {
              id: true,
              name: true,
              price: true,
              createdAt: true,
              student: {
                select: {
                  name: true,
                },
              },
            },
          },
          _count: {
            select: {
              students: true,
              plans: true,
            },
          },
        },
      });

      if (!trainer) {
        return NextResponse.json(
          { success: false, error: "Trainer not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: trainer,
      });
    }

    // List all trainers with pagination and filters
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (isActive !== null) {
      where.isActive = isActive === "true";
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { bio: { contains: search, mode: "insensitive" } },
      ];
    }

    if (specialization) {
      where.specializations = {
        has: specialization,
      };
    }

    const [trainers, totalCount] = await Promise.all([
      prisma.trainer.findMany({
        where,
        include: {
          _count: {
            select: {
              students: true,
              plans: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.trainer.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: trainers,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching trainers:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/trainers - Create new trainer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = createTrainerSchema.safeParse(body);
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

    // Check if email is already taken
    const existingTrainer = await prisma.trainer.findUnique({
      where: { email: data.email },
    });

    if (existingTrainer) {
      return NextResponse.json(
        { success: false, error: "Trainer with this email already exists" },
        { status: 409 }
      );
    }

    const trainer = await prisma.trainer.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        bio: data.bio,
        specializations: data.specializations,
        certifications: data.certifications,
        profileImage: data.profileImage,
        hourlyRate: data.hourlyRate,
        experience: data.experience,
        location: data.location,
        availability: data.availability,
      },
    });

    return NextResponse.json({
      success: true,
      data: trainer,
      message: "Trainer created successfully",
    });
  } catch (error) {
    console.error("Error creating trainer:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/trainers - Update trainer
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trainerId = searchParams.get("id");

    if (!trainerId) {
      return NextResponse.json(
        { success: false, error: "Trainer ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const updateData: Record<string, unknown> = {};
    if (body.name) updateData.name = body.name;
    if (body.email) updateData.email = body.email;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.bio !== undefined) updateData.bio = body.bio;
    if (body.specializations) updateData.specializations = body.specializations;
    if (body.certifications) updateData.certifications = body.certifications;
    if (body.profileImage !== undefined)
      updateData.profileImage = body.profileImage;
    if (body.hourlyRate !== undefined) updateData.hourlyRate = body.hourlyRate;
    if (body.experience !== undefined) updateData.experience = body.experience;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.availability !== undefined)
      updateData.availability = body.availability;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const trainer = await prisma.trainer.update({
      where: { id: trainerId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: trainer,
      message: "Trainer updated successfully",
    });
  } catch (error) {
    console.error("Error updating trainer:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/trainers - Delete trainer (soft delete)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trainerId = searchParams.get("id");

    if (!trainerId) {
      return NextResponse.json(
        { success: false, error: "Trainer ID is required" },
        { status: 400 }
      );
    }

    const trainer = await prisma.trainer.update({
      where: { id: trainerId },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      data: trainer,
      message: "Trainer deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting trainer:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
