import { NextResponse } from "next/server";

export async function POST() {
  // Para JWT no necesitamos hacer nada en el servidor para logout
  // El cliente simplemente borra el token del localStorage
  return NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });
}