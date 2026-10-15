import React, { useState } from 'react';
import { Building, Plus, Trash2, Edit2, KeyRound, Phone, MapPin, Check, ArrowRight } from 'lucide-react';
import { ClubAccount } from '../types';

interface UsersManagerSectionProps {
  clubAccounts: ClubAccount[];
  setClubAccounts: (accounts: ClubAccount[]) => void;
  onBackToAthletes: () => void;
}

export const UsersManagerSection: React.FC<UsersManagerSectionProps> = ({
  clubAccounts,
  setClubAccounts,
  onBackToAthletes
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [clubName, setClubName] = useState('');
  const [clubPass, setClubPass] = useState('');
  const [region, setRegion] = useState('');
  const [managerName, setManagerName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanClub = clubName.trim();
    const cleanPass = clubPass.trim();

    if (!cleanClub || !cleanPass) {
      setErrorMessage('يرجى تحديد اسم الجمعية وكلمة السر.');
      return;
    }

    if (editingId) {
      setClubAccounts(
        clubAccounts.map(c =>
          c.id === editingId
            ? {
                ...c,
                club: cleanClub,
                pass: cleanPass,
                region: region.trim() || c.region,
                managerName: managerName.trim() || c.managerName,
                phone: phone.trim() || c.phone
              }
            : c
        )
      );
      resetForm();
    } else {
      if (clubAccounts.some(c => c.club.toLowerCase() === cleanClub.toLowerCase())) {
        setErrorMessage('هذه الجمعية مسجلة مسبقاً، يمكنك تعديلها من القائمة بالأسفل.');
        return;
      }

      const newAccount: ClubAccount = {
        id: `club_${Date.now()}`,
        club: cleanClub,
        pass: cleanPass,
        region: region.trim() || 'تونس',
        managerName: managerName.trim() || 'الممثل القانوني',
        phone: phone.trim() || ''
      };

      setClubAccounts([...clubAccounts, newAccount]);
      resetForm();
    }
  };

  const startEdit = (acc: ClubAccount) => {
    setEditingId(acc.id);
    setClubName(acc.club);
    setClubPass(acc.pass);
    setRegion(acc.region || '');
    setManagerName(acc.managerName || '');
    setPhone(acc.phone || '');
    setErrorMessage('');
  };

  const resetForm = () => {
    setEditingId(null);
    setClubName('');
    setClubPass('');
    setRegion('');
    setManagerName('');
    setPhone('');
    setErrorMessage('');
  };

  const removeAccount = (id: string) => {
    setClubAccounts(clubAccounts.filter(c => c.id !== id));
    if (editingId === id) resetForm();
    setConfirmDeleteId(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 rounded-xl">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              إدارة حسابات الجمعيات والأندية
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              إسناد وإدارة بيانات الدخول الخاصة بكل جمعية رياضية معتمدة
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToAthletes}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          الرجوع لسجل الرياضيين
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-4 max-w-2xl">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {editingId ? 'تعديل بيانات الجمعية المحددة' : 'إضافة حساب جمعية رياضية جديدة'}
          </h4>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
            >
              إلغاء التعديل
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              اسم الجمعية / النادي <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
              placeholder="مثال: نادي الأمل الرياضي"
              className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              كلمة السر للدخول <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={clubPass}
              onChange={(e) => setClubPass(e.target.value)}
              placeholder="مثال: 1234"
              className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              الجهة / الولاية
            </label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="تونس، صفاقس، سوسة..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              اسم المدرب / المسؤول
            </label>
            <input
              type="text"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              placeholder="الكابتن..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-600"
            />
          </div>
        </div>

        {errorMessage && (
          <p className="text-red-600 text-xs">{errorMessage}</p>
        )}

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            {editingId ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            {editingId ? 'حفظ التعديلات' : 'إضافة حساب الجمعية'}
          </button>
        </div>
      </form>

      {/* Clubs Grid */}
      <div className="space-y-3">
        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
          قائمة الجمعيات المسجلة بالمنظومة ({clubAccounts.length}):
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {clubAccounts.map((acc) => (
            <div
              key={acc.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col justify-between gap-3 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {acc.club}
                  </span>
                  {acc.region && (
                    <span className="text-[10px] text-slate-500 bg-white dark:bg-slate-700 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-600 shrink-0">
                      {acc.region}
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 font-mono space-y-0.5">
                  <p>كلمة السر: <strong className="text-slate-700 dark:text-slate-200">{acc.pass}</strong></p>
                  {acc.managerName && <p className="font-sans">المسؤول: {acc.managerName}</p>}
                </div>
              </div>

              <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                <button
                  type="button"
                  onClick={() => startEdit(acc)}
                  className="px-2.5 py-1 rounded-lg text-sky-600 bg-sky-50 dark:bg-sky-950/40 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  title="تعديل الحساب"
                >
                  <Edit2 className="w-3 h-3" />
                  تعديل
                </button>
                {confirmDeleteId === acc.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => removeAccount(acc.id)}
                      className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded-lg hover:bg-red-700 cursor-pointer"
                    >
                      تأكيد
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-1.5 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] rounded-lg cursor-pointer"
                    >
                      إلغاء
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(acc.id)}
                    className="p-1 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                    title="حذف الحساب"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
