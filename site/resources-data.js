/* Sourced monthly observations; no live feed. */
'use strict';
const HGWResourceData={
  "checked_on": "2026-10-29",
  "published_on": "2026-10-02",
  "observation_period": "2026-09",
  "source_name": "World Bank Pink Sheet — October 2026",
  "source_url": "https://thedocs.worldbank.org/en/doc/74e8be41ceb20fa0da750cda2f6b9e4e-0050012026/related/CMO-Pink-Sheet-October-2026.pdf",
  "categories": [
    {
      "id": "metals",
      "ar": "المعادن الأساسية والسبائك",
      "en": "Base metals & alloys",
      "examples": [
        "الحديد والصلب",
        "النحاس",
        "الألومنيوم",
        "النيكل",
        "الزنك",
        "الرصاص",
        "القصدير",
        "المغنيسيوم",
        "التيتانيوم"
      ]
    },
    {
      "id": "precious",
      "ar": "المعادن الثمينة",
      "en": "Precious metals",
      "examples": [
        "الذهب",
        "الفضة",
        "البلاتين",
        "البلاديوم"
      ]
    },
    {
      "id": "critical",
      "ar": "معادن البطاريات والعناصر الحرجة",
      "en": "Battery & critical minerals",
      "examples": [
        "الليثيوم",
        "الكوبالت",
        "الجرافيت",
        "المنغنيز",
        "العناصر الأرضية النادرة",
        "التنتالوم",
        "التنغستن"
      ]
    },
    {
      "id": "minerals",
      "ar": "الخامات والمعادن الصناعية",
      "en": "Ores & industrial minerals",
      "examples": [
        "خام الحديد",
        "الفوسفات",
        "البوتاس",
        "البوكسيت",
        "السيليكا",
        "الملح",
        "الكبريت",
        "الكربونات"
      ]
    },
    {
      "id": "energy",
      "ar": "الطاقة والوقود",
      "en": "Energy & fuels",
      "examples": [
        "النفط الخام",
        "الغاز الطبيعي",
        "الغاز المسال",
        "الفحم",
        "الهيدروجين",
        "الوقود الحيوي",
        "الكهرباء المتعاقد عليها"
      ]
    },
    {
      "id": "agri",
      "ar": "الحبوب والمحاصيل والمواد الغذائية",
      "en": "Crops & food inputs",
      "examples": [
        "القمح",
        "الذرة",
        "الأرز",
        "الشعير",
        "البقول",
        "البذور",
        "السكر",
        "البن",
        "الكاكاو",
        "الشاي"
      ]
    },
    {
      "id": "oils",
      "ar": "الزيوت والأعلاف",
      "en": "Oils & feedstocks",
      "examples": [
        "زيت النخيل",
        "زيت الصويا",
        "زيت جوز الهند",
        "الأعلاف",
        "كسب الصويا",
        "مسحوق السمك"
      ]
    },
    {
      "id": "fertilizers",
      "ar": "الأسمدة والمدخلات الزراعية",
      "en": "Fertilizers & agricultural inputs",
      "examples": [
        "اليوريا",
        "DAP",
        "TSP",
        "كلوريد البوتاسيوم",
        "الفوسفات الصخري"
      ]
    },
    {
      "id": "bio",
      "ar": "الأخشاب والألياف والكتلة الحيوية",
      "en": "Timber, fibers & biomass",
      "examples": [
        "الأخشاب",
        "اللب والورق",
        "القطن",
        "الصوف",
        "الكتان",
        "المطاط الطبيعي",
        "الكتلة الحيوية"
      ]
    },
    {
      "id": "polymers",
      "ar": "البوليمرات والبلاستيك والمطاط",
      "en": "Polymers, plastics & rubber",
      "examples": [
        "PET",
        "HDPE",
        "LDPE",
        "PP",
        "PVC",
        "المطاط الصناعي",
        "الراتنجات"
      ]
    },
    {
      "id": "chemicals",
      "ar": "الكيماويات والغازات الصناعية",
      "en": "Chemicals & industrial gases",
      "examples": [
        "المذيبات",
        "الأحماض والقواعد الصناعية",
        "الغازات الصناعية",
        "الدهانات",
        "المحفزات",
        "المواد اللاصقة"
      ]
    },
    {
      "id": "construction",
      "ar": "البناء والزجاج والسيراميك",
      "en": "Construction, glass & ceramics",
      "examples": [
        "الإسمنت",
        "الرمل",
        "الحصى",
        "الحجر",
        "الجبس",
        "الزجاج",
        "السيراميك"
      ]
    },
    {
      "id": "recycled",
      "ar": "الخامات الثانوية والخردة",
      "en": "Secondary materials & scrap",
      "examples": [
        "خردة المعادن",
        "حبيبات بلاستيك معاد تدويره",
        "ورق مسترجع",
        "زجاج مكسر",
        "ركام معاد تدويره",
        "مواد بطاريات مستردة"
      ]
    },
    {
      "id": "water",
      "ar": "المياه والموارد البيئية",
      "en": "Water & environmental resources",
      "examples": [
        "المياه الصناعية",
        "المياه المعالجة",
        "الحرارة المستردة",
        "موارد مرخصة محليًا"
      ]
    },
    {
      "id": "advanced",
      "ar": "المواد المتقدمة والتقنية",
      "en": "Advanced & technical materials",
      "examples": [
        "أشباه الموصلات",
        "مساحيق التصنيع الإضافي",
        "الألياف الكربونية",
        "المواد الحيوية",
        "المواد المركبة"
      ]
    }
  ],
  "prices": [
    {
      "id": "aluminum",
      "ar": "الألومنيوم",
      "en": "Aluminum",
      "category": "metals",
      "value": 3283,
      "unit": "USD/mt",
      "basis": "LME primary high grade"
    },
    {
      "id": "copper",
      "ar": "النحاس",
      "en": "Copper",
      "category": "metals",
      "value": 14474,
      "unit": "USD/mt",
      "basis": "LME grade A"
    },
    {
      "id": "iron",
      "ar": "خام الحديد",
      "en": "Iron ore",
      "category": "minerals",
      "value": 97.7,
      "unit": "USD/dmt",
      "basis": "62% Fe, CFR China"
    },
    {
      "id": "nickel",
      "ar": "النيكل",
      "en": "Nickel",
      "category": "metals",
      "value": 16324,
      "unit": "USD/mt",
      "basis": "LME high grade"
    },
    {
      "id": "zinc",
      "ar": "الزنك",
      "en": "Zinc",
      "category": "metals",
      "value": 4021,
      "unit": "USD/mt",
      "basis": "LME special high grade"
    },
    {
      "id": "gold",
      "ar": "الذهب",
      "en": "Gold",
      "category": "precious",
      "value": 4319,
      "unit": "USD/toz",
      "basis": "Spot monthly average"
    },
    {
      "id": "silver",
      "ar": "الفضة",
      "en": "Silver",
      "category": "precious",
      "value": 64.6,
      "unit": "USD/toz",
      "basis": "99.9%, London fixing"
    },
    {
      "id": "brent",
      "ar": "خام برنت",
      "en": "Brent crude",
      "category": "energy",
      "value": 116.8,
      "unit": "USD/bbl",
      "basis": "Brent 38 API"
    },
    {
      "id": "gas",
      "ar": "غاز طبيعي أوروبي",
      "en": "European natural gas",
      "category": "energy",
      "value": 25.42,
      "unit": "USD/MMBtu",
      "basis": "Netherlands TTF"
    },
    {
      "id": "wheat",
      "ar": "قمح أمريكي HRW",
      "en": "US HRW wheat",
      "category": "agri",
      "value": 347,
      "unit": "USD/mt",
      "basis": "US HRW Gulf export"
    },
    {
      "id": "maize",
      "ar": "ذرة",
      "en": "Maize",
      "category": "agri",
      "value": 239.6,
      "unit": "USD/mt",
      "basis": "US yellow no. 2, FOB Gulf"
    },
    {
      "id": "rice",
      "ar": "أرز تايلاندي ٥٪ كسر",
      "en": "Thai rice 5% broken",
      "category": "agri",
      "value": 482,
      "unit": "USD/mt",
      "basis": "White rice, FOB Bangkok"
    },
    {
      "id": "palm",
      "ar": "زيت النخيل",
      "en": "Palm oil",
      "category": "oils",
      "value": 1180,
      "unit": "USD/mt",
      "basis": "Malaysia crude/RBD series"
    },
    {
      "id": "urea",
      "ar": "اليوريا",
      "en": "Urea",
      "category": "fertilizers",
      "value": 407.5,
      "unit": "USD/mt",
      "basis": "Prill, FOB Middle East"
    },
    {
      "id": "dap",
      "ar": "فوسفات ثنائي الأمونيوم",
      "en": "DAP",
      "category": "fertilizers",
      "value": 800.6,
      "unit": "USD/mt",
      "basis": "FOB US Gulf"
    },
    {
      "id": "cotton",
      "ar": "القطن",
      "en": "Cotton",
      "category": "bio",
      "value": 2.1,
      "unit": "USD/kg",
      "basis": "Cotlook A, C/F Far East"
    },
    {
      "id": "rubber",
      "ar": "مطاط RSS3",
      "en": "RSS3 rubber",
      "category": "bio",
      "value": 2.75,
      "unit": "USD/kg",
      "basis": "SICOM nearby contract"
    }
  ]
};
if(typeof module!=='undefined')module.exports=HGWResourceData;
