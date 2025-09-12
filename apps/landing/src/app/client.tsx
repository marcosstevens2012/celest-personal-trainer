"use client";

import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: "Inicio", href: "#hero" },
    { name: "Sobre Mí", href: "#about" },
    { name: "Servicios", href: "#services" },
    { name: "Testimonios", href: "#testimonials" },
    { name: "Precios", href: "#pricing" },
    { name: "Contacto", href: "#contact" },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 fixed w-full z-50 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Marco Stevens
              </h1>
              <p className="text-xs text-gray-500">Personal Trainer</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex">
            <a
              href="#contact"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Entrenar Ahora
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <a
                href="#contact"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 w-fit"
                onClick={() => setIsMenuOpen(false)}
              >
                Entrenar Ahora
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen flex items-center"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Transforma tu{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  cuerpo
                </span>{" "}
                y tu vida
              </h1>
              <p className="text-xl text-gray-600 max-w-lg">
                Entrenador personal certificado con más de 5 años de
                experiencia. Programas personalizados que se adaptan a tu ritmo
                y objetivos.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#contact"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 text-center flex items-center justify-center"
              >
                Comenzar Ahora
                <span className="ml-2">→</span>
              </a>
              <a
                href="https://wa.me/34612345678?text=Hola%20Marco,%20me%20interesa%20conocer%20más%20sobre%20tus%20servicios%20de%20entrenamiento%20personal"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-green-500 text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-colors duration-200 text-center flex items-center justify-center"
              >
                <span className="mr-2">💬</span>
                WhatsApp
              </a>
            </div>

            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">150+</div>
                <div className="text-sm text-gray-500">
                  Clientes Transformados
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">5+</div>
                <div className="text-sm text-gray-500">Años de Experiencia</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">98%</div>
                <div className="text-sm text-gray-500">Satisfacción</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=600&fit=crop&crop=face"
                alt="Marco Stevens - Entrenador Personal"
                className="rounded-2xl shadow-2xl w-full max-w-md mx-auto lg:max-w-full"
              />
            </div>
            <div className="absolute top-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg">
              <span>💪</span>
            </div>
            <div className="absolute bottom-4 left-4 bg-purple-600 text-white p-3 rounded-full shadow-lg">
              <span>❤️</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => {
  const certifications = [
    {
      name: "NASM-CPT",
      description: "Certificación Nacional de Entrenamiento Personal",
    },
    {
      name: "CSCS",
      description: "Especialista Certificado en Fuerza y Acondicionamiento",
    },
    {
      name: "FMS Level 2",
      description: "Pantalla de Movimiento Funcional Nivel 2",
    },
    {
      name: "Nutrición Deportiva",
      description: "Especialización en Nutrición para Deportistas",
    },
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Sobre Mí
              </h2>
              <p className="text-lg text-gray-600">
                Soy Marco Stevens, entrenador personal certificado con una
                pasión genuina por ayudar a las personas a alcanzar su máximo
                potencial físico y mental.
              </p>
              <p className="text-gray-600">
                Con más de 5 años de experiencia en el mundo del fitness, he
                tenido el privilegio de trabajar con más de 150 clientes, desde
                principiantes absolutos hasta atletas avanzados. Mi enfoque se
                basa en crear programas personalizados que no solo transformen
                tu cuerpo, sino que también generen hábitos saludables para toda
                la vida.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Certificaciones y Especialidades
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className="text-blue-600 mt-1">🏆</span>
                    <div>
                      <div className="font-medium text-gray-900">
                        {cert.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {cert.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1594736797933-d0401ba0ad65?w=450&h=550&fit=crop&crop=face"
                alt="Marco Stevens - Foto Profesional"
                className="rounded-2xl shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ServicesSection = () => {
  const services = [
    {
      icon: "👥",
      title: "Entrenamiento Personal 1:1",
      description:
        "Sesiones individuales completamente personalizadas según tus objetivos específicos.",
      features: [
        "Evaluación física completa",
        "Plan de entrenamiento personalizado",
        "Seguimiento nutricional",
        "Apoyo motivacional continuo",
      ],
      price: "Desde €65/sesión",
    },
    {
      icon: "🎯",
      title: "Entrenamientos Grupales",
      description:
        "Sesiones en grupos pequeños (2-4 personas) para mantener la atención personalizada.",
      features: [
        "Grupos reducidos",
        "Ejercicios adaptados",
        "Ambiente motivador",
        "Precios más accesibles",
      ],
      price: "Desde €35/sesión",
    },
    {
      icon: "📱",
      title: "Programas Online",
      description:
        "Entrenamiento virtual con seguimiento personalizado desde donde estés.",
      features: [
        "Flexibilidad horaria",
        "Rutinas personalizadas",
        "Videos explicativos",
        "Chat de soporte",
      ],
      price: "Desde €120/mes",
    },
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Servicios de Entrenamiento
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ofrezco diferentes modalidades de entrenamiento para adaptarme a tu
            estilo de vida, presupuesto y preferencias.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8"
            >
              <div className="text-4xl mb-4">{service.icon}</div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {service.title}
              </h3>

              <p className="text-gray-600 mb-6">{service.description}</p>

              <ul className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center text-sm text-gray-600"
                  >
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="border-t border-gray-200 pt-4">
                <div className="text-lg font-bold text-blue-600 mb-4">
                  {service.price}
                </div>
                <a
                  href="#contact"
                  className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Más Información
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "María González",
      role: "Ejecutiva de Marketing",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=80&h=80&fit=crop&crop=face",
      rating: 5,
      text: "Marco me ayudó a recuperar mi confianza y forma física después del embarazo. Su enfoque personalizado y su paciencia fueron clave en mi transformación.",
    },
    {
      name: "Carlos Ruiz",
      role: "Empresario",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
      rating: 5,
      text: "Perdí 15 kg en 4 meses con Marco. No solo mejoré físicamente, sino que aprendí hábitos que mantengo hasta hoy. 100% recomendado.",
    },
    {
      name: "Ana Martínez",
      role: "Estudiante Universitaria",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
      rating: 5,
      text: "Como principiante total, tenía miedo del gimnasio. Marco me enseñó desde cero con mucha paciencia. Ahora el ejercicio es parte de mi vida diaria.",
    },
    {
      name: "Luis Fernández",
      role: "Atleta Amateur",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      rating: 5,
      text: "Marco me ayudó a prepararme para mi primera maratón. Su conocimiento técnico y planes estructurados fueron fundamentales para lograr mi objetivo.",
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Lo que dicen mis clientes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            La satisfacción de mis clientes es mi mayor motivación. Estas son
            algunas de sus experiencias.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-bold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  <div className="flex mt-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <blockquote className="text-gray-700 italic">
                "{testimonial.text}"
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PricingSection = () => {
  const plans = [
    {
      name: "Plan Básico",
      description: "Perfecto para empezar tu transformación",
      price: "120",
      period: "/mes",
      features: [
        "4 sesiones de entrenamiento/mes",
        "Plan nutricional básico",
        "Evaluación física inicial",
        "Soporte vía WhatsApp",
      ],
      popular: false,
      cta: "Comenzar Ahora",
    },
    {
      name: "Plan Premium",
      description: "El más elegido por mis clientes",
      price: "200",
      period: "/mes",
      features: [
        "8 sesiones de entrenamiento/mes",
        "Plan nutricional personalizado",
        "Evaluaciones mensuales",
        "Soporte prioritario 24/7",
        "Acceso a app móvil",
        "Seguimiento de progreso",
      ],
      popular: true,
      cta: "Más Popular",
    },
    {
      name: "Plan Élite",
      description: "Máximo rendimiento y resultados",
      price: "350",
      period: "/mes",
      features: [
        "Sesiones ilimitadas",
        "Plan nutricional avanzado",
        "Evaluaciones semanales",
        "Soporte 24/7 premium",
        "Acceso completo a todas las herramientas",
        "Coaching de estilo de vida",
        "Preparación para competencias",
      ],
      popular: false,
      cta: "Contactar",
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Planes y Precios
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Elige el plan que mejor se adapte a tus objetivos y presupuesto.
            Todos incluyen mi compromiso con tu éxito.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 ${
                plan.popular ? "ring-2 ring-blue-600 scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Más Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gray-900">
                    €{plan.price}
                  </span>
                  <span className="text-xl text-gray-500 ml-1">
                    {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-3">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`block w-full text-center py-3 rounded-lg font-medium transition-colors duration-200 ${
                  plan.popular
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            ¿No estás seguro de qué plan elegir?
          </p>
          <a
            href="https://wa.me/34612345678?text=Hola%20Marco,%20me%20gustaría%20una%20consulta%20gratuita%20para%20elegir%20el%20mejor%20plan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
          >
            <span className="mr-2">💬</span>
            Consulta Gratuita por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("¡Mensaje enviado correctamente! Te contactaré pronto.");
    } catch (error) {
      alert("Error al enviar el mensaje. Por favor, intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Comienza tu Transformación
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ¿Listo para dar el primer paso? Contáctame y empezemos a trabajar
            juntos hacia tus objetivos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-gray-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Envíame un Mensaje
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nombre Completo
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tu nombre completo"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+34 612 345 678"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="service"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Servicio de Interés
                </label>
                <select
                  id="service"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecciona un servicio</option>
                  <option value="personal-1on1">
                    Entrenamiento Personal 1:1
                  </option>
                  <option value="group">Entrenamientos Grupales</option>
                  <option value="online">Programas Online</option>
                  <option value="consultation">Consulta General</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mensaje
                </label>
                <textarea
                  id="message"
                  rows={4}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Cuéntame sobre tus objetivos y cómo puedo ayudarte..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Información de Contacto
              </h3>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <span className="text-blue-600 text-xl">📧</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Email</h4>
                    <p className="text-gray-600">marco@personaltrainer.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <span className="text-green-600 text-xl">📱</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Teléfono</h4>
                    <p className="text-gray-600">+34 612 345 678</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <span className="text-purple-600 text-xl">📍</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Ubicación</h4>
                    <p className="text-gray-600">Madrid, España</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-8 text-center">
              <div className="space-y-4">
                <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white text-2xl">💬</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900">
                  ¿Prefieres WhatsApp?
                </h4>
                <p className="text-gray-600">
                  Chatea conmigo directamente para una respuesta más rápida
                </p>
                <a
                  href="https://wa.me/34612345678?text=Hola%20Marco,%20me%20interesa%20conocer%20más%20sobre%20tus%20servicios%20de%20entrenamiento%20personal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
                >
                  <span className="mr-2">💬</span>
                  Abrir WhatsApp
                </a>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">
                Horarios de Atención
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Lunes - Viernes:</span>
                  <span className="font-medium">6:00 AM - 10:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sábados:</span>
                  <span className="font-medium">7:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Domingos:</span>
                  <span className="font-medium">8:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Marco Stevens
            </h3>
            <p className="text-gray-400 mb-4">
              Entrenador personal certificado dedicado a ayudarte a alcanzar tus
              objetivos de fitness y bienestar.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://wa.me/34612345678"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 p-2 rounded-full hover:bg-green-700 transition-colors"
              >
                <span>💬</span>
              </a>
              <a
                href="mailto:marco@personaltrainer.com"
                className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                <span>📧</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Servicios</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a
                  href="#services"
                  className="hover:text-white transition-colors"
                >
                  Entrenamiento Personal
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="hover:text-white transition-colors"
                >
                  Entrenamientos Grupales
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="hover:text-white transition-colors"
                >
                  Programas Online
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="hover:text-white transition-colors"
                >
                  Planes y Precios
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <div className="space-y-2 text-gray-400">
              <p>Madrid, España</p>
              <p>+34 612 345 678</p>
              <p>marco@personaltrainer.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; 2025 Marco Stevens Personal Trainer. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default function LandingPageClient() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <TestimonialsSection />
      <PricingSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
