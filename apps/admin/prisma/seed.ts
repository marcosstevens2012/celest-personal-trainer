import { PrismaClient } from "@prisma/client";
import { generatePublicToken } from "../src/lib/tokens";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seeding...");

  // Create a trainer for authentication
  const trainer = await prisma.trainer.upsert({
    where: { email: "trainer@example.com" },
    update: {},
    create: {
      email: "trainer@example.com",
      name: "Carlos Rodríguez",
      bio: "Entrenador personal certificado con más de 5 años de experiencia",
      specialties: JSON.stringify(["Fuerza", "Cardio", "Pérdida de peso", "Tonificación"]),
      certifications: JSON.stringify(["NSCA-CPT", "ACSM-CPT"]),
      phone: "+5491123456789",
      whatsapp: "+5491123456789",
      instagram: "@carlosfitness",
    },
  });

  console.log("✅ Trainer creado:", trainer.name);

  // Create students
  const students = [
    {
      name: "María",
      lastName: "González",
      email: "maria.gonzalez@email.com",
      phone: "+5491134567890",
      birthDate: new Date("1990-05-15"),
      goals: JSON.stringify(["Pérdida de peso", "Tonificación"]),
      medicalConditions: JSON.stringify([]),
      emergencyContact: JSON.stringify({
        name: "Juan González",
        phone: "+5491134567891",
        relationship: "Esposo",
      }),
      monthlyFee: 12000,
    },
    {
      name: "Juan",
      lastName: "Pérez",
      email: "juan.perez@email.com",
      phone: "+5491145678901",
      birthDate: new Date("1985-08-22"),
      goals: JSON.stringify(["Ganar masa muscular", "Fuerza"]),
      medicalConditions: JSON.stringify(["Lesión de rodilla antigua"]),
      emergencyContact: JSON.stringify({
        name: "Ana Pérez",
        phone: "+5491145678902",
        relationship: "Esposa",
      }),
      monthlyFee: 15000,
    },
    {
      name: "Ana",
      lastName: "López",
      email: "ana.lopez@email.com",
      phone: "+5491156789012",
      birthDate: new Date("1992-03-10"),
      goals: JSON.stringify(["Cardio", "Resistencia"]),
      medicalConditions: JSON.stringify([]),
      emergencyContact: JSON.stringify({
        name: "Carlos López",
        phone: "+5491156789013",
        relationship: "Hermano",
      }),
      monthlyFee: 10000,
    },
  ];
  const createdStudents = [];
  for (const studentData of students) {
    const student = await prisma.student.create({
      data: {
        ...studentData,
        trainerId: trainer.id,
      },
    });
    createdStudents.push(student);
    console.log("✅ Estudiante creado:", student.name, student.lastName);
  }

  // Create some plans
  const plansData = [
    {
      name: "Rutina Pérdida de Peso - María",
      description: "Plan personalizado para pérdida de peso y tonificación",
      price: 8000,
      duration: "8 semanas",
      features: JSON.stringify(["Rutina personalizada", "Seguimiento semanal", "Dieta incluida"]),
      planType: "PERSONAL" as const,
      difficultyLevel: "BEGINNER" as const,
      categoryTags: JSON.stringify(["pérdida de peso", "tonificación", "principiante"]),
      studentId: createdStudents[0].id,
    },
    {
      name: "Fuerza Avanzada - Juan",
      description: "Programa de fuerza para desarrollo muscular",
      price: 12000,
      duration: "12 semanas",
      features: JSON.stringify(["Programa de fuerza", "Periodización", "Suplementación"]),
      planType: "PERSONAL" as const,
      difficultyLevel: "ADVANCED" as const,
      categoryTags: JSON.stringify(["fuerza", "músculo", "avanzado"]),
      studentId: createdStudents[1].id,
    },
    {
      name: "Cardio Funcional - Ana",
      description: "Entrenamiento funcional enfocado en cardio",
      price: 6000,
      duration: "6 semanas",
      features: JSON.stringify(["Entrenamiento funcional", "Cardio HIIT", "Flexibilidad"]),
      planType: "PERSONAL" as const,
      difficultyLevel: "INTERMEDIATE" as const,
      categoryTags: JSON.stringify(["cardio", "funcional", "resistencia"]),
      studentId: createdStudents[2].id,
    },
  ];

  for (const planData of plansData) {
    const publicToken = generatePublicToken();

    const plan = await prisma.plan.create({
      data: {
        ...planData,
        trainerId: trainer.id,
        publicToken: publicToken,
        isTemplate: false,
        isActive: true,
      },
    });

    console.log("✅ Plan creado:", plan.name);

    // Create some plan days for each plan
    const daysData = [
      { name: "Día 1 - Tren Superior", description: "Ejercicios para pecho, espalda y brazos" },
      { name: "Día 2 - Tren Inferior", description: "Ejercicios para piernas y glúteos" },
      { name: "Día 3 - Cardio", description: "Entrenamiento cardiovascular" },
    ];

    for (let i = 0; i < daysData.length; i++) {
      const dayData = daysData[i];

      const planDay = await prisma.planDay.create({
        data: {
          planId: plan.id,
          dayNumber: i + 1,
          name: dayData.name,
          description: dayData.description,
        },
      });

      // Create some blocks for each day
      const blocksData = [
        { blockType: "WARMUP" as const, name: "Calentamiento", description: "5-10 minutos de calentamiento" },
        { blockType: "CIRCUIT1" as const, name: "Circuito Principal", description: "Ejercicios principales del día" },
        { blockType: "EXTRA" as const, name: "Enfriamiento", description: "Estiramiento y relajación" },
      ];

      for (let j = 0; j < blocksData.length; j++) {
        const blockData = blocksData[j];

        const planBlock = await prisma.planBlock.create({
          data: {
            planDayId: planDay.id,
            blockType: blockData.blockType,
            blockNumber: j + 1,
            name: blockData.name,
            description: blockData.description,
          },
        });

        // Create some items for each block
        const itemsData =
          blockData.blockType === "WARMUP"
            ? [
                { name: "Caminata en cinta", duration: 300 }, // 5 minutos
                { name: "Movimientos articulares", duration: 300 },
              ]
            : blockData.blockType === "CIRCUIT1"
              ? [
                  { name: "Flexiones de pecho", sets: 3, reps: "10-12" },
                  { name: "Sentadillas", sets: 3, reps: "15-20" },
                  { name: "Plancha", sets: 3, duration: 30 },
                ]
              : [
                  { name: "Estiramiento de cuádriceps", duration: 120 },
                  { name: "Estiramiento de isquiotibiales", duration: 120 },
                ];

        for (let k = 0; k < itemsData.length; k++) {
          const itemData = itemsData[k];

          await prisma.planItem.create({
            data: {
              planBlockId: planBlock.id,
              itemNumber: k + 1,
              name: itemData.name,
              sets: itemData.sets || null,
              reps: itemData.reps || null,
              duration: itemData.duration || null,
            },
          });
        }
      }
    }
  }

  console.log("✅ Seeding completado exitosamente!");
  console.log("📧 Email de login: trainer@example.com");
  console.log("🔑 Password: admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
