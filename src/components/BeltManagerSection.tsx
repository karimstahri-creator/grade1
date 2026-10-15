import React, { useState } from 'react';
import { Award, ArrowUp, ArrowDown, Trash2, Plus, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { getBeltVisualBadge } from '../utils/beltValidation';

interface BeltManagerSectionProps {
  beltHierarchy: string[];
  setBeltHierarchy: (newHierarchy: string[]) => void;
  onBackToAthletes: () => void;
}

export const BeltManagerSection: React.FC<BeltManagerSectionProps> = ({
  beltHierarchy,
  setBeltHierarchy,
  onBackToAthletes
}) => {
  const [newBeltName, setNewBeltName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [deleteConfirmIdx, setDeleteConfirmIdx] = useState<number | null>(null);

  const handleAddBelt = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newBeltName.trim();
    if (!clean) {
      setErrorMessage('يرجى كتابة اسم الحزام أو الدرجة.');
      return;
    }
    if (beltHierarchy.includes(clean)) {
      setErrorMessage('هذه الدرجة مسجلة مسبقاً في سلم الأحزمة.');
      return;
    }

    setBeltHierarchy([...beltHierarchy, clean]);
    setNewBeltName('');
    setErrorMessage('');
  };

  const moveBelt = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= beltHierarchy.length) return;
    const copy = [...beltHierarchy];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setBeltHierarchy(copy);
  };

  const removeBelt = (index: number) => {
    const copy = beltHierarchy.filter((_, i) => i !== index);
    setBeltHierarchy(copy);
    setDeleteConfirmIdx(null);
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(beltHierarchy[index]);
  };

  const saveEdit = (index: number) => {
    const clean = editValue.trim();
    if (!clean) return;
    const copy = [...beltHierarchy];
    copy[index] = clean;
    setBeltHierarchy(copy);
    setEditingIndex(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      
      {/* Top Title Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              إدارة سلم الأحزمة والتسلسل الفني
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              الترتيب الرسمي للترقيات المعتمد بالجامعة التونسية للووشو كونغ فو
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

      {/* Add New Belt Bar */}
      <form onSubmit={handleAddBelt} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2 max-w-xl">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          إضافة درجة فنية / حزام جديد إلى السلم
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newBeltName}
            onChange={(e) => {
              setNewBeltName(e.target.value);
              setErrorMessage('');
            }}
            placeholder="مثال: أسود 7 (دان 7) أو بني 2"
            className="flex-1 px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            إضافة للسلم
          </button>
        </div>
        {errorMessage && (
          <p className="text-red-600 text-xs flex items-center gap-1 pt-1">
            <AlertCircle className="w-3.5 h-3.5" /> {errorMessage}
          </p>
        )}
      </form>

      {/* Belts List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            ترتيب الأحزمة الحالي (من الرتبة المبتدئة إلى الدرجات العليا):
          </span>
          <span className="text-xs font-mono text-purple-600 dark:text-purple-400 font-bold">
            {beltHierarchy.length} درجة معتمدة
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {beltHierarchy.map((belt, index) => {
            const badge = getBeltVisualBadge(belt);
            const isEditing = editingIndex === index;

            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 transition"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono text-xs font-black flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>

                  {isEditing ? (
                    <div className="flex items-center gap-1.5 flex-1 max-w-[220px]">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="px-2.5 py-1 text-xs border rounded-lg bg-white dark:bg-slate-900 border-purple-500 w-full"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => saveEdit(index)}
                        className="p-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 truncate">
                      <span
                        onClick={() => startEdit(index)}
                        className="font-bold text-xs text-slate-800 dark:text-slate-200 cursor-pointer hover:underline truncate"
                        title="انقر لتعديل الاسم"
                      >
                        {belt}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        معاينة الشارة
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveBelt(index, -1)}
                    className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                    title="تحريك لأعلى"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === beltHierarchy.length - 1}
                    onClick={() => moveBelt(index, 1)}
                    className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                    title="تحريك لأسفل"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  {deleteConfirmIdx === index ? (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => removeBelt(index)}
                        className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded-lg hover:bg-red-700 cursor-pointer"
                      >
                        تأكيد
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmIdx(null)}
                        className="px-1.5 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] rounded-lg cursor-pointer"
                      >
                        إلغاء
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmIdx(index)}
                      className="p-1.5 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-200 transition cursor-pointer"
                      title="حذف الحزام"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
