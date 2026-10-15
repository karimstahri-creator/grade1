import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Award, 
  FileCheck, 
  Printer, 
  ChevronDown,
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';
import { AthleteRecord, ClubAccount, CustomField } from '../types';
import { cleanStr, getBeltVisualBadge } from '../utils/beltValidation';

interface AthletesTableProps {
  records: AthleteRecord[];
  fields: CustomField[];
  clubs: ClubAccount[];
  beltHierarchy: string[];
  onEditRecord: (rec: AthleteRecord) => void;
  onDeleteRecord: (id: string) => void;
  onViewPassport: (rec: AthleteRecord) => void;
  onOpenAddModal: () => void;
}

export const AthletesTable: React.FC<AthletesTableProps> = ({
  records,
  fields,
  clubs,
  beltHierarchy,
  onEditRecord,
  onDeleteRecord,
  onViewPassport,
  onOpenAddModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClub, setSelectedClub] = useState<string>('ALL');
  const [selectedBelt, setSelectedBelt] = useState<string>('ALL');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');

  // Extract unique regions
  const uniqueRegions = useMemo(() => {
    const set = new Set<string>();
    records.forEach(r => {
      if (r.region?.trim()) set.add(r.region.trim());
    });
    return Array.from(set);
  }, [records]);

  // Filtered list
  const filteredRecords = useMemo(() => {
    const q = cleanStr(searchQuery);

    return records.filter(rec => {
      // Club filter
      if (selectedClub !== 'ALL' && rec.club !== selectedClub) return false;

      // Belt filter
      if (selectedBelt !== 'ALL' && rec.degree !== selectedBelt) return false;

      // Region filter
      if (selectedRegion !== 'ALL' && rec.region !== selectedRegion) return false;

      // Text search across all fields
      if (q) {
        const matchesAny = fields.some(f => {
          const val = cleanStr(rec[f.id]);
          return val.includes(q);
        });
        if (!matchesAny) return false;
      }

      return true;
    });
  }, [records, searchQuery, selectedClub, selectedBelt, selectedRegion, fields]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedClub('ALL');
    setSelectedBelt('ALL');
    setSelectedRegion('ALL');
  };

  const isFiltered = searchQuery || selectedClub !== 'ALL' || selectedBelt !== 'ALL' || selectedRegion !== 'ALL';

  return (
    <div className="space-y-4">
      
      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم، اللقب، رقم الإجازة، الجمعية، رقم الشهادة..."
              className="w-full pr-10 pl-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-600 dark:text-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                مسح
              </button>
            )}
          </div>

          {/* Quick Filter Selects */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Club Filter */}
            <select
              value={selectedClub}
              onChange={(e) => setSelectedClub(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600 font-medium"
            >
              <option value="ALL">كافة الجمعيات ({clubs.length})</option>
              {clubs.map((c) => (
                <option key={c.id} value={c.club}>
                  {c.club}
                </option>
              ))}
            </select>

            {/* Belt Degree Filter */}
            <select
              value={selectedBelt}
              onChange={(e) => setSelectedBelt(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600 font-medium"
            >
              <option value="ALL">كافة الأحزمة والدرجات</option>
              {beltHierarchy.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            {/* Region Filter */}
            {uniqueRegions.length > 0 && (
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600 font-medium"
              >
                <option value="ALL">كافة الجهات</option>
                {uniqueRegions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            )}

            {isFiltered && (
              <button
                onClick={resetFilters}
                className="px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 bg-slate-100 dark:bg-slate-800 rounded-xl transition flex items-center gap-1"
                title="إعادة ضبط الفلاتر"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                إلغاء الفلترة
              </button>
            )}
          </div>

        </div>

        {/* Count and filter status */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
          <span>
            عرض <strong className="text-slate-800 dark:text-slate-200 font-mono tabular-nums">{filteredRecords.length}</strong> من إجمالي <strong className="text-slate-800 dark:text-slate-200 font-mono tabular-nums">{records.length}</strong> رياضي مسجل
          </span>
          <span className="text-[11px]">
            السجل الرسمي للأحزمة · محين وفق مقررات اللجنة الفنية الوطنية
          </span>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs" id="dataTable">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                <th className="p-3.5 whitespace-nowrap">#</th>
                {fields.map((f) => (
                  <th key={f.id} className="p-3.5 whitespace-nowrap font-bold">
                    {f.label}
                  </th>
                ))}
                <th className="p-3.5 text-center whitespace-nowrap">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={fields.length + 2} className="text-center py-16">
                    <div className="max-w-xs mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                        <Filter className="w-6 h-6" />
                      </div>
                      <p className="font-bold text-sm text-slate-700 dark:text-slate-300">
                        لا توجد نتائج مطابقة لبحثك
                      </p>
                      <p className="text-xs text-slate-400">
                        جرّب تعديل كلمات البحث أو إلغاء فلاتر الجمعيات والأحزمة.
                      </p>
                      {isFiltered ? (
                        <button
                          onClick={resetFilters}
                          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl text-xs font-bold transition"
                        >
                          إعادة ضبط الفلاتر
                        </button>
                      ) : (
                        <button
                          onClick={onOpenAddModal}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                        >
                          إضافة أول رياضي
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec, index) => {
                  const badge = getBeltVisualBadge(rec.degree);

                  return (
                    <tr
                      key={rec.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="p-3.5 text-slate-400 font-mono tabular-nums whitespace-nowrap">
                        {index + 1}
                      </td>

                      {fields.map((f) => {
                        const val = rec[f.id] || '-';

                        if (f.id === 'degree') {
                          return (
                            <td key={f.id} className="p-3.5 whitespace-nowrap">
                              <span
                                className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border ${badge.bg} ${badge.text} ${badge.border}`}
                              >
                                {val}
                              </span>
                            </td>
                          );
                        }

                        if (f.id === 'licenseNo') {
                          return (
                            <td key={f.id} className="p-3.5 font-mono font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                              {val}
                            </td>
                          );
                        }

                        if (f.id === 'firstName' || f.id === 'lastName') {
                          return (
                            <td key={f.id} className="p-3.5 font-extrabold text-slate-900 dark:text-white whitespace-nowrap">
                              {val}
                            </td>
                          );
                        }

                        if (f.id === 'degreeDate' || f.type === 'date') {
                          return (
                            <td key={f.id} className="p-3.5 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                              {val}
                            </td>
                          );
                        }

                        return (
                          <td key={f.id} className="p-3.5 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                            {val}
                          </td>
                        );
                      })}

                      {/* Row Actions */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onViewPassport(rec)}
                            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/40 text-amber-700 dark:text-amber-300 transition"
                            title="عرض وطباعة بطاقة الرتبة الرسمية (شهادة الحزام)"
                          >
                            <Award className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onEditRecord(rec)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                            title="تعديل بيانات الرياضي"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`هل أنت متأكد من حذف الرياضي ${rec.firstName} ${rec.lastName} من السجل؟`)) {
                                onDeleteRecord(rec.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 transition"
                            title="حذف من السجل"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
  );
};
