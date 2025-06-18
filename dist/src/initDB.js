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
const db_1 = require("./db");
const usuarios_1 = require("./tables/usuarios");
const dotenv_1 = __importDefault(require("dotenv"));
const password_1 = require("./utils/password");
dotenv_1.default.config();
const initDB = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Starting database initialization...');
    // Clean usuarios table
    yield db_1.db.delete(usuarios_1.usuarios);
    const plainPassword = '123456';
    const nombre = 'Coordinador Principal';
    const correo = 'coordinador@ucab.edu.ve';
    const tipo = 'COORDINADOR';
    try {
        const contrasenaHash = yield (0, password_1.hashPassword)(plainPassword);
        // Comprobar que comparePassword funciona correctamente
        const isMatch = yield (0, password_1.comparePassword)(plainPassword, contrasenaHash);
        yield db_1.db.transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            // Insertar usuario (sin contraseña)
            const inserted = yield tx
                .insert(usuarios_1.usuarios)
                .values({
                Nombre: nombre,
                Correo: correo,
                Tipo: tipo,
                Contraseña: contrasenaHash,
            })
                .returning({ Id: usuarios_1.usuarios.Id });
            const usuarioId = (_a = inserted[0]) === null || _a === void 0 ? void 0 : _a.Id;
            if (!usuarioId)
                throw new Error('No se pudo obtener el Id del usuario');
        }));
        console.log('Usuario coordinador agregado correctamente.');
        // --- TRIGGER Y FUNCIÓN PARA ACTUALIZAR CODIGO_IDENTIFICACION EN CASCADA ---
        const triggerSQL = `
DROP FUNCTION IF EXISTS actualizar_codigos_identificacion_recursivo(integer);
CREATE OR REPLACE FUNCTION actualizar_codigos_identificacion_recursivo(current_id integer) RETURNS void AS $$
DECLARE
    padre RECORD;
    hijo RECORD;
BEGIN
    -- Actualizar el codigo_identificacion del nodo actual
    SELECT i."idPadre", p.codigo_identificacion AS padre_codigo
    INTO padre
    FROM "Incluyen" i
    JOIN "UbicacionTecnica" p ON p.id = i."idPadre"
    WHERE i."idHijo" = current_id AND i."esUbicacionFisica" = true
    LIMIT 1;

    IF padre IS NULL THEN
        -- Nodo raíz: su codigo_identificacion es su abreviacion
        UPDATE "UbicacionTecnica"
        SET codigo_identificacion = abreviacion
        WHERE id = current_id;
    ELSE
        -- Nodo con padre: concatenar el codigo_identificacion del padre y su abreviacion
        UPDATE "UbicacionTecnica"
        SET codigo_identificacion = padre.padre_codigo || '-' || abreviacion
        WHERE id = current_id;
    END IF;

    -- Recursivamente actualizar los hijos
    FOR hijo IN
        SELECT u.id
        FROM "Incluyen" i
        JOIN "UbicacionTecnica" u ON u.id = i."idHijo"
        WHERE i."idPadre" = current_id
    LOOP
        PERFORM actualizar_codigos_identificacion_recursivo(hijo.id);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_codigo_identificacion ON "UbicacionTecnica";

CREATE OR REPLACE FUNCTION trigger_update_codigo_identificacion_func() RETURNS trigger AS $$
BEGIN
    IF NEW.abreviacion <> OLD.abreviacion OR NEW.codigo_identificacion <> OLD.codigo_identificacion THEN
        PERFORM actualizar_codigos_identificacion_recursivo(NEW.id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_codigo_identificacion
AFTER UPDATE OF abreviacion, codigo_identificacion
ON "UbicacionTecnica"
FOR EACH ROW
EXECUTE FUNCTION trigger_update_codigo_identificacion_func();
`;
        yield db_1.db.execute(triggerSQL);
        console.log('Trigger y función para actualizar codigo_identificacion creados.');
    }
    catch (error) {
        console.error('Error al crear trigger y función:', error);
        console.error('Error al agregar usuario:', error);
    }
});
initDB();
