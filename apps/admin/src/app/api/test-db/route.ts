import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient({
  datasourceUrl: "file:../../../../backend/prisma/dev.db",
});

export async function GET() {
  try {
    // Test database connection
    const trainers = await prisma.trainer.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    console.log("Found trainers:", trainers);

    return NextResponse.json({
      success: true,
      trainers,
      message: "Database connection successful",
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        details: error,
      },
      { status: 500 }
    );
  }
}
