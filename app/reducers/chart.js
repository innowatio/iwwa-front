import {prepend, equals, contains, keys} from "ramda";

import * as colors from "lib/colors";
import {
    SELECT_SINGLE_SENSOR,
    SELECT_TYPE,
    SELECT_ENVIRONMENTAL,
    SELECT_SOURCES,
    SELECT_MULTIPLE_SITE,
    SELECT_DATE_RANGES,
    SELECT_DATA_RANGES_COMPARE,
    REMOVE_ALL_COMPARE
} from "../actions/chart";

import {DISPLAY_ALARMS_ON_CHART} from "../actions/alarms";

const defaultChartState = {
    alarms: undefined,
    sensors: [],
    sites: ["sitoDiTest1"],
    types: [{label: "Attiva", key: "activeEnergy"}, {}],
    dateRanges: {},
    sources: [{label: "Reale", color: colors.lineReale, key: "real"}]
};

export function chart (state = defaultChartState, {type, payload}) {
    const firstTypes = state.types.slice(0, 1).concat({}) || [];
    const firstSensor = state.sensors.slice(0, 1) || [];
    switch (type) {
    case SELECT_SINGLE_SENSOR:
        return {
            ...state,
            alarms: undefined,
            sensors: payload.sensorId,
            sites: payload.siteId
        };
    case SELECT_TYPE:
        return {
            ...state,
            alarms: undefined,
            types: prepend(payload, state.types.slice(1, 2))
        };
    case SELECT_MULTIPLE_SITE:
        return {
            ...state,
            alarms: undefined,
            sensors: payload,
            types: firstTypes,
            dateRanges: R.path("range", state.dateRanges[0]) === "dateRanges" ?
                state.dateRanges :
                {}
        };
    case SELECT_DATA_RANGES_COMPARE:
        return {
            ...state,
            alarms: undefined,
            sensors: firstSensor,
            types: firstTypes,
            dateRanges: payload
        };
    case SELECT_ENVIRONMENTAL:
        return {
            ...state,
            alarms: undefined,
            sensors: firstSensor,
            types: equals(state.types[1], payload) ?
                state.types.slice(0, 1).concat({}) :
                state.types.slice(0, 1).concat(payload),
            dateRanges: R.path("range", state.dateRanges[0]) === "dateRanges" ?
                state.dateRanges :
                {}
        };
    case SELECT_SOURCES:
        return {
            ...state,
            alarms: undefined,
            sources: payload
        };
    case SELECT_DATE_RANGES:
        return {
            ...state,
            dateRanges: payload
        };
    case REMOVE_ALL_COMPARE:
        return {
            ...state,
            dateRanges: R.path("range", state.dateRanges[0]) === "dateRanges" ?
                state.dateRanges :
                {},
            alarms: undefined,
            sensors: firstSensor,
            types: firstTypes
        };
    case DISPLAY_ALARMS_ON_CHART:
        return {
            ...state,
            dateRanges: {
                start: payload.startDate,
                end: payload.endDate
            },
            sensors: payload.siteId,
            alarms: payload.alarms,
            types: [{label: "Attiva", key: "activeEnergy"}, {}]
        };
    default:
        return state;
    }
}
