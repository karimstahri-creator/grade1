import React, { useState } from 'react';
import { 
  Inbox, 
  FileText, 
  Download, 
  Eye, 
  Check, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  FileSpreadsheet, 
  Building, 
  Calendar,
  ArrowRight,
  X
} from 'lucide-react';
import { AthleteRecord, CustomField, Submission, SubmissionItem } from '../types';
import { checkSubmissionItemAlert, getBeltVisualBadge } from '../utils/beltValidation';
import { exportSubmissionsToExcel } from '../utils/exportUtils';

interface SubmissionsSectionProps {
  submissions: Submission[];
  records: AthleteRecord[];
  onApproveItem: (subId: string | number, item: SubmissionItem) => void;
  onRejectItem: (subId: string | number, itemId: string) => void;
  onRejectEntireSubmission: (subId: string | number) => void;
  fields: CustomField[];
  beltHierarchy: string[];
  onBackToAthletes: () => void;
}

export const SubmissionsSection: React.FC<SubmissionsSectionProps> = ({
  submissions,
  records,
  onApproveItem,
  onRejectItem,
  onRejectEntireSubmission,
  fields,
  beltHierarchy,
  onBackToAthletes
}) => {
  const [previewFileData, setPreviewFileData] = useState<{ name: string; data: string; type: string } | null>(null);

  const handleExportExcel = () => {
    if (submissions.length === 0) return;
    exportSubmissionsToExcel(submissions, fields);
  };

  const handleApproveAllInSubmission = (sub: Submission) => {
    sub.items.forEach(item => {
      onApproveItem(sub.id, item);
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                الطلبات الواردة والترقيات من الجمعيات
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                {submissions.length} طلب
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              مراجعة ملفات الترقية ومحاضر الجلسات والتحقق الآلي من تدرج الأحزمة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {submissions.length > 0 && (
            <button
              type="button"
              onClick={handleExportExcel}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              تصدير الطلبات (Excel)
            </button>
          )}

          <button
            type="button"
            onClick={onBackToAthletes}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            الرجوع لسجل الرياضيين
          </button>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-6">
        {submissions.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Inbox className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">
              صندوق الوارد فارغ حالياً
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              عندما ترسل الجمعيات ملفات ترقية جديدة، ستظهر هنا فورياً مع نتائج التدقيق الذكي.
            </p>
          </div>
        ) : (
          submissions.map((sub) => (
            <div
              key={sub.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 p-5 space-y-4 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                    <Building className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        الجهة المرسلة: {sub.sender}
                      </span>
                      <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded font-mono text-slate-700 dark:text-slate-300">
                        {sub.items.length} رياضي
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>تاريخ الإرسال: {sub.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleApproveAllInSubmission(sub)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    قبول الكل
                  </button>
                  <button
                    type="button"
                    onClick={() => onRejectEntireSubmission(sub.id)}
                    className="px-3 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 dark:bg-red-950/60 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    حذف الطلب
                  </button>
                </div>
              </div>

              {sub.notes && (
                <p className="text-xs text-slate-600 dark:text-slate-400 bg-white/60 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <strong>ملاحظات الجمعية:</strong> {sub.notes}
                </p>
              )}

              {sub.file ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 gap-3 flex-wrap">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-xs text-slate-900 dark:text-white truncate block">
                        {sub.file.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        الحجم: {sub.file.size}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {sub.file.data && (
                      <button
                        type="button"
                        onClick={() => setPreviewFileData(sub.file!)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        معاينة
                      </button>
                    )}
                    {sub.file.data ? (
                      <a
                        href={sub.file.data}
                        download={sub.file.name}
                        className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-sm cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        تحميل الملف
                      </a>
                    ) : (
                      <span className="text-[10px] text-slate-400">ملف مرفق معتمد</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-slate-400 bg-slate-100/60 dark:bg-slate-800/40 p-2 rounded-lg">
                  لا يوجد ملف مرفق مع هذا الطلب.
                </div>
              )}

              {/* Athletes table */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100/80 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                        <th className="p-3">الاسم واللقب</th>
                        <th className="p-3">رقم الإجازة</th>
                        <th className="p-3">الدرجة المطلوبة</th>
                        <th className="p-3">التاريخ</th>
                        <th className="p-3">تدقيق تسلسل الرتبة</th>
                        <th className="p-3 text-center">الإجراء</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                      {sub.items.map((item) => {
                        const alertInfo = checkSubmissionItemAlert(
                          item.data,
                          records,
                          beltHierarchy,
                          fields
                        );
                        const badge = getBeltVisualBadge(item.data.degree);

                        return (
                          <tr
                            key={item.itemId}
                            className={
                              alertInfo.isAlert
                                ? 'bg-amber-50/70 dark:bg-amber-950/20'
                                : 'hover:bg-slate-50/50 dark:hover:bg-slate-750'
                            }
                          >
                            <td className="p-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                              {item.data.firstName} {item.data.lastName}
                            </td>
                            <td className="p-3 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                              {item.data.licenseNo || '-'}
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}
                              >
                                {item.data.degree || '-'}
                              </span>
                            </td>
                            <td className="p-3 font-mono text-slate-500 whitespace-nowrap">
                              {item.data.degreeDate || '-'}
                            </td>
                            <td className="p-3">
                              {alertInfo.isAlert ? (
                                <div className="flex items-start gap-1.5 text-amber-700 dark:text-amber-400">
                                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                                  <span className="text-[11px] font-bold leading-tight">
                                    {alertInfo.reason}
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold">
                                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                  <span>{alertInfo.reason}</span>
                                </div>
                              )}
                            </td>
                            <td className="p-3 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => onApproveItem(sub.id, item)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition shadow-xs cursor-pointer"
                                  title="قبول الرياضي وإدراجه بالسجل المعتمد"
                                >
                                  قبول
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onRejectItem(sub.id, item.itemId)}
                                  className="px-2.5 py-1 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-bold text-[11px] transition cursor-pointer"
                                  title="رفض هذا البند"
                                >
                                  رفض
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* File Preview Sub-Modal */}
      {previewFileData && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
              <span className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                معاينة الملف: {previewFileData.name}
              </span>
              <button
                type="button"
                onClick={() => setPreviewFileData(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 bg-slate-950 p-2 overflow-hidden flex items-center justify-center">
              {previewFileData.type.includes('image') ? (
                <img
                  src={previewFileData.data}
                  alt={previewFileData.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <iframe
                  src={previewFileData.data}
                  title={previewFileData.name}
                  className="w-full h-full rounded border-0"
                />
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
