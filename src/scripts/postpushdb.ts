import { db } from '../db';

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

async function main() {
  try {
    await db.execute(triggerSQL);
    console.log(
      'Trigger y función para actualizar codigo_identificacion creados.'
    );
  } catch (error) {
    console.error('Error al crear trigger y función:', error);
  }
}

main();
