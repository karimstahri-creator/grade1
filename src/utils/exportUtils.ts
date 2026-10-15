import * as XLSX from 'xlsx';
import { AthleteRecord, CustomField, Submission } from '../types';
import { cleanStr } from './beltValidation';

export function exportAthletesToExcel(records: AthleteRecord[], fields: CustomField[], fileName = 'قاعدة_بيانات_الأحزمة_الجامعة_التونسية.xlsx') {
  const data = records.map((rec, index) => {
    const row: Record<string, string | number> = {
      'الرقم الترتيبي': index + 1
    };
    fields.forEach(f => {
      row[f.label] = rec[f.id] || '';
    });
    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set RTL direction on worksheet view
  if (!worksheet['!views']) {
    worksheet['!views'] = [{ rightToLeft: true }];
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'سجل الأحزمة المعتمدة');
  XLSX.writeFile(workbook, fileName);
}

export function exportSubmissionsToExcel(submissions: Submission[], fields: CustomField[], fileName = 'كافة_الطلبات_الواردة.xlsx') {
  const flatRows: Record<string, string | number>[] = [];

  submissions.forEach((sub, subIdx) => {
    (sub.items || []).forEach((item, itemIdx) => {
      const row: Record<string, string | number> = {
        'رقم الإرسال': sub.id,
        'الجمعية المرسلة': sub.sender,
        'تاريخ الطلب': sub.date,
        'رقم البند': itemIdx + 1
      };
      fields.forEach(f => {
        row[f.label] = item.data[f.id] || '';
      });
      flatRows.push(row);
    });
  });

  const worksheet = XLSX.utils.json_to_sheet(flatRows);
  if (!worksheet['!views']) {
    worksheet['!views'] = [{ rightToLeft: true }];
  }
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'الطلبات الواردة');
  XLSX.writeFile(workbook, fileName);
}

function excelDateToJSDate(serial: number): string {
  if (!serial || isNaN(serial)) return '';
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  const year = date_info.getUTCFullYear();
  const month = String(date_info.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date_info.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export interface ImportResult {
  records: AthleteRecord[];
  insertedCount: number;
  updatedCount: number;
  error?: string;
}

export function parseExcelFile(
  fileBuffer: ArrayBuffer,
  fields: CustomField[],
  existingRecords: AthleteRecord[]
): ImportResult {
  try {
    const data = new Uint8Array(fileBuffer);
    const workbook = XLSX.read(data, { type: 'array', cellDates: true });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    const jsonRows: (string | number | Date | null)[][] = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      raw: true,
      defval: ''
    });

    if (jsonRows.length < 2) {
      return { records: existingRecords, insertedCount: 0, updatedCount: 0, error: 'الملف فارغ أو لا يحتوي على صفوف بيانات صالحة.' };
    }

    const headers = jsonRows[0].map(h => (h ? h.toString().trim() : ''));
    const recordsMap = new Map<string, AthleteRecord>();
    const updatedRecordsList = [...existingRecords];

    // Map existing by license number or ID
    const licField = fields.find(f => f.id === 'licenseNo' || cleanStr(f.label).includes('اجازه'))?.id || 'licenseNo';

    let inserted = 0;
    let updated = 0;

    for (let r = 1; r < jsonRows.length; r++) {
      const row = jsonRows[r];
      if (!row || row.length === 0 || row.every(val => val === '' || val === null || val === undefined)) {
        continue;
      }

      const newRec: AthleteRecord = {
        id: 'ath_' + Date.now() + '_' + Math.floor(Math.random() * 10000),
        firstName: '',
        lastName: '',
        licenseNo: '',
        club: '',
        region: '',
        degree: '',
        degreeDate: '',
        certNo: ''
      };

      fields.forEach((f, fieldIdx) => {
        let val: string | number | Date | null | undefined = undefined;
        // Search header matching cleanStr
        const headerIndex = headers.findIndex(h => cleanStr(h) === cleanStr(f.label) || cleanStr(h) === cleanStr(f.id));

        if (headerIndex !== -1 && row[headerIndex] !== undefined && row[headerIndex] !== null && row[headerIndex] !== '') {
          val = row[headerIndex];
        } else if (row[fieldIdx] !== undefined && row[fieldIdx] !== null && row[fieldIdx] !== '') {
          val = row[fieldIdx];
        }

        if (val !== undefined && val !== null && val !== '') {
          if (val instanceof Date) {
            const y = val.getFullYear();
            const m = String(val.getMonth() + 1).padStart(2, '0');
            const d = String(val.getDate()).padStart(2, '0');
            newRec[f.id] = `${y}-${m}-${d}`;
          } else if (f.type === 'date' && typeof val === 'number') {
            newRec[f.id] = excelDateToJSDate(val);
          } else {
            newRec[f.id] = val.toString().trim();
          }
        }
      });

      const licVal = cleanStr(newRec[licField]);
      if (licVal) {
        const existingIdx = updatedRecordsList.findIndex(item => cleanStr(item[licField]) === licVal);
        if (existingIdx !== -1) {
          newRec.id = updatedRecordsList[existingIdx].id;
          updatedRecordsList[existingIdx] = { ...updatedRecordsList[existingIdx], ...newRec };
          updated++;
          continue;
        }
      }

      // Check if duplicate name + club
      const existingNameIdx = updatedRecordsList.findIndex(
        item =>
          cleanStr(item.firstName) === cleanStr(newRec.firstName) &&
          cleanStr(item.lastName) === cleanStr(newRec.lastName) &&
          cleanStr(item.club) === cleanStr(newRec.club)
      );

      if (existingNameIdx !== -1) {
        newRec.id = updatedRecordsList[existingNameIdx].id;
        updatedRecordsList[existingNameIdx] = { ...updatedRecordsList[existingNameIdx], ...newRec };
        updated++;
      } else {
        updatedRecordsList.push(newRec);
        inserted++;
      }
    }

    return {
      records: updatedRecordsList,
      insertedCount: inserted,
      updatedCount: updated
    };
  } catch (err) {
    console.error('Error parsing excel:', err);
    return {
      records: existingRecords,
      insertedCount: 0,
      updatedCount: 0,
      error: 'تعذر تحليل الملف. يرجى التأكد من أن صيغة الملف هي Excel (.xlsx أو .xls) صالحة.'
    };
  }
}
