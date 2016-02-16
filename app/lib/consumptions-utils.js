import {flatten} from "ramda";
import moment from "moment";


const DATE_FORMAT = "YYYY-MM-DD";
const PERIODS = ["day", "week", "month", "year"];

export function getTimeRangeByPeriod (period) {
    const now = moment.utc();
    return {
        start: now.startOf(period).format(DATE_FORMAT),
        end: now.endOf(period).add(1, "minute").format(DATE_FORMAT)
    };
}

export function getSumBySiteAndPeriod (period, siteId, measures) {
    const allMeasures = flatten(measures
        .filter(measure => (measure.get("day") >= period.start && measure.get("day") < period.end && measure.get("sensorId") === siteId))
        .map(measure => measure.get("measurementValues").split(","))
        .toArray());
    const sum = allMeasures.reduce((a, b) => a + (parseFloat(b) || 0), 0);
    return sum;
}

export function tabParameters () {
    return PERIODS.map(period => getTitleAndSubtitle(period));
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
            periodSubtitle: `${moment(periodDates.start).format("DD MMMM YYYY")}`.toUpperCase(),
            title: "OGGI"
        };
    case 1:
        return {
            key: period,
            measureUnit: "kWh",
            period: period,
            periodTitle: "QUESTA SETTIMANA HAI UTILIZZATO",
            periodSubtitle: `${moment(periodDates.start).format("DD")} - ${moment(periodDates.end).format("DD MMMM YYYY")}`.toUpperCase(),
            title: "SETTIMANA CORRENTE"
        };
    case 2:
        return {
            key: period,
            measureUnit: "kWh",
            period: period,
            periodTitle: `NEL MESE DI ${moment(periodDates.start).format("MMMM")} HAI UTILIZZATO`.toUpperCase(),
            periodSubtitle: `${moment(periodDates.start).format("YYYY")}`,
            title: "MESE CORRENTE"
        };
    case 3:
        return {
            key: period,
            measureUnit: "kWh",
            period: period,
            periodTitle: `NEL ${moment(periodDates.start).format("YYYY")} HAI UTILIZZATO`,
            periodSubtitle: `${moment(periodDates.start).format("YYYY")}`.toUpperCase(),
            title: "ANNO CORRENTE"
        };
    default:
        return {
            key: period,
            measureUnit: "kWh",
            period: period,
            periodTitle: "",
            periodSubtitle: "",
            title: ""
        };
    }
}
