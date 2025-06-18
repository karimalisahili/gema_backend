"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Configuración condicional de CORS
if (process.env.NODE_ENV === "development") {
    // En desarrollo, permite solicitudes desde cualquier origen
    app.use((0, cors_1.default)());
}
else {
    // En producción, solo permite solicitudes desde la URL autorizada
    const productionUrl = process.env.PRODUCTION_URL;
    if (!productionUrl) {
        console.error("Error: PRODUCTION_URL environment variable is not defined.");
        process.exit(1);
    }
    app.use((0, cors_1.default)({ origin: productionUrl }));
}
// Middleware to parse JSON bodies
app.use(express_1.default.json());
// Ruta de prueba "Hola Mundo"
app.get('/hola', (_req, res) => {
    res.json({ mensaje: 'Hola mundo' });
});
app.use('/', routes_1.default);
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.db.execute("SELECT 1");
        console.log("Connected to PostgreSQL via Drizzle ORM.");
    }
    catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}))();
