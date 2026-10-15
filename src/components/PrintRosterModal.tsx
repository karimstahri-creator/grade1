import React from 'react';
import { Printer, Download, X, Award, FileSpreadsheet, Building, Hash } from 'lucide-react';
import { FEDERATION_LOGO, FEDERATION_MINISTRY, FEDERATION_NAME_AR, FEDERATION_NAME_FR } from '../constants/assets';
import { AthleteRecord, CustomField } from '../types';
import { getBeltVisualBadge } from '../utils/beltValidation';

interface PrintRosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: AthleteRecord[];
  fields: CustomField[];
  onExportExcel: () => void;
}

export const PrintRosterModal: React.FC<PrintRosterModalProps> = ({
  isOpen,
  onClose,
  records,
  fields,
  onExportExcel
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      console.warn('Print blocked by iframe:', e);
    }
  };

  const handleDownloadHtml = () => {
    const tableHeaders = fields.map(f => `<th style="padding: 8px; border: 1px solid #cbd5e1; background: #f1f5f9; text-align: right;">${f.label}</th>`).join('');
    
    const tableRows = records.map((r, i) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center; font-family: monospace;">${i + 1}</td>
        ${fields.map(f => `<td style="padding: 8px; border: 1px solid #e2e8f0;">${r[f.id] || '-'}</td>`).join('')}
      </tr>
    `).join('');

    const htmlContent = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>السجل الرسمي للأحزمة - الجامعة التونسية للووشو كونغ فو</title>
  <style>
    body { font-family: 'Cairo', system-ui, sans-serif; margin: 30px; color: #0f172a; direction: rtl; }
    .header { text-align: center; border-bottom: 2px solid #b91c1c; padding-bottom: 20px; margin-bottom: 20px; }
    .title { font-size: 20px; font-weight: bold; color: #991b1b; margin: 5px 0; }
    .subtitle { font-size: 13px; color: #64748b; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 15px; }
    th { background: #f8fafc; font-weight: bold; }
    @media print {
      body { margin: 10mm; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div style="font-size: 12px; color: #64748b;">${FEDERATION_MINISTRY}</div>
    <div class="title">${FEDERATION_NAME_AR}</div>
    <div class="subtitle">${FEDERATION_NAME_FR}</div>
    <div style="margin-top: 10px; font-weight: bold; font-size: 14px;">السجل الوطني العام للأحزمة والدرجات الفنية المعتمدة (${records.length} رياضي)</div>
    <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">تاريخ الاستخراج: ${new Date().toLocaleDateString('ar-TN')}</div>
  </div>
  <table>
    <thead>
      <tr>
        <th style="padding: 8px; border: 1px solid #cbd5e1; width: 40px;">#</th>
        ${tableHeaders}
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>
  <div style="margin-top: 40px; display: flex; justify-content: space-between; font-size: 12px; font-weight: bold;">
    <div>ختم وإمضاء الإدارة الفنية</div>
    <div>ختم وإمضاء رئيس الجامعة</div>
  </div>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `سجل_الأحزمة_الجامعة_التونسية_${Date.now()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden my-6 flex flex-col max-h-[90vh]">
        
        {/* Top Header Actions (no-print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 no-print flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                معاينة السجل الرسمي للطباعة والتصدير
              </h3>
              <p className="text-[11px] text-slate-500">
                إجمالي {records.length} رياضي مسجل في قاعدة البيانات
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              طباعة فورية
            </button>

            <button
              type="button"
              onClick={handleDownloadHtml}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="تنزيل نسخة HTML للطباعة والحفظ كـ PDF"
            >
              <Download className="w-3.5 h-3.5" />
              تنزيل كـ ملف للطباعة
            </button>

            <button
              type="button"
              onClick={onExportExcel}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Excel
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 overflow-y-auto flex-1 bg-white text-slate-900 printable-area">
          
          {/* Official Letterhead */}
          <div className="text-center pb-6 border-b-2 border-red-700 space-y-1">
            <div className="text-xs text-slate-500 font-semibold">{FEDERATION_MINISTRY}</div>
            <div className="flex items-center justify-center gap-3 my-2">
              <div className="w-14 h-14 rounded-2xl bg-white p-1 border border-slate-200 shadow-sm flex items-center justify-center">
                <img
                  src={FEDERATION_LOGO}
                  alt="شعار الجامعة"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <h2 className="text-lg font-black text-red-900">{FEDERATION_NAME_AR}</h2>
            <p className="text-[11px] text-slate-500 font-sans">{FEDERATION_NAME_FR}</p>
            <div className="pt-2 text-xs font-bold text-slate-800">
              السجل الوطني المعتمد للأحزمة والدرجات الفنية
            </div>
          </div>

          {/* Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                  <th className="p-2.5 border border-slate-200 text-center w-10">#</th>
                  {fields.map(f => (
                    <th key={f.id} className="p-2.5 border border-slate-200 font-bold">
                      {f.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {records.map((rec, i) => {
                  const badge = getBeltVisualBadge(rec.degree);

                  return (
                    <tr key={rec.id} className="hover:bg-slate-50">
                      <td className="p-2.5 border border-slate-200 text-center font-mono text-slate-500">
                        {i + 1}
                      </td>
                      {fields.map(f => {
                        const val = rec[f.id] || '-';
                        if (f.id === 'degree') {
                          return (
                            <td key={f.id} className="p-2.5 border border-slate-200 font-bold">
                              <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                                {val}
                              </span>
                            </td>
                          );
                        }
                        if (f.id === 'firstName' || f.id === 'lastName') {
                          return (
                            <td key={f.id} className="p-2.5 border border-slate-200 font-bold text-slate-900">
                              {val}
                            </td>
                          );
                        }
                        return (
                          <td key={f.id} className="p-2.5 border border-slate-200 text-slate-700">
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Signatures */}
          <div className="mt-12 pt-6 border-t border-slate-200 flex justify-between items-end text-xs font-bold text-slate-700 px-8">
            <div>
              <p>ختم وإمضاء الإدارة الفنية الوطنية</p>
              <div className="h-14"></div>
            </div>
            <div>
              <p>ختم وإمضاء رئيس الجامعة</p>
              <div className="h-14"></div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
