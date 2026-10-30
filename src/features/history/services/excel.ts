import { Directory, File } from "expo-file-system";
import type { Expense } from "../../../types/expense";
import { buildWorkbookBase64, parseWorkbookBase64 } from "./excelParse";

const XLSX_MIME =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

/** Saves the backup to a user-picked folder. Returns false if the user cancels. */
export async function exportTransactionsToExcel(
  transactions: Expense[],
): Promise<boolean> {
  const base64 = buildWorkbookBase64(transactions);

  let dir: Awaited<ReturnType<typeof Directory.pickDirectoryAsync>>;
  try {
    dir = await Directory.pickDirectoryAsync();
  } catch (e) {
    if (e instanceof Error && e.message.toLowerCase().includes("cancel")) {
      return false;
    }
    throw e;
  }

  // Fecha local de México para el nombre (toISOString daría UTC y "mañana").
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Mexico_City",
  });
  const file = dir.createFile(`mis-pesitos-backup-${today}.xlsx`, XLSX_MIME);
  await file.write(base64, { encoding: "base64" });
  return true;
}

/** Returns null when the user cancels the picker. Throws on invalid files. */
export async function pickTransactionsFromExcel(): Promise<Expense[] | null> {
  // File.pickFileAsync (not expo-document-picker): the returned File carries
  // the picker's SAF read grant, which expo-file-system v58 requires to read it.
  // shortcut: File.pickFileAsync convierte todo error nativo en canceled:true, así
  // que un fallo real del selector también cae aquí sin aviso; si un fallo debe
  // verse en pantalla, vuelve a expo-document-picker.
  const picked = await File.pickFileAsync({
    mimeTypes: [XLSX_MIME, "application/vnd.ms-excel"],
  });
  if (picked.canceled || !picked.result) return null;

  const base64 = await picked.result.base64();
  return parseWorkbookBase64(base64);
}
