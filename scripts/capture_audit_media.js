const path = require('path');
const fs = require('fs');

// Load playwright from verified path in explorer_survey_3
const playwrightPath = 'C:/Users/saransh/.gemini/antigravity/scratch/teamwork/78cdabac-b1bf-4220-bef5-7e37b83f0ac2/.agents/teamwork/explorer_survey_3/node_modules/playwright';
const { chromium } = require(playwrightPath);

async function runMediaCapture() {
  console.log('--- Starting GaliGuide Media Capture Automation ---');

  const rootDir = path.resolve(__dirname, '..');
  const artifactsDir = path.join(rootDir, 'audit_artifacts');
  const screenshotsDir = path.join(artifactsDir, 'screenshots');
  const recordingsDir = path.join(artifactsDir, 'recordings');
  const videosDir = path.join(artifactsDir, 'videos');
  const tempVideoDir = path.join(artifactsDir, '_temp_video');

  // Clean old temp video folder
  if (fs.existsSync(tempVideoDir)) {
    fs.readdirSync(tempVideoDir).forEach(f => fs.unlinkSync(path.join(tempVideoDir, f)));
  }

  [screenshotsDir, recordingsDir, videosDir, tempVideoDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  console.log('Launching Chrome via Playwright...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: tempVideoDir,
      size: { width: 1280, height: 720 },
    },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 GaliGuideAudit/1.0',
  });

  const page = await context.newPage();
  const targetUrl = 'https://galiguide-saranshlab.vercel.app';

  console.log(`Navigating to ${targetUrl}...`);
  await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);

  // 1. Landing Hero View (Explore Tab)
  console.log('1. Capturing: 01_landing_hero.png...');
  const exploreTabBtn = page.locator('nav button:has-text("Explore")').first();
  if (await exploreTabBtn.isVisible()) {
    await exploreTabBtn.click();
    await page.waitForTimeout(1500);
  }
  await page.screenshot({
    path: path.join(screenshotsDir, '01_landing_hero.png'),
    fullPage: false,
  });

  // 2. Categories Bento Grid
  console.log('2. Capturing: 08_categories_bento_grid.png...');
  await page.evaluate(() => window.scrollTo({ top: 620, behavior: 'smooth' }));
  await page.waitForTimeout(1500);
  await page.screenshot({
    path: path.join(screenshotsDir, '08_categories_bento_grid.png'),
    fullPage: false,
  });

  // 3. Switch to City Map View
  console.log('3. Capturing: 02_vendor_discovery_map.png...');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  const cityMapTabBtn = page.locator('nav button:has-text("City Map")').first();
  if (await cityMapTabBtn.isVisible()) {
    await cityMapTabBtn.click();
  } else {
    const discoverBtn = page.locator('button:has-text("Discover Vendors")').first();
    if (await discoverBtn.isVisible()) await discoverBtn.click();
  }
  await page.waitForTimeout(3000); // Allow OSM tiles and marker cluster to settle
  await page.screenshot({
    path: path.join(screenshotsDir, '02_vendor_discovery_map.png'),
    fullPage: false,
  });

  // 4. Category Filter Active
  console.log('4. Capturing: 04_category_filter.png...');
  const categoryPill = page.locator('[id^="pill-category-"]').nth(1);
  if (await categoryPill.isVisible()) {
    await categoryPill.click();
    await page.waitForTimeout(1500);
  }
  await page.screenshot({
    path: path.join(screenshotsDir, '04_category_filter.png'),
    fullPage: false,
  });

  // Reset category filter to All
  const allCategoryPill = page.locator('#pill-category-all');
  if (await allCategoryPill.isVisible()) {
    await Promise.all([
      page.waitForResponse(res => res.url().includes('/api/vendors') && !res.url().includes('category=') && res.status() === 200).catch(() => {}),
      allCategoryPill.click(),
    ]);
    await page.waitForTimeout(1500);
  }

  // 5. Bilingual Search Filter
  console.log('5. Capturing: 03_bilingual_search.png...');
  const searchInput = page.locator('#search-input');
  await searchInput.focus();
  // Fill 'Joshi' (Sarafa Bazaar, <300m from Rajwada) and wait for the API response
  await Promise.all([
    page.waitForResponse(res => res.url().includes('search=Joshi') && res.status() === 200),
    searchInput.fill('Joshi'),
  ]);
  // Wait explicitly for "1 Street Vendor Found" and the specific card to be rendered
  await page.locator('text=1 Street Vendor Found').first().waitFor({ state: 'visible', timeout: 10000 });
  const vendorCard = page.locator('[data-testid="vendor-card"]').first();
  await vendorCard.waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('text=Joshi Dahi Bada House').first().waitFor({ state: 'visible', timeout: 10000 });
  await page.waitForTimeout(1500); // Allow marker highlight and card styles to settle
  await page.screenshot({
    path: path.join(screenshotsDir, '03_bilingual_search.png'),
    fullPage: false,
  });

  // 6. Vendor Detail Drawer
  console.log('6. Capturing: 05_vendor_detail_drawer.png...');
  await vendorCard.click();
  // Wait for the slide-over drawer and the universal navigation button to become visible
  const drawer = page.locator('#vendor-detail-drawer, [data-testid="vendor-detail-drawer"]').first();
  await drawer.waitFor({ state: 'visible', timeout: 10000 });
  const directionsBtn = page.locator('#btn-get-directions, [data-testid="btn-get-directions"]').first();
  await directionsBtn.waitFor({ state: 'visible', timeout: 8000 });
  await drawer.locator('text=Joshi Dahi Bada House').first().waitFor({ state: 'visible', timeout: 5000 });
  await page.waitForTimeout(2000); // Allow slide-over animation and weekly schedule table to settle

  await page.screenshot({
    path: path.join(screenshotsDir, '05_vendor_detail_drawer.png'),
    fullPage: false,
  });

  // Hold drawer open in video and scroll to reveal 7-day weekly operating hours table
  console.log('Displaying vendor detail drawer & weekly schedule in video walkthrough...');
  await page.waitForTimeout(1500);
  const drawerScrollable = page.locator('#vendor-detail-drawer > div.overflow-y-auto').first();
  if (await drawerScrollable.isVisible()) {
    await drawerScrollable.evaluate(el => el.scrollTo({ top: 380, behavior: 'smooth' }));
    await page.waitForTimeout(2000);
    await drawerScrollable.evaluate(el => el.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(1000);
  } else {
    await page.waitForTimeout(3000);
  }

  // Close drawer
  const closeDrawerBtn = page.locator('#btn-close-drawer, [data-testid="btn-close-drawer"]').first();
  if (await closeDrawerBtn.isVisible()) {
    await closeDrawerBtn.click();
  } else {
    await page.keyboard.press('Escape');
  }
  await drawer.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(1000);

  // Clear search input and wait for all vendors to reappear
  await searchInput.fill('');
  await page.waitForResponse(res => res.url().includes('/api/vendors') && !res.url().includes('search=') && res.status() === 200).catch(() => {});
  await page.waitForTimeout(1500);

  // 7. Density Heatmap Overlay
  console.log('7. Capturing: 06_density_heatmap.png...');
  const heatmapBtn = page.locator('button:has-text("Heatmap")').first();
  if (await heatmapBtn.isVisible()) {
    await heatmapBtn.click();
    await page.waitForTimeout(2500); // Allow Leaflet.heat canvas to draw
    await page.screenshot({
      path: path.join(screenshotsDir, '06_density_heatmap.png'),
      fullPage: false,
    });
    // Turn heatmap off
    await heatmapBtn.click();
    await page.waitForTimeout(800);
  }

  // 8. Admin Portal & Coordinate Picker
  console.log('8. Capturing: 07_admin_portal_picker.png...');
  const adminBtn = page.locator('button:has-text("Admin Portal"), button:has-text("Admin Active")').first();
  await adminBtn.click();
  await page.waitForTimeout(1200);

  // Check if we need to log in
  const superAdminBtn = page.locator('button:has-text("Super Admin")').first();
  if (await superAdminBtn.isVisible()) {
    await superAdminBtn.click();
    await page.waitForTimeout(500);
    const signInBtn = page.locator('button:has-text("Sign In as Administrator")').first();
    await signInBtn.click();
    await page.waitForTimeout(2000);
  }

  // Click Onboard New Vendor to trigger Coordinate Picker Leaflet Map
  const onboardBtn = page.locator('button:has-text("Onboard New Vendor")').first();
  if (await onboardBtn.isVisible()) {
    await onboardBtn.click();
    await page.waitForTimeout(2500); // Allow coordinate picker Leaflet map to initialize
    await page.screenshot({
      path: path.join(screenshotsDir, '07_admin_portal_picker.png'),
      fullPage: false,
    });

    // Close onboard modal via Cancel button
    const cancelBtn = page.locator('button:has-text("Cancel")').first();
    if (await cancelBtn.isVisible()) {
      await cancelBtn.click();
      await page.waitForTimeout(800);
    }
  }

  // Close Admin Modal via the X button in its top right
  const closeAdminBtn = page.locator('div.fixed.inset-0.z-50 button:has(svg.lucide-x)').first();
  if (await closeAdminBtn.isVisible()) {
    await closeAdminBtn.click();
    await page.waitForTimeout(1000);
  }

  // 9. About Indore Heritage Modal
  console.log('9. Capturing: 09_about_heritage_modal.png...');
  const aboutBtn = page.locator('nav button:has-text("About Indore")').first();
  if (await aboutBtn.isVisible()) {
    await aboutBtn.click();
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: path.join(screenshotsDir, '09_about_heritage_modal.png'),
      fullPage: false,
    });
    // Close About Modal via its X button
    const closeAboutBtn = page.locator('div.fixed.inset-0.z-50 button:has(svg.lucide-x)').first();
    if (await closeAboutBtn.isVisible()) {
      await closeAboutBtn.click();
      await page.waitForTimeout(800);
    }
  }

  // Settle time for video recording
  console.log('Finalizing video recording (waiting 3 seconds)...');
  await page.waitForTimeout(3000);

  // Close context to flush video to disk
  await context.close();
  await browser.close();

  // Move and rename video file
  const videoFiles = fs.readdirSync(tempVideoDir).filter(f => f.endsWith('.webm'));
  if (videoFiles.length > 0) {
    const rawVideoPath = path.join(tempVideoDir, videoFiles[0]);
    const finalRecordingPath = path.join(recordingsDir, 'galiguide_walkthrough.webm');
    const finalVideoPath = path.join(videosDir, 'galiguide_walkthrough.webm');

    fs.copyFileSync(rawVideoPath, finalRecordingPath);
    fs.copyFileSync(rawVideoPath, finalVideoPath);
    const stat = fs.statSync(finalRecordingPath);
    console.log(`Video saved to: ${finalRecordingPath} (${stat.size} bytes)`);

    // Clean up temp
    fs.unlinkSync(rawVideoPath);
    try { fs.rmdirSync(tempVideoDir); } catch (e) {}
  } else {
    console.warn('Warning: No video file found in temp dir.');
  }

  console.log('--- Media Capture Complete ---');
}

runMediaCapture().catch(err => {
  console.error('Fatal error during media capture:', err);
  process.exit(1);
});
