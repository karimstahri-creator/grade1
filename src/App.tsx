import React, { useState, useEffect } from 'react';
import { 
  DEFAULT_ATHLETES, 
  DEFAULT_BELT_HIERARCHY, 
  DEFAULT_CLUBS, 
  DEFAULT_FIELDS, 
  DEFAULT_SUBMISSIONS 
} from './data/initialData';
import { AthleteRecord, ClubAccount, CustomField, Submission, SubmissionItem, UserRole } from './types';
import { Navbar } from './components/Navbar';
import { HeaderBanner } from './components/HeaderBanner';
import { AthletesTable } from './components/AthletesTable';
import { AddEditAthleteModal } from './components/AddEditAthleteModal';
import { BeltManagerSection } from './components/BeltManagerSection';
import { CustomFieldsSection } from './components/CustomFieldsSection';
import { UsersManagerSection } from './components/UsersManagerSection';
import { SubmissionsSection } from './components/SubmissionsSection';
import { PrintRosterModal } from './components/PrintRosterModal';
import { AthletePassportModal } from './components/AthletePassportModal';
import { AuthModal } from './components/AuthModal';
import { ClubPortal } from './components/ClubPortal';
import { ConfirmModal, ConfirmDialogState } from './components/ConfirmModal';
import { exportAthletesToExcel, parseExcelFile } from './utils/exportUtils';
import { cleanStr } from './utils/beltValidation';
import { safeStorage } from './utils/safeStorage';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return safeStorage.getItem('ftwk_dark_mode') === 'true';
  });

  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        safeStorage.setItem('ftwk_dark_mode', 'true');
      } else {
        document.documentElement.classList.remove('dark');
        safeStorage.setItem('ftwk_dark_mode', 'false');
      }
    } catch (e) {
      // Ignore
    }
  }, [darkMode]);

  // Auth & Roles
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (safeStorage.getItem('ftwk_role') as UserRole) || 'admin';
  });
  const [activeClubName, setActiveClubName] = useState<string>(() => {
    return safeStorage.getItem('ftwk_active_club') || 'نادي الأمل الرياضي بتونس';
  });
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return safeStorage.getItem('ftwk_admin_pass') || safeStorage.getItem('belt_admin_pass') || '5678';
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>('athletes');

  // Core Data States with backward compatibility for user's previous data
  const [records, setRecords] = useState<AthleteRecord[]>(() => {
    try {
      const stored = safeStorage.getItem('ftwk_records') || safeStorage.getItem('belt_records');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse records, falling back to default:', e);
    }
    return DEFAULT_ATHLETES;
  });

  const [fields, setFields] = useState<CustomField[]>(() => {
    try {
      const stored = safeStorage.getItem('ftwk_fields') || safeStorage.getItem('belt_fields');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse fields:', e);
    }
    return DEFAULT_FIELDS;
  });

  const [beltHierarchy, setBeltHierarchy] = useState<string[]>(() => {
    try {
      const stored = safeStorage.getItem('ftwk_belts') || safeStorage.getItem('belt_hierarchy');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse beltHierarchy:', e);
    }
    return DEFAULT_BELT_HIERARCHY;
  });

  const [clubs, setClubs] = useState<ClubAccount[]>(() => {
    try {
      const stored = safeStorage.getItem('ftwk_clubs') || safeStorage.getItem('belt_user_accounts');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((c: any, i: number) => ({
            id: c.id || `club_${i + 1}`,
            club: c.club || '',
            pass: c.pass || '',
            region: c.region || 'تونس',
            managerName: c.managerName || 'الممثل القانوني',
            phone: c.phone || ''
          }));
        }
      }
    } catch (e) {
      console.warn('Failed to parse clubs:', e);
    }
    return DEFAULT_CLUBS;
  });

  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    try {
      const stored = safeStorage.getItem('ftwk_submissions') || safeStorage.getItem('belt_submissions');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse submissions:', e);
    }
    return DEFAULT_SUBMISSIONS;
  });

  // Save to safeStorage
  useEffect(() => {
    safeStorage.setItem('ftwk_records', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    safeStorage.setItem('ftwk_fields', JSON.stringify(fields));
  }, [fields]);

  useEffect(() => {
    safeStorage.setItem('ftwk_belts', JSON.stringify(beltHierarchy));
  }, [beltHierarchy]);

  useEffect(() => {
    safeStorage.setItem('ftwk_clubs', JSON.stringify(clubs));
  }, [clubs]);

  useEffect(() => {
    safeStorage.setItem('ftwk_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    if (currentRole) {
      safeStorage.setItem('ftwk_role', currentRole);
    }
    if (activeClubName) {
      safeStorage.setItem('ftwk_active_club', activeClubName);
    }
  }, [currentRole, activeClubName]);

  // Modals Visibility
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState<AthleteRecord | null>(null);
  const [passportAthlete, setPassportAthlete] = useState<AthleteRecord | null>(null);
  const [isPrintRosterOpen, setIsPrintRosterOpen] = useState(false);

  // In-app confirm dialog (iframe-safe, z-[100])
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // User notification toasts
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Upsert athlete record
  const handleSaveAthlete = (athlete: AthleteRecord) => {
    const licField = fields.find(f => f.id === 'licenseNo' || cleanStr(f.label).includes('اجازه'))?.id || 'licenseNo';
    const cleanLic = cleanStr(athlete[licField]);

    setRecords(prev => {
      const existingIdx = prev.findIndex(
        r => r.id === athlete.id || (cleanLic && cleanStr(r[licField]) === cleanLic)
      );

      if (existingIdx !== -1) {
        const copy = [...prev];
        copy[existingIdx] = { ...copy[existingIdx], ...athlete };
        return copy;
      } else {
        return [athlete, ...prev];
      }
    });

    showToast('تم حفظ وتحديث بيانات الرياضي بنجاح!');
  };

  const handleDeleteAthlete = (id: string) => {
    const ath = records.find(r => r.id === id);
    const name = ath ? `${ath.firstName} ${ath.lastName}` : 'الرياضي';

    setConfirmDialog({
      isOpen: true,
      title: 'حذف السجل',
      message: `هل أنت متأكد من حذف ${name} من سجل الأحزمة؟`,
      confirmLabel: 'نعم، حذف',
      isDestructive: true,
      onConfirm: () => {
        setRecords(prev => prev.filter(r => r.id !== id));
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        showToast('تم حذف الرياضي من السجل.');
      },
      onCancel: () => setConfirmDialog(prev => ({ ...prev, isOpen: false }))
    });
  };

  // Handle Submissions Actions
  const handleApproveSubmissionItem = (subId: string | number, item: SubmissionItem) => {
    const licField = fields.find(f => f.id === 'licenseNo' || cleanStr(f.label).includes('اجازه'))?.id || 'licenseNo';
    const cleanLic = cleanStr(item.data[licField]);

    const newRecord: AthleteRecord = {
      id: `ath_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      firstName: item.data.firstName || '',
      lastName: item.data.lastName || '',
      licenseNo: item.data.licenseNo || '',
      club: item.data.club || '',
      region: item.data.region || 'تونس',
      degree: item.data.degree || 'أصفر 1',
      degreeDate: item.data.degreeDate || new Date().toISOString().split('T')[0],
      certNo: item.data.certNo || `CERT-TN-${Math.floor(8000 + Math.random() * 2000)}`,
      ...item.data
    };

    setRecords(prev => {
      const existingIdx = prev.findIndex(
        r => cleanLic && cleanStr(r[licField]) === cleanLic
      );

      if (existingIdx !== -1) {
        const copy = [...prev];
        newRecord.id = copy[existingIdx].id;
        copy[existingIdx] = { ...copy[existingIdx], ...newRecord };
        return copy;
      } else {
        return [newRecord, ...prev];
      }
    });

    setSubmissions(prev => {
      return prev
        .map(sub => {
          if (sub.id !== subId) return sub;
          return {
            ...sub,
            items: sub.items.filter(i => i.itemId !== item.itemId)
          };
        })
        .filter(sub => sub.items.length > 0);
    });

    showToast(`تم اعتماد ترقية الرياضي ${newRecord.firstName} ${newRecord.lastName} بنجاح.`);
  };

  const handleRejectSubmissionItem = (subId: string | number, itemId: string) => {
    setSubmissions(prev => {
      return prev
        .map(sub => {
          if (sub.id !== subId) return sub;
          return {
            ...sub,
            items: sub.items.filter(i => i.itemId !== itemId)
          };
        })
        .filter(sub => sub.items.length > 0);
    });
    showToast('تم رفض هذا البند من الطلب.');
  };

  const handleRejectEntireSubmission = (subId: string | number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'حذف الطلب كاملاً',
      message: 'هل أنت متأكد من حذف هذا الطلب الوارد بالكامل مع جميع مرفقاته؟',
      confirmLabel: 'نعم، حذف الطلب',
      isDestructive: true,
      onConfirm: () => {
        setSubmissions(prev => prev.filter(s => s.id !== subId));
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        showToast('تم حذف الطلب.');
      },
      onCancel: () => setConfirmDialog(prev => ({ ...prev, isOpen: false }))
    });
  };

  // Club portal new batch submit
  const handleClubSubmitBatch = (newSub: Submission) => {
    setSubmissions(prev => [newSub, ...prev]);
    showToast('تم إرسال طلب الترقية بنجاح إلى الإدارة الفنية بالجامعة.');
  };

  // Excel handlers
  const handleExportExcel = () => {
    exportAthletesToExcel(records, fields);
    showToast('تم تصدير ملف Excel بنجاح.');
  };

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const buffer = evt.target?.result as ArrayBuffer;
      const result = parseExcelFile(buffer, fields, records);

      if (result.error) {
        showToast(result.error, 'error');
      } else {
        setRecords(result.records);
        showToast(
          `تم الاستيراد بنجاح! إضافة ${result.insertedCount} سجل جديد وتحديث ${result.updatedCount} سجل مطابق.`
        );
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors selection:bg-red-500 selection:text-white">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-6 z-[90] animate-bounce">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold text-white border ${
              toast.type === 'error'
                ? 'bg-red-600 border-red-700'
                : 'bg-emerald-600 border-emerald-700'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Bar Navigation */}
      <Navbar
        currentRole={currentRole}
        activeClubName={activeClubName}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingSubmissionsCount={submissions.length}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onLogout={() => {
          setIsAuthModalOpen(true);
        }}
        onOpenSwitchRole={() => {
          setIsAuthModalOpen(true);
        }}
      />

      {/* Main View Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        
        {currentRole === 'admin' ? (
          <div className="space-y-6">
            
            {/* Header & Quick Actions Toolbar */}
            <HeaderBanner
              records={records}
              clubs={clubs}
              submissions={submissions}
              onOpenAddModal={() => {
                setRecordToEdit(null);
                setIsAddEditModalOpen(true);
              }}
              onOpenBeltManager={() => setActiveTab('belts')}
              onOpenCustomFields={() => setActiveTab('fields')}
              onOpenUsersManager={() => setActiveTab('clubs')}
              onOpenSubmissions={() => setActiveTab('submissions')}
              onExportExcel={handleExportExcel}
              onImportExcel={handleImportExcel}
              onPrintTable={() => setIsPrintRosterOpen(true)}
            />

            {/* Dynamic View based on Active Tab */}
            {activeTab === 'athletes' && (
              <AthletesTable
                records={records}
                fields={fields}
                clubs={clubs}
                beltHierarchy={beltHierarchy}
                onEditRecord={(rec) => {
                  setRecordToEdit(rec);
                  setIsAddEditModalOpen(true);
                }}
                onDeleteRecord={handleDeleteAthlete}
                onViewPassport={(rec) => {
                  setPassportAthlete(rec);
                }}
                onOpenAddModal={() => {
                  setRecordToEdit(null);
                  setIsAddEditModalOpen(true);
                }}
              />
            )}

            {activeTab === 'submissions' && (
              <SubmissionsSection
                submissions={submissions}
                records={records}
                onApproveItem={handleApproveSubmissionItem}
                onRejectItem={handleRejectSubmissionItem}
                onRejectEntireSubmission={handleRejectEntireSubmission}
                fields={fields}
                beltHierarchy={beltHierarchy}
                onBackToAthletes={() => setActiveTab('athletes')}
              />
            )}

            {activeTab === 'belts' && (
              <BeltManagerSection
                beltHierarchy={beltHierarchy}
                setBeltHierarchy={setBeltHierarchy}
                onBackToAthletes={() => setActiveTab('athletes')}
              />
            )}

            {activeTab === 'clubs' && (
              <UsersManagerSection
                clubAccounts={clubs}
                setClubAccounts={setClubs}
                onBackToAthletes={() => setActiveTab('athletes')}
              />
            )}

            {activeTab === 'fields' && (
              <CustomFieldsSection
                fields={fields}
                setFields={setFields}
                onBackToAthletes={() => setActiveTab('athletes')}
              />
            )}

          </div>
        ) : (
          /* Club Portal View */
          <ClubPortal
            clubName={activeClubName}
            records={records}
            fields={fields}
            beltHierarchy={beltHierarchy}
            submissions={submissions}
            onSubmitNewBatch={handleClubSubmitBatch}
            onViewPassport={(rec) => {
              setPassportAthlete(rec);
            }}
          />
        )}

      </main>

      {/* Official Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400 no-print">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-bold text-slate-700 dark:text-slate-300">
            الجمهورية التونسية · وزارة الشباب والرياضة · الجامعة التونسية للووشو كونغ فو والرياضات التابعة
          </p>
          <p className="text-[11px] text-slate-400">
            Fédération Tunisienne de Wushu Kung Fu (FTWK) · المنظومة الوطنية لإدارة الأحزمة والرتب الرياضية
          </p>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        adminPassword={adminPassword}
        clubAccounts={clubs}
        onSelectRole={(role, clubName) => {
          setCurrentRole(role);
          if (clubName) setActiveClubName(clubName);
          showToast(
            role === 'admin'
              ? 'تم تسجيل الدخول كمتصرف عام للجامعة'
              : `تم تسجيل الدخول باسم: ${clubName}`
          );
        }}
      />

      <AddEditAthleteModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setRecordToEdit(null);
        }}
        onSave={handleSaveAthlete}
        recordToEdit={recordToEdit}
        fields={fields}
        beltHierarchy={beltHierarchy}
        clubs={clubs}
      />

      <PrintRosterModal
        isOpen={isPrintRosterOpen}
        onClose={() => setIsPrintRosterOpen(false)}
        records={records}
        fields={fields}
        onExportExcel={handleExportExcel}
      />

      <AthletePassportModal
        athlete={passportAthlete}
        isOpen={!!passportAthlete}
        onClose={() => setPassportAthlete(null)}
      />

      {/* In-App Confirm Dialog (Always on top with z-[100]) */}
      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel={confirmDialog.confirmLabel}
        cancelLabel={confirmDialog.cancelLabel}
        isDestructive={confirmDialog.isDestructive}
        onConfirm={confirmDialog.onConfirm}
        onCancel={confirmDialog.onCancel}
      />

    </div>
  );
}
