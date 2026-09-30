import { useMemo, useRef, useState } from "react";
import Month from "./Components/Month";
import { EVENT_TYPES, schoolYears } from "./data/schoolYears";
import { formatRange, monthsBetween } from "./utils/calendar";
import { parseICS, yearFromEvents } from "./utils/ics";

const allTypes = Object.keys(EVENT_TYPES);

const Callendar = () => {
    const [years, setYears] = useState(schoolYears);
    const [selectedId, setSelectedId] = useState(schoolYears[0].id);
    const [visibleTypes, setVisibleTypes] = useState(new Set(allTypes));
    const [message, setMessage] = useState("");
    const fileInput = useRef(null);
    const selectedYear =
        years.find((year) => year.id === selectedId) || years[0];
    const months = useMemo(
        () => monthsBetween(selectedYear.start, selectedYear.end),
        [selectedYear],
    );
    const visibleEvents = selectedYear.events.filter((event) =>
        visibleTypes.has(event.type),
    );

    function toggleType(type) {
        setVisibleTypes((current) => {
            const next = new Set(current);
            next.has(type) ? next.delete(type) : next.add(type);
            return next;
        });
    }

    async function importCalendar(event) {
        const file = event.target.files?.[0];
        if (!file) return;
        try {
            const imported = yearFromEvents(
                parseICS(await file.text()),
                file.name,
            );
            setYears((current) => [
                ...current.filter((year) => !year.id.startsWith("imported-")),
                imported,
            ]);
            setSelectedId(imported.id);
            setMessage(`تم استيراد ${imported.events.length} حدثاً بنجاح.`);
        } catch (error) {
            setMessage(error.message);
        } finally {
            event.target.value = "";
        }
    }

    return (
        <main className="app">
            <section className="calendar-page">
                <header className="hero">
                    <div>
                        <p className="eyebrow">المملكة المغربية</p>
                        <h1>اليومية المدرسية</h1>
                        <p className="subtitle">
                            محطات السنة الدراسية والعطل الرسمية في صفحة واحدة
                        </p>
                    </div>
                    <div className="year-stamp">
                        <span>الموسم الدراسي</span>
                        <strong>{selectedYear.label}</strong>
                    </div>
                </header>
                <section className="toolbar" aria-label="خيارات التقويم">
                    <label>
                        <span>السنة الدراسية</span>
                        <select
                            value={selectedId}
                            onChange={(event) =>
                                setSelectedId(event.target.value)
                            }
                        >
                            {years.map((year) => (
                                <option value={year.id} key={year.id}>
                                    {year.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <div className="actions">
                        <input
                            ref={fileInput}
                            type="file"
                            accept=".ics,text/calendar"
                            onChange={importCalendar}
                            hidden
                        />
                        <button
                            className="secondary"
                            onClick={() => fileInput.current?.click()}
                        >
                            استيراد ملف تقويم
                        </button>
                        <button onClick={() => window.print()}>
                            طباعة / حفظ PDF
                        </button>
                    </div>
                </section>
                {message && (
                    <p className="message" role="status">
                        {message}
                    </p>
                )}
                <section
                    className="legend screen-legend"
                    aria-label="مفتاح التقويم"
                >
                    {Object.entries(EVENT_TYPES).map(([type, config]) => (
                        <label
                            className={
                                !visibleTypes.has(type) ? "disabled" : ""
                            }
                            key={type}
                        >
                            <input
                                type="checkbox"
                                checked={visibleTypes.has(type)}
                                onChange={() => toggleType(type)}
                            />
                            <i className={config.className} /> {config.label}
                        </label>
                    ))}
                </section>
                <div className="calendar">
                    {months.map(({ year, month }) => (
                        <Month
                            key={`${year}-${month}`}
                            year={year}
                            month={month}
                            events={selectedYear.events}
                            visibleTypes={visibleTypes}
                        />
                    ))}
                </div>
            </section>
            <section className="agenda">
                <div className="section-heading">
                    <p className="eyebrow">التفاصيل</p>
                    <h2>مفتاح الألوان ومحطات الموسم</h2>
                </div>
                <div className="print-legend" aria-label="مفتاح ألوان التقويم">
                    {Object.entries(EVENT_TYPES).map(([type, config]) => (
                        <span key={type}>
                            <i className={config.className} />
                            {config.label}
                        </span>
                    ))}
                </div>
                <div className="event-list">
                    {visibleEvents.map((event, index) => (
                        <article
                            className="event-row"
                            key={`${event.start}-${event.title}-${index}`}
                        >
                            <i className={event.type} />
                            <time>{formatRange(event)}</time>
                            <strong>{event.title}</strong>
                            {event.description && <p>{event.description}</p>}
                        </article>
                    ))}
                </div>
                <footer>
                    <p>
                        <strong>المصدر:</strong>{" "}
                        <a
                            href={selectedYear.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {selectedYear.sourceLabel}
                        </a>
                    </p>
                    <p>{selectedYear.notes}</p>
                </footer>
            </section>
        </main>
    );
};

export default Callendar;
