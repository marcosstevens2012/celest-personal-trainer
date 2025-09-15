const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function createDemoStudents() {
  try {
    // Get the trainer first
    const trainer = await prisma.trainer.findFirst();

    if (!trainer) {
      console.error(
        "No trainer found. Please run create-demo-trainer.js first"
      );
      return;
    }

    // Create demo students
    const students = [
      {
        trainerId: trainer.id,
        name: "María González",
        lastName: "González",
        alias: "Mari",
        phone: "+54 9 11 1234-5678",
        email: "maria.gonzalez@email.com",
        monthlyFee: 25000,
        status: "ACTIVE",
        notes: "Muy motivada, viene 3 veces por semana",
        birthDate: new Date("1990-03-15"),
        goals: JSON.stringify(["Bajar de peso", "Ganar fuerza"]),
        medicalConditions: "Ninguna",
        emergencyContact: JSON.stringify({
          name: "Carlos González",
          phone: "+54 9 11 9876-5432",
          relationship: "Esposo",
        }),
      },
      {
        trainerId: trainer.id,
        name: "Juan Pérez",
        lastName: "Pérez",
        alias: "Juancho",
        phone: "+54 9 11 2345-6789",
        email: "juan.perez@email.com",
        monthlyFee: 30000,
        status: "ACTIVE",
        notes: "Experiencia previa con entrenamientos",
        birthDate: new Date("1985-07-22"),
        goals: JSON.stringify(["Ganar masa muscular", "Mejorar resistencia"]),
        medicalConditions: "Lesión previa en rodilla izquierda",
        emergencyContact: JSON.stringify({
          name: "Ana Pérez",
          phone: "+54 9 11 8765-4321",
          relationship: "Madre",
        }),
      },
      {
        trainerId: trainer.id,
        name: "Carla Rodríguez",
        lastName: "Rodríguez",
        phone: "+54 9 11 3456-7890",
        email: "carla.rodriguez@email.com",
        monthlyFee: 20000,
        status: "PAUSED",
        notes: "Pausó por vacaciones en enero",
        birthDate: new Date("1992-11-08"),
        goals: JSON.stringify(["Tonificar", "Mejorar postura"]),
        medicalConditions: "Ninguna",
        emergencyContact: JSON.stringify({
          name: "Laura Rodríguez",
          phone: "+54 9 11 7654-3210",
          relationship: "Hermana",
        }),
      },
      {
        trainerId: trainer.id,
        name: "Diego Martín",
        lastName: "Martín",
        alias: "Diegote",
        phone: "+54 9 11 4567-8901",
        monthlyFee: 35000,
        status: "ACTIVE",
        notes: "Entrenamiento avanzado, competitivo",
        birthDate: new Date("1988-01-30"),
        goals: JSON.stringify(["Competencia de fuerza", "Mejorar técnica"]),
        medicalConditions: "Ninguna",
        emergencyContact: JSON.stringify({
          name: "Silvia Martín",
          phone: "+54 9 11 6543-2109",
          relationship: "Madre",
        }),
      },
      {
        trainerId: trainer.id,
        name: "Lucía Fernández",
        lastName: "Fernández",
        phone: "+54 9 11 5678-9012",
        email: "lucia.fernandez@email.com",
        monthlyFee: 22000,
        status: "INACTIVE",
        notes: "Se mudó de ciudad",
        birthDate: new Date("1995-09-12"),
        goals: JSON.stringify(["Mantenimiento", "Bienestar general"]),
        medicalConditions: "Asma leve",
      },
    ];

    console.log("Creating demo students...");

    for (const studentData of students) {
      const student = await prisma.student.create({
        data: studentData,
      });
      console.log(`✅ Created student: ${student.name} ${student.lastName}`);
    }

    console.log(`\n🎉 Successfully created ${students.length} demo students!`);

    // Show summary
    const totalStudents = await prisma.student.count();
    const activeStudents = await prisma.student.count({
      where: { status: "ACTIVE" },
    });
    const totalRevenue = await prisma.student.aggregate({
      where: { status: "ACTIVE" },
      _sum: { monthlyFee: true },
    });

    console.log("\n📊 Summary:");
    console.log(`Total students: ${totalStudents}`);
    console.log(`Active students: ${activeStudents}`);
    console.log(
      `Monthly revenue from active students: $${totalRevenue._sum.monthlyFee?.toLocaleString("es-AR")} ARS`
    );
  } catch (error) {
    console.error("Error creating demo students:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
createDemoStudents().catch((error) => {
  console.error("Failed to create demo students:", error);
  process.exit(1);
});
