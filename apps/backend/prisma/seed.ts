import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create a trainer
  const trainer = await prisma.trainer.upsert({
    where: { email: "trainer@example.com" },
    update: {},
    create: {
      name: "Carlos Rodríguez",
      email: "trainer@example.com",
      bio: "Entrenador personal certificado con más de 5 años de experiencia",
      specialties: ["Fuerza", "Cardio", "Pérdida de peso", "Tonificación"],
      certifications: ["NASM-CPT", "Nutrition Specialist", "CrossFit Level 1"],
      phone: "+34612345678",
      instagram: "@carlos_trainer",
      whatsapp: "+34612345678",
    },
  });

  console.log("Created trainer:", trainer);

  // Create students
  const students = await Promise.all([
    prisma.student.create({
      data: {
        trainerId: trainer.id,
        name: "María González",
        email: "maria@example.com",
        phone: "+34623456789",
        birthDate: new Date("1995-03-15"),
        goals: ["Perder peso", "Ganar resistencia"],
        medicalConditions: "Ninguna conocida",
        emergencyContact: {
          name: "Carlos González",
          phone: "+34687654321",
          relationship: "Esposo",
        },
        isActive: true,
      },
    }),
    prisma.student.create({
      data: {
        trainerId: trainer.id,
        name: "Juan Pérez",
        email: "juan@example.com",
        phone: "+34634567890",
        birthDate: new Date("1988-07-22"),
        goals: ["Ganar músculo", "Mejorar fuerza"],
        medicalConditions: "Lesión previa en rodilla izquierda",
        emergencyContact: {
          name: "Ana Pérez",
          phone: "+34645678901",
          relationship: "Esposa",
        },
        isActive: true,
      },
    }),
    prisma.student.create({
      data: {
        trainerId: trainer.id,
        name: "Ana López",
        email: "ana@example.com",
        phone: "+34656789012",
        birthDate: new Date("1992-11-08"),
        goals: ["Tonificar", "Mejorar postura"],
        medicalConditions: "",
        emergencyContact: {
          name: "Luis López",
          phone: "+34667890123",
          relationship: "Hermano",
        },
        isActive: true,
      },
    }),
  ]);

  console.log("Created students:", students);

  // Create plans
  const plans = await Promise.all([
    prisma.plan.create({
      data: {
        trainerId: trainer.id,
        studentId: students[0].id,
        name: "Plan de Fuerza Básico",
        description:
          "Programa diseñado para principiantes que quieren desarrollar fuerza base",
        price: 99.99,
        startDate: new Date("2025-09-01"),
        endDate: new Date("2025-10-26"),
        isActive: true,
      },
    }),
    prisma.plan.create({
      data: {
        trainerId: trainer.id,
        studentId: students[1].id,
        name: "Cardio Intensivo",
        description: "Plan enfocado en mejorar resistencia cardiovascular",
        price: 79.99,
        isActive: true,
      },
    }),
    prisma.plan.create({
      data: {
        trainerId: trainer.id,
        studentId: students[2].id,
        name: "Tonificación Femenina",
        description: "Plan especializado para tonificación muscular femenina",
        price: 89.99,
        startDate: new Date("2025-09-15"),
        isActive: true,
      },
    }),
  ]);

  console.log("Created plans:", plans);

  // Create payments
  const payments = await Promise.all([
    prisma.payment.create({
      data: {
        trainerId: trainer.id,
        studentId: students[0].id,
        planId: plans[0].id,
        amount: 99.99,
        currency: "EUR",
        status: "COMPLETED",
        method: "CARD",
        dueDate: new Date("2025-09-15"),
        paidDate: new Date("2025-09-10"),
        notes: "Pago mensual - Plan de Fuerza Básico",
      },
    }),
    prisma.payment.create({
      data: {
        trainerId: trainer.id,
        studentId: students[1].id,
        planId: plans[1].id,
        amount: 79.99,
        currency: "EUR",
        status: "PENDING",
        method: "TRANSFER",
        dueDate: new Date("2025-09-20"),
        notes: "Pago mensual - Cardio Intensivo",
      },
    }),
    prisma.payment.create({
      data: {
        trainerId: trainer.id,
        studentId: students[2].id,
        planId: plans[2].id,
        amount: 89.99,
        currency: "EUR",
        status: "OVERDUE",
        method: "CASH",
        dueDate: new Date("2025-09-10"),
        notes: "Pago mensual - Tonificación Femenina",
      },
    }),
  ]);

  console.log("Created payments:", payments);

  console.log("✅ Seed data created successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
