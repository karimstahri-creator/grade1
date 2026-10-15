import React from 'react';
import { Printer, X, Award, CheckCircle, Shield, Calendar, Building, Hash } from 'lucide-react';
import { FEDERATION_LOGO, FEDERATION_MINISTRY, FEDERATION_NAME_AR, FEDERATION_NAME_FR } from '../constants/assets';
import { AthleteRecord } from '../types';
import { getBeltVisualBadge } from '../utils/beltValidation';

interface AthletePassportModalProps {
  athlete: AthleteRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AthletePassportModal: React.FC<AthletePassportModalProps> = ({
  athlete,
  isOpen,
  onClose
}) => {
  if (!isOpen || !athlete) return null;

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      // Ignore or let user use browser print
    }
  };

  const badgeStyle = getBeltVisualBadge(athlete.degree);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden my-8">
        
        {/* Modal Controls Header (Hidden in print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 no-print">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              بطاقة إثبات الدرجة الفنية الرسمية (جواز الحزام)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              طباعة الشهادة / تصدير PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Canvas */}
        <div className="p-8 sm:p-12 printable-area bg-gradient-to-b from-amber-50/30 via-white to-amber-50/20 text-slate-900 relative">
          
          {/* Decorative Ornamental Border */}
          <div className="border-4 border-double border-amber-600/60 p-6 sm:p-8 rounded-2xl relative bg-white/80 shadow-sm">
            
            {/* Corner Accents */}
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-700"></div>
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-700"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-700"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-700"></div>

            {/* Federation Header */}
            <div className="text-center space-y-1.5 pb-6 border-b border-amber-200/80">
              <p className="text-[11px] font-semibold tracking-wider text-slate-600">{FEDERATION_MINISTRY}</p>
              
              <div className="flex items-center justify-center gap-4 my-2">
                <div className="w-16 h-16 rounded-full bg-white p-1 border-2 border-amber-600/40 shadow-sm flex items-center justify-center">
                  <img
                    src={FEDERATION_LOGO}
                    alt="شعار الجامعة التونسية للووشو كونغ فو"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-red-800 tracking-tight">
                {FEDERATION_NAME_AR}
              </h2>
              <p className="text-[10px] text-slate-500 font-sans tracking-wide">
                {FEDERATION_NAME_FR}
              </p>
              <div className="pt-2">
                <span className="inline-block px-4 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
                  شهادة ترقية في الدرجة الفنية المعتمدة
                </span>
              </div>
            </div>

            {/* Main Certificate Content */}
            <div className="py-8 space-y-6 text-center">
              <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                تشهد الإدارة الفنية الوطنية للجامعة التونسية للووشو كونغ فو والرياضات التابعة بأنّ الرياضي(ة):
              </p>

              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {athlete.firstName} {athlete.lastName}
                </h1>
                <p className="text-xs font-bold text-slate-600 font-mono tracking-wider">
                  رقم الإجازة الفدرالية: {athlete.licenseNo}
                </p>
              </div>

              <div className="my-6 p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 max-w-sm mx-auto">
                <p className="text-xs text-amber-800 mb-1">قد نال(ت) عن جدارة واستحقاق رتبة:</p>
                <div className="text-xl sm:text-2xl font-black text-red-900">
                  {athlete.degree}
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  تاريخ الاعتماد: <span className="font-bold font-mono">{athlete.degreeDate || 'مُعتمد'}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs text-slate-700 max-w-md mx-auto pt-2 border-t border-dashed border-slate-200">
                <div className="text-right space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Building className="w-3.5 h-3.5" />
                    <span>الجمعية / النادي:</span>
                  </div>
                  <p className="font-bold text-slate-900 pr-5">{athlete.club}</p>
                </div>

                <div className="text-right space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Hash className="w-3.5 h-3.5" />
                    <span>رقم الشهادة الوطنية:</span>
                  </div>
                  <p className="font-bold text-slate-900 font-mono pr-5">{athlete.certNo || 'FTWK-REG'}</p>
                </div>
              </div>
            </div>

            {/* Official Signatures & Seal */}
            <div className="pt-8 mt-6 border-t border-amber-200/80 flex justify-between items-end px-4 text-center">
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-700">المدير الفني الوطني</p>
                <div className="h-10"></div>
                <p className="text-[10px] text-slate-400">توقيع وختم الإدارة الفنية</p>
              </div>

              {/* Official Federation Stamp Graphic */}
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-red-700/60 p-1 flex items-center justify-center flex-col text-red-800 rotate-[-8deg] opacity-80">
                <Shield className="w-5 h-5 text-red-700" />
                <span className="text-[8px] font-black leading-tight text-center">
                  ختم الجامعة
                  <br />
                  المعتمد
                </span>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-700">رئيس الجامعة</p>
                <div className="h-10"></div>
                <p className="text-[10px] text-slate-400">توقيع وختم رئيس الجامعة</p>
              </div>
            </div>

          </div>

          <div className="text-center text-[10px] text-slate-400 pt-4">
            وثيقة رسمية صادرة عن الجامعة التونسية للووشو كونغ فو · صالحة إدارياً ورياضياً لجميع التظاهرات الوطنية والدولية
          </div>

        </div>

        {/* Modal Bottom Actions (Hidden in print) */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2 no-print">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 transition"
          >
            إغلاق
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            طباعة
          </button>
        </div>

      </div>
    </div>
  );
};
