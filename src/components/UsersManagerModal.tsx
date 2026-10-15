import React, { useState } from 'react';
import { Building, Plus, Trash2, Edit2, X, KeyRound, Phone, MapPin, Check, User } from 'lucide-react';
import { ClubAccount } from '../types';

interface UsersManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  clubAccounts: ClubAccount[];
  setClubAccounts: (accounts: ClubAccount[]) => void;
}

export const UsersManagerModal: React.FC<UsersManagerModalProps> = ({
  isOpen,
  onClose,
  clubAccounts,
  setClubAccounts
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [clubName, setClubName] = useState('');
  const [clubPass, setClubPass] = useState('');
  const [region, setRegion] = useState('');
  const [managerName, setManagerName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanClub = clubName.trim();
    const cleanPass = clubPass.trim();

    if (!cleanClub || !cleanPass) {
      setErrorMessage('يرجى تحديد اسم الجمعية وكلمة السر.');
      return;
    }

    if (editingId) {
      // Update
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
      // Create
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

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const removeAccount = (id: string) => {
    setClubAccounts(clubAccounts.filter(c => c.id !== id));
    if (editingId === id) resetForm();
    setConfirmDeleteId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 rounded-lg">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                إدارة حسابات الجمعيات والأندية
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                إسناد وإدارة بيانات الدخول الخاصة بكل جمعية رياضية
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          <form onSubmit={handleSave} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>{editingId ? 'تعديل بيانات الجمعية المحددة' : 'إضافة حساب جمعية رياضية جديدة'}</span>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-slate-400 hover:text-slate-600 text-[11px]"
                >
                  إلغاء التعديل
                </button>
              )}
            </h4>

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
              <p className="text-red-600 text-xs pt-1">{errorMessage}</p>
            )}

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                {editingId ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                {editingId ? 'حفظ التعديلات' : 'إضافة حساب الجمعية'}
              </button>
            </div>
          </form>

          {/* Accounts List */}
          <div className="pt-2">
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
              الحسابات المسجلة ({clubAccounts.length}):
            </p>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {clubAccounts.map((acc) => (
                <div
                  key={acc.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 flex items-center justify-between gap-3 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition"
                >
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {acc.club}
                      </span>
                      {acc.region && (
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded">
                          {acc.region}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      <span>كلمة السر: <strong className="text-slate-700 dark:text-slate-200">{acc.pass}</strong></span>
                      {acc.managerName && <span>المسؤول: {acc.managerName}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEdit(acc)}
                      className="p-1.5 rounded-lg text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/40 transition"
                      title="تعديل الحساب"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {confirmDeleteId === acc.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => removeAccount(acc.id)}
                          className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded-lg hover:bg-red-700"
                        >
                          تأكيد
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-1.5 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] rounded-lg"
                        >
                          إلغاء
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(acc.id)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
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

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end">
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
