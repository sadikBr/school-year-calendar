/* eslint-disable react/prop-types */
import {
    arabicMonths,
    eventsOnDate,
    monthCells,
    toISO,
    weekDayLabels,
    weekDays,
} from "../utils/calendar";

const priority = ["holiday", "exam", "milestone", "activity"];

const Month = ({ year, month, events, visibleTypes }) => {
    const cells = monthCells(year, month);

    return (
        <section
            className="month-card"
            aria-label={`${arabicMonths[month]} ${year}`}
        >
            <h2>
                {arabicMonths[month]} <span>{year}</span>
            </h2>
            <div className="week-days">
                {weekDays.map((day, index) => (
                    <div key={day} aria-label={day}>
                        {weekDayLabels[index]}
                    </div>
                ))}
            </div>
            <div className="month-days">
                {cells.map((day, index) => {
                    if (!day)
                        return (
                            <div className="day empty" key={`empty-${index}`} />
                        );
                    const date = toISO(new Date(Date.UTC(year, month, day)));
                    const dayEvents = eventsOnDate(events, date).filter(
                        (event) => visibleTypes.has(event.type),
                    );
                    const primaryType = priority.find((type) =>
                        dayEvents.some((event) => event.type === type),
                    );
                    const titles = dayEvents
                        .map((event) => event.title)
                        .join(" • ");
                    return (
                        <div
                            className={`day ${primaryType || ""}`}
                            key={date}
                            aria-label={titles ? `${date}: ${titles}` : date}
                        >
                            <span>{day}</span>
                            {dayEvents.length > 0 && (
                                <span
                                    className="event-dots"
                                    aria-label={titles}
                                >
                                    {[
                                        ...new Set(
                                            dayEvents.map(
                                                (event) => event.type,
                                            ),
                                        ),
                                    ].map((type) => (
                                        <i className={type} key={type} />
                                    ))}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default Month;
