require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function createDemoUser() {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: "trainer@example.com" },
    });

    if (existingUser) {
      console.log("Demo user already exists");
      return;
    }

    // Create demo user
    const demoUser = await prisma.user.create({
      data: {
        email: "trainer@example.com",
        name: "Demo Trainer",
        role: "TRAINER",
      },
    });

    // Create associated trainer record
    await prisma.trainer.create({
      data: {
        userId: demoUser.id,
        name: "Demo Trainer",
        email: "trainer@example.com",
        phone: "+1234567890",
        specialization: "Personal Training",
        certifications: ["ACSM Certified Personal Trainer"],
        bio: "Entrenador personal demo con amplia experiencia en fitness y bienestar.",
      },
    });

    console.log("Demo user and trainer created successfully");
    console.log("Email: trainer@example.com");
    console.log("Password: admin123");
  } catch (error) {
    console.error("Error creating demo user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createDemoUser();
