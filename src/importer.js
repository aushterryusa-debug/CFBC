import { marked } from 'marked';
import * as XLSX from 'xlsx';
import { db, collection, addDoc } from './firebase.js';

/**
 * Parse a Markdown file and return HTML + raw text
 */
export function parseMD(mdText) {
  return {
    html: marked(mdText),
    raw: mdText,
  };
}

/**
 * Parse an Excel file (ArrayBuffer) and return sheet data as JSON
 */
export function parseExcel(arrayBuffer) {
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const results = {};
  for (const sheetName of workbook.SheetNames) {
    results[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  }
  return results;
}

/**
 * Import a file (MD or Excel) by reading it from an <input type="file">
 */
export async function importFile(file) {
  const name = file.name.toLowerCase();

  if (name.endsWith('.md') || name.endsWith('.markdown')) {
    const text = await file.text();
    const parsed = parseMD(text);
    return { type: 'markdown', name: file.name, ...parsed };
  }

  if (name.endsWith('.xlsx') || name.endsWith('.xls') || name.endsWith('.csv')) {
    const buffer = await file.arrayBuffer();
    const sheets = parseExcel(buffer);
    return { type: 'excel', name: file.name, sheets };
  }

  throw new Error(`Unsupported file type: ${file.name}`);
}

/**
 * Save imported data to Firestore
 */
export async function saveToFirestore(data) {
  const docRef = await addDoc(collection(db, 'imports'), {
    ...data,
    importedAt: new Date().toISOString(),
  });
  return docRef.id;
}
