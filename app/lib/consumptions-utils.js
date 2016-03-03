import {flatten} from "ramda";
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
    const startYear = moment(period.start).year() + "";
    const endYear = moment(period.end).year() + "";
    const allMeasures = flatten(measures
        .filter(measure => (measure.get("year") === startYear || measure.get("year") === endYear) && measure.get("sensorId") === siteId)
        .map(measure => {
            return {
                year: measure.get("year"),
                measurementValues: measure.get("measurementValues").split(",")
            };
        })
        .map(measure => {
            const startDay = moment(period.start).dayOfYear();
            const endDay = moment(period.end).dayOfYear();
            if (startYear === endYear) {
                return measure["measurementValues"].slice(startDay -1, endDay);
            } else {
                // start > end
                if (measure["year"] === endYear) {
                    return measure["measurementValues"].slice(0, endDay);
                } else if (measure["year"] === startYear) {
                    return measure["measurementValues"].slice(startDay -1, measure["measurementValues"].lenght);
                }
            }
        })
        .toArray());
    const sum = allMeasures.reduce((a, b) => a + (parseFloat(b) || 0), 0);
    return sum;
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
    switch (PERIODS.indexOf(period)) {
        case 0:
            return {
                key: period,
                measureUnit: "kWh",
                period: period,
                periodTitle: "OGGI HAI UTILIZZATO",
                periodSubtitle: `${moment(periodDates.start).locale("it").format("DD MMMM YYYY")}`.toUpperCase(),
                title: "OGGI",
                comparisons: [{
                    key: "today-1d",
                    title: "IERI",
                    ...getPreviousPeriod(period, period)
                }, {
                    key: "today-7d",
                    title: `${moment().locale("it").format("dddd")} scors${moment().day() === 6 ? "a" : "o"}`.toUpperCase(),
                    ...getPreviousPeriod("week", "day")
                }]
            };
        case 1:
            return {
                key: period,
                measureUnit: "kWh",
                period: period,
                periodTitle: "QUESTA SETTIMANA HAI UTILIZZATO",
                periodSubtitle: `${moment(periodDates.start).format("DD")} - ${moment(periodDates.end).locale("it").format("DD MMMM YYYY")}`.toUpperCase(),
                title: "SETTIMANA CORRENTE",
                comparisons: [{
                    key: "week-1w",
                    title: "SETTIMANA SCORSA",
                    ...getPreviousPeriod(period, period)
                }]
            };
        case 2:
            return {
                key: period,
                measureUnit: "kWh",
                period: period,
                periodTitle: `NEL MESE DI ${moment(periodDates.start).locale("it").format("MMMM")} HAI UTILIZZATO`.toUpperCase(),
                periodSubtitle: `${moment(periodDates.start).format("YYYY")}`,
                title: "MESE CORRENTE",
                comparisons: [{
                    key: "month-1m",
                    title: `${moment(getPreviousPeriod(period, period).start).locale("it").format("MMMM YYYY")}`.toUpperCase(),
                    ...getPreviousPeriod(period, period)
                }, {
                    key: "month-1y",
                    title: `${moment(getPreviousPeriod("year", "month").start).locale("it").format("MMMM YYYY")}`.toUpperCase(),
                    ...getPreviousPeriod("year", "month")
                }]
            };
        case 3:
            return {
                key: period,
                measureUnit: "kWh",
                period: period,
                periodTitle: `NEL ${moment(periodDates.start).format("YYYY")} HAI UTILIZZATO`,
                periodSubtitle: `${moment(periodDates.start).format("YYYY")}`.toUpperCase(),
                title: "ANNO CORRENTE",
                comparisons: [{
                    key: "year-1y",
                    title: `${moment(getPreviousPeriod(period, period).start).locale("it").format("YYYY")}`.toUpperCase(),
                    ...getPreviousPeriod(period, period)
                }]
            };
        default:
            return {
                key: period,
                measureUnit: "kWh",
                period: period,
                periodTitle: "",
                periodSubtitle: "",
                title: "",
                comparisons: []
            };
    }
}
