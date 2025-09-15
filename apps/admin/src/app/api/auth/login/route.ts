import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
// import bcrypt from "bcryptjs"; // Para futuro uso con passwords hasheados

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here";

export async function POST(request: NextRequest) {
  console.log("=== LOGIN REQUEST START ===");

  try {
    const body = await request.json();
    const { email, password } = body;

    console.log("Received email:", email);
    console.log(
      "Received password:",
      password ? "[PASSWORD PROVIDED]" : "[NO PASSWORD]"
    );
    console.log("JWT_SECRET exists:", !!JWT_SECRET);

    if (!email || !password) {
      console.log("Missing email or password");
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    console.log("Attempting to connect to database...");

    // Buscar el trainer por email
    const trainer = await prisma.trainer.findUnique({
      where: { email: email.toLowerCase() },
    });

    console.log("Trainer found:", trainer ? `Yes - ${trainer.name}` : "No");

    // Para desarrollo, usar password simple
    // En producción, comparar con bcrypt
    let isValidPassword = false;

    if (password === "admin123") {
      isValidPassword = true;
    }
    // Si hay un hash de password guardado, usar bcrypt
    // else if (trainer.passwordHash) {
    //   isValidPassword = await bcrypt.compare(password, trainer.passwordHash);
    // }

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Crear JWT token
    const token = jwt.sign(
      {
        userId: trainer.id,
        email: trainer.email,
        name: trainer.name,
        role: "trainer",
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Respuesta exitosa
    console.log("Login successful, returning token");
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: trainer.id,
        email: trainer.email,
        name: trainer.name,
        role: "trainer",
        profileImage: trainer.profileImage,
      },
    });
  } catch (error) {
    console.error("=== LOGIN ERROR ===");
    console.error("Error details:", error);
    console.error(
      "Error message:",
      error instanceof Error ? error.message : "Unknown error"
    );
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack"
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    console.log("=== LOGIN REQUEST END ===");
  }
}
