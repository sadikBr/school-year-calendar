const unfold = (text) => text.replace(/\r?\n[ \t]/g, "");

function readField(block, name) {
    const match = block.match(new RegExp(`^${name}(?:;[^:]*)?:(.*)$`, "mi"));
    return match?.[1]?.trim().replace(/\\n/g, " ").replace(/\\,/g, ",") || "";
}

function normalizeDate(value) {
    const match = value.match(/^(\d{4})(\d{2})(\d{2})/);
    return match ? `${match[1]}-${match[2]}-${match[3]}` : "";
}

function inferType(title, description) {
    const value = `${title} ${description}`;
    if (
        /عطلة|عيد|السنة الميلادية|وثيقة الاستقلال|المسيرة الخضراء|فاتح محرم/.test(
            value,
        )
    )
        return "holiday";
    if (/امتحان|فروض|المراقبة المستمرة/.test(value)) return "exam";
    if (/تحدي|مسابقة|أولمبياد|البرمجة|الروبوت/.test(value)) return "activity";
    return "milestone";
}

export function parseICS(text) {
    const blocks = unfold(text).match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/g) || [];
    return blocks
        .map((block) => {
            const title = readField(block, "SUMMARY"),
                description = readField(block, "DESCRIPTION");
            return {
                start: normalizeDate(readField(block, "DTSTART")),
                end: normalizeDate(readField(block, "DTEND")),
                title,
                description,
                type: inferType(title, description),
            };
        })
        .filter((event) => event.start && event.end && event.title);
}

export function yearFromEvents(events, fileName = "تقويم مستورد") {
    const sorted = [...events].sort((a, b) => a.start.localeCompare(b.start));
    if (!sorted.length)
        throw new Error("لم يتم العثور على أحداث صالحة في الملف.");
    return {
        id: `imported-${Date.now()}`,
        label: `${sorted[0].start.slice(0, 4)} / ${sorted.at(-1).end.slice(0, 4)}`,
        start: `${sorted[0].start.slice(0, 7)}-01`,
        end: sorted.at(-1).end,
        sourceLabel: fileName,
        notes: "تقويم مستورد محلياً. راجع الأعياد الدينية لأنها قد تكون تقريبية.",
        events: sorted,
    };
}
