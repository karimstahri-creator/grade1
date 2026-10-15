import React from 'react';
import { 
  UserPlus, 
  FileSpreadsheet, 
  Upload, 
  Printer, 
  Award, 
  SlidersHorizontal, 
  Building2, 
  Inbox,
  Users
} from 'lucide-react';
import { FEDERATION_LOGO, FEDERATION_MINISTRY, FEDERATION_NAME_AR } from '../constants/assets';
import { AthleteRecord, ClubAccount, Submission } from '../types';

interface HeaderBannerProps {
  records: AthleteRecord[];
  clubs: ClubAccount[];
  submissions: Submission[];
  onOpenAddModal: () => void;
  onOpenBeltManager: () => void;
  onOpenCustomFields: () => void;
  onOpenUsersManager: () => void;
  onOpenSubmissions: () => void;
  onExportExcel: () => void;
  onImportExcel: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPrintTable: () => void;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  records,
  clubs,
  submissions,
  onOpenAddModal,
  onOpenBeltManager,
  onOpenCustomFields,
  onOpenUsersManager,
  onOpenSubmissions,
  onExportExcel,
  onImportExcel,
  onPrintTable
}) => {
  const blackBeltsCount = records.filter(r => (r.degree || '').includes('أسود') || (r.degree || '').includes('دان')).length;

  return (
    <div className="space-y-5">
      
      {/* Institutional Brand Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-900 via-red-800 to-slate-900 text-white p-6 shadow-md border border-red-800/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          {/* Logo & Federation Titles */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-lg shrink-0 border border-white/20 flex items-center justify-center">
              <img
                src={FEDERATION_LOGO}
                alt="شعار الجامعة التونسية للووشو كونغ فو"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-semibold tracking-wider text-red-200/90 block">
                {FEDERATION_MINISTRY}
              </span>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {FEDERATION_NAME_AR}
              </h1>
              <p className="text-xs text-red-100/70">
                المنظومة المركزية لإسناد ومتابعة الدرجات الفنية (الأحزمة) لجميع الرياضيين والجمعيات
              </p>
            </div>
          </div>

          {/* KPI Mini-Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 p-3 rounded-xl text-center">
              <span className="text-[11px] text-red-200 block font-medium">إجمالي الرياضيين</span>
              <span className="text-xl font-black font-mono tabular-nums">{records.length}</span>
            </div>
            <div 
              onClick={onOpenUsersManager}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 p-3 rounded-xl text-center cursor-pointer transition"
              title="انقر لإدارة الجمعيات"
            >
              <span className="text-[11px] text-red-200 block font-medium">الجمعيات المعتمدة</span>
              <span className="text-xl font-black font-mono tabular-nums">{clubs.length}</span>
            </div>
            <div 
              onClick={onOpenBeltManager}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 p-3 rounded-xl text-center cursor-pointer transition"
              title="انقر لإدارة سلم الأحزمة"
            >
              <span className="text-[11px] text-red-200 block font-medium">أحزمة دان (أسود)</span>
              <span className="text-xl font-black font-mono tabular-nums text-amber-300">{blackBeltsCount}</span>
            </div>
            <div 
              onClick={onOpenSubmissions}
              className="bg-amber-500/20 hover:bg-amber-500/30 backdrop-blur-sm border border-amber-400/30 p-3 rounded-xl text-center cursor-pointer transition"
              title="انقر لفتح الطلبات الواردة"
            >
              <span className="text-[11px] text-amber-200 block font-bold">الطلبات الواردة</span>
              <span className="text-xl font-black font-mono tabular-nums text-amber-300">{submissions.length}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Action Bar */}
      <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Left primary actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenAddModal}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            إضافة رياضي جديد
          </button>

          {/* Native label for robust file selection in any browser or iframe */}
          <label
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            title="استيراد سجل الرياضيين من ملف Excel مع مطابقة ذكية للأعمدة"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>استيراد Excel</span>
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={onImportExcel}
              className="hidden"
            />
          </label>

          {/* Export Excel */}
          <button
            type="button"
            onClick={onExportExcel}
            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            title="تصدير السجل الكامل إلى جدول Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            تصدير Excel
          </button>

          {/* Print Registry / View Document */}
          <button
            type="button"
            onClick={onPrintTable}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            title="معاينة وطباعة السجل الرسمي أو التنزيل"
          >
            <Printer className="w-3.5 h-3.5" />
            طباعة السجل / PDF
          </button>
        </div>

        {/* Right configuration tools */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenSubmissions}
            className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700/60 text-xs font-bold transition flex items-center gap-1.5 relative cursor-pointer"
          >
            <Inbox className="w-3.5 h-3.5" />
            الطلبات الواردة
            {submissions.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center font-mono">
                {submissions.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenBeltManager}
            className="px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-bold transition flex items-center gap-1.5 border border-purple-200 dark:border-purple-800/50 cursor-pointer"
          >
            <Award className="w-3.5 h-3.5" />
            إدارة الأحزمة والتسلسل
          </button>

          <button
            type="button"
            onClick={onOpenUsersManager}
            className="px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 dark:hover:bg-sky-900/40 text-sky-700 dark:text-sky-300 text-xs font-bold transition flex items-center gap-1.5 border border-sky-200 dark:border-sky-800/50 cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5" />
            إدارة الجمعيات
          </button>

          <button
            type="button"
            onClick={onOpenCustomFields}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            إدارة الحقول
          </button>
        </div>

      </div>

    </div>
  );
};
