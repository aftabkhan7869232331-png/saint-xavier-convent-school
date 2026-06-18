// Multilingual Localization Strings for Saint Xavier Convent School Portal (English / Hindi / Urdu)

export type LangType = 'en' | 'hi' | 'ur';

export const DICTIONARY: Record<string, Record<LangType, string>> = {
  // Navigation / Headers
  studentPortals: {
    en: 'Student Portals',
    hi: 'छात्र पोर्टल',
    ur: 'اسٹوڈنٹ پورٹلز'
  },
  adminDesk: {
    en: 'Admin Desk',
    hi: 'एडमिन डेस्क',
    ur: 'ایڈمن ڈیسک'
  },
  administrativeLogin: {
    en: 'ADMINISTRATOR SECURE LOGIN',
    hi: 'प्रशासक सुरक्षित लॉगिन',
    ur: 'ایڈمنسٹریٹر لاگ ان'
  },
  secureTerminal: {
    en: 'SECURE TERMINAL',
    hi: 'सुरक्षित टर्मिनल',
    ur: 'سیکیور ٹرمینل'
  },
  schoolHome: {
    en: 'School Home',
    hi: 'स्कूल होम पेज',
    ur: 'اسکول ہوم'
  },
  parentsLogin: {
    en: 'Parents Login',
    hi: 'अभिभावक लॉगिन',
    ur: 'والدین لاگ ان'
  },
  teacherLogin: {
    en: 'Teacher Login',
    hi: 'शिक्षक लॉगिन',
    ur: 'ٹیچر لاگ ان'
  },
  studentLogin: {
    en: 'Student Login',
    hi: 'विद्यार्थी लॉगिन',
    ur: 'طالب علم لاگ ان'
  },
  homework: {
    en: 'Home-work',
    hi: 'गृहकार्य (होमवर्क)',
    ur: 'ہوم ورک'
  },
  liveClass: {
    en: 'Live-Class',
    hi: 'लाइव क्लास',
    ur: 'لائیو کلاس'
  },
  classroomCameras: {
    en: 'AI Classroom Cameras',
    hi: 'एआई क्लासरूम कैमरे',
    ur: 'کلاس روم کیمرے'
  },
  todayPresent: {
    en: 'Today Present Student',
    hi: 'आज उपस्थित छात्र',
    ur: 'آج حاضر طلباء'
  },
  absentStudent: {
    en: 'Absent Student',
    hi: 'अनुपस्थित छात्र',
    ur: 'غیر حاضر طلبہ'
  },
  newScholarship: {
    en: 'New Scholarship',
    hi: 'नई छात्रवृत्ति',
    ur: 'نئی اسکالرشپ'
  },
  guildlinesTitle: {
    en: 'Document Portal Operational Guide',
    hi: 'दस्तावेज़ पोर्टल परिचालन मार्गदर्शिका',
    ur: 'بریفنگ گائیڈ'
  },

  // Admin Dashboard
  masterDashboard: {
    en: 'Master Admin Dashboard',
    hi: 'मुख्य एडमिन डैशबोर्ड',
    ur: 'ماسٹر ایڈمن ڈیش بورڈ'
  },
  selectModule: {
    en: 'Select a restricted module below to manage school operations.',
    hi: 'स्कूल संचालन का प्रबंधन करने के लिए नीचे दिए गए मॉड्यूल का चयन करें।',
    ur: 'اسکول کے انتظامات سنبھالنے کے لیے نیچے دیے گئے ماڈیول کا انتخاب کریں۔'
  },
  marksheetBuilder: {
    en: 'Marksheet Builder',
    hi: 'अंकसूची निर्माता (मार्कशीट)',
    ur: 'مارک شیٹ بلڈر'
  },
  tcEngine: {
    en: 'TC Engine',
    hi: 'स्थानांतरण प्रमाणपत्र (टी.सी.) इंजन',
    ur: 'ٹی سی انجن'
  },
  admissionCrm: {
    en: 'Admission CRM',
    hi: 'प्रवेश प्रबंधन (एडमिशन crm)',
    ur: 'داخلہ سی آر ایم'
  },
  scholarLedger: {
    en: 'Scholar Ledger',
    hi: 'छात्र बहीखाता (स्कॉलर लेजर)',
    ur: 'اسکالر لیجر'
  },
  cloudErp: {
    en: 'Cloud ERP & LMS',
    hi: 'क्लाउड ईआरपी एवं एलएमएस',
    ur: 'کلاؤڈ ای آر پی'
  },
  aiCameras: {
    en: 'AI Camera System',
    hi: 'एआई सीसीटीवी कैमरा प्रणाली',
    ur: 'کیمرہ سسٹم'
  },
  terminateSession: {
    en: 'Terminate Session',
    hi: 'सत्र समाप्त करें (लॉगआउट)',
    ur: 'لاگ آؤٹ'
  },

  // Scholar Tab / Filtering
  nurseryTo8th: {
    en: 'Nursery to 8th (Primary / Middle)',
    hi: 'नर्सरी से आठवीं (प्राथमिक / माध्यमिक)',
    ur: 'نرسری سے آٹھویں (پرائمری)'
  },
  '9thTo12th': {
    en: '9th to 12th (High Secondary)',
    hi: 'नौवीं से बारहवीं (उच्चतर माध्यमिक)',
    ur: 'नोवीं से बारहवीं (सकेंडरी)'
  },
  allClasses: {
    en: 'All Classes Roster',
    hi: 'सभी कक्षाएं बहीखाता',
    ur: 'تمام کلاسز'
  },
  addScholar: {
    en: 'Add Scholar',
    hi: 'नया स्कॉलर जोड़ें',
    ur: 'اسکالر شامل کریں'
  },
  schoolFeeStatus: {
    en: '₹ SCHOOL FEE STATUS',
    hi: '₹ स्कूल शुल्क का विवरण',
    ur: '₹ اسکول فیس کی تفصیلات'
  },
  payOutstandingDues: {
    en: 'Pay Outstanding Dues',
    hi: 'बकाया राशि का भुगतान करें',
    ur: 'بقایا فیس ادا کریں'
  },
  outstandingDueBalance: {
    en: 'outstanding due balance',
    hi: 'कुल बकाया शेष राशि',
    ur: 'کل واجب الادا رقم'
  },
  allSettled: {
    en: 'All fee dues are settled. Thank you!',
    hi: 'सभी शुल्क का भुगतान हो चुका है। धन्यवाद!',
    ur: 'فیس مکمل طور پر جمع ہو چکی ہے۔ شکریہ!'
  },
  viewLedgerAccount: {
    en: 'View Ledger Account',
    hi: 'बहीखाता खाता देखें',
    ur: 'لیجر بک دیکھیں'
  },
  ledgerSynced: {
    en: 'Paid Ledger Synced',
    hi: 'भुगतान बहीखाता समन्वित',
    ur: 'ادائیگی کی تفصیلات مطابقت پذیر'
  },

  // Voice command suggestions
  voiceCommandSuggestions: {
    en: 'Try speaking: "go to admin", "go to portals", "pay outstanding", "set hindi", "filter nursery"',
    hi: 'बोल कर देखें: "go to admin", "go to portals", "pay outstanding", "set hindi", "filter nursery"',
    ur: 'بولیں: "go to admin", "go to portals", "pay outstanding", "set urdu", "filter secondary"'
  }
};

export function getTranslation(key: string, lang: LangType): string {
  if (DICTIONARY[key] && DICTIONARY[key][lang]) {
    return DICTIONARY[key][lang];
  }
  return key; // Fallback to raw key
}
