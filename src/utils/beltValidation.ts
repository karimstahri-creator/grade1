import { AthleteRecord, CustomField, ValidationResult } from '../types';

export function cleanStr(str: string | undefined | null): string {
  if (!str) return '';
  return str
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[إأآا]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ي|ى/g, 'ي')
    .replace(/\s+/g, '');
}

export function getBeltIndex(beltName: string | undefined | null, hierarchy: string[]): number {
  if (!beltName) return -1;
  const raw = beltName.toString().trim();
  const directIdx = hierarchy.indexOf(raw);
  if (directIdx !== -1) return directIdx;

  const cleaned = cleanStr(raw);
  return hierarchy.findIndex(b => cleanStr(b) === cleaned);
}

export function checkSubmissionItemAlert(
  itemData: Record<string, string>,
  records: AthleteRecord[],
  hierarchy: string[],
  fields: CustomField[]
): ValidationResult {
  const licKey = fields.find(f => f.id === 'licenseNo' || cleanStr(f.label).includes('اجازه'))?.id || 'licenseNo';
  const fnKey = fields.find(f => f.id === 'firstName' || cleanStr(f.label).includes('اسم'))?.id || 'firstName';
  const lnKey = fields.find(f => f.id === 'lastName' || cleanStr(f.label).includes('لقب'))?.id || 'lastName';
  const degKey = fields.find(f => f.id === 'degree' || cleanStr(f.label).includes('درجه') || cleanStr(f.label).includes('حزام'))?.id || 'degree';

  const uLic = cleanStr(itemData[licKey]);
  const uFn = cleanStr(itemData[fnKey]);
  const uLn = cleanStr(itemData[lnKey]);
  const uDegree = (itemData[degKey] || '').trim();

  // Find existing athlete
  const existingRecord = records.find(r => {
    const rLic = cleanStr(r[licKey]);
    if (uLic && rLic && uLic === rLic) return true;
    const rFn = cleanStr(r[fnKey]);
    const rLn = cleanStr(r[lnKey]);
    return uFn && uLn && rFn === uFn && rLn === uLn;
  });

  const firstBelt = hierarchy.length > 0 ? hierarchy[0] : 'أصفر 1';
  const targetIdx = getBeltIndex(uDegree, hierarchy);

  if (targetIdx === -1) {
    return {
      isAlert: true,
      severity: 'warning',
      reason: `الدرجة (${uDegree || 'غير محددة'}) غير مسجلة في سلم الأحزمة الرسمي.`
    };
  }

  if (existingRecord) {
    const currentDeg = (existingRecord[degKey] || '').trim();
    const currentIdx = getBeltIndex(currentDeg, hierarchy);

    if (currentIdx === -1) {
      return {
        isAlert: true,
        severity: 'info',
        reason: `الرياضي مسجل بدرجة سابقة غير معيارية (${currentDeg}). الترقية إلى ${uDegree}.`
      };
    }

    if (targetIdx <= currentIdx) {
      return {
        isAlert: true,
        severity: 'error',
        reason: `تراجع أو تكرار بالرتبة: الحالية (${currentDeg}) والمرسلة (${uDegree}).`
      };
    }

    if (targetIdx > currentIdx + 1) {
      const skippedBelts = hierarchy.slice(currentIdx + 1, targetIdx).join('، ');
      return {
        isAlert: true,
        severity: 'warning',
        reason: `تخطي تسلسل الأحزمة: الانتقال من (${currentDeg}) إلى (${uDegree}) متجاوزاً [${skippedBelts}].`
      };
    }

    return {
      isAlert: false,
      severity: 'info',
      reason: `تسلسل سليم ومباشر: ترقية من (${currentDeg}) إلى (${uDegree}).`
    };
  } else {
    // New athlete
    if (targetIdx !== 0) {
      return {
        isAlert: true,
        severity: 'warning',
        reason: `رياضي جديد برتبة متقدمة (${uDegree})، بينما درجة البداية المعتمدة هي (${firstBelt}).`
      };
    }

    return {
      isAlert: false,
      severity: 'info',
      reason: `تسجيل أولي نظامي: الدرجة المبدئية (${firstBelt}).`
    };
  }
}

export function getBeltVisualBadge(degree: string | undefined): {
  bg: string;
  text: string;
  border: string;
  label: string;
} {
  const deg = degree || 'غير محدد';
  const lower = deg.toLowerCase();

  if (lower.includes('أصفر') || lower.includes('اصفر')) {
    return {
      bg: 'bg-amber-100 dark:bg-amber-950/40',
      text: 'text-amber-800 dark:text-amber-300',
      border: 'border-amber-300 dark:border-amber-700/60',
      label: deg
    };
  }
  if (lower.includes('أخضر') || lower.includes('اخضر')) {
    return {
      bg: 'bg-emerald-100 dark:bg-emerald-950/40',
      text: 'text-emerald-800 dark:text-emerald-300',
      border: 'border-emerald-300 dark:border-emerald-700/60',
      label: deg
    };
  }
  if (lower.includes('أزرق') || lower.includes('ازرق')) {
    return {
      bg: 'bg-sky-100 dark:bg-sky-950/40',
      text: 'text-sky-800 dark:text-sky-300',
      border: 'border-sky-300 dark:border-sky-700/60',
      label: deg
    };
  }
  if (lower.includes('أحمر') || lower.includes('احمر')) {
    return {
      bg: 'bg-rose-100 dark:bg-rose-950/40',
      text: 'text-rose-800 dark:text-rose-300',
      border: 'border-rose-300 dark:border-rose-700/60',
      label: deg
    };
  }
  if (lower.includes('أسود') || lower.includes('اسود') || lower.includes('دان')) {
    return {
      bg: 'bg-neutral-900 dark:bg-neutral-800',
      text: 'text-amber-300 dark:text-amber-200',
      border: 'border-amber-500/50 dark:border-amber-400/40',
      label: deg
    };
  }

  return {
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-800 dark:text-slate-200',
    border: 'border-slate-300 dark:border-slate-700',
    label: deg
  };
}
