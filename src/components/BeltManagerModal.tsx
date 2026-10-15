import React, { useState } from 'react';
import { Award, ArrowUp, ArrowDown, Trash2, Plus, X, Check, AlertCircle } from 'lucide-react';
import { getBeltVisualBadge } from '../utils/beltValidation';

interface BeltManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  beltHierarchy: string[];
  setBeltHierarchy: (newHierarchy: string[]) => void;
}

export const BeltManagerModal: React.FC<BeltManagerModalProps> = ({
  isOpen,
  onClose,
  beltHierarchy,
  setBeltHierarchy
}) => {
  const [newBeltName, setNewBeltName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  if (!isOpen) return null;

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

  const [deleteConfirmIdx, setDeleteConfirmIdx] = useState<number | null>(null);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-lg">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                إدارة سلم الأحزمة والتسلسل الفني
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                الترتيب الرسمي للترقيات المعتمد بالجامعة التونسية للووشو
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

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          
          {/* Add New Belt Bar */}
          <form onSubmit={handleAddBelt} className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              إضافة درجة فنية / حزام جديد
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newBeltName}
                onChange={(e) => {
                  setNewBeltName(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="مثال: أسود 7 أو بني 2"
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                إضافة للسلم
              </button>
            </div>
            {errorMessage && (
              <p className="text-red-600 text-xs flex items-center gap-1 pt-1">
                <AlertCircle className="w-3 h-3" /> {errorMessage}
              </p>
            )}
          </form>

          {/* List of current belts */}
          <div className="pt-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                ترتيب الأحزمة الحالي (من الرتبة المبتدئة إلى الدرجات العليا):
              </span>
              <span className="text-[11px] text-slate-400 tabular-nums">
                {beltHierarchy.length} درجة مسجلة
              </span>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {beltHierarchy.map((belt, index) => {
                const badge = getBeltVisualBadge(belt);
                const isEditing = editingIndex === index;

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 transition"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>

                      {isEditing ? (
                        <div className="flex items-center gap-1.5 flex-1 max-w-[200px]">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="px-2 py-1 text-xs border rounded-lg bg-white dark:bg-slate-900 border-purple-500 w-full"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => saveEdit(index)}
                            className="p-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                          >
                            <Check className="w-3 h-3" />
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
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border} hidden sm:inline-block`}
                          >
                            معاينة
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveBelt(index, -1)}
                        className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition"
                        title="تحريك لأعلى"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === beltHierarchy.length - 1}
                        onClick={() => moveBelt(index, 1)}
                        className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition"
                        title="تحريك لأسفل"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      {deleteConfirmIdx === index ? (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => removeBelt(index)}
                            className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded-lg hover:bg-red-700"
                          >
                            تأكيد
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmIdx(null)}
                            className="px-1.5 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] rounded-lg"
                          >
                            إلغاء
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmIdx(index)}
                          className="p-1.5 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-200 transition"
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

          {/* Footer note */}
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200/50 dark:border-purple-900/50 text-[11px] text-purple-900 dark:text-purple-300">
            ملاحظة: محرك التدقيق الذكي يعتمد على هذا الترتيب لاكتشاف الرياضيين الذين يتجاوزون الأحزمة أو التخطي غير النظامي.
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 transition shadow-sm"
          >
            إغلاق وحفظ
          </button>
        </div>

      </div>
    </div>
  );
};
