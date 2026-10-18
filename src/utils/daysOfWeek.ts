export const DAYS_IN_WEEK = 7;

export type DaysOfWeek = [
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
];

export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const DAY_INDEXES: readonly DayIndex[] = [0, 1, 2, 3, 4, 5, 6];

export const DAY_LABEL_KEYS = {
  0: "rules.monday",
  1: "rules.tuesday",
  2: "rules.wednesday",
  3: "rules.thursday",
  4: "rules.friday",
  5: "rules.saturday",
  6: "rules.sunday",
} satisfies Record<DayIndex, string>;

export function fromApiDaysOfWeek(
  value?: readonly boolean[] | null,
): DaysOfWeek {
  if (!value || value.length !== DAYS_IN_WEEK) {
    return [true, true, true, true, true, true, true];
  }
  return [
    value[0] === true,
    value[1] === true,
    value[2] === true,
    value[3] === true,
    value[4] === true,
    value[5] === true,
    value[6] === true,
  ];
}

export function setDay(
  days: DaysOfWeek,
  index: DayIndex,
  value: boolean,
): DaysOfWeek {
  const next: DaysOfWeek = [
    days[0],
    days[1],
    days[2],
    days[3],
    days[4],
    days[5],
    days[6],
  ];
  next[index] = value;
  return next;
}

export function hasSelectedDay(days: DaysOfWeek): boolean {
  return days.some((day) => day);
}
