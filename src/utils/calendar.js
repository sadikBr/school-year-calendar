export const arabicMonths = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "ماي",
    "يونيو",
    "يوليوز",
    "غشت",
    "شتنبر",
    "أكتوبر",
    "نونبر",
    "دجنبر",
];

export const weekDays = [
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
];

export const weekDayLabels = ["أح", "إث", "ثل", "أر", "خم", "جم", "سب"];

export function toDate(value) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day));
}

export const toISO = (date) => date.toISOString().slice(0, 10);

export function addDays(date, days) {
    const result = new Date(date);
    result.setUTCDate(result.getUTCDate() + days);
    return result;
}

export function monthsBetween(start, end) {
    const first = toDate(start),
        last = toDate(end),
        months = [];
    let cursor = new Date(
        Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), 1),
    );
    while (cursor <= last) {
        months.push({
            year: cursor.getUTCFullYear(),
            month: cursor.getUTCMonth(),
        });
        cursor = new Date(
            Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 1),
        );
    }
    return months;
}

export function monthCells(year, month) {
    const first = new Date(Date.UTC(year, month, 1));
    const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const offset = first.getUTCDay();
    return Array.from({ length: 42 }, (_, index) => {
        const day = index - offset + 1;
        return day > 0 && day <= days ? day : null;
    });
}

export const eventsOnDate = (events, isoDate) =>
    events.filter((event) => event.start <= isoDate && isoDate < event.end);

export function formatRange(event) {
    const start = toDate(event.start),
        end = addDays(toDate(event.end), -1);
    const startText = `${start.getUTCDate()} ${arabicMonths[start.getUTCMonth()]}`;
    return event.start === toISO(end)
        ? startText
        : `${startText} – ${end.getUTCDate()} ${arabicMonths[end.getUTCMonth()]}`;
}
