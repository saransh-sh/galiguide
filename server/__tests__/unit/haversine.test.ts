import { calculateHaversineDistanceKm, getBoundingBox, formatDistance } from '../../src/lib/haversine';

describe('Spatial Geodesy Unit Tests (Haversine Formula)', () => {
  test('TC-T1-F16-01: Palasia Square to Johny Hot Dog (Chappan Dukan)', () => {
    // Palasia Square: (22.7220, 75.8872)
    // Johny Hot Dog: (22.7244, 75.8839)
    const dist = calculateHaversineDistanceKm(22.722, 75.8872, 22.7244, 75.8839);
    // Expected distance is approximately 0.43 km
    expect(dist).toBeGreaterThanOrEqual(0.35);
    expect(dist).toBeLessThanOrEqual(0.55);
  });

  test('TC-T1-F16-02: Zero distance between identical coordinates', () => {
    const dist = calculateHaversineDistanceKm(22.7196, 75.8577, 22.7196, 75.8577);
    expect(dist).toBe(0);
  });

  test('TC-T1-F16-03: Sarafa Bazaar to Rajwada Palace', () => {
    // Sarafa: 22.7196, 75.8577
    // Rajwada: 22.7186, 75.8552
    const dist = calculateHaversineDistanceKm(22.7196, 75.8577, 22.7186, 75.8552);
    // Distance should be ~0.28 km (< 500m)
    expect(dist).toBeGreaterThan(0.1);
    expect(dist).toBeLessThan(0.6);
  });

  test('Bounding box deltas calculation', () => {
    const bbox = getBoundingBox(22.7244, 75.8839, 2.0);
    expect(bbox.minLat).toBeLessThan(22.7244);
    expect(bbox.maxLat).toBeGreaterThan(22.7244);
    expect(bbox.minLng).toBeLessThan(75.8839);
    expect(bbox.maxLng).toBeGreaterThan(75.8839);
  });

  test('Format distance helper', () => {
    expect(formatDistance(0.02)).toBe('Right here (< 50m)');
    expect(formatDistance(0.43)).toBe('430 m away');
    expect(formatDistance(2.45)).toBe('2.5 km away');
  });
});
