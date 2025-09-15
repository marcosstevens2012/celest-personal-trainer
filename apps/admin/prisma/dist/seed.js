"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        function main() {
            return __awaiter(this, void 0, void 0, function () {
                var trainer, _a, _b, studentsData, studentsData;
                var _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            console.log('🌱 Iniciando seeding...');
                            console.log('🌱 Iniciando seeding...');
                            _b = (_a = prisma.trainer).upsert;
                            _c = {};
                            return [4 /*yield*/, prisma.trainer.upsert({
                                    where: { email: "trainer@example.com" }, where: { email: "trainer@example.com" },
                                    update: {}, update: {},
                                    create: { create: {
                                            email: "trainer@example.com", email: "trainer@example.com",
                                            name: "Carlos Rodríguez", name: "Carlos Rodríguez",
                                            bio: "Entrenador personal certificado con más de 5 años de experiencia", bio: "Entrenador personal certificado con más de 5 años de experiencia",
                                            specialties: JSON.stringify(["Fuerza", "Cardio", "Pérdida de peso", "Tonificación"]), specialties: JSON.stringify(["Fuerza", "Cardio", "Pérdida de peso", "Tonificación"]),
                                            certifications: JSON.stringify(["NSCA-CPT", "ACSM-CPT"]), certifications: JSON.stringify(["NSCA-CPT", "ACSM-CPT"]),
                                            phone: "+5491123456789", phone: "+5491123456789",
                                            whatsapp: "+5491123456789", whatsapp: "+5491123456789",
                                            instagram: "@carlosfitness", instagram: "@carlosfitness"
                                        }, },
                                })];
                        case 1: return [4 /*yield*/, _b.apply(_a, [(_c.const = trainer = _d.sent(), _c)])];
                        case 2:
                            trainer = _d.sent();
                            console.log("✅ Trainer creado:", trainer.name);
                            console.log("✅ Trainer creado:", trainer.name);
                            studentsData = [];
                            studentsData = [
                                {}, {
                                    name: "María", name: "María",
                                    lastName: "González", lastName: "González",
                                    alias: "Mari", alias: "Mari",
                                    phone: "+5491123456701", phone: "+5491123456701",
                                    email: "maria.gonzalez@email.com", email: "maria.gonzalez@email.com",
                                    monthlyFee: 45000.0, // $45,000 ARS      monthlyFee: 45000.0, // $45,000 ARS
                                    status: "ACTIVE", status: "ACTIVE",
                                    goals: JSON.stringify(["Pérdida de peso", "Tonificación"]), goals: JSON.stringify(["Pérdida de peso", "Tonificación"]),
                                    notes: "Principiante, disponible martes y jueves", notes: "Principiante, disponible martes y jueves"
                                },
                            ];
                            return [2 /*return*/];
                    }
                });
            });
        }
        var _i, studentsData_1, studentData, _a, studentsData_2, studentData_1, student, _b, _c;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    {
                        {
                            name: "Juan", name;
                            "Juan",
                                lastName;
                            "Pérez", lastName;
                            "Pérez",
                                alias;
                            "Juani", alias;
                            "Juani",
                                phone;
                            "+5491123456702", phone;
                            "+5491123456702",
                                email;
                            "juan.perez@email.com", email;
                            "juan.perez@email.com",
                                monthlyFee;
                            50000.0, // $50,000 ARS      monthlyFee: 50000.0, // $50,000 ARS
                                status;
                            "ACTIVE", status;
                            "ACTIVE",
                                goals;
                            JSON.stringify(["Ganancia muscular", "Fuerza"]), goals;
                            JSON.stringify(["Ganancia muscular", "Fuerza"]),
                                notes;
                            "Experiencia previa, busca resultados rápidos";
                            notes: "Experiencia previa, busca resultados rápidos";
                        }
                    }
                    {
                        {
                            name: "Ana", name;
                            "Ana",
                                lastName;
                            "Rodríguez", lastName;
                            "Rodríguez",
                                alias;
                            "Anita", alias;
                            "Anita",
                                phone;
                            "+5491123456703", phone;
                            "+5491123456703",
                                email;
                            "ana.rodriguez@email.com", email;
                            "ana.rodriguez@email.com",
                                monthlyFee;
                            40000.0, // $40,000 ARS      monthlyFee: 40000.0, // $40,000 ARS
                                status;
                            "PAUSED", status;
                            "PAUSED",
                                goals;
                            JSON.stringify(["Rehabilitación", "Movilidad"]), goals;
                            JSON.stringify(["Rehabilitación", "Movilidad"]),
                                notes;
                            "Lesión en rodilla, vuelve el mes que viene";
                            notes: "Lesión en rodilla, vuelve el mes que viene";
                        }
                    }
                    {
                        {
                            name: "Carlos", name;
                            "Carlos",
                                lastName;
                            "López", lastName;
                            "López",
                                alias;
                            "Carlitos", alias;
                            "Carlitos",
                                phone;
                            "+5491123456704", phone;
                            "+5491123456704",
                                monthlyFee;
                            55000.0, // $55,000 ARS        monthlyFee: 55000.0, // $55,000 ARS  
                                status;
                            "ACTIVE", status;
                            "ACTIVE",
                                goals;
                            JSON.stringify(["Resistencia", "CrossFit"]), goals;
                            JSON.stringify(["Resistencia", "CrossFit"]),
                                notes;
                            "Atlético, quiere prepararse para competencia";
                            notes: "Atlético, quiere prepararse para competencia";
                        }
                    }
                    {
                        {
                            name: "Laura", name;
                            "Laura",
                                lastName;
                            "Fernández", lastName;
                            "Fernández",
                                alias;
                            "Lau", alias;
                            "Lau",
                                phone;
                            "+5491123456705", phone;
                            "+5491123456705",
                                email;
                            "laura.fernandez@email.com", email;
                            "laura.fernandez@email.com",
                                monthlyFee;
                            42000.0, // $42,000 ARS      monthlyFee: 42000.0, // $42,000 ARS
                                status;
                            "INACTIVE", status;
                            "INACTIVE",
                                goals;
                            JSON.stringify(["Salud general"]), goals;
                            JSON.stringify(["Salud general"]),
                                notes;
                            "Pausó por vacaciones, evaluar reactivación";
                            notes: "Pausó por vacaciones, evaluar reactivación";
                        }
                    }
                    ;
                    ;
                    _i = 0, studentsData_1 = studentsData;
                    _e.label = 1;
                case 1:
                    if (!(_i < studentsData_1.length)) return [3 /*break*/, 7];
                    studentData = studentsData_1[_i];
                    _a = 0, studentsData_2 = studentsData;
                    _e.label = 2;
                case 2:
                    if (!(_a < studentsData_2.length)) return [3 /*break*/, 6];
                    studentData_1 = studentsData_2[_a];
                    _c = (_b = prisma.student).create;
                    _d = {};
                    return [4 /*yield*/, prisma.student.create({
                            data: { data: __assign(__assign(__assign({}, studentData_1), studentData_1), { trainerId: trainer.id, trainerId: trainer.id }), },
                        })];
                case 3: return [4 /*yield*/, _c.apply(_b, [(_d.const = student = _e.sent(), _d)])];
                case 4:
                    student = _e.sent();
                    console.log("\u2705 Alumno creado: ".concat(student.name, " ").concat(student.lastName));
                    console.log("\u2705 Alumno creado: ".concat(student.name, " ").concat(student.lastName));
                    _e.label = 5;
                case 5:
                    _a++;
                    return [3 /*break*/, 2];
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7:
                    console.log('🎉 Seeding completado exitosamente!');
                    console.log('🎉 Seeding completado exitosamente!');
                    return [2 /*return*/];
            }
        });
    });
}
main();
main()
    .catch(function (e) {
    try { }
    catch () { }
    (function (e) {
        console.error('❌ Error durante el seeding:', e);
        console.error('❌ Error durante el seeding:', e);
        process.exit(1);
        process.exit(1);
    });
});
try { }
finally { }
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try { }
        finally { }
        (function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.$disconnect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, prisma.$disconnect()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); });
phone: "+34667890123",
    relationship;
"Hermano",
;
isActive: true,
;
;
console.log("Created students:", students);
// Create plans
var plans = await Promise.all([
    prisma.plan.create({
        data: {
            trainerId: trainer.id,
            studentId: students[0].id,
            name: "Plan de Fuerza Básico",
            description: "Programa diseñado para principiantes que quieren desarrollar fuerza base",
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
var payments = await Promise.all([
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
main()
    .then(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })
    .catch(function (e) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.error(e);
                return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                process.exit(1);
                return [2 /*return*/];
        }
    });
}); });
