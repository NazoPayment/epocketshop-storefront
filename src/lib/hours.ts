import type {BusinessDetails, DayHours, DayKey, OperatingHours} from './types';

export const DEFAULT_TIMEZONE = 'Africa/Johannesburg';

export const DAYS_ORDER: readonly DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export const DAY_NAMES: Record<DayKey, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

const WEEKDAY_TO_INDEX: Record<string, number> = {
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thu: 3,
  Fri: 4,
  Sat: 5,
  Sun: 6,
};

export interface ClientShopStatus {
  enabled: boolean;
  isOpen: boolean;
  timezone: string;
  currentDay: DayKey;
  todayHours: DayHours | null;
  nextOpenLabel: string | null;
  closedMessage: string | null;
}

function hhmmToMinutes(value: string): number {
  const [hStr, mStr] = value.split(':');
  return Number(hStr) * 60 + Number(mStr);
}

function getLocalDayAndMinutes(
  timeZone: string,
  now: Date,
): {weekdayIdx: number; minutes: number} {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      hourCycle: 'h23',
    });
    const parts = formatter.formatToParts(now);
    const weekdayPart = parts.find((p) => p.type === 'weekday')?.value ?? 'Mon';
    const rawHour = Number(parts.find((p) => p.type === 'hour')?.value ?? '0');
    const hour = rawHour === 24 ? 0 : rawHour;
    const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? '0');
    const weekdayIdx = WEEKDAY_TO_INDEX[weekdayPart] ?? 0;
    return {weekdayIdx, minutes: hour * 60 + minute};
  } catch {
    const jsDay = now.getDay();
    const weekdayIdx = jsDay === 0 ? 6 : jsDay - 1;
    return {weekdayIdx, minutes: now.getHours() * 60 + now.getMinutes()};
  }
}

export function evaluateClientShopStatus(
  business?: BusinessDetails | null,
  now: Date = new Date(),
): ClientShopStatus {
  const timezone = business?.timezone || business?.shop_status?.timezone || DEFAULT_TIMEZONE;
  const {weekdayIdx, minutes} = getLocalDayAndMinutes(timezone, now);
  const currentDay = DAYS_ORDER[weekdayIdx];
  const hours = business?.operating_hours;

  if (!hours) {
    const serverStatus = business?.shop_status;
    if (serverStatus) {
      return {
        enabled: Boolean(serverStatus.enabled),
        isOpen: serverStatus.is_open !== false,
        timezone: serverStatus.timezone || timezone,
        currentDay: (serverStatus.current_day as DayKey) || currentDay,
        todayHours: serverStatus.today_hours || null,
        nextOpenLabel: serverStatus.next_open_label || null,
        closedMessage: serverStatus.closed_message || null,
      };
    }
    return {
      enabled: false,
      isOpen: true,
      timezone,
      currentDay,
      todayHours: null,
      nextOpenLabel: null,
      closedMessage: null,
    };
  }

  if (!hours.enabled) {
    return {
      enabled: false,
      isOpen: true,
      timezone,
      currentDay,
      todayHours: null,
      nextOpenLabel: null,
      closedMessage: null,
    };
  }

  const todayHours = hours.days?.[currentDay] ?? null;
  let isOpen = false;

  if (todayHours && !todayHours.closed) {
    const openMin = hhmmToMinutes(todayHours.open);
    const closeMin = hhmmToMinutes(todayHours.close);
    if (openMin < closeMin) {
      isOpen = minutes >= openMin && minutes < closeMin;
    } else if (closeMin < openMin) {
      isOpen = minutes >= openMin;
    }
  }

  if (!isOpen) {
    const prevKey = DAYS_ORDER[(weekdayIdx + 6) % 7];
    const prevHours = hours.days?.[prevKey];
    if (prevHours && !prevHours.closed) {
      const prevOpenMin = hhmmToMinutes(prevHours.open);
      const prevCloseMin = hhmmToMinutes(prevHours.close);
      if (prevCloseMin < prevOpenMin && minutes < prevCloseMin) {
        isOpen = true;
      }
    }
  }

  let nextOpenLabel: string | null = null;
  if (!isOpen) {
    for (let offset = 0; offset <= 7; offset += 1) {
      const candIdx = (weekdayIdx + offset) % 7;
      const candKey = DAYS_ORDER[candIdx];
      const cand = hours.days?.[candKey];
      if (!cand || cand.closed) continue;
      const candOpenMin = hhmmToMinutes(cand.open);
      if (offset === 0 && candOpenMin <= minutes) continue;
      if (offset === 0) nextOpenLabel = `Today at ${cand.open}`;
      else if (offset === 1) nextOpenLabel = `Tomorrow at ${cand.open}`;
      else nextOpenLabel = `${DAY_NAMES[candKey]} at ${cand.open}`;
      break;
    }
  }

  let closedMessage: string | null = null;
  if (!isOpen) {
    const shopName = business?.business_name?.trim() || 'This shop';
    if (nextOpenLabel) {
      const lowered = nextOpenLabel.charAt(0).toLowerCase() + nextOpenLabel.slice(1);
      closedMessage = `${shopName} is currently closed. Orders will reopen ${lowered}.`;
    } else {
      closedMessage = `${shopName} is currently closed and not accepting orders right now.`;
    }
  }

  return {
    enabled: true,
    isOpen,
    timezone,
    currentDay,
    todayHours,
    nextOpenLabel,
    closedMessage,
  };
}

export interface FormattedScheduleRow {
  key: DayKey;
  dayName: string;
  label: string;
  isClosed: boolean;
}

export function formatWeeklySchedule(hours?: OperatingHours | null): FormattedScheduleRow[] {
  if (!hours?.enabled || !hours.days) return [];
  return DAYS_ORDER.map((key) => {
    const cfg = hours.days[key];
    if (!cfg || cfg.closed) {
      return {key, dayName: DAY_NAMES[key], label: 'Closed', isClosed: true};
    }
    const overnight = cfg.close < cfg.open ? ' (next day)' : '';
    return {
      key,
      dayName: DAY_NAMES[key],
      label: `${cfg.open} – ${cfg.close}${overnight}`,
      isClosed: false,
    };
  });
}

export function formatTodayHoursSummary(status: ClientShopStatus): string | null {
  if (!status.enabled || !status.todayHours) return null;
  if (status.todayHours.closed) return 'Closed today';
  return `Hours today: ${status.todayHours.open} – ${status.todayHours.close}`;
}
