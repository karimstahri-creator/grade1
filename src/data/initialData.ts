import { AthleteRecord, ClubAccount, CustomField, Submission } from '../types';

export const DEFAULT_BELT_HIERARCHY: string[] = [
  "أصفر 1",
  "أصفر 2",
  "أصفر 3",
  "أخضر 1",
  "أخضر 2",
  "أخضر 3",
  "أزرق 1",
  "أزرق 2",
  "أزرق 3",
  "أحمر 1",
  "أحمر 2",
  "أحمر 3",
  "أسود 1 (دان 1)",
  "أسود 2 (دان 2)",
  "أسود 3 (دان 3)",
  "أسود 4 (دان 4)",
  "أسود 5 (دان 5)",
  "أسود 6 (دان 6)"
];

export const DEFAULT_FIELDS: CustomField[] = [
  { id: 'firstName', label: 'الاسم', type: 'text' },
  { id: 'lastName', label: 'اللقب', type: 'text' },
  { id: 'licenseNo', label: 'رقم الإجازة', type: 'text' },
  { id: 'club', label: 'الجمعية', type: 'text' },
  { id: 'region', label: 'الجهة', type: 'text' },
  { id: 'degree', label: 'الدرجة الفنية (الحزام)', type: 'text' },
  { id: 'degreeDate', label: 'تاريخ الحصول عليها', type: 'date' },
  { id: 'certNo', label: 'رقم الشهادة', type: 'text' }
];

export const DEFAULT_CLUBS: ClubAccount[] = [
  {
    id: 'club_1',
    club: 'نادي الأمل الرياضي بتونس',
    pass: '1111',
    region: 'تونس',
    managerName: 'الكابتن سفيان الغربي',
    phone: '71 234 567'
  },
  {
    id: 'club_2',
    club: 'جمعية النهضة الرياضية بصفاقس',
    pass: '2222',
    region: 'صفاقس',
    managerName: 'الأستاذ منير بن سالم',
    phone: '74 890 123'
  },
  {
    id: 'club_3',
    club: 'نادي النجم الساحلي للكونغ فو بسوسة',
    pass: '3333',
    region: 'سوسة',
    managerName: 'المدرب كمال الطرابلسي',
    phone: '73 456 789'
  },
  {
    id: 'club_4',
    club: 'جمعية الصقور للرياضات الدفاعية بأريانة',
    pass: '4444',
    region: 'أريانة',
    managerName: 'المدرب هيثم العبيدي',
    phone: '71 789 012'
  }
];

export const DEFAULT_ATHLETES: AthleteRecord[] = [
  {
    id: 'ath_101',
    firstName: 'يوسف',
    lastName: 'البوعزيزي',
    licenseNo: 'FTWK-2024-001',
    club: 'نادي الأمل الرياضي بتونس',
    region: 'تونس',
    degree: 'أزرق 2',
    degreeDate: '2024-05-18',
    certNo: 'CERT-TN-8821'
  },
  {
    id: 'ath_102',
    firstName: 'مريم',
    lastName: 'التليلي',
    licenseNo: 'FTWK-2024-002',
    club: 'نادي الأمل الرياضي بتونس',
    region: 'تونس',
    degree: 'أخضر 3',
    degreeDate: '2024-06-22',
    certNo: 'CERT-TN-8854'
  },
  {
    id: 'ath_103',
    firstName: 'محمد أمين',
    lastName: 'الدريدي',
    licenseNo: 'FTWK-2023-045',
    club: 'جمعية النهضة الرياضية بصفاقس',
    region: 'صفاقس',
    degree: 'أسود 1 (دان 1)',
    degreeDate: '2023-11-10',
    certNo: 'CERT-TN-7712'
  },
  {
    id: 'ath_104',
    firstName: 'سارة',
    lastName: 'الماجري',
    licenseNo: 'FTWK-2024-118',
    club: 'جمعية النهضة الرياضية بصفاقس',
    region: 'صفاقس',
    degree: 'أصفر 3',
    degreeDate: '2024-03-15',
    certNo: 'CERT-TN-8540'
  },
  {
    id: 'ath_105',
    firstName: 'فارس',
    lastName: 'الشواشي',
    licenseNo: 'FTWK-2023-089',
    club: 'نادي النجم الساحلي للكونغ فو بسوسة',
    region: 'سوسة',
    degree: 'أحمر 2',
    degreeDate: '2023-12-04',
    certNo: 'CERT-TN-8002'
  },
  {
    id: 'ath_106',
    firstName: 'زينب',
    lastName: 'القروي',
    licenseNo: 'FTWK-2024-204',
    club: 'جمعية الصقور للرياضات الدفاعية بأريانة',
    region: 'أريانة',
    degree: 'أصفر 2',
    degreeDate: '2024-08-11',
    certNo: 'CERT-TN-9104'
  },
  {
    id: 'ath_107',
    firstName: 'أنيس',
    lastName: 'المنصوري',
    licenseNo: 'FTWK-2022-019',
    club: 'نادي النجم الساحلي للكونغ فو بسوسة',
    region: 'سوسة',
    degree: 'أسود 2 (دان 2)',
    degreeDate: '2024-02-14',
    certNo: 'CERT-TN-8419'
  }
];

export const DEFAULT_SUBMISSIONS: Submission[] = [
  {
    id: 17180001,
    sender: 'نادي الأمل الرياضي بتونس',
    date: '2026-10-12',
    notes: 'قائمة الناجحين في دورة الترقية الخريفية تحت إشراف اللجنة الفنية الوطنية',
    file: {
      name: 'محضر_جلسة_امتحان_الأحزمة_الأمل.pdf',
      size: '245.8 KB',
      type: 'application/pdf',
      data: ''
    },
    items: [
      {
        itemId: 'sub_item_1',
        data: {
          firstName: 'يوسف',
          lastName: 'البوعزيزي',
          licenseNo: 'FTWK-2024-001',
          club: 'نادي الأمل الرياضي بتونس',
          region: 'تونس',
          degree: 'أزرق 3', // Proper sequence from أزرق 2
          degreeDate: '2026-10-10',
          certNo: 'CERT-TN-9901'
        }
      },
      {
        itemId: 'sub_item_2',
        data: {
          firstName: 'حمزة',
          lastName: 'العرفاوي',
          licenseNo: 'FTWK-2026-302',
          club: 'نادي الأمل الرياضي بتونس',
          region: 'تونس',
          degree: 'أصفر 1', // New athlete starting at first belt
          degreeDate: '2026-10-10',
          certNo: 'CERT-TN-9902'
        }
      },
      {
        itemId: 'sub_item_3',
        data: {
          firstName: 'مريم',
          lastName: 'التليلي',
          licenseNo: 'FTWK-2024-002',
          club: 'نادي الأمل الرياضي بتونس',
          region: 'تونس',
          degree: 'أحمر 1', // Anomaly: jumps from أخضر 3 to أحمر 1 (skipping أزرق!)
          degreeDate: '2026-10-10',
          certNo: 'CERT-TN-9903'
        }
      }
    ]
  }
];
