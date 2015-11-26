import {prepend, equals} from "ramda";

import {
    SELECT_SINGLE_SITE,
    SELECT_TYPE,
    SELECT_ENVIRONMENTAL,
    SELECT_SOURCES,
    SELECT_MULTIPLE_SITE,
    SELECT_DATE_RANGES,
    SELECT_DATA_RANGES_COMPARE
} from "../actions/chart";

const defaultChartState = {
    sites: [],
    types: [{label: "Attiva", key: "energia attiva"}],
    dateRanges: [],
    sources: ["real"]
};

export function chart (state = defaultChartState, {type, payload}) {
    const firstDateRanges = state.dateRanges.slice(0, 1) || [];
    const firstTypes = state.types.slice(0, 1) || [];
    const firstSites = state.sites.slice(0, 1) || [];
    switch (type) {
    //OK
    case SELECT_SINGLE_SITE:
        return {
            ...state,
            sites: payload
        };
    // OK
    case SELECT_MULTIPLE_SITE:
        return {
            ...state,
            sites: payload,
            types: firstTypes,
            dateRanges: firstDateRanges
        };
    case SELECT_DATA_RANGES_COMPARE:
        return {
            ...state,
            sites: firstSites,
            types: firstTypes,
            dateRanges: [payload.firstDate, payload.secondDate]
        };
    // OK
    case SELECT_ENVIRONMENTAL:
        const types = state.types.slice(0, 1);
        return {
            ...state,
            sites: firstSites,
            types: equals(state.types[1], payload) ? types : types.concat(payload),
            dateRanges: firstDateRanges
        };
    // OK
    case SELECT_TYPE:
        return {
            ...state,
            types: state.types.length <= 1 ? [payload] : prepend(payload, state.types.slice(1, 2))
        };
    case SELECT_SOURCES:
        return {
            ...state,
            sources: payload
        };
    case SELECT_DATE_RANGES:
        return {
            ...state,
            dateRanges: [payload.start, payload.end]
        };
    default:
        return state;
    }
}
