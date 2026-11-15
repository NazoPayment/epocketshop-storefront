import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {
  evaluateClientShopStatus,
  formatTodayHoursSummary,
  formatWeeklySchedule,
} from './hours';
import type {BusinessDetails, OperatingHours} from './types';

function makeHours(overrides?: Partial<OperatingHours>): OperatingHours {
  return {
    enabled: true,
    days: {
      mon: {closed: false, open: '09:00', close: '17:00'},
      tue: {closed: false, open: '09:00', close: '17:00'},
      wed: {closed: false, open: '09:00', close: '17:00'},
      thu: {closed: false, open: '09:00', close: '17:00'},
      fri: {closed: false, open: '18:00', close: '02:00'},
      sat: {closed: true, open: '09:00', close: '17:00'},
      sun: {closed: true, open: '09:00', close: '17:00'},
    },
    ...overrides,
  };
}

function makeBusiness(hours?: OperatingHours | null): BusinessDetails {
  return {
    business_name: 'Kasi Kitchen',
    name: 'Kasi Kitchen',
    currency: 'ZAR',
    timezone: 'Africa/Johannesburg',
    operating_hours: hours ?? null,
  };
}

describe('evaluateClientShopStatus', () => {
  it('treats missing or disabled operating hours as always open', () => {
    const noHours = evaluateClientShopStatus(makeBusiness(null), new Date('2026-11-16T01:00:00Z'));
    assert.equal(noHours.enabled, false);
    assert.equal(noHours.isOpen, true);

    const disabled = evaluateClientShopStatus(
      makeBusiness(makeHours({enabled: false})),
      new Date('2026-11-16T01:00:00Z'),
    );
    assert.equal(disabled.enabled, false);
    assert.equal(disabled.isOpen, true);
  });

  it('respects Africa/Johannesburg (UTC+2) open and closed windows', () => {
    const biz = makeBusiness(makeHours());
    // Monday 2026-11-16 09:30 SAST = 07:30Z -> Open
    const duringShift = evaluateClientShopStatus(biz, new Date('2026-11-16T07:30:00Z'));
    assert.equal(duringShift.currentDay, 'mon');
    assert.equal(duringShift.isOpen, true);
    assert.equal(formatTodayHoursSummary(duringShift), 'Hours today: 09:00 – 17:00');

    // Monday 2026-11-16 08:30 SAST = 06:30Z -> Closed, reopens today at 09:00
    const beforeOpen = evaluateClientShopStatus(biz, new Date('2026-11-16T06:30:00Z'));
    assert.equal(beforeOpen.isOpen, false);
    assert.equal(beforeOpen.nextOpenLabel, 'Today at 09:00');
    assert.match(beforeOpen.closedMessage ?? '', /today at 09:00/);

    // Monday 2026-11-16 17:30 SAST = 15:30Z -> Closed, reopens tomorrow at 09:00
    const afterClose = evaluateClientShopStatus(biz, new Date('2026-11-16T15:30:00Z'));
    assert.equal(afterClose.isOpen, false);
    assert.equal(afterClose.nextOpenLabel, 'Tomorrow at 09:00');
  });

  it('supports overnight shifts crossing midnight into Saturday', () => {
    const biz = makeBusiness(makeHours());
    // Saturday 2026-11-21 01:15 SAST = Friday 2026-11-20 23:15Z -> still open from Friday 18:00-02:00
    const spillover = evaluateClientShopStatus(biz, new Date('2026-11-20T23:15:00Z'));
    assert.equal(spillover.currentDay, 'sat');
    assert.equal(spillover.isOpen, true);

    // Saturday 2026-11-21 02:05 SAST = 00:05Z -> closed; skips closed Sat/Sun -> Monday at 09:00
    const closedAfterSpillover = evaluateClientShopStatus(biz, new Date('2026-11-21T00:05:00Z'));
    assert.equal(closedAfterSpillover.isOpen, false);
    assert.equal(closedAfterSpillover.nextOpenLabel, 'Monday at 09:00');
  });
});

describe('formatWeeklySchedule', () => {
  it('formats all 7 days cleanly including overnight indicator', () => {
    const rows = formatWeeklySchedule(makeHours());
    assert.equal(rows.length, 7);
    assert.deepEqual(rows[0], {
      key: 'mon',
      dayName: 'Monday',
      label: '09:00 – 17:00',
      isClosed: false,
    });
    assert.deepEqual(rows[4], {
      key: 'fri',
      dayName: 'Friday',
      label: '18:00 – 02:00 (next day)',
      isClosed: false,
    });
    assert.deepEqual(rows[6], {
      key: 'sun',
      dayName: 'Sunday',
      label: 'Closed',
      isClosed: true,
    });
  });
});
