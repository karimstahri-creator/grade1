import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  Laptop, 
  Share2, 
  PlusSquare, 
  CheckCircle2, 
  X, 
  FileSpreadsheet, 
  Code2, 
  HardDrive,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { FEDERATION_LOGO } from '../constants/assets';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportExcel: () => void;
  onExportBackupJSON: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  onExportExcel,
  onExportBackupJSON
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'app' | 'code' | 'backup'>('app');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden my-6">
        
        {/* Header Banner */}
        <div className="relative p-6 bg-gradient-to-r from-red-900 via-red-800 to-slate-900 text-white overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white p-1 shadow-md border border-white/20 flex items-center justify-center shrink-0">
                <img
                  src={FEDERATION_LOGO}
                  alt="شعار الجامعة"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black tracking-tight">
                  تحميل وتثبيت منظومة الجامعة التونسية للووشو
                </h3>
                <p className="text-xs text-red-100/80">
                  خيارات التثبيت كتطبيق مستقل، تنزيل الكود المصدري، أو حفظ البيانات
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/15">
            <button
              onClick={() => setActiveTab('app')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'app'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-red-100 hover:bg-white/10'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              تثبيت كتطبيق (حاسوب وهاتف)
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'code'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-red-100 hover:bg-white/10'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              تحميل الكود المصدري (ZIP)
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'backup'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-red-100 hover:bg-white/10'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              تصدير نسخة احتياطية
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* TAB 1: INSTALL AS PWA (Desktop & Mobile) */}
          {activeTab === 'app' && (
            <div className="space-y-4">
              
              {isInstalled ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>التطبيق مثبت ويعمل حالياً كتطبيق مكتبي / محمول مستقل على جهازك!</span>
                </div>
              ) : (
                <>
                  {/* Direct 1-Click Install Button if supported */}
                  {isInstallable && (
                    <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <span className="text-xs font-black text-red-900 dark:text-red-200 block">
                          تثبيت فوري بنقرة واحدة
                        </span>
                        <span className="text-[11px] text-slate-600 dark:text-slate-400">
                          جاهز للتثبيت المباشر على جهازك دون الحاجة للمتجر
                        </span>
                      </div>
                      <button
                        onClick={install}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm shrink-0"
                      >
                        <Download className="w-4 h-4" />
                        تثبيت التطبيق الآن
                      </button>
                    </div>
                  )}

                  {/* Instructions for Desktop & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    
                    {/* Desktop Instructions */}
                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-2.5">
                      <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs">
                        <Laptop className="w-4 h-4 text-red-600" />
                        <span>على الحاسوب (Windows / Mac)</span>
                      </div>
                      <ol className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-decimal list-inside pr-1">
                        <li>
                          في متصفح <strong>Google Chrome</strong> أو <strong>Edge</strong>، انقر على أيقونة التثبيت <span className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded font-mono text-[10px]">⊕</span> في شريط العنوان بالأعلى.
                        </li>
                        <li>
                          اختر <strong>«تثبيت / Install»</strong> ليظهر التطبيق في قائمة البرامج وسطح المكتب.
                        </li>
                        <li>
                          يعمل التطبيق كنافذة مستقلة وسريعة بدون شريط المتصفح.
                        </li>
                      </ol>
                    </div>

                    {/* Mobile Instructions */}
                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-2.5">
                      <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs">
                        <Smartphone className="w-4 h-4 text-emerald-600" />
                        <span>على الهاتف (Android / iPhone)</span>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
                        <div>
                          <strong className="text-slate-800 dark:text-slate-200 block text-[11px]">هواتف Android (Chrome):</strong>
                          انقر على قائمة المتصفح (⋮) ثم اضغط <strong>«تثبيت التطبيق»</strong> أو <strong>«إضافة إلى الشاشة الرئيسية»</strong>.
                        </div>
                        <div>
                          <strong className="text-slate-800 dark:text-slate-200 block text-[11px]">هواتف iPhone (Safari):</strong>
                          انقر على زر المشاركة ( <Share2 className="w-3 h-3 inline text-sky-500" /> ) ثم اختر <strong>«إضافة إلى الشاشة الرئيسية»</strong>.
                        </div>
                      </div>
                    </div>

                  </div>
                </>
              )}

              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/60 text-[11px] text-amber-900 dark:text-amber-300 leading-relaxed">
                💡 <strong>ميزة التثبيت (PWA):</strong> يتيح لك فتح المنظومة مباشرة كبرنامج أصلي بدون الحاجة لكتابة الرابط، مع دعم التشغيل والوصول للبيانات المخزنة في أي وقت.
              </div>

            </div>
          )}

          {/* TAB 2: DOWNLOAD SOURCE CODE (ZIP) */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-sky-600" />
                  <span>تحميل كود المشروع كاملاً من منصة Google AI Studio</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  يمكنك تحميل المشروع كاملاً بصيغة ملف مضغوط (<strong>ZIP</strong>) لتشغيله محلياً على جهازك أو استضافته على خادم خاص بك عبر الخطوات التالية:
                </p>

                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-2 text-slate-700 dark:text-slate-300">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                    <span>في الشريط العلوي لواجهة <strong>Google AI Studio</strong>، اضغط على زر <strong>Export / Download</strong> أو أيقونة القائمة لتحميل ملف <code>zip</code> يحتوي كافة ملفات المشروع.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                    <span>قم بفك الضغط عن المجلد على حاسوبك وافتح سطر الأوامر (Terminal / CMD).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
                    <span>شغّل الأوامر التالية لتنصيب الحزم وتشغيل المنظومة:</span>
                  </div>
                </div>

                <div className="bg-slate-900 text-emerald-400 font-mono text-xs p-3 rounded-xl overflow-x-auto text-left" dir="ltr">
                  <code>npm install<br />npm run dev</code>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EXPORT BACKUP */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-teal-600" />
                  <span>تصدير وحفظ بيانات السجل على جهازك</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  يمكنك حفظ نسخة كاملة من سجل الرياضيين، الأحزمة، والطلبات على حاسوبك الشخصي:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={onExportExcel}
                    className="p-4 rounded-xl border border-teal-200 dark:border-teal-800/60 bg-teal-50 dark:bg-teal-950/30 hover:bg-teal-100 text-right transition group"
                  >
                    <FileSpreadsheet className="w-5 h-5 text-teal-600 dark:text-teal-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-xs text-teal-950 dark:text-teal-200 block">
                      تصدير كملف Excel (.xlsx)
                    </span>
                    <span className="text-[11px] text-teal-700 dark:text-teal-400 mt-0.5 block">
                      جدول بيانات كامل لجميع الرياضيين والأحزمة والجمعيات
                    </span>
                  </button>

                  <button
                    onClick={onExportBackupJSON}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 text-right transition group"
                  >
                    <Download className="w-5 h-5 text-slate-700 dark:text-slate-300 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-xs text-slate-900 dark:text-white block">
                      نسخة احتياطية كاملة (.json)
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                      تشمل السجلات، الحقول، سلم الأحزمة، وحسابات الجمعيات
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 transition shadow-sm"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
