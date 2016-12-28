import {partial, partialRight, always} from "ramda";
import utils from "iwwa-utils";
import moment from "moment";
import "moment/locale/it";

const PERIODS = ["day", "week", "month", "year"];

export function tabParameters () {
    return PERIODS.map(period => getTitleAndSubtitle(period));
}

function getLabel (key, day) {
    switch (key) {
        case "today":
            return "OGGI";
        case "today-7d-toNow":
        case "yesterday":
            return `${day.format("dddd")} scors${moment().isoWeekday() === 7 ? "a" : "o"}`.toUpperCase();
        case "avg-8-prev-today":
        case "avg-8-prev-yesterday":
            return `media ${day.isoWeekday() === 7
                ? "delle ultime 8 domeniche"
                : "degli ultimi 8 " + day.format("dddd")}`.toUpperCase();
        default:


    }
}

function getTitleAndSubtitle (period) {
    const periodDatesToNow = utils.getTimeRangeByPeriod(period, true);
    const periodDates = utils.getTimeRangeByPeriod(period);
    const previousPeriodDates = utils.getPreviousPeriod(period, period);
    const previousPeriod2Dates = utils.getPreviousPeriod(period, period, false, 2);
    const previousPeriod3Dates = utils.getPreviousPeriod(period, period, false, 3);
    const defaultToNow = partial(utils.getSumByPeriodToNow, [periodDatesToNow]);


    const today = moment();
    const yesterday = moment().subtract(1, "day");
    switch (period) {
        case "day":
            return {
                key: period,
                now: defaultToNow,
                measureUnit: "kWh",
                period,
                periodTitle: "OGGI HAI UTILIZZATO",
                periodSubtitle: `${moment(periodDates.start).format("dddd")} ${moment(periodDates.start).format("DD MMMM YYYY")}`.toUpperCase(),
                title: "OGGI",
                comparisons: [{
                    key: "today",
                    title: getLabel("today", today)+"*",
                    now: defaultToNow
                }, {
                    key: "today-7d-toNow",
                    title: getLabel("today-7d-toNow", today)+"*",
                    now: partial(utils.getSumByPeriodToNow, [utils.getPreviousPeriod("week", period, true)])
                }, {
                    key: "avg-8-prev-today",
                    title: getLabel("avg-8-prev-today", today)+"*",
                    now: partialRight(utils.getAverageByPeriodToNow, ["days", 7])
                }],
                comparisonsPrevPeriod: [{
                    key: "yesterday",
                    title: "TOTALE DI " + getLabel("yesterday", yesterday),
                    now: partial(utils.getSumByPeriod, [utils.getPreviousPeriod("day", period, false, 8)])
                }, {
                    key: "avg-8-prev-yesterday",
                    title: getLabel("avg-8-prev-yesterday", yesterday),
                    now: partialRight(utils.getAverageByPeriod, ["days", 8])
                }]
            };
        case "week":
            return {
                key: period,
                measureUnit: "kWh",
                now: defaultToNow,
                period,
                periodTitle: "QUESTA SETTIMANA HAI UTILIZZATO",
                periodSubtitle: `${moment.utc(periodDates.start).format("DD")} - ${moment.utc(periodDates.end).format("DD MMMM YYYY")}`.toUpperCase(),
                title: "SETTIMANA CORRENTE",
                comparisons: [{
                    key: "week-toNow",
                    title: "SETTIMANA CORRENTE*",
                    now: defaultToNow
                }, {
                    key: "avg-8w-toNow",
                    title: "MEDIA DELLE ULTIME 8 SETTIMANALE*",
                    now: partialRight(utils.getAverageByPeriodToNow, [period, 1])
                }, {
                    key: "week-1w-toNow",
                    title: "SETTIMANA SCORSA*",
                    now: partial(utils.getSumByPeriodToNow, [utils.getPreviousPeriod(period, period, true)])
                }],
                comparisonsPrevPeriod: [{
                    key: "week-1w",
                    title: "TOTALE DI SETTIMANA SCORSA",
                    now: partial(utils.getSumByPeriod, [previousPeriodDates])
                }, {
                    key: "avg-8w",
                    title: "TOTALE IN MEDIA DELLE ULTIME 8 SETTIMANA",
                    now: partialRight(utils.getAverageByPeriod, [period, 1])
                }]
            };
        case "month":
            return {
                key: period,
                measureUnit: "kWh",
                now: defaultToNow,
                period,
                periodTitle: "QUESTO MESE HAI UTILIZZATO",
                periodSubtitle: `${moment.utc(periodDates.start).format("MMMM YYYY")}`,
                title: "MESE CORRENTE",
                comparisonsPrevPeriod: [{
                    key: "month-1m",
                    title: `${moment.utc(previousPeriodDates.start).format("MMMM YYYY")}`.toUpperCase(),
                    now: partial(utils.getSumByPeriod, [previousPeriodDates])
                }, {
                    key: "month-2m",
                    title: `${moment.utc(previousPeriod2Dates.start).format("MMMM YYYY")}`.toUpperCase(),
                    now: partial(utils.getSumByPeriod, [previousPeriod2Dates])
                }, {
                    key: "month-3m",
                    title: `${moment.utc(previousPeriod3Dates.start).format("MMMM YYYY")}`.toUpperCase(),
                    now: partial(utils.getSumByPeriod, [previousPeriod3Dates])
                }
            ]
            };
        case "year":
            return {
                key: period,
                measureUnit: "kWh",
                now: defaultToNow,
                period,
                periodTitle: `NEL ${moment(periodDates.start).format("YYYY")} HAI CONSUMATO`,
                periodSubtitle: `${moment(periodDates.start).format("YYYY")}`.toUpperCase(),
                title: "ANNO",
                comparisonsPrevPeriod: [
                    {
                        key: "year-1y",
                        title: `${moment(previousPeriodDates.start).format("YYYY")}`.toUpperCase(),
                        now: partial(utils.getSumByPeriod, [previousPeriodDates])
                    },
                    {
                        key: "year-avg",
                        title: "MEDIA DEGLI ANNI PRECEDENTI",
                        now: partial(utils.getAverageByYear, [])
                    }
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
