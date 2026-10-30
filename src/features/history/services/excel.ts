import * as DocumentPicker from "expo-document-picker";
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

  const today = new Date().toISOString().slice(0, 10);
  const file = dir.createFile(`mis-pesitos-backup-${today}.xlsx`, XLSX_MIME);
  await file.write(base64, { encoding: "base64" });
  return true;
}

/** Returns null when the user cancels the picker. Throws on invalid files. */
export async function pickTransactionsFromExcel(): Promise<Expense[] | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: [XLSX_MIME, "application/vnd.ms-excel"],
    copyToCacheDirectory: true,
  });
  if (result.canceled) return null;

  const base64 = await new File(result.assets[0].uri).base64();
  return parseWorkbookBase64(base64);
}
