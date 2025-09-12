export const generateStructuredData = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Marco Stevens",
    jobTitle: "Entrenador Personal Certificado",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Madrid",
      addressCountry: "España",
    },
    telephone: "+34612345678",
    email: "marco@personaltrainer.com",
    url: "https://marco-stevens-trainer.com",
    description:
      "Entrenador personal certificado en Madrid con más de 5 años de experiencia. Especializado en entrenamiento personalizado, fuerza y acondicionamiento físico.",
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        name: "NASM-CPT",
        description: "Certificación Nacional de Entrenamiento Personal",
      },
      {
        "@type": "EducationalOccupationalCredential",
        name: "CSCS",
        description: "Especialista Certificado en Fuerza y Acondicionamiento",
      },
    ],
    offers: [
      {
        "@type": "Service",
        name: "Entrenamiento Personal 1:1",
        description: "Sesiones individuales completamente personalizadas",
        provider: {
          "@type": "Person",
          name: "Marco Stevens",
        },
      },
      {
        "@type": "Service",
        name: "Entrenamientos Grupales",
        description: "Sesiones en grupos pequeños con atención personalizada",
        provider: {
          "@type": "Person",
          name: "Marco Stevens",
        },
      },
    ],
  };

  return JSON.stringify(structuredData);
};

export const businessStructuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Marco Stevens Personal Trainer",
  image: "https://marco-stevens-trainer.com/og-image.jpg",
  description:
    "Servicios de entrenamiento personal en Madrid. Programas personalizados de fitness, fuerza y acondicionamiento físico.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Madrid",
    addressRegion: "Madrid",
    addressCountry: "ES",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 40.4168,
    longitude: -3.7038,
  },
  url: "https://marco-stevens-trainer.com",
  telephone: "+34612345678",
  email: "marco@personaltrainer.com",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "06:00",
      closes: "22:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "07:00",
      closes: "20:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "08:00",
      closes: "18:00",
    },
  ],
  sameAs: ["https://wa.me/34612345678"],
};
