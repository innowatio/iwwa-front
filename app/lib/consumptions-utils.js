import {flatten, range, partial, always} from "ramda";
import moment from "moment";


const PERIODS = ["day", "week", "month", "year"];

export function getTimeRangeByPeriod (period) {
    const now = moment.utc();
    return {
        start: now.startOf(period).format(),
        end: now.endOf(period).format()
    };
}

export function getSumBySiteAndPeriod (period, siteId, measures) {
    const startYear = moment.utc(period.start).year() + "";
    const endYear = moment.utc(period.end).year() + "";
    const allMeasures = flatten(measures
        .filter(measure => (measure.get("year") === startYear || measure.get("year") === endYear) && measure.get("sensorId") === siteId)
        .map(measure => {
            return {
                year: measure.get("year"),
                measurementValues: measure.get("measurementValues").split(",")
            };
        })
        .map(measure => {
            const startDay = moment.utc(period.start).dayOfYear();
            const endDay = moment.utc(period.end).dayOfYear();
            if (startYear === endYear) {
                return measure["measurementValues"].slice(startDay -1, endDay);
            } else {
                // start > end
                if (measure["year"] === endYear) {
                    return measure["measurementValues"].slice(0, endDay);
                } else if (measure["year"] === startYear) {
                    return measure["measurementValues"].slice(startDay -1, measure["measurementValues"].length);
                }
            }
        })
        .toArray());
    const sum = allMeasures.reduce((a, b) => a + (parseFloat(b) || 0), 0);
    return sum;
}

export function getTimeRangeFromDateByPeriod (date, period) {
    return {
        start: date.startOf(period).format(),
        end: date.endOf(period).format()
    };
}

export function getAverageBySiteAndPeriod (offsetNumber, offsetPeriod, sensorId, measurements) {
    const maxRange = parseInt(moment([moment().year() + 1]).diff(moment([moment().year() -1]), offsetPeriod, true) / offsetNumber);
    const sumsByPeriod = range(1, maxRange).map(index => {
        const period = {
            start: moment.utc().subtract(index * offsetNumber, offsetPeriod).startOf(offsetPeriod).format(),
            end: moment.utc().subtract(index * offsetNumber, offsetPeriod).endOf(offsetPeriod).format()
        };
        return getSumBySiteAndPeriod(period, sensorId, measurements);
    });
    const {sum, counter} = sumsByPeriod.reduce((a, b) => {
        // skips 0s
        if (b) {
            return {
                sum: a.sum + (parseFloat(b) || 0),
                counter: a.counter+1
            };
        } else {
            return {
                sum: a.sum,
                counter: a.counter
            };
        }

    }, {sum: 0, counter: 0});

    return counter > 0 ? sum/counter : 0;
}

export function tabParameters () {
    return PERIODS.map(period => getTitleAndSubtitle(period));
}

function getPreviousPeriod (subtractPeriod, rangePeriod) {
    return {
        start: moment.utc().subtract(1, subtractPeriod).startOf(rangePeriod).format(),
        end: moment.utc().subtract(1, subtractPeriod).endOf(rangePeriod).format()
    };
}

function getTitleAndSubtitle (period) {
    const periodDates = getTimeRangeByPeriod(period);
    const defaultMax = partial(getSumBySiteAndPeriod, [getPreviousPeriod(period, period)]);
    const defaultNow = partial(getSumBySiteAndPeriod, [periodDates]);
    switch (PERIODS.indexOf(period)) {
        case 0:
            return {
                key: period,
                now: defaultNow,
                measureUnit: "kWh",
                period: period,
                periodTitle: "OGGI HAI UTILIZZATO",
                periodSubtitle: `${moment(periodDates.start).locale("it").format("DD MMMM YYYY")}`.toUpperCase(),
                title: "OGGI",
                comparisons: [{
                    key: "today-1d",
                    title: "IERI",
                    max: defaultMax,
                    now: defaultNow
                }, {
                    key: "today-7d",
                    title: `${moment().locale("it").format("dddd")} scors${moment().day() === 6 ? "a" : "o"}`.toUpperCase(),
                    max: partial(getSumBySiteAndPeriod, [getPreviousPeriod("week", "day")]),
                    now: defaultNow
                }, {
                    key: "avg-7d",
                    title: `media ${moment().locale("it").format("dddd")}`.toUpperCase(),
                    max: partial(getAverageBySiteAndPeriod, [7, "days"]),
                    now: defaultNow
                }]
            };
        case 1:
            return {
                key: period,
                measureUnit: "kWh",
                now: defaultNow,
                period: period,
                periodTitle: "QUESTA SETTIMANA HAI UTILIZZATO",
                periodSubtitle: `${moment(periodDates.start).format("DD")} - ${moment(periodDates.end).locale("it").format("DD MMMM YYYY")}`.toUpperCase(),
                title: "SETTIMANA CORRENTE",
                comparisons: [{
                    key: "week-1w",
                    title: "SETTIMANA SCORSA",
                    max: defaultMax,
                    now: defaultNow
                }]
            };
        case 2:
            return {
                key: period,
                measureUnit: "kWh",
                now: defaultNow,
                period: period,
                periodTitle: `NEL MESE DI ${moment(periodDates.start).locale("it").format("MMMM")} HAI UTILIZZATO`.toUpperCase(),
                periodSubtitle: `${moment(periodDates.start).format("YYYY")}`,
                title: "MESE CORRENTE",
                comparisons: [{
                    key: "month-1m",
                    title: `${moment(getPreviousPeriod(period, period).start).locale("it").format("MMMM YYYY")}`.toUpperCase(),
                    max: defaultMax,
                    now: defaultNow
                }, {
                    key: "month-1y",
                    title: `${moment(getPreviousPeriod("year", "month").start).locale("it").format("MMMM YYYY")}`.toUpperCase(),
                    max: partial(getAverageBySiteAndPeriod, [getPreviousPeriod("year", "month")]),
                    now: defaultNow
                }, {
                    key: "avg-month",
                    title: "MEDIA DEI MESI",
                    max: partial(getAverageBySiteAndPeriod, [getPreviousPeriod("year", "month")]),
                    now: defaultNow
                }]
            };
        case 3:
            return {
                key: period,
                measureUnit: "kWh",
                now: defaultNow,
                period: period,
                periodTitle: `NEL ${moment(periodDates.start).format("YYYY")} HAI UTILIZZATO`,
                periodSubtitle: `${moment(periodDates.start).format("YYYY")}`.toUpperCase(),
                title: "ANNO CORRENTE",
                comparisons: [{
                    key: "year-1y",
                    title: `${moment(getPreviousPeriod(period, period).start).locale("it").format("YYYY")}`.toUpperCase(),
                    max: defaultMax,
                    now: defaultNow
                }]
            };
        default:
            return {
                key: period,
                measureUnit: "kWh",
                now: always(0),
                period: period,
                periodTitle: "",
                periodSubtitle: "",
                title: "",
                comparisons: []
            };
    }
}
