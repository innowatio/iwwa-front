import {prepend, equals, contains, keys} from "ramda";

import * as colors from "lib/colors";
import {
    SELECT_SINGLE_SITE,
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
    sites: [],
    types: [{label: "Attiva", key: "energia attiva"}, {}],
    dateRanges: [],
    sources: [{label: "Reale", color: colors.lineReale, key: "real"}]
};

export function chart (state = defaultChartState, {type, payload}) {
    const firstTypes = state.types.slice(0, 1).concat({}) || [];
    const firstSites = state.sites.slice(0, 1) || [];
    switch (type) {
    case SELECT_SINGLE_SITE:
        return {
            ...state,
            alarms: undefined,
            sites: payload
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
            sites: payload,
            types: firstTypes,
            dateRanges: contains("start", keys(state.dateRanges[0])) ?
                state.dateRanges :
                []
        };
    case SELECT_DATA_RANGES_COMPARE:
        return {
            ...state,
            alarms: undefined,
            sites: firstSites,
            types: firstTypes,
            dateRanges: [payload]
        };
    case SELECT_ENVIRONMENTAL:
        return {
            ...state,
            alarms: undefined,
            sites: firstSites,
            types: equals(state.types[1], payload) ?
                state.types.slice(0, 1).concat({}) :
                state.types.slice(0, 1).concat(payload),
            dateRanges: contains("start", keys(state.dateRanges[0])) ?
                state.dateRanges :
                []
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
            alarms: undefined,
            dateRanges: [payload]
        };
    case REMOVE_ALL_COMPARE:
        return {
            ...state,
            dateRanges: contains("start", keys(state.dateRanges[0])) ?
                state.dateRanges :
                [],
            alarms: undefined,
            sites: firstSites,
            types: firstTypes
        };
    case DISPLAY_ALARMS_ON_CHART:
        return {
            ...state,
            dateRanges: [{
                start: payload.startDate,
                end: payload.endDate
            }],
            sites: payload.siteId,
            alarms: payload.alarms,
            types: [{label: "Attiva", key: "energia attiva"}, {}]
        };
    default:
        return state;
    }
}
