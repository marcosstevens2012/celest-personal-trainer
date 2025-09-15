import { PrismaClient } from "@prisma/client";import { PrismaClient } from "@prisma/client";

import { generatePublicToken } from "../src/lib/tokens";import { generatePublicToken } from "../src/lib/tokens";



const prisma = new PrismaClient();const prisma = new PrismaClient();



async function main() {async function main() {

  console.log('🌱 Iniciando seeding...');  console.log('🌱 Iniciando seeding...');



  // Create a trainer for authentication  // Create a trainer for authentication

  const trainer = await prisma.trainer.upsert({  const trainer = await prisma.trainer.upsert({

    where: { email: "trainer@example.com" },    where: { email: "trainer@example.com" },

    update: {},    update: {},

    create: {    create: {

      email: "trainer@example.com",      email: "trainer@example.com",

      name: "Carlos Rodríguez",      name: "Carlos Rodríguez",

      bio: "Entrenador personal certificado con más de 5 años de experiencia",      bio: "Entrenador personal certificado con más de 5 años de experiencia",

      specialties: JSON.stringify(["Fuerza", "Cardio", "Pérdida de peso", "Tonificación"]),      specialties: JSON.stringify(["Fuerza", "Cardio", "Pérdida de peso", "Tonificación"]),

      certifications: JSON.stringify(["NSCA-CPT", "ACSM-CPT"]),      certifications: JSON.stringify(["NSCA-CPT", "ACSM-CPT"]),

      phone: "+5491123456789",      phone: "+5491123456789",

      whatsapp: "+5491123456789",      whatsapp: "+5491123456789",

      instagram: "@carlosfitness"      instagram: "@carlosfitness"

    },    },

  });  });



  console.log("✅ Trainer creado:", trainer.name);  console.log("✅ Trainer creado:", trainer.name);



  // Create students

  const students = [

    {  // Create students with Argentina phone numbers and ARS prices  // Create students with Argentina phone numbers and ARS prices

      name: "María",

      lastName: "González",  const studentsData = [  const studentsData = [

      email: "maria.gonzalez@email.com",

      phone: "+5491123456790",    {    {

      goals: JSON.stringify(["Pérdida de peso", "Tonificación"]),

      monthlyFee: 25000.00,      name: "María",      name: "María",

      notes: "Objetivo: perder 8kg en 3 meses"

    },      lastName: "González",      lastName: "González",

    {

      name: "Juan",      alias: "Mari",      alias: "Mari",

      lastName: "Pérez",

      email: "juan.perez@email.com",      phone: "+5491123456701",      phone: "+5491123456701",

      phone: "+5491123456791",

      goals: JSON.stringify(["Ganancia muscular", "Fuerza"]),      email: "maria.gonzalez@email.com",      email: "maria.gonzalez@email.com",

      monthlyFee: 30000.00,

      notes: "Experiencia previa en gimnasio"      monthlyFee: 45000.0, // $45,000 ARS      monthlyFee: 45000.0, // $45,000 ARS

    },

    {      status: "ACTIVE",      status: "ACTIVE",

      name: "Ana",

      lastName: "Martínez",      goals: JSON.stringify(["Pérdida de peso", "Tonificación"]),      goals: JSON.stringify(["Pérdida de peso", "Tonificación"]),

      email: "ana.martinez@email.com",

      phone: "+5491123456792",      notes: "Principiante, disponible martes y jueves"      notes: "Principiante, disponible martes y jueves"

      goals: JSON.stringify(["Resistencia", "Bienestar general"]),

      monthlyFee: 22000.00,    },    },

      notes: "Primera vez con entrenador personal"

    }    {    {

  ];

      name: "Juan",      name: "Juan",

  const createdStudents = [];

  for (const studentData of students) {      lastName: "Pérez",       lastName: "Pérez", 

    const student = await prisma.student.create({

      data: {      alias: "Juani",      alias: "Juani",

        ...studentData,

        trainerId: trainer.id,      phone: "+5491123456702",      phone: "+5491123456702",

      },

    });      email: "juan.perez@email.com",      email: "juan.perez@email.com",

    createdStudents.push(student);

    console.log("✅ Estudiante creado:", student.name, student.lastName);      monthlyFee: 50000.0, // $50,000 ARS      monthlyFee: 50000.0, // $50,000 ARS

  }

      status: "ACTIVE",      status: "ACTIVE",

  // Create plans with public tokens

  const plansData = [      goals: JSON.stringify(["Ganancia muscular", "Fuerza"]),      goals: JSON.stringify(["Ganancia muscular", "Fuerza"]),

    {

      name: "Plan Fuerza - María",      notes: "Experiencia previa, busca resultados rápidos"      notes: "Experiencia previa, busca resultados rápidos"

      description: "Plan personalizado de entrenamiento enfocado en fuerza y tonificación muscular",

      price: 25000.00,    },    },

      duration: "4 semanas",

      features: JSON.stringify(["Rutinas personalizadas", "Seguimiento semanal", "Ajustes según progreso"]),    {    {

      planType: "PERSONAL" as const,

      difficultyLevel: "BEGINNER" as const,      name: "Ana",      name: "Ana",

      categoryTags: JSON.stringify(["Fuerza", "Tonificación", "Principiante"]),

      studentId: createdStudents[0].id,      lastName: "Rodríguez",      lastName: "Rodríguez",

      isActive: true,

      publicToken: generatePublicToken()      alias: "Anita",       alias: "Anita", 

    },

    {      phone: "+5491123456703",      phone: "+5491123456703",

      name: "Plan Masa Muscular - Juan",

      description: "Programa intensivo para ganancia de masa muscular y fuerza",      email: "ana.rodriguez@email.com",      email: "ana.rodriguez@email.com",

      price: 30000.00,

      duration: "6 semanas",      monthlyFee: 40000.0, // $40,000 ARS      monthlyFee: 40000.0, // $40,000 ARS

      features: JSON.stringify(["Rutinas avanzadas", "Plan nutricional", "Suplementación"]),

      planType: "PERSONAL" as const,      status: "PAUSED",      status: "PAUSED",

      difficultyLevel: "INTERMEDIATE" as const,

      categoryTags: JSON.stringify(["Hipertrofia", "Fuerza", "Intermedio"]),      goals: JSON.stringify(["Rehabilitación", "Movilidad"]),      goals: JSON.stringify(["Rehabilitación", "Movilidad"]),

      studentId: createdStudents[1].id,

      isActive: true,      notes: "Lesión en rodilla, vuelve el mes que viene"      notes: "Lesión en rodilla, vuelve el mes que viene"

      publicToken: generatePublicToken()

    },    },    },

    {

      name: "Plan Cardio & Bienestar - Ana",    {    {

      description: "Entrenamiento cardiovascular y bienestar general para principiantes",

      price: 22000.00,      name: "Carlos",      name: "Carlos",

      duration: "3 semanas",

      features: JSON.stringify(["Ejercicios de bajo impacto", "Rutinas adaptables", "Enfoque en bienestar"]),      lastName: "López",      lastName: "López",

      planType: "PERSONAL" as const,

      difficultyLevel: "BEGINNER" as const,      alias: "Carlitos",      alias: "Carlitos",

      categoryTags: JSON.stringify(["Cardio", "Bienestar", "Principiante"]),

      studentId: createdStudents[2].id,      phone: "+5491123456704",      phone: "+5491123456704",

      isActive: true,

      publicToken: generatePublicToken()      monthlyFee: 55000.0, // $55,000 ARS        monthlyFee: 55000.0, // $55,000 ARS  

    }

  ];      status: "ACTIVE",      status: "ACTIVE",



  const createdPlans = [];      goals: JSON.stringify(["Resistencia", "CrossFit"]),      goals: JSON.stringify(["Resistencia", "CrossFit"]),

  for (const planData of plansData) {

    const plan = await prisma.plan.create({      notes: "Atlético, quiere prepararse para competencia"      notes: "Atlético, quiere prepararse para competencia"

      data: {

        ...planData,    },    },

        trainerId: trainer.id,

      },    {    {

    });

    createdPlans.push(plan);      name: "Laura",      name: "Laura",

    console.log("✅ Plan creado:", plan.name, "con token público:", plan.publicToken);

  }      lastName: "Fernández",       lastName: "Fernández", 



  console.log("🎉 Seeding completado exitosamente!");      alias: "Lau",      alias: "Lau",

  console.log("\n📋 Datos creados:");

  console.log(`- 1 Entrenador: ${trainer.name}`);      phone: "+5491123456705",      phone: "+5491123456705",

  console.log(`- ${createdStudents.length} Estudiantes`);

  console.log(`- ${createdPlans.length} Planes con tokens públicos`);      email: "laura.fernandez@email.com",      email: "laura.fernandez@email.com",

  console.log("\n🔗 Enlaces públicos de ejemplo:");

  createdPlans.forEach(plan => {      monthlyFee: 42000.0, // $42,000 ARS      monthlyFee: 42000.0, // $42,000 ARS

    console.log(`${plan.name}: http://localhost:3000/p/${plan.publicToken}`);

  });      status: "INACTIVE",       status: "INACTIVE", 

}

      goals: JSON.stringify(["Salud general"]),      goals: JSON.stringify(["Salud general"]),

main()

  .catch((e) => {      notes: "Pausó por vacaciones, evaluar reactivación"      notes: "Pausó por vacaciones, evaluar reactivación"

    console.error(e);

    process.exit(1);    }    }

  })

  .finally(async () => {  ];  ];

    await prisma.$disconnect();

  });

  for (const studentData of studentsData) {  for (const studentData of studentsData) {

    const student = await prisma.student.create({    const student = await prisma.student.create({

      data: {      data: {

        ...studentData,        ...studentData,

        trainerId: trainer.id,        trainerId: trainer.id,

      },      },

    });    });

    console.log(`✅ Alumno creado: ${student.name} ${student.lastName}`);    console.log(`✅ Alumno creado: ${student.name} ${student.lastName}`);

  }  }



  console.log('🎉 Seeding completado exitosamente!');  console.log('🎉 Seeding completado exitosamente!');

}}



main()main()

  .catch((e) => {  .catch((e) => {

    console.error('❌ Error durante el seeding:', e);    console.error('❌ Error durante el seeding:', e);

    process.exit(1);    process.exit(1);

  })  })

  .finally(async () => {  .finally(async () => {

    await prisma.$disconnect();    await prisma.$disconnect();

  });  });
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
