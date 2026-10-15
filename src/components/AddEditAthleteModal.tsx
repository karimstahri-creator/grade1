import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, AlertCircle } from 'lucide-react';
import { AthleteRecord, ClubAccount, CustomField } from '../types';

interface AddEditAthleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: AthleteRecord) => void;
  recordToEdit: AthleteRecord | null;
  fields: CustomField[];
  beltHierarchy: string[];
  clubs: ClubAccount[];
}

export const AddEditAthleteModal: React.FC<AddEditAthleteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  recordToEdit,
  fields,
  beltHierarchy,
  clubs
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (recordToEdit) {
      const sanitized: Record<string, string> = {};
      Object.entries(recordToEdit).forEach(([k, v]) => {
        if (typeof v === 'string') sanitized[k] = v;
      });
      setFormData(sanitized);
    } else {
      // Default new record
      const initial: Record<string, string> = {
        firstName: '',
        lastName: '',
        licenseNo: `FTWK-2026-${Math.floor(100 + Math.random() * 900)}`,
        club: clubs[0]?.club || '',
        region: clubs[0]?.region || 'تونس',
        degree: beltHierarchy[0] || 'أصفر 1',
        degreeDate: new Date().toISOString().split('T')[0],
        certNo: `CERT-TN-${Math.floor(8000 + Math.random() * 2000)}`
      };
      setFormData(initial);
    }
    setFormError('');
  }, [recordToEdit, isOpen, clubs, beltHierarchy]);

  if (!isOpen) return null;

  const handleChange = (fieldId: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [fieldId]: value };
      // If changing club, automatically align region if matched
      if (fieldId === 'club') {
        const foundClub = clubs.find(c => c.club === value);
        if (foundClub?.region) {
          updated.region = foundClub.region;
        }
      }
      return updated;
    });
    setFormError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName?.trim() || !formData.lastName?.trim()) {
      setFormError('يرجى إدخال الاسم واللقب على الأقل.');
      return;
    }
    if (!formData.licenseNo?.trim()) {
      setFormError('يرجى تحديد رقم الإجازة الفدرالية.');
      return;
    }

    const finalRecord: AthleteRecord = {
      id: recordToEdit?.id || `ath_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      licenseNo: formData.licenseNo.trim(),
      club: formData.club?.trim() || 'نادي عام',
      region: formData.region?.trim() || 'تونس',
      degree: formData.degree?.trim() || beltHierarchy[0] || 'أصفر 1',
      degreeDate: formData.degreeDate?.trim() || new Date().toISOString().split('T')[0],
      certNo: formData.certNo?.trim() || '',
      ...formData
    };

    onSave(finalRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 rounded-lg">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {recordToEdit ? 'تعديل بيانات رياضي بسجل الأحزمة' : 'إضافة رياضي جديد إلى السجل'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                الجامعة التونسية للووشو كونغ فو والرياضات التابعة
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Core Fields */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                الاسم الأول <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.firstName || ''}
                onChange={(e) => handleChange('firstName', e.target.value)}
                placeholder="مثال: يوسف"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                اللقب (اسم العائلة) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.lastName || ''}
                onChange={(e) => handleChange('lastName', e.target.value)}
                placeholder="مثال: البوعزيزي"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                رقم الإجازة الفدرالية <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.licenseNo || ''}
                onChange={(e) => handleChange('licenseNo', e.target.value)}
                placeholder="FTWK-2026-..."
                className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                الجمعية أو النادي <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.club || ''}
                onChange={(e) => handleChange('club', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                {clubs.map((c) => (
                  <option key={c.id} value={c.club}>
                    {c.club}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                الجهة / الولاية
              </label>
              <input
                type="text"
                value={formData.region || ''}
                onChange={(e) => handleChange('region', e.target.value)}
                placeholder="تونس، صفاقس، سوسة، إلخ"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                الدرجة الفنية (الحزام) <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.degree || ''}
                onChange={(e) => handleChange('degree', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-600 font-bold"
              >
                {beltHierarchy.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                تاريخ الحصول عليها
              </label>
              <input
                type="date"
                value={formData.degreeDate || ''}
                onChange={(e) => handleChange('degreeDate', e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                رقم الشهادة الوطنية
              </label>
              <input
                type="text"
                value={formData.certNo || ''}
                onChange={(e) => handleChange('certNo', e.target.value)}
                placeholder="CERT-TN-..."
                className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            {/* Any Dynamic Custom Fields */}
            {fields
              .filter(
                f =>
                  !['firstName', 'lastName', 'licenseNo', 'club', 'region', 'degree', 'degreeDate', 'certNo'].includes(
                    f.id
                  )
              )
              .map((f) => (
                <div key={f.id}>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {f.label}
                  </label>
                  <input
                    type={f.type || 'text'}
                    value={formData[f.id] || ''}
                    onChange={(e) => handleChange(f.id, e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              ))}
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              حفظ السجل
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
