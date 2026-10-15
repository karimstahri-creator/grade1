import React, { useState } from 'react';
import { SlidersHorizontal, Plus, Trash2, Check, Lock, ArrowRight } from 'lucide-react';
import { CustomField } from '../types';

interface CustomFieldsSectionProps {
  fields: CustomField[];
  setFields: (fields: CustomField[]) => void;
  onBackToAthletes: () => void;
}

const PROTECTED_FIELD_IDS = ['firstName', 'lastName', 'licenseNo', 'club', 'degree'];

export const CustomFieldsSection: React.FC<CustomFieldsSectionProps> = ({
  fields,
  setFields,
  onBackToAthletes
}) => {
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<'text' | 'date' | 'number'>('text');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [deleteConfirmFieldId, setDeleteConfirmFieldId] = useState<string | null>(null);

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
    setFieldError('');
  };

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
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              إدارة حقول قاعدة البيانات
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              تخصيص وإضافة أعمدة جديدة لسجل الرياضيين (الوزن، الفئة، إلخ)
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

      {/* Add Field Form */}
      <form onSubmit={handleAddField} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2 max-w-lg">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          إضافة حقل جديد للسجل
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newFieldLabel}
            onChange={(e) => setNewFieldLabel(e.target.value)}
            placeholder="اسم الحقل (مثال: الوزن أو فئة السن)"
            className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-600"
          />
          <select
            value={newFieldType}
            onChange={(e) => setNewFieldType(e.target.value as 'text' | 'date' | 'number')}
            className="px-2.5 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
          >
            <option value="text">نص</option>
            <option value="date">تاريخ</option>
            <option value="number">رقم</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            إضافة
          </button>
        </div>
        {fieldError && (
          <p className="text-red-600 text-xs pt-1">{fieldError}</p>
        )}
      </form>

      {/* Fields List */}
      <div className="space-y-3">
        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
          الحقول المعرفة حالياً بالسجل:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {fields.map((field) => {
            const isProtected = PROTECTED_FIELD_IDS.includes(field.id);
            const isEditing = editingId === field.id;

            return (
              <div
                key={field.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between gap-2"
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
                      className="p-1 bg-emerald-600 text-white rounded-md cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 truncate">
                    {isProtected ? (
                      <span title="حقل إجباري أساسي">
                        <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                    )}
                    <span
                      onClick={() => startEdit(field)}
                      className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer hover:underline truncate"
                      title="انقر لتعديل التسمية"
                    >
                      {field.label}
                    </span>
                    <span className="text-[10px] text-slate-400">({field.type || 'نص'})</span>
                  </div>
                )}

                {!isProtected && !isEditing && (
                  deleteConfirmFieldId === field.id ? (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => removeField(field.id)}
                        className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded-lg hover:bg-red-700 cursor-pointer"
                      >
                        تأكيد
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmFieldId(null)}
                        className="px-1.5 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] rounded-lg cursor-pointer"
                      >
                        إلغاء
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmFieldId(field.id)}
                      className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition cursor-pointer"
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
  );
};
