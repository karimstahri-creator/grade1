import React from 'react';
import { 
  Users, 
  Award, 
  Inbox, 
  Building2, 
  SlidersHorizontal, 
  LogOut, 
  Sun, 
  Moon, 
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { FEDERATION_LOGO } from '../constants/assets';
import { UserRole } from '../types';

interface NavbarProps {
  currentRole: UserRole;
  activeClubName?: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingSubmissionsCount: number;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onLogout: () => void;
  onOpenSwitchRole: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  activeClubName,
  activeTab,
  setActiveTab,
  pendingSubmissionsCount,
  darkMode,
  setDarkMode,
  onLogout,
  onOpenSwitchRole
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Zone 1: Brand Wordmark with Federation Seal */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 bg-white p-0.5 flex items-center justify-center shrink-0">
              <img
                src={FEDERATION_LOGO}
                alt="شعار الجامعة التونسية للووشو كونغ فو"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-black tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                الجامعة التونسية للووشو كونغ فو
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap hidden xs:inline-block">
                منظومة قاعدة بيانات الأحزمة والدرجات الفنية
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links for Admin (Visible on md and up) */}
          {currentRole === 'admin' ? (
            <nav className="hidden md:flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('athletes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'athletes'
                    ? 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400 font-extrabold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Users className="w-4 h-4 text-red-600 dark:text-red-400" />
                سجل الرياضيين
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('submissions')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 relative cursor-pointer ${
                  activeTab === 'submissions'
                    ? 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400 font-extrabold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Inbox className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                الطلبات الواردة
                {pendingSubmissionsCount > 0 && (
                  <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                    {pendingSubmissionsCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('belts')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'belts'
                    ? 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400 font-extrabold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                سلم الأحزمة
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('clubs')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'clubs'
                    ? 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400 font-extrabold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Building2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                الجمعيات والأندية
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('fields')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'fields'
                    ? 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400 font-extrabold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                الحقول
              </button>
            </nav>
          ) : currentRole === 'club' ? (
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">الجمعية:</span>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/50 truncate max-w-[180px]">
                {activeClubName}
              </span>
            </div>
          ) : null}

          {/* Zone 3: Actions, Role Badge & Toggles */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title={darkMode ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الليلي'}
              aria-label="تبديل المظهر"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Current user badge & switch */}
            {currentRole && (
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={onOpenSwitchRole}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition cursor-pointer"
                  title="تغيير نوع الحساب أو تسجيل الدخول"
                >
                  {currentRole === 'admin' ? (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                      <span>المتصرف العام</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="max-w-[100px] truncate">{activeClubName}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onLogout}
                  className="p-1 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition cursor-pointer"
                  title="تبديل الحساب أو تسجيل الخروج"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Mobile Navigation bar for smaller screens */}
        {currentRole === 'admin' && (
          <div className="flex md:hidden items-center gap-1 pb-2 overflow-x-auto border-t border-slate-100 dark:border-slate-800 pt-2 no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('athletes')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 shrink-0 ${
                activeTab === 'athletes'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Users className="w-3 h-3" />
              الرياضيين
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('submissions')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 shrink-0 relative ${
                activeTab === 'submissions'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Inbox className="w-3 h-3" />
              الطلبات ({pendingSubmissionsCount})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('belts')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 shrink-0 ${
                activeTab === 'belts'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Award className="w-3 h-3" />
              الأحزمة
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('clubs')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 shrink-0 ${
                activeTab === 'clubs'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Building2 className="w-3 h-3" />
              الجمعيات
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('fields')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 shrink-0 ${
                activeTab === 'fields'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <SlidersHorizontal className="w-3 h-3" />
              الحقول
            </button>
          </div>
        )}

      </div>
    </header>
  );
};
