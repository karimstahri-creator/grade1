import React, { useState, useMemo, useRef } from 'react';
import { 
  Building, 
  Users, 
  UserPlus, 
  Send, 
  Paperclip, 
  FileSpreadsheet, 
  Printer, 
  Trash2, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileCheck,
  Search,
  Award
} from 'lucide-react';
import { AthleteRecord, AttachedFile, CustomField, Submission, SubmissionItem } from '../types';
import { checkSubmissionItemAlert, getBeltVisualBadge } from '../utils/beltValidation';
import { exportAthletesToExcel } from '../utils/exportUtils';
import { FEDERATION_LOGO, FEDERATION_NAME_AR } from '../constants/assets';

interface ClubPortalProps {
  clubName: string;
  records: AthleteRecord[];
  fields: CustomField[];
  beltHierarchy: string[];
  submissions: Submission[];
  onSubmitNewBatch: (sub: Submission) => void;
  onViewPassport: (rec: AthleteRecord) => void;
}

export const ClubPortal: React.FC<ClubPortalProps> = ({
  clubName,
  records,
  fields,
  beltHierarchy,
  submissions,
  onSubmitNewBatch,
  onViewPassport
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'approved' | 'submit' | 'history'>('submit');
  const [searchRoster, setSearchRoster] = useState('');
  
  // Roster of approved athletes for this club
  const clubAthletes = useMemo(() => {
    return records.filter(
      r => (r.club || '').trim().toLowerCase() === clubName.trim().toLowerCase()
    );
  }, [records, clubName]);

  const filteredRoster = useMemo(() => {
    const q = searchRoster.trim().toLowerCase();
    if (!q) return clubAthletes;
    return clubAthletes.filter(r => 
      `${r.firstName} ${r.lastName} ${r.licenseNo} ${r.degree} ${r.certNo}`.toLowerCase().includes(q)
    );
  }, [clubAthletes, searchRoster]);

  // Submissions sent by this club
  const mySubmissions = useMemo(() => {
    return submissions.filter(
      s => (s.sender || '').trim().toLowerCase() === clubName.trim().toLowerCase()
    );
  }, [submissions, clubName]);

  // Multi-row form state for batch submissions
  const [batchRows, setBatchRows] = useState<Array<{ id: string; data: Record<string, string> }>>([
    {
      id: 'row_init_1',
      data: {
        firstName: '',
        lastName: '',
        licenseNo: '',
        degree: beltHierarchy[0] || 'أصفر 1',
        degreeDate: new Date().toISOString().split('T')[0],
        certNo: ''
      }
    }
  ]);

  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add row
  const addRow = () => {
    setBatchRows(prev => [
      ...prev,
      {
        id: `row_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        data: {
          firstName: '',
          lastName: '',
          licenseNo: '',
          degree: beltHierarchy[0] || 'أصفر 1',
          degreeDate: new Date().toISOString().split('T')[0],
          certNo: ''
        }
      }
    ]);
  };

  const [formError, setFormError] = useState('');

  const removeRow = (rowId: string) => {
    if (batchRows.length === 1) {
      setFormError('يجب أن تحتوي القائمة على رياضي واحد على الأقل.');
      return;
    }
    setBatchRows(prev => prev.filter(r => r.id !== rowId));
    setFormError('');
  };

  const updateRowField = (rowId: string, fieldId: string, value: string) => {
    setBatchRows(prev =>
      prev.map(r => (r.id === rowId ? { ...r, data: { ...r.data, [fieldId]: value } } : r))
    );
    setFormError('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      setAttachedFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.type || 'application/octet-stream',
        data: (evt.target?.result as string) || ''
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitBatch = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that at least one row has first and last name
    const validRows = batchRows.filter(r => r.data.firstName?.trim() && r.data.lastName?.trim());
    if (validRows.length === 0) {
      setFormError('يرجى إدخال بيانات رياضي واحد على الأقل (الاسم واللقب).');
      return;
    }
    setFormError('');

    const items: SubmissionItem[] = validRows.map((r, idx) => ({
      itemId: `sub_item_${Date.now()}_${idx}`,
      data: {
        ...r.data,
        club: clubName,
        region: clubAthletes[0]?.region || 'تونس'
      },
      status: 'pending'
    }));

    const newSubmission: Submission = {
      id: Date.now(),
      sender: clubName,
      items,
      file: attachedFile,
      date: new Date().toISOString().split('T')[0],
      notes: submissionNotes.trim()
    };

    onSubmitNewBatch(newSubmission);
    setSubmitSuccessMsg(true);

    // Reset form
    setBatchRows([
      {
        id: `row_init_${Date.now()}`,
        data: {
          firstName: '',
          lastName: '',
          licenseNo: '',
          degree: beltHierarchy[0] || 'أصفر 1',
          degreeDate: new Date().toISOString().split('T')[0],
          certNo: ''
        }
      }
    ]);
    setAttachedFile(null);
    setSubmissionNotes('');
    if (fileInputRef.current) fileInputRef.current.value = '';

    setTimeout(() => {
      setSubmitSuccessMsg(false);
      setActiveSubTab('history');
    }, 1800);
  };

  const handleExportClubAthletes = () => {
    if (clubAthletes.length === 0) return;
    exportAthletesToExcel(clubAthletes, fields, `سجل_رياضيي_${clubName.replace(/\s+/g, '_')}.xlsx`);
  };

  const handlePrintClubRoster = () => {
    try {
      window.print();
    } catch (e) {
      // Ignore
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Club Identity Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 shadow-md border border-emerald-800/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white p-1 shadow-md border border-white/20 shrink-0 flex items-center justify-center">
              <img
                src={FEDERATION_LOGO}
                alt="شعار الجامعة"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-emerald-200/90 tracking-wider">
                بوابة الجمعيات والأندية الرياضية المنخرطة
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {clubName}
              </h2>
              <p className="text-xs text-emerald-100/70">
                إرسال ملفات الترقية · متابعة رتب وأحزمة لاعبي الجمعية المعتمدين
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 px-4 py-2.5 rounded-xl text-center">
              <span className="text-[10px] text-emerald-200 block">اللاعبون المعتمدون</span>
              <span className="text-lg font-black font-mono tabular-nums">{clubAthletes.length}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 px-4 py-2.5 rounded-xl text-center">
              <span className="text-[10px] text-emerald-200 block">الملفات قيد المراجعة</span>
              <span className="text-lg font-black font-mono tabular-nums">{mySubmissions.length}</span>
            </div>
          </div>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-emerald-800/60 no-print">
          <button
            onClick={() => setActiveSubTab('submit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'submit'
                ? 'bg-white text-emerald-950 font-extrabold shadow-sm'
                : 'text-emerald-200 hover:bg-white/10'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            إرسال ترقيات جديدة
          </button>

          <button
            onClick={() => setActiveSubTab('approved')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'approved'
                ? 'bg-white text-emerald-950 font-extrabold shadow-sm'
                : 'text-emerald-200 hover:bg-white/10'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            سجل لاعبي الجمعية ({clubAthletes.length})
          </button>

          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'history'
                ? 'bg-white text-emerald-950 font-extrabold shadow-sm'
                : 'text-emerald-200 hover:bg-white/10'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            حالة الطلبات المرسلة ({mySubmissions.length})
          </button>
        </div>
      </div>

      {/* Tab 1: New Submission Batch Form */}
      {activeSubTab === 'submit' && (
        <form onSubmit={handleSubmitBatch} className="space-y-4">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-emerald-600" />
                  <span>تعمير قائمة الترقية في الأحزمة (دورة جديدة)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  أضف أسماء الرياضيين الناجحين في دورة الترقية مع درجتهم المستحقة ومحضر الجلسة
                </p>
              </div>

              <button
                type="button"
                onClick={addRow}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                إضافة سطر رياضي آخر
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {submitSuccessMsg && (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>تم إرسال الملف والمرفقات بنجاح إلى الإدارة الفنية بالجامعة التونسية للووشو!</span>
              </div>
            )}

            {/* Rows list */}
            <div className="space-y-4">
              {batchRows.map((row, index) => {
                const alertCheck = checkSubmissionItemAlert(
                  row.data,
                  records,
                  beltHierarchy,
                  fields
                );

                return (
                  <div
                    key={row.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        الرياضي رقم {index + 1}
                      </span>
                      {batchRows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRow(row.id)}
                          className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          حذف السطر
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          الاسم الأول <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={row.data.firstName || ''}
                          onChange={(e) => updateRowField(row.id, 'firstName', e.target.value)}
                          placeholder="مثال: يوسف"
                          className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          اللقب <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={row.data.lastName || ''}
                          onChange={(e) => updateRowField(row.id, 'lastName', e.target.value)}
                          placeholder="مثال: البوعزيزي"
                          className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          رقم الإجازة (إن توفر)
                        </label>
                        <input
                          type="text"
                          value={row.data.licenseNo || ''}
                          onChange={(e) => updateRowField(row.id, 'licenseNo', e.target.value)}
                          placeholder="FTWK-..."
                          className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          الدرجة الفنية المطلوبة <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={row.data.degree || ''}
                          onChange={(e) => updateRowField(row.id, 'degree', e.target.value)}
                          className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        >
                          {beltHierarchy.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          تاريخ الامتحان
                        </label>
                        <input
                          type="date"
                          value={row.data.degreeDate || ''}
                          onChange={(e) => updateRowField(row.id, 'degreeDate', e.target.value)}
                          className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>
                    </div>

                    {/* Real-time Validation Banner inside the row */}
                    {row.data.firstName && row.data.lastName && (
                      <div className="pt-1">
                        {alertCheck.isAlert ? (
                          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-1.5 font-medium">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                            <span>تنبيه نظامي: {alertCheck.reason}</span>
                          </div>
                        ) : (
                          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                            <span>الترقية مطابقة لسلم التدرج: {alertCheck.reason}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* File Attachment & Notes Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              
              {/* Attachment */}
              <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Paperclip className="w-4 h-4 text-emerald-600" />
                  <span>إرفاق محضر جلسة الامتحان أو الملفات المساعدة (PDF أو صور)</span>
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf, .jpg, .jpeg, .png, .doc, .docx"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
                />
                {attachedFile && (
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">
                    ✓ تم اختيار الملف: {attachedFile.name} ({attachedFile.size})
                  </p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ملاحظات أو توضيحات موجهة للإدارة الفنية (اختياري)
                </label>
                <textarea
                  rows={3}
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  placeholder="مثال: أسماء الممتحنين من أعضاء اللجنة الفنية المشرفة، مكان الدورة، إلخ..."
                  className="w-full p-3 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                ></textarea>
              </div>

            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm"
              >
                <Send className="w-4 h-4" />
                إرسال القائمة والملف للمتصرف الاتحادي
              </button>
            </div>

          </div>
        </form>
      )}

      {/* Tab 2: Approved Club Athletes Roster */}
      {activeSubTab === 'approved' && (
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchRoster}
                onChange={(e) => setSearchRoster(e.target.value)}
                placeholder="ابحث في رياضيي جمعيتك..."
                className="w-full pr-9 pl-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportClubAthletes}
                className="px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                تحميل Excel
              </button>
              <button
                onClick={handlePrintClubRoster}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                طباعة القائمة / PDF
              </button>
            </div>
          </div>

          {/* Athletes Table for this club */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm printable-area">
            
            {/* Printable official header (shown when printed) */}
            <div className="p-6 text-center border-b border-slate-200 hidden print:block">
              <h2 className="text-base font-bold">{FEDERATION_NAME_AR}</h2>
              <h3 className="text-sm font-semibold">سجل الرياضيين المعتمدين لجمعية: {clubName}</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                    <th className="p-3">#</th>
                    <th className="p-3">الاسم واللقب</th>
                    <th className="p-3">رقم الإجازة</th>
                    <th className="p-3">الدرجة الفنية (الحزام)</th>
                    <th className="p-3">تاريخ الاعتماد</th>
                    <th className="p-3">رقم الشهادة</th>
                    <th className="p-3 text-center no-print">جواز الحزام</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredRoster.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-400">
                        لا توجد سجلات مسجلة أو مطابقة باسم جمعيتك حالياً.
                      </td>
                    </tr>
                  ) : (
                    filteredRoster.map((ath, idx) => {
                      const badge = getBeltVisualBadge(ath.degree);

                      return (
                        <tr key={ath.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          <td className="p-3 font-mono text-slate-400 tabular-nums">{idx + 1}</td>
                          <td className="p-3 font-bold text-slate-900 dark:text-white">
                            {ath.firstName} {ath.lastName}
                          </td>
                          <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                            {ath.licenseNo}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}
                            >
                              {ath.degree}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-slate-500">{ath.degreeDate || '-'}</td>
                          <td className="p-3 font-mono text-slate-500">{ath.certNo || '-'}</td>
                          <td className="p-3 text-center no-print">
                            <button
                              onClick={() => onViewPassport(ath)}
                              className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold text-[11px] transition inline-flex items-center gap-1"
                            >
                              <Award className="w-3.5 h-3.5" />
                              الشهادة الرسمية
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Submissions History */}
      {activeSubTab === 'history' && (
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              سجل الطلبات السابقة المرسلة من جمعيتكم
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              تتبع حالة دراسة واعتماد ملفات الترقية لدى اللجنة الفنية للجامعة
            </p>
          </div>

          <div className="space-y-4">
            {mySubmissions.length === 0 ? (
              <div className="p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400">
                لم يتم إرسال أي طلبات ترقية سابقة من هذا الحساب.
              </div>
            ) : (
              mySubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-sm"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                        طلب رقم #{sub.id}
                      </span>
                      <span className="text-xs text-slate-400">· {sub.date}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                      قيد المعالجة والاعتماد لدى المتصرف
                    </span>
                  </div>

                  {sub.file && (
                    <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-emerald-600" />
                      <span>المرفق: {sub.file.name} ({sub.file.size})</span>
                    </div>
                  )}

                  <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      الرياضيون المشمولون بالطلب ({sub.items.length}):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {sub.items.map((item) => (
                        <span
                          key={item.itemId}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                        >
                          {item.data.firstName} {item.data.lastName} ({item.data.degree})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
};
