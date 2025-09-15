const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function createDemoUser() {
  try {
    // Check if trainer already exists
    const existingTrainer = await prisma.trainer.findUnique({
      where: { email: "trainer@example.com" },
    });

    if (existingTrainer) {
      console.log("Demo trainer already exists:", existingTrainer.email);
      return existingTrainer;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create trainer
    const trainer = await prisma.trainer.create({
      data: {
        email: "trainer@example.com",
        name: "Demo Trainer",
        bio: "Professional fitness trainer with 5+ years of experience",
        specialties: JSON.stringify([
          "Weight Loss",
          "Muscle Building",
          "Cardio",
        ]),
        certifications: JSON.stringify([
          "ACSM Certified",
          "NASM Personal Trainer",
        ]),
        phone: "+1234567890",
        profileImage: null,
        instagram: "@demotrainer",
        whatsapp: "+1234567890",
      },
    });

    console.log("✅ Demo trainer created successfully!");
    console.log("📧 Email:", trainer.email);
    console.log("🔑 Password: admin123");
    console.log("👤 Name:", trainer.name);

    return trainer;
  } catch (error) {
    console.error("Error creating demo trainer:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
createDemoUser()
  .then((trainer) => {
    console.log("\n🎉 Demo setup complete! You can now sign in with:");
    console.log("Email: trainer@example.com");
    console.log("Password: admin123");
  })
  .catch((error) => {
    console.error("Failed to create demo trainer:", error);
    process.exit(1);
  });
