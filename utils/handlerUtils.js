import fs from "node:fs/promises";
import path from "node:path";

export const DATA_PATH = path.join("data", "data.json");

export function parsePriceToCents(value) {
  if (!value) return null;

  if (!value.trim()) return null;

  if (!isFinite(Number(value))) return null;

  return Number(value) * 100;
}

export async function readDataFile() {
  try {
    const dataJson = await fs.readFile(DATA_PATH, "utf-8");
    const data = JSON.parse(dataJson);
    return data;
  } catch (error) {
    console.error(error);
    // Todo: Enviar un código correcto para evitar el 404 genérico
    throw new Error(error.message, { cause: error });
  }
}