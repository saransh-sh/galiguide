import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Brand & Header
    'brand.subtitle': 'Local Street Vendor Discovery',
    'header.explore': 'Explore',
    'header.map': 'Map',
    'header.categories': 'Categories',
    'header.about': 'About',
    'header.admin': 'Ward Admin',
    'header.adminActive': 'Admin Active',
    'header.locateMe': 'Locate Me',
    'header.gpsActive': 'GPS Active',
    'header.streetFood': 'Street Food',
    'header.repairArtisans': 'Repair Artisans',
    'header.localMarkets': 'Local Markets',

    // Bottom Nav
    'nav.explore': 'Explore',
    'nav.map': 'Map',
    'nav.categories': 'Categories',
    'nav.about': 'About',
    'nav.admin': 'Admin',
    'nav.login': 'Login',

    // Explore Hero
    'hero.badge': 'Local Street Directory',
    'hero.title': 'Find street vendors and local artisans near you.',
    'hero.subtitle': 'Discover food carts, cobblers, key makers, mechanics, and neighborhood stalls with direct walking directions.',
    'hero.searchPlaceholder': 'Cobbler, chai, key maker, poha...',
    'hero.searchLabel': 'Search Vendor or Service',
    'hero.localityLabel': 'Locality',
    'hero.allLocalities': 'Entire City',
    'hero.searchButton': 'Find Vendors',
    'hero.popular': 'Popular Searches:',
    'hero.pill1': 'Tea & Breakfast',
    'hero.pill2': 'Cobbler',
    'hero.pill3': 'Key Maker',
    'hero.pill4': 'Cycle Repair',
    'hero.pill5': 'Street Snacks',
    'hero.pill6': 'Alteration Tailor',
    'hero.verifiedBadge': 'On-Ground Verified',
    'hero.verifiedBadgeSub': 'Verified by ward teams',
    'hero.landmarkTitle': 'Street Landmark Guidance',
    'hero.landmarkExample': 'Near Main Square',
    'hero.landmarkDesc': '“Next to the corner banyan tree — look for the wooden stall with hand tools.”',

    // Explore Categories Section
    'categories.tag': 'Essential Services',
    'categories.title': 'Browse by Category',
    'categories.subtitle': 'Everyday street artisans keeping our neighbourhoods self-reliant.',
    'categories.active': 'active',
    'categories.viewCategory': 'View Stalls',

    // Explore Value Props Section
    'values.tag': 'Community First',
    'values.title': 'Simple, Direct, Free',
    'values.subtitle': 'A zero-commission community directory that puts local street stalls on the map.',
    'values.card1Title': 'Zero Commission, Zero Fees',
    'values.card1Desc': 'Free for both citizens and vendors. No listing fees, paid rankings, or commercial middlemen.',
    'values.card2Title': 'Direct Contact & Privacy',
    'values.card2Desc': 'Visit in person or call directly. Vendor phone numbers are protected from spam and telemarketers.',
    'values.card3Title': 'Landmark-Based Walking Directions',
    'values.card3Desc': 'Navigate using familiar street landmarks directly inside your favourite navigation app.',

    // Footer
    'footer.rights': 'Community Street Directory • Dedicated to Local Entrepreneurs',

    // About Modal
    'about.title': 'About GaliGuide',
    'about.subtitle': 'Local Street Vendor Discovery & Navigation',
    'about.intro': 'GaliGuide connects citizens with informal street vendors, food carts, and repair artisans who rarely appear on commercial map apps.',
    'about.card1Title': 'Street Food & Neighborhood Carts',
    'about.card1Desc': 'From morning breakfast carts to evening tea and snack stalls, find trusted local flavors across the city.',
    'about.card2Title': 'Everyday Repair Artisans',
    'about.card2Desc': 'Locate sidewalk cobblers, roadside cycle mechanics, key makers, and alteration tailors when you need them most.',
    'about.body': 'Commercial platforms prioritize large businesses with advertising budgets. GaliGuide provides zero-cost discoverability with verified physical locations and landmark-based directions so you can support local livelihoods with confidence.',
    'about.footer': 'Dignity and discoverability for street entrepreneurs.',
    'about.badge': 'Community Project',

    // Map View Controls & Header
    'map.searchPlaceholder': 'Search vendor, trade, or street landmark...',
    'map.allCategories': 'All Categories',
    'map.allLocalities': 'Entire City (All Localities)',
    'map.heatmap': 'Heatmap',
    'map.viewSplit': 'Split View',
    'map.viewMap': 'Map Only',
    'map.viewList': 'List Only',
    'map.vendorsCount': 'Street Vendors',
    'map.nearest': 'Nearest to you',
    'map.directory': 'Verified Directory',
    'map.noVendorsTitle': 'No Street Stalls Found',
    'map.noVendorsDesc': 'Try clearing your search query or selecting a different category or locality.',
    'map.resetFilters': 'Reset All Filters',
    'map.listBtn': 'List',
    'map.locationDenied': 'Location access disabled. Browsing central city default.',

    // Cards & Badges
    'card.openNow': 'Open Now',
    'card.closed': 'Closed',
    'card.verified': 'Verified',
    'card.pending': 'Pending',
    'card.call': 'Call',
    'card.directions': 'Directions',
    'card.detailsAndDirections': 'View Details & Directions',
    'card.m': 'm',
    'card.km': 'km',
    'card.away': 'away',

    // Vendor Detail Drawer
    'drawer.getDirections': 'Get Directions',
    'drawer.callVendor': 'Call Vendor',
    'drawer.inPersonOnly': 'In-Person Only',
    'drawer.phonePrivacyNotice': 'Vendor privacy: Contact number is kept private to prevent telemarketing calls.',
    'drawer.aboutTitle': 'About this Vendor & Stall',
    'drawer.paymentTitle': 'Digital Payment (UPI & Cash)',
    'drawer.paymentDesc': 'UPI QR code scanner or cash accepted',
    'drawer.upiActive': 'UPI Ready',
    'drawer.scheduleTitle': 'Operating Schedule',
    'drawer.landmarkTitle': 'Street Landmark Guidance',
    'drawer.addressLabel': 'Street / Area:',
    'drawer.gpsLabel': 'GPS Coordinates:',
    'drawer.shareTitle': 'Share Vendor',
    'drawer.shareCopied': 'Walking directions link copied to clipboard!',
    'drawer.roamingTitle': 'Roaming Handcart',
    'drawer.roamingDesc': 'Ask nearby: Cart moves within the locality or street corner.',

    // Stall types
    'stall.thela': 'Thela (Pushcart)',
    'stall.gumti': 'Gumti (Roadside Kiosk)',
    'stall.phad': 'Phad (Ground Setup)',
    'stall.roaming': 'Roaming Handcart',

    // Days of the week
    'day.MONDAY': 'Monday',
    'day.TUESDAY': 'Tuesday',
    'day.WEDNESDAY': 'Wednesday',
    'day.THURSDAY': 'Thursday',
    'day.FRIDAY': 'Friday',
    'day.SATURDAY': 'Saturday',
    'day.SUNDAY': 'Sunday',
  },
  hi: {
    // Brand & Header
    'brand.subtitle': 'स्थानीय ठेले व कारीगरों की खोज',
    'header.explore': 'खोजें',
    'header.map': 'मैप',
    'header.categories': 'श्रेणियां',
    'header.about': 'परिचय',
    'header.admin': 'वार्ड एडमिन',
    'header.adminActive': 'एडमिन एक्टिव',
    'header.locateMe': 'मेरी लोकेशन',
    'header.gpsActive': 'GPS चालू है',
    'header.streetFood': 'स्ट्रीट फूड',
    'header.repairArtisans': 'मरम्मत व कारीगर',
    'header.localMarkets': 'स्थानीय बाज़ार',

    // Bottom Nav
    'nav.explore': 'खोजें',
    'nav.map': 'मैप',
    'nav.categories': 'श्रेणियां',
    'nav.about': 'परिचय',
    'nav.admin': 'एडमिन',
    'nav.login': 'लॉगिन',

    // Explore Hero
    'hero.badge': 'स्थानीय स्ट्रीट डायरेक्टरी',
    'hero.title': 'अपने नज़दीकी ठेले, गुमटी और कारीगर खोजें।',
    'hero.subtitle': 'स्ट्रीट फूड, मोची, चाबी वाले, साइकिल मरम्मत और गली-नुक्कड़ के हुनरमंदों की सीधी जानकारी और पैदल रास्ता।',
    'hero.searchPlaceholder': 'मोची, चाय, चाबी वाले, पोहा...',
    'hero.searchLabel': 'कारीगर या सेवा खोजें',
    'hero.localityLabel': 'इलाका',
    'hero.allLocalities': 'पूरा शहर (सभी इलाके)',
    'hero.searchButton': 'कारीगर खोजें',
    'hero.popular': 'लोकप्रिय खोज:',
    'hero.pill1': 'चाय व नाश्ता',
    'hero.pill2': 'मोची',
    'hero.pill3': 'चाबी वाले',
    'hero.pill4': 'साइकिल पंचर',
    'hero.pill5': 'स्ट्रीट स्नैक्स',
    'hero.pill6': 'रफू व दर्जी',
    'hero.verifiedBadge': 'ज़मीनी सत्यापन',
    'hero.verifiedBadgeSub': 'वार्ड टीम द्वारा सत्यापित',
    'hero.landmarkTitle': 'ज़मीनी पहचान से रास्ता',
    'hero.landmarkExample': 'मुख्य चौराहे के पास',
    'hero.landmarkDesc': '“नुक्कड़ के पुराने पेड़ के पास — लकड़ी के फड़ पर मरम्मत के औजारों के साथ।”',

    // Explore Categories Section
    'categories.tag': 'ज़रूरी सेवाएं',
    'categories.title': 'श्रेणी के अनुसार खोजें',
    'categories.subtitle': 'गली-मोहल्ले के कारीगर जो हर दिन आपकी मदद के लिए तैयार हैं।',
    'categories.active': 'सक्रिय',
    'categories.viewCategory': 'ठेले देखें',

    // Explore Value Props Section
    'values.tag': 'समुदाय प्रथम',
    'values.title': 'सीधा, सच्चा और मुफ़्त',
    'values.subtitle': 'बिना किसी कमीशन की सामुदायिक डायरेक्टरी जो छोटे दुकानदारों को डिजिटल पहचान देती है।',
    'values.card1Title': 'शून्य कमीशन, पूरी छूट',
    'values.card1Desc': 'ना ग्राहकों से कोई शुल्क, ना वेंडर्स से कोई कमीशन। कोई बिचौलिया या पेड विज्ञापन नहीं।',
    'values.card2Title': 'सीधा संपर्क और निजता',
    'values.card2Desc': 'सीधे मिलें या फ़ोन करें। वेंडर्स के नंबर स्पैम और अनचाही कॉल्स से सुरक्षित हैं।',
    'values.card3Title': 'ज़मीनी पहचान से पैदल रास्ता',
    'values.card3Desc': 'आसपास की मशहूर निशानियों के ज़रिये रास्ता, सीधे आपके पसंदीदा मोबाइल मैप ऐप में।',

    // Footer
    'footer.rights': 'सामुदायिक स्ट्रीट डायरेक्टरी • स्थानीय कारीगरों व उद्यमियों को समर्पित',

    // About Modal
    'about.title': 'गलीगाइड के बारे में',
    'about.subtitle': 'स्थानीय ठेले और कारीगरों की खोज व रास्ता',
    'about.intro': 'गलीगाइड आपको अपने शहर के उन छोटे दुकानदारों, ठेलों और कारीगरों तक पहुँचाता है जो आम व्यावसायिक मैप ऐप्स पर नहीं मिलते।',
    'about.card1Title': 'स्ट्रीट फूड और बाज़ार',
    'about.card1Desc': 'सुबह के नाश्ते के ठेलों से लेकर शाम की चाय और स्नैक्स तक, शहर के असली स्थानीय स्वाद का पता लगाएँ।',
    'about.card2Title': 'दैनिक मरम्मत और कारीगर',
    'about.card2Desc': 'मोची, चाबी बनाने वाले, साइकिल पंचर, और दर्जी जैसी ज़रूरी सेवाएं जब और जहाँ आपको चाहिए।',
    'about.body': 'बड़ी टेक कंपनियाँ केवल विज्ञापनों वाली बड़ी दुकानों को तरजीह देती हैं। गलीगाइड बिना किसी शुल्क के, स्थानीय पहचान और खुली मैपिंग के साथ इन मेहनती कारीगरों को डिजिटल पहचान देता है ताकि आप बेझिझक स्थानीय कारीगरों का समर्थन कर सकें।',
    'about.footer': 'स्थानीय रोज़गार और स्ट्रीट कारीगरों का सम्मान।',
    'about.badge': 'सामुदायिक प्रोजेक्ट',

    // Map View Controls & Header
    'map.searchPlaceholder': 'दुकान, ठेला, काम या नज़दीकी निशानी खोजें...',
    'map.allCategories': 'सभी श्रेणियां',
    'map.allLocalities': 'पूरा शहर (सभी इलाके)',
    'map.heatmap': 'हीटमैप',
    'map.viewSplit': 'स्प्लिट व्यू',
    'map.viewMap': 'केवल मैप',
    'map.viewList': 'केवल लिस्ट',
    'map.vendorsCount': 'दुकानें / ठेले',
    'map.nearest': 'आपके सबसे पास',
    'map.directory': 'सत्यापित डायरेक्टरी',
    'map.noVendorsTitle': 'कोई ठेला या दुकान नहीं मिली',
    'map.noVendorsDesc': 'सर्च बदलकर देखें या कोई दूसरी श्रेणी या इलाका चुनें।',
    'map.resetFilters': 'फ़िल्टर हटाएं',
    'map.listBtn': 'लिस्ट',
    'map.locationDenied': 'लोकेशन बंद है। शहर का मुख्य केंद्र दिखाया जा रहा है।',

    // Cards & Badges
    'card.openNow': 'खुला है',
    'card.closed': 'बंद है',
    'card.verified': 'सत्यापित',
    'card.pending': 'जांच जारी',
    'card.call': 'कॉल करें',
    'card.directions': 'रास्ता देखें',
    'card.detailsAndDirections': 'जानकारी व रास्ता देखें',
    'card.m': 'मी.',
    'card.km': 'कि.मी.',
    'card.away': 'दूर',

    // Vendor Detail Drawer
    'drawer.getDirections': 'रास्ता देखें',
    'drawer.callVendor': 'कॉल करें',
    'drawer.inPersonOnly': 'सीधे मिलें',
    'drawer.phonePrivacyNotice': 'गोपनीयता: अनावश्यक मार्केटिंग कॉल से बचाने के लिए वेंडर का नंबर सुरक्षित रखा गया है।',
    'drawer.aboutTitle': 'दुकान व वेंडर के बारे में',
    'drawer.paymentTitle': 'डिजिटल पेमेंट (UPI व नकद)',
    'drawer.paymentDesc': 'UPI QR कोड या नकद भुगतान स्वीकार्य',
    'drawer.upiActive': 'UPI चालू',
    'drawer.scheduleTitle': 'दुकान का समय',
    'drawer.landmarkTitle': 'ज़मीनी पहचान व रास्ता',
    'drawer.addressLabel': 'गली / इलाका:',
    'drawer.gpsLabel': 'GPS निर्देशांक:',
    'drawer.shareTitle': 'शेयर करें',
    'drawer.shareCopied': 'रास्ते का लिंक कॉपी हो गया!',
    'drawer.roamingTitle': 'चलता-फिरता ठेला',
    'drawer.roamingDesc': 'आस-पास पूछें: ठेला गली या चौराहे पर थोड़ा आगे-पीछे होता रहता है।',

    // Stall types
    'stall.thela': 'ठेला (हाथगाड़ी)',
    'stall.gumti': 'गुमटी (सड़क किनारे स्टॉल)',
    'stall.phad': 'फड़ (ज़मीनी दुकान)',
    'stall.roaming': 'चलता-फिरता ठेला',

    // Days of the week
    'day.MONDAY': 'सोमवार',
    'day.TUESDAY': 'मंगलवार',
    'day.WEDNESDAY': 'बुधवार',
    'day.THURSDAY': 'गुरुवार',
    'day.FRIDAY': 'शुक्रवार',
    'day.SATURDAY': 'शनिवार',
    'day.SUNDAY': 'रविवार',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('galiguide_lang') as Language;
      if (saved === 'en' || saved === 'hi') return saved;
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('galiguide_lang', lang);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
