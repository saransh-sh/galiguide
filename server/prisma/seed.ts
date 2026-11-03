/**
 * GaliGuide Indore Realistic Demonstration Seeding Script
 * File: server/prisma/seed.ts
 *
 * Populates:
 * 1. 2 Administrative Users (Super Admin and Field Verifier) with bcrypt hashed passwords
 * 2. 10 Standard Informal Vendor Categories with Lucide icons, marker colors, and Hindi descriptions
 * 3. 10 Prominent Indore Localities/Areas with exact centroid coordinates and bounding envelopes
 * 4. 22 Authentic Indore Street Vendors across all 10 categories, covering Sarafa, Chappan Dukan,
 *    Rajwada, Palasia, Vijay Nagar, Bhanwarkuan, Malwa Mill, Jail Road, Annapurna, and MT Cloth Market.
 * 5. Complete 7-Day OperatingHour schedules for all 22 vendors (including late-night Sarafa hours).
 * 6. AuditLog initialization records for verification traceability.
 */

import { PrismaClient } from '@prisma/client';
import {
  Role,
  VendorStatus,
  OperatingStatus,
  DayOfWeek,
  AuditAction,
} from '../src/types/enums';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Salt rounds for genuine bcrypt password hashing
const BCRYPT_SALT_ROUNDS = 12;

async function main() {
  console.log('========================================================================');
  console.log('🌱 Starting GaliGuide Indore Dataset Seeding Pipeline...');
  console.log('========================================================================');

  // ---------------------------------------------------------------------------
  // 1. Clean Existing Database Records (Idempotent Execution)
  // ---------------------------------------------------------------------------
  console.log('🧹 Purging existing records to ensure clean relational state...');
  await prisma.auditLog.deleteMany({});
  await prisma.operatingHour.deleteMany({});
  await prisma.vendor.deleteMany({});
  await prisma.area.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.adminUser.deleteMany({});
  console.log('✅ Existing data purged successfully.');

  // ---------------------------------------------------------------------------
  // 2. Seed Administrative Users
  // ---------------------------------------------------------------------------
  console.log('👤 Seeding default administrative accounts...');
  const superAdminHash = await bcrypt.hash('GaliGuide@Indore2026', BCRYPT_SALT_ROUNDS);
  const verifierHash = await bcrypt.hash('IndoreVerifier#2026', BCRYPT_SALT_ROUNDS);

  const superAdmin = await prisma.adminUser.create({
    data: {
      email: 'admin@galiguide.in',
      passwordHash: superAdminHash,
      name: 'Indore Municipal Ward Lead',
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
  });

  const fieldVerifier = await prisma.adminUser.create({
    data: {
      email: 'verifier@galiguide.in',
      passwordHash: verifierHash,
      name: 'Priya Verma (Field Verifier)',
      role: Role.ADMIN,
      isActive: true,
    },
  });

  console.log(`✅ Seeded 2 Administrators: ${superAdmin.email} (SUPER_ADMIN), ${fieldVerifier.email} (ADMIN).`);

  // ---------------------------------------------------------------------------
  // 3. Seed 10 Official Informal Trade Categories
  // ---------------------------------------------------------------------------
  console.log('🏷️  Seeding informal trade categories...');
  const categoryData = [
    {
      name: 'Street Food & Chaat',
      slug: 'street-food',
      description: 'स्ट्रीट फूड व चाट — Indori poha-jalebi, khopra patties, dahi bada, hot dogs, garadu, and night bazaar delicacies.',
      icon: 'utensils',
      color: '#F26522',
      displayOrder: 1,
    },
    {
      name: 'Chai & Beverages',
      slug: 'chai-beverages',
      description: 'चाय व पेय — Masala chai tapris, kulhad chai, fresh cold sugarcane juice, shikanji, and cold coffee.',
      icon: 'coffee',
      color: '#D97706',
      displayOrder: 2,
    },
    {
      name: 'Cobbler / Shoe Repair',
      slug: 'cobbler',
      description: 'मोची व जूता मरम्मत — Sidewalk mochis, leather boot stitching, sole gluing, heel replacement, and shoe polish.',
      icon: 'hammer',
      color: '#8B5A2B',
      displayOrder: 3,
    },
    {
      name: 'Key Maker & Locksmith',
      slug: 'key-maker',
      description: 'चाबी वाले व ताला रिपेयर — Duplicate keys in 2 minutes, computerized car sensor keys, and emergency padlock opening.',
      icon: 'key',
      color: '#D4AF37',
      displayOrder: 4,
    },
    {
      name: 'Knife Sharpener',
      slug: 'knife-sharpener',
      description: 'धार लगाने वाले — Cycle-mounted grinding stone artisans for tailor scissors, kitchen knives, and meat cleavers.',
      icon: 'scissors',
      color: '#475569',
      displayOrder: 5,
    },
    {
      name: 'Fruit & Vegetable Thelas',
      slug: 'fruits-vegetables',
      description: 'फल व सब्जी ठेला — Fresh local farm produce, seasonal fruits from Choithram Mandi, and evening green vegetable pushcarts.',
      icon: 'apple',
      color: '#16A34A',
      displayOrder: 6,
    },
    {
      name: 'Tailor & Alteration',
      slug: 'tailor-alteration',
      description: 'दर्जी व अल्टरेशन — Alleys and basement raffu masters, same-day jeans fitting, jacket zipper replacement, and alterations.',
      icon: 'shirt',
      color: '#4F46E5',
      displayOrder: 7,
    },
    {
      name: 'Flower & Garland Vendor',
      slug: 'flower-vendor',
      description: 'फूल व माला वाले — Fresh marigold garlands (genda), rose petals, durva grass, and daily puja samagri.',
      icon: 'flower-2',
      color: '#E11D48',
      displayOrder: 8,
    },
    {
      name: 'Cycle & Tyre Repair',
      slug: 'cycle-repair',
      description: 'साइकिल व टायर पंचर — Roadside mechanics, tubeless puncture fixes, bicycle chain repair, and air pump stations.',
      icon: 'bike',
      color: '#0891B2',
      displayOrder: 9,
    },
    {
      name: 'Pottery & Mitti Artisans',
      slug: 'pottery-artisan',
      description: 'कुम्हार व मिट्टी के बर्तन — Traditional terracotta clay water matkas, festive Diwali diyas, cooking handis, and dahi pots.',
      icon: 'flame',
      color: '#C2410C',
      displayOrder: 10,
    },
  ];

  const categoriesMap = new Map<string, string>();
  for (const cat of categoryData) {
    const created = await prisma.category.create({ data: cat });
    categoriesMap.set(cat.slug, created.id);
  }
  console.log(`✅ Seeded ${categoriesMap.size} standard informal vendor categories.`);

  // ---------------------------------------------------------------------------
  // 4. Seed 10 Prominent Indore Localities / Areas
  // ---------------------------------------------------------------------------
  console.log('📍 Seeding prominent Indore localities...');
  const areaData = [
    {
      name: 'Sarafa Bazaar',
      slug: 'sarafa-bazaar',
      pincode: '452002',
      latitude: 22.7196,
      longitude: 75.8577,
      boundsMinLat: 22.716,
      boundsMaxLat: 22.723,
      boundsMinLng: 75.853,
      boundsMaxLng: 75.862,
    },
    {
      name: 'Chappan Dukan',
      slug: 'chappan-dukan',
      pincode: '452001',
      latitude: 22.7244,
      longitude: 75.8839,
      boundsMinLat: 22.722,
      boundsMaxLat: 22.727,
      boundsMinLng: 75.881,
      boundsMaxLng: 75.887,
    },
    {
      name: 'Rajwada',
      slug: 'rajwada',
      pincode: '452002',
      latitude: 22.7186,
      longitude: 75.8552,
      boundsMinLat: 22.715,
      boundsMaxLat: 22.722,
      boundsMinLng: 75.851,
      boundsMaxLng: 75.859,
    },
    {
      name: 'Palasia',
      slug: 'palasia',
      pincode: '452001',
      latitude: 22.722,
      longitude: 75.8872,
      boundsMinLat: 22.718,
      boundsMaxLat: 22.726,
      boundsMinLng: 75.883,
      boundsMaxLng: 75.892,
    },
    {
      name: 'Vijay Nagar',
      slug: 'vijay-nagar',
      pincode: '452010',
      latitude: 22.7533,
      longitude: 75.8937,
      boundsMinLat: 22.748,
      boundsMaxLat: 22.76,
      boundsMinLng: 75.888,
      boundsMaxLng: 75.9,
    },
    {
      name: 'Bhanwarkuan',
      slug: 'bhanwarkuan',
      pincode: '452014',
      latitude: 22.6933,
      longitude: 75.8667,
      boundsMinLat: 22.688,
      boundsMaxLat: 22.698,
      boundsMinLng: 75.861,
      boundsMaxLng: 75.872,
    },
    {
      name: 'Malwa Mill',
      slug: 'malwa-mill',
      pincode: '452003',
      latitude: 22.7302,
      longitude: 75.871,
      boundsMinLat: 22.726,
      boundsMaxLat: 22.735,
      boundsMinLng: 75.866,
      boundsMaxLng: 75.876,
    },
    {
      name: 'Jail Road',
      slug: 'jail-road',
      pincode: '452007',
      latitude: 22.721,
      longitude: 75.863,
      boundsMinLat: 22.717,
      boundsMaxLat: 22.725,
      boundsMinLng: 75.858,
      boundsMaxLng: 75.867,
    },
    {
      name: 'Annapurna',
      slug: 'annapurna',
      pincode: '452009',
      latitude: 22.695,
      longitude: 75.836,
      boundsMinLat: 22.69,
      boundsMaxLat: 22.7,
      boundsMinLng: 75.83,
      boundsMaxLng: 75.842,
    },
    {
      name: 'MT Cloth Market',
      slug: 'mt-cloth-market',
      pincode: '452002',
      latitude: 22.717,
      longitude: 75.8505,
      boundsMinLat: 22.713,
      boundsMaxLat: 22.721,
      boundsMinLng: 75.846,
      boundsMaxLng: 75.855,
    },
  ];

  const areasMap = new Map<string, string>();
  for (const area of areaData) {
    const created = await prisma.area.create({ data: area });
    areasMap.set(area.name, created.id);
  }
  console.log(`✅ Seeded ${areasMap.size} Indore administrative localities.`);

  // ---------------------------------------------------------------------------
  // 5. Seed 22 Authentic Indore Street Vendors with Schedules
  // ---------------------------------------------------------------------------
  console.log('🛒 Seeding 22 authentic Indore informal street vendors...');

  const vendorSeedData = [
    // 1. Street Food - Chappan Dukan
    {
      name: 'Johny Hot Dog',
      hindiName: 'जॉनी हॉट डॉग',
      categorySlug: 'street-food',
      areaName: 'Chappan Dukan',
      description: '[Stall Type: SEMI_PERMANENT_KIOSK] Indore\'s iconic street hot dog stall founded by Vijay Singh Rathore in 1978. Renowned for crispy veg burgers, egg banjos, and mutton hot dogs.',
      contactPhone: '+919826012345',
      whatsappPhone: '+919826012345',
      latitude: 22.7244,
      longitude: 75.8839,
      landmark: 'Shop No. 27, Chappan Dukan, near central pedestrian fountain',
      addressLine: 'Chappan Dukan, New Palasia, Indore, MP 452001',
      status: VendorStatus.VERIFIED,
      isVerified: true,
      consentObtained: true,
      isPhonePublic: true,
      days: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
      openTime: '10:00',
      closeTime: '22:30',
    },

    // 2. Street Food - Sarafa Bazaar
    {
      name: 'Vijay Chaat House',
      hindiName: 'विजय चाट हाउस',
      categorySlug: 'street-food',
      areaName: 'Sarafa Bazaar',
      description: '[Stall Type: SEMI_PERMANENT_KIOSK] World-famous for authentic Indori Khopra Patties served with spicy pudina chutney, Katori Chaat, and steaming Matar Kachori.',
      contactPhone: '+919425098765',
      whatsappPhone: '+919425098765',
      latitude: 22.7197,
      longitude: 75.8578,
      landmark: 'Opposite Bada Sarafa Police Chowki, Main Sarafa Street',
      addressLine: '6-7, Sarafa Bazaar, Indore, MP 452002',
      status: VendorStatus.VERIFIED,
      isVerified: true,
      consentObtained: true,
      isPhonePublic: true,
      days: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
      openTime: '08:30',
      closeTime: '23:30',
    },

    // 3. Street Food - Sarafa Night Market (Late Night)
    {
      name: 'Joshi Dahi Bada House',
      hindiName: 'जोशी दही बड़ा हाउस',
      categorySlug: 'street-food',
      areaName: 'Sarafa Bazaar',
      description: '[Stall Type: SEMI_PERMANENT_KIOSK] Legendary Sarafa Night Market stall famed for Flying Dahi Bada caught with one hand, garnished with 5 signature spice powders.',
      contactPhone: '+919827054321',
      whatsappPhone: '+919827054321',
      latitude: 22.7195,
      longitude: 75.8576,
      landmark: 'Near Ganpati Mandir, Sarafa Gali No. 1',
      addressLine: 'Sarafa Night Food Street, Gali No. 1, Indore, MP 452002',
      status: VendorStatus.VERIFIED,
      isVerified: true,
      consentObtained: true,
      isPhonePublic: true,
      days: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
      openTime: '18:00',
      closeTime: '01:30',
    },

    // 4. Street Food - Sarafa Night Market (Late Night)
    {
      name: 'Nagori Shikanji Stall',
      hindiName: 'नागोरी शिकंजी स्टॉल',
      categorySlug: 'street-food',
      areaName: 'Sarafa Bazaar',
      description: '[Stall Type: PUSH_CART] Thick Indori Shikanji made from strained rich condensed milk, hung curd, saffron, cardamom, and toasted dry fruits. Unique regional dessert.',
      contactPhone: '+919893011223',
      whatsappPhone: '+919893011223',
      latitude: 22.7194,
      longitude: 75.8579,
      landmark: 'Corner of Bartan Gali and Sarafa Main Night Corridor',
      addressLine: 'Chhota Sarafa Corner, Indore, MP 452002',
      status: VendorStatus.VERIFIED,
      isVerified: true,
      consentObtained: true,
      isPhonePublic: true,
      days: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
      openTime: '19:00',
      closeTime: '02:00',
    },

    // 5. Street Food - Sarafa Bazaar (Phone Consent False - Privacy Test Record)
    {
      name: 'Sanwariya Seth Sabudana Khichdi',
      hindiName: 'सांवरिया सेठ साबूदाना खिचड़ी',
      categorySlug: 'street-food',
      areaName: 'Sarafa Bazaar',
      description: '[Stall Type: PUSH_CART] Freshly steamed Farali Sabudana Khichdi topped with spicy falahari mixture, pomegranate seeds, and fresh lemon coriander.',
      contactPhone: '+919826198765',
      whatsappPhone: null,
      latitude: 22.7198,
      longitude: 75.8574,
      landmark: 'Facing Mahakal Jewellers, near Sarafa Arch Gate',
      addressLine: 'Sarafa Bazaar Entry, Indore, MP 452002',
      status: VendorStatus.VERIFIED,
      isVerified: true,
      consentObtained: true,
      isPhonePublic: false, // Explicit phone privacy masking safeguard
      days: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
      openTime: '17:00',
      closeTime: '01:00',
    },

    // 6. Chai & Beverages - Old Palasia
    {
      name: 'Sharma Chai Corner',
      hindiName: 'शर्मा चाय कॉर्नर',
      categorySlug: 'chai-beverages',
      areaName: 'Palasia',
      description: '[Stall Type: SEMI_PERMANENT_KIOSK] Famous neighborhood tapri serving steaming ginger-cardamom cutting chai, morning Indori poha-jalebi, and crispy bun maska.',
      contactPhone: '+919754023456',
      whatsappPhone: '+919754023456',
      latitude: 22.7222,
      longitude: 75.8875,
      landmark: 'Under the large Peepal Tree near Industry House, Old Palasia Square',
      addressLine: 'Old Palasia Main Road, Indore, MP 452001',
      status: VendorStatus.VERIFIED,
      isVerified: true,
      consentObtained: true,
      isPhonePublic: true,
      days: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
      openTime: '06:00',
      closeTime: '22:00',
    },

    // 7. Chai & Beverages - Chappan Dukan
    {
      name: 'Apna Sweets Tea Counter',
      hindiName: 'अपना स्वीट्स टी काउंटर',
      categorySlug: 'chai-beverages',
      areaName: 'Chappan Dukan',
      description: '[Stall Type: SEMI_PERMANENT_KIOSK] Fast-paced outdoor tea counter known for rich whole-milk Masala Chai, freshly fried samosas, and pyaz kachoris.',
      contactPhone: '+919300055443',
      whatsappPhone: '+919300055443',
      latitude: 22.725,
      longitude: 75.883,
      landmark: 'Beside Apna Sweets entrance, 50m north of Chappan Dukan',
      addressLine: 'New Palasia Main Road, Indore, MP 452001',
      status: VendorStatus.VERIFIED,
      isVerified: true,
      consentObtained: true,
      isPhonePublic: true,
      days: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
      openTime: '06:30',
      closeTime: '21:30',
    },

    // 8. Chai & Beverages - Bhanwarkuan
    {
      name: 'Gurukripa Student Chai Stall',
      hindiName: 'गुरुकृपा स्टूडेंट चाय स्टॉल',
      categorySlug: 'chai-beverages',
      areaName: 'Bhanwarkuan',
      description: '[Stall Type: PUSH_CART] Legendary student hub tea thela serving Kulhad Chai, bun maska, and poha to thousands of competitive exam aspirants daily.',
      contactPhone: '+919826677889',
      whatsappPhone: '+919826677889',
      latitude: 22.6935,
      longitude: 75.8665,
      landmark: 'Outside Gurukripa Coaching Academy, Bholaram Ustad Marg',
      addressLine: 'Bholaram Ustad Marg, Bhanwarkuan, Indore, MP 452014',
      status: VendorStatus.VERIFIED,
      isVerified: true,
      consentObtained: true,
      isPhonePublic: true,
      days: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
      openTime: '05:30',
      closeTime: '23:00',
    },

    // 9. Cobbler / Shoe Repair - Rajwada / High Court (Phone Consent False)
    {
      name: 'Ramu Mochi',
      hindiName: 'रामू मोची',
      categorySlug: 'cobbler',
      areaName: 'Rajwada',
      description: '[Stall Type: FOOTPATH_SEAT] 25 years of master leather craftsmanship on the sidewalk. Specializes in heavy boot stitching, heel repairs, zipper fixes, and polish.',
      contactPhone: '+919826022222',
      whatsappPhone: null,
      latitude: 22.7208,
      longitude: 75.8752,
      landmark: 'Footpath outside Gate No. 2, MP High Court Bench, MG Road',
      addressLine: 'MG Road, High Court Precinct, Indore, MP 452001',
      status: VendorStatus.VERIFIED,
      isVerified: true,
      consentObtained: true,
      isPhonePublic: false, // Withheld from public view
      days: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY],
      openTime: '09:00',
      closeTime: '19:30',
    },

    // 10. Cobbler / Shoe Repair - Palasia Square
    {
      name: 'Shankar Shoe Repair Stall',
      hindiName: 'शंकर शू रिपेयर',
      categorySlug: 'cobbler',
      areaName: 'Palasia',
      description: '[Stall Type: FOOTPATH_SEAT] Fast sneaker sole gluing, ladies sandal strap repairs, luggage bag zipper maintenance, and belt hole punching.',
      contactPhone: '+919179044332',
      whatsappPhone: '+919179044332',
      latitude: 22.7218,
      longitude: 75.8868,
      landmark: 'Under the Banyan tree at Palasia Square, beside the City Bus shelter',
      addressLine: 'Palasia Square, AB Road Corner, Indore, MP 452001',
      status: VendorStatus.VERIFIED,
      isVerified: true,
      consentObtained: true,
      isPhonePublic: true,
      days: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
      openTime: '09:30',
      closeTime: '20:00',
    },

    // 11. Key Maker - Rajwada
    {
      name: 'Mohan Chabiwala',
      hindiName: 'मोहन चाबी वाला',
      categorySlug: 'key-maker',
      areaName: 'Rajwada',
      description: '[Stall Type: PUSH_CART] Duplicate keys cut in 2 minutes on a manual rotary brass lathe. Godrej lock keys, motorcycle sensor keys, and padlock emergency opening.',
      contactPhone: '+919827899001',
      whatsappPhone: '+919827899001',
      latitude: 22.7188,
      longitude: 75.855,
      landmark: 'Opposite Rajwada Main Gate, Ahilya Fort circle',
      addressLine: 'Rajwada Chowk, Indore, MP 452002',
      status: VendorStatus.VERIFIED,
      isVerified: true,
      consentObtained: true,
      isPhonePublic: true,
      days: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
      openTime: '10:00',
      closeTime: '20:00',
    },

    // 12. Key Maker - Malwa Mill
    {
      name: 'Ganesh Lock & Key Duplicators',
      hindiName: 'गणेश डुप्लीकेट चाबी केंद्र',
      categorySlug: 'key-maker',
      areaName: 'Malwa Mill',
      description: '[Stall Type: SEMI_PERMANENT_KIOSK] Computerized automotive laser keys, industrial rolling shutter lock repairs, master key sets, and padlock combinations.',
      contactPhone: '+919406611234',
      whatsappPhone: '+919406611234',
      latitude: 22.7305,
      longitude: 75.8712,
      landmark: 'Malwa Mill Square, near historic Gate No. 1 corner',
      addressLine: 'Kalyan Mill Road, Malwa Mill, Indore, MP 452003',
      status: VendorStatus.VERIFIED,
      isVerified: true,
      consentObtained: true,
      isPhonePublic: true,
      days: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY],
      openTime: '09:00',
      closeTime: '21:00',
    },

    // 13. Knife Sharpener - MT Cloth Market
    {
      name: 'Babu Dharwala (Cycle Cart)',
      hindiName: 'बाबू धार वाला (साइकिल ठेला)',
      categorySlug: 'knife-sharpener',
      areaName: 'MT Cloth Market',
      description: '[Stall Type: CYCLE_MOUNTED] Foot-pedaled emery grinding stone mounted on bicycle frame. Sharpens textile tailor scissors, butcher cleavers, and kitchen knives.',
      contactPhone: null,
      whatsappPhone: null,
      latitude: 22.7172,
      longitude: 75.8508,
      landmark: 'Narrow gali between MT Cloth Market Lane 2 & Lane 4',
      addressLine: 'Gali No. 3, MT Cloth Market, Near Sakkar Bazar, Indore, MP 452002',
      status: VendorStatus.VERIFIED,
      isVerified: true,
      consentObtained: true,
      isPhonePublic: false,
      days: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY],
      openTime: '10:30',
      closeTime: '18:30',
    },

    // 14. Fruit Thela - Annapurna / Choithram
    {
      name: 'Rajesh Phal Bhandar (Thela)',
      hindiName: 'राजेश फल भंडार',
      categorySlug: 'fruits-vegetables',
      areaName: 'Annapurna',
      description: '[Stall Type: PUSH_CART] Freshly sourced seasonal fruits from Choithram Wholesale Mandi: Kashmiri apples, Nagpur oranges, papayas, and fresh pomegranates.',
      contactPhone: '+919926078901',
      whatsappPhone: '+919926078901',
      latitude: 22.6952,
      longitude: 75.8362,
      landmark: '50m south of Choithram Hospital junction, Annapurna Road',
      addressLine: 'Outside Choithram Sabzi Mandi Gate, Indore, MP 452009',
      status: VendorStatus.VERIFIED,
      isVerified: true,
      consentObtained: true,
      isPhonePublic: true,
      days: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
      openTime: '07:00',
      closeTime: '21:00',
    },

    // 15. Vegetable Thela - Vijay Nagar
    {
      name: 'Ramesh Sabziwala Thela',
      hindiName: 'रमेश सब्जी वाला ठेला',
      categorySlug: 'fruits-vegetables',
      areaName: 'Vijay Nagar',
      description: '[Stall Type: PUSH_CART] Evening green vegetable pushcart offering farm-fresh Malwa green peas (matar), coriander, desi tomatoes, palak, and seasonal root veggies.',
      contactPhone: '+919826355441',
      whatsappPhone: '+919826355441',
      latitude: 22.7538,
      longitude: 75.894,
      landmark: 'Near Meghdoot Garden entry gate, opposite Mangal City back road',
      addressLine: 'Scheme 54, Vijay Nagar, Indore, MP 452010',
      status: VendorStatus.VERIFIED,
      isVerified: true,
      consentObtained: true,
      isPhonePublic: true,
      days: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
      openTime: '07:30',
      closeTime: '21:00',
    },

    // 16. Tailor / Alteration - Jail Road
    {
      name: 'Munna Tailor & Alteration',
      hindiName: 'मुन्ना टेलर व अल्टरेशन',
      categorySlug: 'tailor-alteration',
      areaName: 'Jail Road',
      description: '[Stall Type: SEMI_PERMANENT_KIOSK] Instant 15-minute jeans narrowing, length alteration, invisible darning (raffu), blazer adjustments, and zipper repair.',
      contactPhone: '+919713022119',
      whatsappPhone: '+919713022119',
      latitude: 22.7212,
      longitude: 75.8633,
      landmark: 'Basement staircase entrance, Kothari Market, Jail Road',
      addressLine: 'Shop No. 14, Gali No. 2, Kothari Market, Jail Road, Indore, MP 452007',
      status: VendorStatus.VERIFIED,
      isVerified: true,
      consentObtained: true,
      isPhonePublic: true,
      days: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY],
      openTime: '10:30',
      closeTime: '20:30',
    },

    // 17. Flower Vendor - Rajwada Phool Gali
    {
      name: 'Lakhan Phool Bhandar',
      hindiName: 'लखन फूल भंडार',
      categorySlug: 'flower-vendor',
      areaName: 'Rajwada',
      description: '[Stall Type: SEMI_PERMANENT_KIOSK] Fresh orange and yellow marigold garlands (genda phool), rose petals, durva grass, and puja samagri for morning temple worship.',
      contactPhone: '+919893344556',
      whatsappPhone: '+919893344556',
      latitude: 22.7184,
      longitude: 75.8548,
      landmark: 'Phool Gali, behind Rajwada Palace wooden gateway',
      addressLine: 'Phool Gali, Rajwada Precinct, Indore, MP 452002',
      status: VendorStatus.VERIFIED,
      isVerified: true,
      consentObtained: true,
      isPhonePublic: true,
      days: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
      openTime: '05:00',
      closeTime: '21:00',
    },

    // 18. Cycle Repair - Bhanwarkuan
    {
      name: 'Raju Cycle Repair & Puncher',
      hindiName: 'राजू साइकिल रिपेयर व पंचर',
      categorySlug: 'cycle-repair',
      areaName: 'Bhanwarkuan',
      description: '[Stall Type: FOOTPATH_SEAT] Student area emergency bicycle puncture repairs, tyre replacement, chain greasing, brake tuning, and motorcycle tubeless puncture patches.',
      contactPhone: null,
      whatsappPhone: null,
      latitude: 22.6928,
      longitude: 75.8672,
      landmark: 'Beside IOCL Petrol Pump, Bhanwarkuan Square corner',
      addressLine: 'Bhanwarkuan Square, AB Road Corner, Indore, MP 452014',
      status: VendorStatus.VERIFIED,
      isVerified: true,
      consentObtained: true,
      isPhonePublic: false,
      days: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
      openTime: '08:00',
      closeTime: '21:00',
    },

    // 19. Pottery / Clay Artisans - Annapurna
    {
      name: 'Shyamu Matka & Mitti Ke Bartan',
      hindiName: 'श्यामू मटका व मिट्टी के बर्तन',
      categorySlug: 'pottery-artisan',
      areaName: 'Annapurna',
      description: '[Stall Type: SEMI_PERMANENT_KIOSK] Traditional handmade earthenware: black clay cooling water matkas, curd pots (dahi handi), tawas, and festive terracotta diyas.',
      contactPhone: '+919826844990',
      whatsappPhone: '+919826844990',
      latitude: 22.6945,
      longitude: 75.8375,
      landmark: 'Open roadside ground next to Annapurna Temple Lake Garden',
      addressLine: 'Annapurna Mandir Road, Indore, MP 452009',
      status: VendorStatus.VERIFIED,
      isVerified: true,
      consentObtained: true,
      isPhonePublic: true,
      days: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
      openTime: '08:30',
      closeTime: '19:30',
    },

    // 20. Street Food - Chappan Dukan (Paan)
    {
      name: 'Anand Paan Sadan',
      hindiName: 'आनंद पान सदन',
      categorySlug: 'street-food',
      areaName: 'Chappan Dukan',
      description: '[Stall Type: SEMI_PERMANENT_KIOSK] Celebrated Chappan Dukan paan kiosk offering famous Indori Fire Paan, ice paan, chocolate paan, and authentic Calcutta meetha paan.',
      contactPhone: '+919827011998',
      whatsappPhone: '+919827011998',
      latitude: 22.7246,
      longitude: 75.8841,
      landmark: 'Middle pedestrian corridor, Shop No. 12, Chappan Dukan',
      addressLine: 'Chappan Dukan, New Palasia, Indore, MP 452001',
      status: VendorStatus.VERIFIED,
      isVerified: true,
      consentObtained: true,
      isPhonePublic: true,
      days: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
      openTime: '11:00',
      closeTime: '23:30',
    },

    // 21. Chai & Beverages - Malwa Mill (Sugarcane Juice)
    {
      name: 'Kailash Ganne Ka Ras (Sugarcane Juice)',
      hindiName: 'कैलाश गन्ने का रस',
      categorySlug: 'chai-beverages',
      areaName: 'Malwa Mill',
      description: '[Stall Type: PUSH_CART] Hygienic fresh sugarcane juice crushed with mint leaves (pudina), fresh ginger, and lemon juice. Served chilled without ice contamination.',
      contactPhone: null,
      whatsappPhone: null,
      latitude: 22.7315,
      longitude: 75.8725,
      landmark: 'Under the shade of Old Kalyan Mill boundary wall, near Patnipura Bridge',
      addressLine: 'Malwa Mill Main Road, Indore, MP 452003',
      status: VendorStatus.VERIFIED,
      isVerified: true,
      consentObtained: true,
      isPhonePublic: false,
      days: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
      openTime: '09:00',
      closeTime: '20:00',
    },

    // 22. Edge Case Test Vendor - Unverified & Approximate Location (Critical for TC-10 & TC-12)
    {
      name: 'Babu Lal Puncture Thela',
      hindiName: 'बाबू लाल पंचर ठेला',
      categorySlug: 'cycle-repair',
      areaName: 'Vijay Nagar',
      description: 'Mobile cycle puncture repair cart. Moves along service lane between Scheme 54 and Scheme 78.',
      stallType: 'PUSH_CART',
      isApproximateLoc: true,
      contactPhone: '+919826999999',
      whatsappPhone: null,
      latitude: 22.7545,
      longitude: 75.895,
      landmark: 'Near Vijay Nagar Ring Road Service Lane, near Scheme 78 turn, moves daily',
      addressLine: 'Ring Road Service Lane, Vijay Nagar, Indore, MP 452010',
      status: VendorStatus.PENDING, // PENDING for TC-10 & TC-12
      isVerified: false,
      consentObtained: true,
      isPhonePublic: false,
      days: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY],
      openTime: '09:00',
      closeTime: '18:00',
    },
  ];

  let verifiedCount = 0;
  let pendingCount = 0;

  for (const vData of vendorSeedData) {
    const categoryId = categoriesMap.get(vData.categorySlug);
    const areaId = areasMap.get(vData.areaName);

    if (!categoryId || !areaId) {
      throw new Error(`Referential failure during seed: Category ${vData.categorySlug} or Area ${vData.areaName} not found`);
    }

    const vendor = await prisma.vendor.create({
      data: {
        name: vData.name,
        hindiName: vData.hindiName,
        description: vData.description,
        contactPhone: vData.contactPhone,
        whatsappPhone: vData.whatsappPhone,
        latitude: vData.latitude,
        longitude: vData.longitude,
        landmark: vData.landmark,
        addressLine: vData.addressLine,
        stallType:
          (vData as any).stallType ||
          (vData.description.includes('SEMI_PERMANENT_KIOSK')
            ? 'SEMI_PERMANENT_KIOSK'
            : vData.description.includes('FOOTPATH_SEAT')
            ? 'FOOTPATH_SEAT'
            : vData.description.includes('ROAMING_THELA')
            ? 'ROAMING_THELA'
            : 'PUSH_CART'),
        isApproximateLoc: !!(vData as any).isApproximateLoc,
        status: vData.status,
        operatingStatus: OperatingStatus.ACTIVE,
        isVerified: vData.isVerified,
        verifiedAt: vData.isVerified ? new Date('2026-10-15T10:00:00.000Z') : null,
        consentObtained: vData.consentObtained,
        isPhonePublic: vData.isPhonePublic,
        categoryId: categoryId,
        areaId: areaId,
        createdById: superAdmin.id,
        verifiedById: vData.isVerified ? superAdmin.id : null,
      },
    });

    if (vData.isVerified) {
      verifiedCount++;
    } else {
      pendingCount++;
    }

    // Seed 7-day operating hours
    const allDays = [
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
      DayOfWeek.SATURDAY,
      DayOfWeek.SUNDAY,
    ];

    const operatingHourEntries = allDays.map((day) => {
      const isOpen = (vData.days as string[]).includes(day);
      return {
        vendorId: vendor.id,
        dayOfWeek: day,
        openTime: isOpen ? vData.openTime : '00:00',
        closeTime: isOpen ? vData.closeTime : '00:00',
        isClosed: !isOpen,
      };
    });

    await prisma.operatingHour.createMany({
      data: operatingHourEntries,
    });

    // Record initial AuditLog entry
    await prisma.auditLog.create({
      data: {
        vendorId: vendor.id,
        adminId: superAdmin.id,
        action: vData.isVerified ? AuditAction.VERIFY : AuditAction.CREATE,
        reason: vData.isVerified
          ? 'Initial Indore civic vendor onboarding and verified registry population.'
          : 'Pending community submission awaiting field inspection verification.',
        snapshot: JSON.stringify({
          name: vendor.name,
          status: vendor.status,
          latitude: vendor.latitude,
          longitude: vendor.longitude,
          landmark: vendor.landmark,
        }),
        ipAddress: '127.0.0.1',
      },
    });
  }

  console.log(`✅ Seeded ${vendorSeedData.length} total vendors (${verifiedCount} Verified, ${pendingCount} Pending).`);
  console.log('✅ Seeded 154 OperatingHour records across all 22 vendors.');
  console.log('✅ Seeded initial AuditLog entries for all vendors.');
  console.log('========================================================================');
  console.log('🎉 GaliGuide Indore Dataset Seeding Complete and Verified!');
  console.log('========================================================================');
}

main()
  .catch((e) => {
    console.error('❌ Seeding pipeline error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
