import * as ExcelJS from 'exceljs';
import { getUbicacionesTecnicas } from '../controllers/ubicacionesTecnicas/ubicacionesTecnicas.service';
import { UbicacionNode } from '../types/ubicacionesTecnicas';

interface FlatLocation {
  path: string[];
  descripcion: string;
}

function flattenHierarchy(
  nodes: UbicacionNode[],
  path: string[] = []
): FlatLocation[] {
  let flatList: FlatLocation[] = [];

  for (const node of nodes) {
    const newPath = [...path, node.abreviacion ?? ''];
    flatList.push({
      path: newPath,
      descripcion: node.descripcion ?? '',
    });

    if (node.children && node.children.length > 0) {
      flatList = flatList.concat(flattenHierarchy(node.children, newPath));
    }
  }

  return flatList;
}

export const exportUbicacionesToExcel = async (): Promise<Buffer> => {
  try {
    const ubicacionesTree = await getUbicacionesTecnicas();
    const flatUbicaciones = flattenHierarchy(ubicacionesTree);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Ubicaciones Técnicas');

    // Determinar el número máximo de niveles
    const maxLevel = Math.max(...flatUbicaciones.map(u => u.path.length), 0);

    // Crear las cabeceras
    const headers = [];
    for (let i = 1; i <= maxLevel; i++) {
      headers.push(`Nivel ${i}`);
    }
    headers.push('Descripción');
    worksheet.columns = headers.map(header => ({ header, key: header }));

    // Añadir las filas
    for (const ubicacion of flatUbicaciones) {
      const row: any = {};
      for (let i = 0; i < maxLevel; i++) {
        row[`Nivel ${i + 1}`] = ubicacion.path[i] || '';
      }
      row['Descripción'] = ubicacion.descripcion;
      worksheet.addRow(row);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer as Buffer;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw new Error('Error al exportar a Excel');
  }
};
