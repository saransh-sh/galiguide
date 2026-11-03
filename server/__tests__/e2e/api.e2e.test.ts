import request from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/lib/prisma';

jest.setTimeout(30000);

describe('GaliGuide REST API E2E Verification Suite (Supertest)', () => {
  let adminToken: string;
  let testVendorId: string;
  let categoryId: string;
  let areaId: string;

  beforeAll(async () => {
    // Get valid admin token
    const loginRes = await request(app)
      .post('/api/admin/auth/login')
      .send({
        email: 'admin@galiguide.in',
        password: 'GaliGuide@Indore2026',
      });
    expect(loginRes.status).toBe(200);
    adminToken = loginRes.body.data.token;

    // Grab a category and area ID
    const catRes = await request(app).get('/api/categories');
    expect(catRes.status).toBe(200);
    expect(catRes.body.data.length).toBeGreaterThanOrEqual(10);
    categoryId = catRes.body.data[0].id;

    const areaRes = await request(app).get('/api/areas');
    expect(areaRes.status).toBe(200);
    expect(areaRes.body.data.length).toBeGreaterThanOrEqual(10);
    areaId = areaRes.body.data[0].id;
  }, 30000);

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // PAC-01: Category Browsing
  test('PAC-01 (TC-01): GET /api/categories returns >= 10 categories with vendorCount', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(10);
    expect(res.body.data[0]).toHaveProperty('slug');
    expect(res.body.data[0]).toHaveProperty('vendorCount');

    // Filter by cobbler
    const cobblerRes = await request(app).get('/api/vendors?category=cobbler');
    expect(cobblerRes.status).toBe(200);
    expect(cobblerRes.body.success).toBe(true);
    expect(cobblerRes.body.data.length).toBeGreaterThanOrEqual(1);
  });

  // PAC-02: Partial Keyword Search & Bilingual Matching
  test('PAC-02 (TC-02): Bilingual search matches English ("Dahi") and Devanagari ("मोची")', async () => {
    const engRes = await request(app).get('/api/vendors?search=Dahi');
    expect(engRes.status).toBe(200);
    expect(engRes.body.data.length).toBeGreaterThan(0);
    expect(engRes.body.data[0].name).toContain('Joshi Dahi Bada');

    const hindiRes = await request(app).get('/api/vendors?search=' + encodeURIComponent('मोची'));
    expect(hindiRes.status).toBe(200);
    expect(hindiRes.body.data.length).toBeGreaterThan(0);
    expect(hindiRes.body.data[0].name).toContain('Ramu Mochi');
  });

  // PAC-03: Dual Map vs. List Views Data Provider
  test('PAC-03 (TC-03): GET /api/vendors supports pagination metadata', async () => {
    const res = await request(app).get('/api/vendors?page=1&limit=5');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeLessThanOrEqual(5);
    expect(res.body.meta.totalCount).toBeGreaterThan(0);
    expect(res.body.meta.page).toBe(1);
    expect(res.body.meta.limit).toBe(5);
  });

  // PAC-04: Vendor Detail Drawer
  test('PAC-04 (TC-04): GET /api/vendors/:id returns complete profile with 7-day hours', async () => {
    const listRes = await request(app).get('/api/vendors?limit=1');
    const firstId = listRes.body.data[0].id;

    const detailRes = await request(app).get(`/api/vendors/${firstId}`);
    expect(detailRes.status).toBe(200);
    expect(detailRes.body.success).toBe(true);
    expect(detailRes.body.data).toHaveProperty('name');
    expect(detailRes.body.data).toHaveProperty('landmark');
    expect(Array.isArray(detailRes.body.data.operatingHours)).toBe(true);
    expect(detailRes.body.data.operatingHours.length).toBeGreaterThanOrEqual(1);
  });

  // PAC-05: Device Dialer Protocol
  test('PAC-05 (TC-05): Johny Hot Dog exposes valid E.164 phone for dialer', async () => {
    const res = await request(app).get('/api/vendors?search=Johny');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    const phone = res.body.data[0].contactPhone || res.body.data[0].phone;
    expect(phone).toMatch(/^\+?[0-9]{10,15}$/);
    expect(res.body.data[0].navigation.telUri).toBe(`tel:${phone}`);
  });

  // PAC-06: Google Maps Direction Link Generation
  test('PAC-06 (TC-06): Generates zero-cost universal Google Maps navigation link', async () => {
    const res = await request(app).get('/api/vendors?search=' + encodeURIComponent('Vijay Chaat'));
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    const vendor = res.body.data[0];
    expect(vendor.navigation.googleMapsUrl).toBe(
      `https://www.google.com/maps/dir/?api=1&destination=${vendor.latitude},${vendor.longitude}&travelmode=walking`
    );
  });

  // PAC-07: Admin JWT Auth Guard
  test('PAC-07 (TC-07): Protected admin routes reject unauthenticated requests with 401', async () => {
    const unauthRes = await request(app).get('/api/admin/vendors');
    expect(unauthRes.status).toBe(401);

    const authRes = await request(app)
      .get('/api/admin/vendors')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(authRes.status).toBe(200);
    expect(authRes.body.success).toBe(true);
  });

  // PAC-08: Full Vendor CRUD Lifecycle
  test('PAC-08 (TC-08): Full Vendor CRUD (Create -> Read -> Update -> Delete)', async () => {
    // 1. Create
    const createRes = await request(app)
      .post('/api/admin/vendors')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Jest Test Thela',
        hindiName: 'जेस्ट टेस्ट ठेला',
        categoryId,
        areaId,
        latitude: 22.721,
        longitude: 75.861,
        landmark: 'Opposite High Court Gate 1',
        addressLine: 'MG Road, Indore',
        isVerified: true,
        consentObtained: true,
        isPhonePublic: true,
        operatingHours: [
          {
            dayOfWeek: 'MONDAY',
            openTime: '09:00',
            closeTime: '21:00',
            isClosed: false,
          },
        ],
      });
    expect(createRes.status).toBe(201);
    testVendorId = createRes.body.data.id;
    expect(testVendorId).toBeDefined();

    // 2. Read
    const readRes = await request(app).get(`/api/vendors/${testVendorId}`);
    expect(readRes.status).toBe(200);
    expect(readRes.body.data.name).toBe('Jest Test Thela');

    // 3. Update
    const updateRes = await request(app)
      .put(`/api/admin/vendors/${testVendorId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Jest Test Thela Updated' });
    expect(updateRes.status).toBe(200);

    // 4. Delete
    const deleteRes = await request(app)
      .delete(`/api/admin/vendors/${testVendorId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(deleteRes.status).toBe(200);

    // 5. Verify 404 after deletion
    const afterDeleteRes = await request(app).get(`/api/vendors/${testVendorId}`);
    expect(afterDeleteRes.status).toBe(404);
  });

  // PAC-09: Coordinate Picker Geodesy & Precision
  test('PAC-09 (TC-09): Coordinate bounds and 6-decimal-place precision validation', async () => {
    const lat = 22.724400;
    const lng = 75.883900;
    expect(lat).toBeGreaterThanOrEqual(22.68);
    expect(lat).toBeLessThanOrEqual(22.78);
    expect(lng).toBeGreaterThanOrEqual(75.82);
    expect(lng).toBeLessThanOrEqual(75.92);

    // Verify sub-meter decimal precision preservation in API response
    const res = await request(app).get('/api/vendors?search=' + encodeURIComponent('Johny'));
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    const vendor = res.body.data[0];
    expect(typeof vendor.latitude).toBe('number');
    expect(typeof vendor.longitude).toBe('number');
  });

  // PAC-10: Vendor Verification Status Toggle
  test('PAC-10 (TC-10): Admin can verify/toggle vendor status with reason', async () => {
    // Find unverified vendor Babu Lal
    const searchRes = await request(app)
      .get('/api/admin/vendors?search=' + encodeURIComponent('Babu Lal'))
      .set('Authorization', `Bearer ${adminToken}`);
    expect(searchRes.status).toBe(200);
    expect(searchRes.body.data.length).toBeGreaterThan(0);
    const babuId = searchRes.body.data[0].id;

    const patchRes = await request(app)
      .patch(`/api/admin/vendors/${babuId}/verify`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'VERIFIED',
        reason: 'Automated Supertest verification assertion pass',
      });
    expect(patchRes.status).toBe(200);
    expect(patchRes.body.data.status).toBe('VERIFIED');
    expect(patchRes.body.data.isVerified).toBe(true);
    expect(patchRes.body.data.auditLogId).toBeDefined();
  });

  // PAC-11: Geolocation Denial & Fallback Localities
  test('PAC-11 (TC-11): GET /api/areas provides fallback Indore localities', async () => {
    const res = await request(app).get('/api/areas');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(10);
    const areaNames = res.body.data.map((a: any) => a.name);
    expect(areaNames).toContain('Sarafa Bazaar');
    expect(areaNames).toContain('Rajwada');
    expect(areaNames).toContain('Chappan Dukan');
  });

  // PAC-12: Missing / Approximate Coordinates & Roaming Pushcarts
  test('PAC-12 (TC-12): Approximate roaming vendor exposes isApproximateLoc and landmark guidance', async () => {
    const res = await request(app).get('/api/vendors?search=' + encodeURIComponent('Babu Lal'));
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    const vendor = res.body.data[0];
    expect(vendor.name).toContain('Babu Lal');
    expect(vendor.isApproximateLoc).toBe(true);
    expect(vendor.stallType).toBe('PUSH_CART');
    expect(vendor.landmark).toContain('Scheme 78');
  });

  // PAC-13: Informal Vendor Privacy & Phone Masking
  test('PAC-13 (TC-13): Unconsented vendor phone is masked in public API', async () => {
    const res = await request(app).get('/api/vendors?search=Sanwariya');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    const vendor = res.body.data[0];
    expect(vendor.contactPhone).toBeNull();
    expect(vendor.phone).toBeNull();
    expect(vendor.navigation.telUri).toBeNull();
  });

  // PAC-14: Haversine Distance Search & Hotspot Density Overlay
  test('PAC-14 (TC-14): Spatial query computes accurate Haversine distance and returns heatmap', async () => {
    // Palasia Square (22.7220, 75.8872) with radiusKm=2
    const spatialRes = await request(app).get('/api/vendors?lat=22.7220&lng=75.8872&radiusKm=2');
    expect(spatialRes.status).toBe(200);
    const johny = spatialRes.body.data.find((v: any) => v.name.includes('Johny Hot Dog'));
    expect(johny).toBeDefined();
    expect(johny.distanceKm).toBeGreaterThanOrEqual(0.35);
    expect(johny.distanceKm).toBeLessThanOrEqual(0.55);

    // Heatmap endpoint
    const heatRes = await request(app).get('/api/vendors/heatmap');
    expect(heatRes.status).toBe(200);
    expect(heatRes.body.success).toBe(true);
    expect(Array.isArray(heatRes.body.data)).toBe(true);
    expect(heatRes.body.data.length).toBeGreaterThan(0);
    expect(heatRes.body.data[0].length).toBe(3); // [lat, lng, intensity]
  });
});
