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
                title: "OGGI"
            };
        case 1:
            return {
                key: period,
                measureUnit: "kWh",
                period: period,
                periodTitle: "QUESTA SETTIMANA HAI UTILIZZATO",
                periodSubtitle: `${moment(periodDates.start).format("DD")} - ${moment(periodDates.end).locale("it").format("DD MMMM YYYY")}`.toUpperCase(),
                title: "SETTIMANA CORRENTE"
            };
        case 2:
            return {
                key: period,
                measureUnit: "kWh",
                period: period,
                periodTitle: `NEL MESE DI ${moment(periodDates.start).locale("it").format("MMMM")} HAI UTILIZZATO`.toUpperCase(),
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
