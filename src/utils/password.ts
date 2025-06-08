import bcrypt from "bcrypt";

/**
 * Hashea una contraseña usando bcrypt.
 * @param plainPassword Contraseña en texto plano.
 * @returns Contraseña hasheada.
 */
export const hashPassword = async (plainPassword: string): Promise<string> => {
  return bcrypt.hash(plainPassword, 10);
};

/**
 * Compara una contraseña en texto plano con un hash.
 * @param plainPassword Contraseña en texto plano.
 * @param hash Hash de la contraseña.
 * @returns true si coinciden, false si no.
 */
export const comparePassword = async (
  plainPassword: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hash);
};