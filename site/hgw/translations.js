const ui = {
  ar: {
    solidarityTitle: "التضامن الإنساني",
    solidarity1: "حين نتقاسم الأعباء، يصبح تجاوز الأزمات ممكنًا لمن لا يستطيع مواجهتها وحده.",
    solidarity2: "ما نتشاركه من معرفة اليوم يفتح لغيرنا فرصًا غدًا.",
    solidarity3: "تظهر قيمة التضامن حين تصل المساندة إلى من يحتاجها في الوقت المناسب.",
    brand: 'المنصة الموحدة', originals: 'المواقع الأصلية', heading: 'معا متحدين اقوي و غير قابلين للايقاف',
    intro: 'ابحث عن المشروع أو الأداة، أو تصفّح القطاعات.', search: 'البحث في الفهرس',
    placeholder: 'مثال: المحافظ، الأسواق، الطاقة', sectors: 'قطاعات المنصة',
    sourceHeading: 'المواقع الأصلية ومصادر الأقسام', all: 'الكل', pages: 'صفحات القسم',
    count: 'عدد الأقسام المطابقة', empty: 'لا توجد نتائج مطابقة.', language: 'اللغة',
    back: 'فهرس HGW', arabicContent: 'محتوى هذه الصفحة بالعربية', directory: 'الفهرس والأدوات'
  },
  en: {
    solidarityTitle: "Human solidarity",
    solidarity1: "When we share the burden, people who cannot face a crisis alone can get through it.",
    solidarity2: "The knowledge we share today opens doors for others tomorrow.",
    solidarity3: "Solidarity matters when support reaches those who need it in time.",
    brand: 'Unified Platform', originals: 'Original sites', heading: 'United, stronger and unstoppable',
    intro: 'Find a project or tool, or browse by sector.', search: 'Search the directory',
    placeholder: 'Example: wallets, markets, energy', sectors: 'Platform sectors',
    sourceHeading: 'Original sites and section sources', all: 'All', pages: 'Section pages',
    count: 'Matching sectors', empty: 'No results found.', language: 'Language',
    back: 'HGW directory', arabicContent: 'This page is in Arabic', directory: 'Directory and tools'
  },
  sv: {
    solidarityTitle: "Mänsklig solidaritet",
    solidarity1: "När vi delar på bördan kan människor som inte klarar en kris på egen hand ta sig igenom den.",
    solidarity2: "Kunskapen vi delar i dag öppnar dörrar för andra i morgon.",
    solidarity3: "Solidaritet gör skillnad när stödet når dem som behöver det i tid.",
    brand: 'Gemensam plattform', originals: 'Ursprungliga webbplatser', heading: 'Enade, starkare och ostoppbara',
    intro: 'Sök efter ett projekt eller verktyg, eller välj ett område.', search: 'Sök i katalogen',
    placeholder: 'Exempel: plånböcker, marknader, energi', sectors: 'Plattformens områden',
    sourceHeading: 'Ursprungliga webbplatser och källor', all: 'Alla', pages: 'Sidor inom området',
    count: 'Matchande områden', empty: 'Inga resultat hittades.', language: 'Språk',
    back: 'HGW:s katalog', arabicContent: 'Den här sidan är på arabiska', directory: 'Katalog och verktyg'
  }
};

const sectorTranslations = {
  operations: ['Operations Center', 'Operationscentral', 'Track projects, energy, tasks, decisions and blockers in one dashboard.', 'Följ projekt, energi, uppgifter, beslut och hinder i en översikt.', 'energy projects tasks budget', 'energi projekt uppgifter budget'],
  web3: ['Wallets and Tokens', 'Plånböcker och token', 'Review smart contract specifications and access wallet providers from one section.', 'Granska specifikationer för smarta kontrakt och öppna plånbokstjänster från samma avsnitt.', 'wallets contracts tokens blockchain', 'plånböcker kontrakt token blockkedja'],
  market: ['Markets and Assets', 'Marknader och tillgångar', 'Browse used goods and import costs, the direct market, and listings for resources and assets.', 'Utforska begagnade varor och importkostnader, direktmarknaden och annonser för resurser och tillgångar.', 'cars excavators electronics customs shipping', 'bilar grävmaskiner elektronik tull frakt'],
  digital: ['Digital Platform', 'Digital plattform', 'Explore identity, sandbox payments, policies, quantum security and the abundance economy.', 'Utforska identitet, testbetalningar, policyer, kvantsäkerhet och överflödsekonomi.', 'identity payments security', 'identitet betalningar säkerhet'],
  funding: ['Funding and Partnerships', 'Finansiering och partnerskap', 'Browse funding opportunities, draft applications and partnership proposals.', 'Utforska finansieringsmöjligheter, ansökningsutkast och förslag till partnerskap.', 'grants green funding partners', 'bidrag grön finansiering partners'],
  knowledge: ['Knowledge and AI Assistant', 'Kunskap och AI-assistent', 'Access the assistant for writing, summarizing and classifying posts.', 'Öppna assistenten för att skriva, sammanfatta och klassificera inlägg.', 'AI assistant posts', 'AI assistent inlägg'],
  platform: ['HGW and Smart Mall', 'HGW och Smart Mall', 'Learn about the initiative and open the shopping platform.', 'Läs om initiativet och öppna handelsplattformen.', 'shopping membership orders initiative', 'handel medlemskap beställningar initiativ']
};

const toolTitles = {
  operations: [['Projects and tasks dashboard', 'Projekt- och uppgiftsöversikt']],
  web3: [
    ['Contract and Token Studio', 'Studio för kontrakt och token'],
    ['Thirdweb network inspection', 'Granska nätverk med Thirdweb'],
    ['Thirdweb deployment setup', 'Publiceringsinställningar i Thirdweb'],
    ['WalletConnect', 'WalletConnect'],
    ['Alchemy Wallet', 'Alchemy-plånbok'],
    ['Public wallet lookup', 'Sök efter offentliga plånboksadresser']
  ],
  market: [
    ['Used Goods Market and Import Calculator', 'Begagnatmarknad och importkalkyl'],
    ['Direct Market', 'Direktmarknad'],
    ['Resource and Asset Exchange', 'Marknadsplats för resurser och tillgångar']
  ],
  digital: [
    ['Digital Workbench', 'Digital verktygslåda'],
    ['Sandbox Checkout', 'Betalning i testmiljö'],
    ['Quantum Security', 'Kvantsäkerhet']
  ],
  funding: [['Funding Opportunities Dashboard', 'Översikt över finansieringsmöjligheter']],
  knowledge: [['Gemini Assistant', 'Gemini-assistent']],
  platform: [['About HGW', 'Om HGW'], ['Smart Mall', 'Smart Mall']]
};

const sourceTitles = {
  'hgw-project-control': ['HGW Operations Center', 'HGW:s operationscentral'],
  'hgw-digital-workbench': ['HGW Digital Workbench', 'HGW:s digitala verktygslåda'],
  'hgw-chain-studio': ['HGW Contract and Token Studio', 'HGW:s studio för kontrakt och token'],
  'hgw-global-resource-exchange': ['HGW Resource and Asset Exchange', 'HGW:s marknadsplats för resurser och tillgångar'],
  'hgw-token-operations': ['HGW Token Operations', 'HGW:s drift av token'],
  'hgw-token-control': ['HGW Web3 Management Center', 'HGW:s administrationscenter för Web3'],
  'hgw-reuse-market': ['HGW Used Goods Market', 'HGW:s begagnatmarknad'],
  'hgw-alchemy-wallet-sameh': ['HGW Alchemy Wallet', 'HGW:s Alchemy-plånbok'],
  'hgw-quantum-zero': ['HGW Quantum Security', 'HGW:s kvantsäkerhet']
};

const pageTitles = Object.fromEntries(`
abundance-plan|Abundance Economy and Value Banks|Överflödsekonomi och värdebanker
abundance|Abundance Economy|Överflödsekonomi
bank-bio|Biological Value Bank|Bank för biologiskt värde
bank-commitments|Commitments Bank|Åtagandebank
bank-currency|Currency Bank|Valutabank
bank-ethics|Ethics Bank|Etikbank
bank-knowledge|Knowledge Bank|Kunskapsbank
bank-mass|Mass Bank|Massabank
bank-memory|Memory Bank|Minnesbank
bank-resources|Resource Bank|Resursbank
bank-time|Time Bank|Tidsbank
circular|Circular Economy|Cirkulär ekonomi
cognitive-plan|Knowledge Infrastructure|Kunskapsinfrastruktur
cognitive-proposal|Universal Mind Project|Projektet Universellt medvetande
cognitive|Cognitive Systems|Kognitiva system
communications-plan|Communications, Data and Hybrid Networks|Kommunikation, data och hybridnät
communications-proposal|Hybrid and Quantum Communications Proposal|Förslag för hybrid- och kvantkommunikation
communications|Communications|Kommunikation
cyber|Cybersecurity|Cybersäkerhet
cybersecurity-plan|Information Security and Quantum Resilience Plan|Plan för informationssäkerhet och kvantresiliens
devices|Devices|Enheter
encyclopedia-plan|Project Encyclopedia and Integration Plan|Projektencyklopedi och integrationsplan
encyclopedia|Encyclopedia|Encyklopedi
governance|Governance|Styrning
group-apps|Applications|Applikationer
group-commerce|Commerce|Handel
group-economy|Economy|Ekonomi
group-future|Future Projects|Framtidsprojekt
group-governance|Governance Projects|Styrningsprojekt
group-human|Human Development|Mänsklig utveckling
group-knowledge|Knowledge Projects|Kunskapsprojekt
group-protection|Protection and Safety|Skydd och säkerhet
hgw-deploy|Sign Contract Deployment|Signera kontraktspublicering
hgw-disclosures|White Papers and Disclosures|Vitböcker och offentliggöranden
home|Home|Startsida
insurance|Insurance|Försäkring
integration-status|Systems Integration Status|Status för systemintegration
inventory|Inventory|Lager
logistics|Logistics|Logistik
mall|Global Platform|Global plattform
members|Members|Medlemmar
orders|Orders|Beställningar
project-carpet|Carpet Project|Mattprojekt
project-diversity|Diversity Project|Mångfaldsprojekt
project-education-fr|Education in France|Utbildning i Frankrike
project-education-se|Education in Sweden|Utbildning i Sverige
project-elevator|Elevator Project|Hissprojekt
project-global-popular|Global Popular Initiative|Globalt folkligt initiativ
project-leadership|Leadership Project|Ledarskapsprojekt
project-orbital-factories|Orbital Factories|Fabriker i omloppsbana
project-philosophy|Philosophy Project|Filosofiprojekt
project-sea-villages|Sea Villages|Havsbyar
project-space-mining|Space Mining|Gruvdrift i rymden
project-space-safety|Space Safety|Rymdsäkerhet
project-space-villages|Space Villages|Rymdbyar
project-underground|Underground Project|Underjordsprojekt
quality-plan|Quality, Safety and Digital Twins|Kvalitet, säkerhet och digitala tvillingar
quality-proposal|Quality System Proposal|Förslag till kvalitetssystem
quality|Quality|Kvalitet
recovery-plan|Mental Health and Recovery in Sweden|Psykisk hälsa och återhämtning i Sverige
recovery|Recovery|Återhämtning
regulatory|Regulatory Disclosures|Regulatoriska offentliggöranden
research-plan|Research, Innovation and Knowledge|Forskning, innovation och kunskap
research-proposal|Detailed Research Proposal|Detaljerat forskningsförslag
research|Research|Forskning
resources|Resources|Resurser
shop|Shop|Butik
transparency|Transparency|Transparens
universal-mind-proposal|Universal Mind Proposal|Förslag för Universellt medvetande
vendors|Vendors|Säljare
workbench|HGW Digital Workbench|HGW:s digitala verktygslåda
`.trim().split('\n').map(line => {
  const [key, en, sv] = line.split('|');
  return [key, [en, sv]];
}));
