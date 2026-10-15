import React, { useState } from 'react';
import { SlidersHorizontal, Plus, Trash2, X, Check, Lock } from 'lucide-react';
import { CustomField } from '../types';

interface CustomFieldsModalProps {
  isOpen: boolean;
  onClose: () => void;
  fields: CustomField[];
  setFields: (fields: CustomField[]) => void;
}

const PROTECTED_FIELD_IDS = ['firstName', 'lastName', 'licenseNo', 'club', 'degree'];

export const CustomFieldsModal: React.FC<CustomFieldsModalProps> = ({
  isOpen,
  onClose,
  fields,
  setFields
}) => {
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<'text' | 'date' | 'number'>('text');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState('');

  if (!isOpen) return null;

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newFieldLabel.trim();
    if (!clean) return;

    const newField: CustomField = {
      id: `custom_${Date.now()}`,
      label: clean,
      type: newFieldType
    };

    setFields([...fields, newField]);
    setNewFieldLabel('');
  };

  const [fieldError, setFieldError] = useState('');
  const [deleteConfirmFieldId, setDeleteConfirmFieldId] = useState<string | null>(null);

  const removeField = (id: string) => {
    if (PROTECTED_FIELD_IDS.includes(id)) {
      setFieldError('هذا الحقل أساسي ولا يمكن حذفه للحفاظ على بنية السجل.');
      return;
    }
    setFields(fields.filter(f => f.id !== id));
    setDeleteConfirmFieldId(null);
    setFieldError('');
  };

  const startEdit = (field: CustomField) => {
    setEditingId(field.id);
    setEditingLabel(field.label);
  };

  const saveEdit = (id: string) => {
    const clean = editingLabel.trim();
    if (!clean) return;
    setFields(
      fields.map(f => (f.id === id ? { ...f, label: clean } : f))
    );
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                إدارة حقول قاعدة البيانات
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                تخصيص الأعمدة والبيانات المطلوبة بسجل الرياضيين
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

        {/* Content */}
        <div className="p-6 space-y-4">
          
          {/* Add Field */}
          <form onSubmit={handleAddField} className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              إضافة حقل جديد للسجل
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newFieldLabel}
                onChange={(e) => setNewFieldLabel(e.target.value)}
                placeholder="اسم الحقل (مثال: الوزن أو فئة السن)"
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-600"
              />
              <select
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value as 'text' | 'date' | 'number')}
                className="px-2 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                <option value="text">نص</option>
                <option value="date">تاريخ</option>
                <option value="number">رقم</option>
              </select>
              <button
                type="submit"
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                إضافة
              </button>
            </div>
          </form>

          {/* List of Fields */}
          <div className="pt-2">
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
              الحقول المعرفة حالياً:
            </p>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {fields.map((field) => {
                const isProtected = PROTECTED_FIELD_IDS.includes(field.id);
                const isEditing = editingId === field.id;

                return (
                  <div
                    key={field.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40"
                  >
                    {isEditing ? (
                      <div className="flex items-center gap-1.5 flex-1">
                        <input
                          type="text"
                          value={editingLabel}
                          onChange={(e) => setEditingLabel(e.target.value)}
                          className="px-2 py-1 text-xs border rounded-lg bg-white dark:bg-slate-900 w-full"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => saveEdit(field.id)}
                          className="p-1 bg-emerald-600 text-white rounded-md"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {isProtected ? (
                          <span title="حقل إجباري أساسي">
                            <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          </span>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                        )}
                        <span
                          onClick={() => startEdit(field)}
                          className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer hover:underline"
                          title="انقر لتعديل التسمية"
                        >
                          {field.label}
                        </span>
                        <span className="text-[10px] text-slate-400">({field.type || 'نص'})</span>
                      </div>
                    )}

                    {!isProtected && !isEditing && (
                      deleteConfirmFieldId === field.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => removeField(field.id)}
                            className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded-lg hover:bg-red-700"
                          >
                            تأكيد
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmFieldId(null)}
                            className="px-1.5 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] rounded-lg"
                          >
                            إلغاء
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmFieldId(field.id)}
                          className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition"
                          title="حذف الحقل"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 transition"
          >
            تم وحفظ
          </button>
        </div>

      </div>
    </div>
  );
};
