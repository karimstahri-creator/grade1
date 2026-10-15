import React, { useState } from 'react';
import { ShieldCheck, Users, KeyRound, ArrowRight, Building, CheckCircle2, AlertCircle } from 'lucide-react';
import { FEDERATION_LOGO, WUSHU_BANNER } from '../constants/assets';
import { ClubAccount, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminPassword: string;
  clubAccounts: ClubAccount[];
  onSelectRole: (role: UserRole, clubName?: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  adminPassword,
  clubAccounts,
  onSelectRole
}) => {
  const [view, setView] = useState<'select' | 'admin' | 'club'>('select');
  const [adminInputPass, setAdminInputPass] = useState('');
  const [adminError, setAdminError] = useState(false);

  const [selectedClub, setSelectedClub] = useState(clubAccounts[0]?.club || '');
  const [clubInputPass, setClubInputPass] = useState('');
  const [clubError, setClubError] = useState(false);

  if (!isOpen) return null;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminInputPass === adminPassword) {
      setAdminError(false);
      onSelectRole('admin');
      onClose();
    } else {
      setAdminError(true);
    }
  };

  const handleClubLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = clubAccounts.find(
      c => c.club === selectedClub && c.pass === clubInputPass.trim()
    );
    if (found) {
      setClubError(false);
      onSelectRole('club', found.club);
      onClose();
    } else {
      setClubError(true);
    }
  };

  const handleQuickClubLogin = (club: ClubAccount) => {
    setSelectedClub(club.club);
    setClubInputPass(club.pass);
    onSelectRole('club', club.club);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transition-all">
        
        {/* Banner with Federation branding */}
        <div className="relative h-28 bg-gradient-to-r from-red-800 to-red-950 overflow-hidden flex items-center px-6">
          <img
            src={WUSHU_BANNER}
            alt="خلفية الووشو كونغ فو"
            className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
          />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white p-1 shadow-lg border border-red-200 shrink-0 flex items-center justify-center">
              <img
                src={FEDERATION_LOGO}
                alt="شعار الجامعة"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-white">
              <h2 className="text-base font-extrabold tracking-tight">الجامعة التونسية للووشو كونغ فو</h2>
              <p className="text-xs text-red-100/80">البوابة الرقمية لإدارة الأحزمة والرتب الرياضية</p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {view === 'select' && (
            <div className="space-y-4">
              <div className="text-center pb-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  اختر بوابة الدخول للنظام
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  سجل دخولك كمتصرف اتحادي لإدارة السجل أو كممثل جمعية لتقديم طلبات الترقية
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* Admin Card Option */}
                <button
                  onClick={() => setView('admin')}
                  className="group p-5 text-right rounded-xl border border-slate-200 dark:border-slate-700 hover:border-red-500 dark:hover:border-red-500 bg-slate-50 dark:bg-slate-800/60 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-all flex flex-col justify-between"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 flex items-center justify-center mb-3">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors">
                      دخول المتصرف العام
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      إدارة قاعدة البيانات، مراجعة ملفات الترقية، وضبط سلم الأحزمة
                    </p>
                  </div>
                </button>

                {/* Club Card Option */}
                <button
                  onClick={() => setView('club')}
                  className="group p-5 text-right rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all flex flex-col justify-between"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      دخول جمعية / نادٍ
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      إرسال ملفات الرياضيين ومتابعة درجات ولاعبي النادي
                    </p>
                  </div>
                </button>
              </div>

              {/* Demo quick access hints */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                <span className="text-[11px] text-slate-400">
                  كلمة السر الافتراضية للمتصرف: <strong className="font-mono text-slate-700 dark:text-slate-300">5678</strong>
                </span>
              </div>
            </div>
          )}

          {view === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">تسجيل دخول المتصرف الإداري</h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setView('select');
                    setAdminError(false);
                  }}
                  className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  تغيير البوابة
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  كلمة سر المتصرف
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={adminInputPass}
                    onChange={(e) => {
                      setAdminInputPass(e.target.value);
                      setAdminError(false);
                    }}
                    placeholder="أدخل كلمة السر (افتراضياً: 5678)"
                    className={`w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border ${
                      adminError
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-300 dark:border-slate-700 focus:ring-red-600'
                    } focus:outline-none focus:ring-2`}
                    autoFocus
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
                {adminError && (
                  <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> كلمة السر غير صحيحة!
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setView('select')}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition"
                >
                  رجوع
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition shadow-sm"
                >
                  دخول للمنظومة
                </button>
              </div>

              <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-900/50 text-[11px] text-red-800 dark:text-red-300 flex items-center justify-between">
                <span>تجربة سريعة: كلمة السر هي <strong>5678</strong></span>
                <button
                  type="button"
                  onClick={() => {
                    setAdminInputPass('5678');
                    onSelectRole('admin');
                    onClose();
                  }}
                  className="underline font-bold"
                >
                  دخول تلقائي
                </button>
              </div>
            </form>
          )}

          {view === 'club' && (
            <form onSubmit={handleClubLogin} className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">بوابة الجمعيات والأندية</h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setView('select');
                    setClubError(false);
                  }}
                  className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  تغيير البوابة
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  اختر اسم الجمعية أو النادي
                </label>
                <select
                  value={selectedClub}
                  onChange={(e) => {
                    setSelectedClub(e.target.value);
                    setClubError(false);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  {clubAccounts.map((c) => (
                    <option key={c.id} value={c.club}>
                      {c.club} ({c.region || 'تونس'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  كلمة السر الخاصة بالجمعية
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={clubInputPass}
                    onChange={(e) => {
                      setClubInputPass(e.target.value);
                      setClubError(false);
                    }}
                    placeholder="أدخل كلمة السر الخاصة بالنادي"
                    className={`w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border ${
                      clubError
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-300 dark:border-slate-700 focus:ring-emerald-600'
                    } focus:outline-none focus:ring-2`}
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
                {clubError && (
                  <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> كلمة السر غير مطابقة للجمعية المحددة!
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setView('select')}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition"
                >
                  رجوع
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm"
                >
                  دخول للتعمير
                </button>
              </div>

              {/* Quick Login Chips for Ease of Evaluation */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[11px] font-semibold text-slate-500 mb-2">الدخول السريع بحسابات تجريبية:</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {clubAccounts.slice(0, 4).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleQuickClubLogin(c)}
                      className="text-right p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-slate-200 dark:border-slate-700 text-[11px] transition"
                    >
                      <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">{c.club}</span>
                      <span className="text-slate-400 font-mono text-[10px]">كلمة السر: {c.pass}</span>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
