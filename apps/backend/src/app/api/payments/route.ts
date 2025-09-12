import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";

// Validation schemas
const createPaymentSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  amount: z.number().positive("Amount must be positive"),
  description: z.string().optional(),
  paymentMethod: z
    .enum([
      "CASH",
      "CREDIT_CARD",
      "DEBIT_CARD",
      "BANK_TRANSFER",
      "PAYPAL",
      "OTHER",
    ])
    .default("CASH"),
  status: z
    .enum(["PENDING", "PAID", "OVERDUE", "CANCELLED"])
    .default("PENDING"),
  dueDate: z.string().min(1, "Due date is required"),
  notes: z.string().optional(),
});

// GET /api/payments - List payments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trainerId = searchParams.get("trainerId");
    const studentId = searchParams.get("studentId");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (studentId) {
      where.studentId = studentId;
    } else if (trainerId) {
      // If no studentId but trainerId is provided, get all payments for trainer's students
      where.student = {
        trainerId: trainerId,
      };
    }

    if (status) {
      where.status = status;
    }

    if (startDate && endDate) {
      where.dueDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (startDate) {
      where.dueDate = {
        gte: new Date(startDate),
      };
    } else if (endDate) {
      where.dueDate = {
        lte: new Date(endDate),
      };
    }

    const [payments, totalCount] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
              trainerId: true,
            },
          },
        },
        orderBy: { dueDate: "desc" },
        skip,
        take: limit,
      }),
      prisma.payment.count({ where }),
    ]);

    // Calculate summary statistics
    const summary = await prisma.payment.aggregate({
      where,
      _sum: {
        amount: true,
      },
      _count: {
        _all: true,
      },
    });

    const statusBreakdown = await prisma.payment.groupBy({
      by: ["status"],
      where,
      _sum: {
        amount: true,
      },
      _count: {
        _all: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: payments,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      summary: {
        totalAmount: summary._sum.amount || 0,
        totalCount: summary._count._all,
        statusBreakdown,
      },
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/payments - Create new payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = createPaymentSchema.safeParse(body);
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

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id: data.studentId },
    });

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Student not found" },
        { status: 404 }
      );
    }

    const payment = await prisma.payment.create({
      data: {
        studentId: data.studentId,
        amount: data.amount,
        description: data.description,
        paymentMethod: data.paymentMethod,
        status: data.status,
        dueDate: new Date(data.dueDate),
        notes: data.notes,
        paidDate: data.status === "PAID" ? new Date() : null,
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: payment,
      message: "Payment created successfully",
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/payments - Update payment
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get("id");

    if (!paymentId) {
      return NextResponse.json(
        { success: false, error: "Payment ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const updateData: Record<string, unknown> = {};
    if (body.amount) updateData.amount = body.amount;
    if (body.description !== undefined)
      updateData.description = body.description;
    if (body.paymentMethod) updateData.paymentMethod = body.paymentMethod;
    if (body.status) {
      updateData.status = body.status;
      // Automatically set paidDate when status changes to PAID
      if (body.status === "PAID") {
        updateData.paidDate = new Date();
      } else if (body.status !== "PAID") {
        updateData.paidDate = null;
      }
    }
    if (body.dueDate) updateData.dueDate = new Date(body.dueDate);
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.paidDate !== undefined) {
      updateData.paidDate = body.paidDate ? new Date(body.paidDate) : null;
    }

    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: updateData,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: payment,
      message: "Payment updated successfully",
    });
  } catch (error) {
    console.error("Error updating payment:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/payments - Delete payment
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get("id");

    if (!paymentId) {
      return NextResponse.json(
        { success: false, error: "Payment ID is required" },
        { status: 400 }
      );
    }

    await prisma.payment.delete({
      where: { id: paymentId },
    });

    return NextResponse.json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting payment:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
