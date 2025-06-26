import { DB } from '../db';

async function dropTriggerAndFunction() {
  try {
    await DB.getPool().query(`
      DROP TRIGGER IF EXISTS trigger_update_codigo_identificacion ON "UbicacionTecnica";
    `);
    await DB.getPool().query(`
      DROP FUNCTION IF EXISTS trigger_update_codigo_identificacion();
    `);
    console.log('Trigger y función eliminados correctamente.');
  } catch (error) {
    console.error('Error eliminando trigger o función:', error);
  } finally {
    await DB.getPool().end();
  }
}

dropTriggerAndFunction();
