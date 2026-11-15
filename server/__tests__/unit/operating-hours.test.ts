import {
  evaluateOperatingHours,
  getKolkataTime,
  getPreviousDay,
  getNextDay,
  ScheduleItem,
} from '../../src/lib/operating-hours';
import { DayOfWeek } from '../../src/types/enums';

describe('Operating Hours & IST Timezone Engine', () => {
  describe('getKolkataTime (Timezone Resolution)', () => {
    test('correctly converts UTC date to Asia/Kolkata day and time', () => {
      // 2026-11-15 18:30:00 UTC = 2026-11-16 00:00:00 IST (Monday midnight)
      const utcDate = new Date('2026-11-15T18:30:00.000Z');
      const time = getKolkataTime(utcDate);

      expect(time.dayOfWeek).toBe(DayOfWeek.MONDAY);
      expect(time.hours).toBe(0);
      expect(time.minutes).toBe(0);
      expect(time.currentMinutes).toBe(0);
    });

    test('correctly resolves midday IST when UTC is morning', () => {
      // 2026-11-16 08:45:00 UTC = 2026-11-16 14:15:00 IST (Monday 2:15 PM)
      const utcDate = new Date('2026-11-16T08:45:00.000Z');
      const time = getKolkataTime(utcDate);

      expect(time.dayOfWeek).toBe(DayOfWeek.MONDAY);
      expect(time.hours).toBe(14);
      expect(time.minutes).toBe(15);
      expect(time.currentMinutes).toBe(14 * 60 + 15);
    });
  });

  describe('Day helpers', () => {
    test('getPreviousDay rolls back correctly across week boundary', () => {
      expect(getPreviousDay(DayOfWeek.MONDAY)).toBe(DayOfWeek.SUNDAY);
      expect(getPreviousDay(DayOfWeek.SUNDAY)).toBe(DayOfWeek.SATURDAY);
      expect(getPreviousDay(DayOfWeek.TUESDAY)).toBe(DayOfWeek.MONDAY);
    });

    test('getNextDay advances correctly across week boundary', () => {
      expect(getNextDay(DayOfWeek.SATURDAY)).toBe(DayOfWeek.SUNDAY);
      expect(getNextDay(DayOfWeek.SUNDAY)).toBe(DayOfWeek.MONDAY);
      expect(getNextDay(DayOfWeek.FRIDAY)).toBe(DayOfWeek.SATURDAY);
    });
  });

  describe('evaluateOperatingHours', () => {
    const standardWeekSchedule: ScheduleItem[] = [
      { dayOfWeek: DayOfWeek.MONDAY, openTime: '10:00', closeTime: '22:00', isClosed: false },
      { dayOfWeek: DayOfWeek.TUESDAY, openTime: '10:00', closeTime: '22:00', isClosed: false },
      { dayOfWeek: DayOfWeek.WEDNESDAY, openTime: '10:00', closeTime: '22:00', isClosed: false },
      { dayOfWeek: DayOfWeek.THURSDAY, openTime: '10:00', closeTime: '22:00', isClosed: false },
      { dayOfWeek: DayOfWeek.FRIDAY, openTime: '10:00', closeTime: '22:00', isClosed: false },
      { dayOfWeek: DayOfWeek.SATURDAY, openTime: '10:00', closeTime: '22:00', isClosed: false },
      { dayOfWeek: DayOfWeek.SUNDAY, openTime: '10:00', closeTime: '20:00', isClosed: true }, // Closed Sunday
    ];

    test('returns null for empty or missing schedule', () => {
      expect(evaluateOperatingHours([])).toBeNull();
      expect(evaluateOperatingHours(null as any)).toBeNull();
    });

    test('evaluates open during standard daytime hours', () => {
      // Monday 14:00 IST (UTC: Monday 08:30)
      const refDate = new Date('2026-11-16T08:30:00.000Z');
      const result = evaluateOperatingHours(standardWeekSchedule, refDate);

      expect(result).not.toBeNull();
      expect(result?.isOpenNow).toBe(true);
      expect(result?.dayOfWeek).toBe(DayOfWeek.MONDAY);
      expect(result?.openTime).toBe('10:00');
      expect(result?.closeTime).toBe('22:00');
      expect(result?.statusText).toContain('Open Now');
    });

    test('evaluates closed before opening time during daytime shift', () => {
      // Monday 08:30 IST (UTC: Monday 03:00)
      const refDate = new Date('2026-11-16T03:00:00.000Z');
      const result = evaluateOperatingHours(standardWeekSchedule, refDate);

      expect(result).not.toBeNull();
      expect(result?.isOpenNow).toBe(false);
      expect(result?.statusText).toContain('Opens today at 10:00');
    });

    test('evaluates closed after closing time during daytime shift', () => {
      // Monday 22:30 IST (UTC: Monday 17:00)
      const refDate = new Date('2026-11-16T17:00:00.000Z');
      const result = evaluateOperatingHours(standardWeekSchedule, refDate);

      expect(result).not.toBeNull();
      expect(result?.isOpenNow).toBe(false);
      expect(result?.statusText).toContain('Closed');
    });

    test('evaluates closed on a marked closed day', () => {
      // Sunday 12:00 IST (UTC: Sunday 06:30)
      const refDate = new Date('2026-11-15T06:30:00.000Z');
      const result = evaluateOperatingHours(standardWeekSchedule, refDate);

      expect(result).not.toBeNull();
      expect(result?.isOpenNow).toBe(false);
      expect(result?.isClosed).toBe(true);
      expect(result?.statusText).toContain('Closed Today');
      expect(result?.nextOpeningTime).toBe('MONDAY 10:00');
    });

    test('evaluates boundary times (exact opening and closing)', () => {
      // Exact opening: Monday 10:00 IST (UTC: Monday 04:30)
      const openEdge = new Date('2026-11-16T04:30:00.000Z');
      const openResult = evaluateOperatingHours(standardWeekSchedule, openEdge);
      expect(openResult?.isOpenNow).toBe(true);

      // Exact closing: Monday 22:00 IST (UTC: Monday 16:30)
      const closeEdge = new Date('2026-11-16T16:30:00.000Z');
      const closeResult = evaluateOperatingHours(standardWeekSchedule, closeEdge);
      expect(closeResult?.isOpenNow).toBe(true);
    });

    // -------------------------------------------------------------------------
    // CRITICAL REQUIREMENT: Sarafa Night Bazaar Overnight Rollover Evaluation
    // -------------------------------------------------------------------------
    describe('Sarafa Late Night / Overnight Rollover Shifts', () => {
      const sarafaNightSchedule: ScheduleItem[] = [
        { dayOfWeek: DayOfWeek.SUNDAY, openTime: '18:00', closeTime: '01:30', isClosed: false },
        { dayOfWeek: DayOfWeek.MONDAY, openTime: '18:00', closeTime: '01:30', isClosed: false },
        { dayOfWeek: DayOfWeek.TUESDAY, openTime: '18:00', closeTime: '01:30', isClosed: false },
        { dayOfWeek: DayOfWeek.WEDNESDAY, openTime: '18:00', closeTime: '01:30', isClosed: false },
        { dayOfWeek: DayOfWeek.THURSDAY, openTime: '18:00', closeTime: '01:30', isClosed: false },
        { dayOfWeek: DayOfWeek.FRIDAY, openTime: '18:00', closeTime: '02:00', isClosed: false },
        { dayOfWeek: DayOfWeek.SATURDAY, openTime: '18:00', closeTime: '02:30', isClosed: false },
      ];

      test('is OPEN on Sunday night before midnight (Sunday 21:00 IST)', () => {
        // Sunday 21:00 IST (UTC: Sunday 15:30)
        const refDate = new Date('2026-11-15T15:30:00.000Z');
        const result = evaluateOperatingHours(sarafaNightSchedule, refDate);

        expect(result).not.toBeNull();
        expect(result?.isOpenNow).toBe(true);
        expect(result?.dayOfWeek).toBe(DayOfWeek.SUNDAY);
        expect(result?.closeTime).toBe('01:30');
      });

      test('is OPEN on Monday morning after midnight (Monday 00:30 IST) from Sunday overnight shift', () => {
        // Monday 00:30 IST (UTC: Sunday 19:00)
        // This is Monday in India, but Sunday evening shift runs until 01:30 AM
        const refDate = new Date('2026-11-15T19:00:00.000Z');
        const result = evaluateOperatingHours(sarafaNightSchedule, refDate);

        expect(result).not.toBeNull();
        expect(result?.isOpenNow).toBe(true);
        // Active shift originated from Sunday
        expect(result?.dayOfWeek).toBe(DayOfWeek.SUNDAY);
        expect(result?.closeTime).toBe('01:30');
        expect(result?.statusText).toContain('Open Now • Closes at 01:30');
      });

      test('is CLOSED on Monday morning after overnight shift ends (Monday 02:00 IST)', () => {
        // Monday 02:00 IST (UTC: Sunday 20:30)
        const refDate = new Date('2026-11-15T20:30:00.000Z');
        const result = evaluateOperatingHours(sarafaNightSchedule, refDate);

        expect(result).not.toBeNull();
        expect(result?.isOpenNow).toBe(false);
        expect(result?.dayOfWeek).toBe(DayOfWeek.MONDAY);
        expect(result?.statusText).toContain('Opens today at 18:00');
      });

      test('is OPEN on Monday 00:30 IST even if Monday daytime is marked closed', () => {
        const closedMondayWithSundayNight: ScheduleItem[] = [
          { dayOfWeek: DayOfWeek.SUNDAY, openTime: '18:00', closeTime: '01:30', isClosed: false },
          { dayOfWeek: DayOfWeek.MONDAY, openTime: '18:00', closeTime: '01:30', isClosed: true }, // Monday closed!
        ];

        // Monday 00:30 IST (UTC: Sunday 19:00)
        const refDate = new Date('2026-11-15T19:00:00.000Z');
        const result = evaluateOperatingHours(closedMondayWithSundayNight, refDate);

        expect(result).not.toBeNull();
        expect(result?.isOpenNow).toBe(true);
        expect(result?.dayOfWeek).toBe(DayOfWeek.SUNDAY);
      });
    });
  });
});
