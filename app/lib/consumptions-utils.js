import {partial, partialRight, always} from "ramda";
import utils from "iwwa-utils";
import moment from "moment";

const PERIODS = ["day", "week", "month", "year"];

export function tabParameters () {
    return PERIODS.map(period => getTitleAndSubtitle(period));
}


function getTitleAndSubtitle (period) {
    const periodDates = utils.getTimeRangeByPeriod(period);
    const defaultNow = partial(utils.getSumByPeriod, [periodDates]);
    const defaultMax = partial(utils.getSumByPeriod, [utils.getPreviousPeriod(period, period)]);
    switch (period) {
        case "day":
            return {
                key: period,
                now: defaultNow,
                measureUnit: "kWh",
                period: period,
                periodTitle: "OGGI HAI UTILIZZATO",
                periodSubtitle: `${moment(periodDates.start).format("DD MMMM YYYY")}`.toUpperCase(),
                title: "OGGI",
                comparisons: [{
                    key: "today-1d",
                    title: "IERI",
                    max: defaultMax,
                    now: defaultNow
                }, {
                    key: "today-7d",
                    title: `${moment().format("dddd")} scors${moment().day() === 6 ? "a" : "o"}`.toUpperCase(),
                    max: partial(utils.getSumByPeriod, [utils.getPreviousPeriod("week", "day")]),
                    now: defaultNow
                }, {
                    key: "avg-7d",
                    title: `media ${moment().format("dddd")}`.toUpperCase(),
                    max: partialRight(utils.getAverageByPeriod, ["days", 7]),
                    now: defaultNow
                }]
            };
        case "week":
            return {
                key: period,
                measureUnit: "kWh",
                now: defaultNow,
                period: period,
                periodTitle: "QUESTA SETTIMANA HAI UTILIZZATO",
                periodSubtitle: `${moment(periodDates.start).format("DD")} - ${moment(periodDates.end).format("DD MMMM YYYY")}`.toUpperCase(),
                title: "SETTIMANA CORRENTE",
                comparisons: [{
                    key: "week-1w",
                    title: "SETTIMANA SCORSA",
                    max: defaultMax,
                    now: defaultNow
                }, {
                    key: "avg-1w",
                    title: "MEDIA SETTIMANALE",
                    max: partialRight(utils.getAverageByPeriod, ["week", 1]),
                    now: defaultNow
                }]
            };
        case "month":
            return {
                key: period,
                measureUnit: "kWh",
                now: defaultNow,
                period: period,
                periodTitle: `NEL MESE DI ${moment(periodDates.start).format("MMMM")} HAI UTILIZZATO`.toUpperCase(),
                periodSubtitle: `${moment(periodDates.start).format("YYYY")}`,
                title: "MESE CORRENTE",
                comparisons: [{
                    key: "month-1m",
                    title: `${moment(utils.getPreviousPeriod(period, period).start).format("MMMM YYYY")}`.toUpperCase(),
                    max: defaultMax,
                    now: defaultNow
                }
                // {
                //     key: "month-1y",
                //     title: `${moment(getPreviousPeriod("year", "month").start).format("MMMM YYYY")}`.toUpperCase(),
                //     max: partial(getAverageBySiteAndPeriod, [getPreviousPeriod("year", "month")]),
                //     now: defaultNow
                // }, {
                //     key: "avg-month",
                //     title: "MEDIA DEI MESI",
                //     max: partial(getAverageBySiteAndPeriod, [getPreviousPeriod("year", "month")]),
                //     now: defaultNow
                // }
            ]
            };
        case "year":
            return {
                key: period,
                measureUnit: "kWh",
                now: defaultNow,
                period: period,
                periodTitle: `NEL ${moment(periodDates.start).format("YYYY")} HAI UTILIZZATO`,
                periodSubtitle: `${moment(periodDates.start).format("YYYY")}`.toUpperCase(),
                title: "ANNO CORRENTE",
                comparisons: [
                    // {
                    //     key: "year-1y",
                    //     title: `${moment(getPreviousPeriod(period, period).start).format("YYYY")}`.toUpperCase(),
                    //     max: defaultMax,
                    //     now: defaultNow
                    // }
                ]
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
