import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs"; // Para futuro uso con passwords hasheados

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Buscar el trainer por email
    const trainer = await prisma.trainer.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!trainer) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

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
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}