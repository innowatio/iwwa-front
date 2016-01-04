import {String, Number, tuple, struct} from "tcomb";

import actionTypeValidator from "../lib/action-type-validator";

export const SELECT_SINGLE_SENSOR = "SELECT_SINGLE_SENSOR";
export const SELECT_TYPE = "SELECT_TYPE";
export const SELECT_ENVIRONMENTAL = "SELECT_ENVIRONMENTAL";
export const SELECT_SOURCES = "SELECT_SOURCES";
export const SELECT_MULTIPLE_SITE = "SELECT_MULTIPLE_SITE";
export const SELECT_DATE_RANGES = "SELECT_DATE_RANGES";
export const SELECT_DATA_RANGES_COMPARE = "SELECT_DATA_RANGES_COMPARE";
export const REMOVE_ALL_COMPARE = "REMOVE_ALL_COMPARE";

/**
*   A click on select-tree component for the choice of site
*   @param {array} site - id site of the site
*/
const typeofSelectSingleSensor = actionTypeValidator(
    tuple([String]),
    tuple([String])
);
export function selectSingleSensor (sensorId, siteId) {
    typeofSelectSingleSensor(...arguments);
    return {
        type: SELECT_SINGLE_SENSOR,
        payload: {
            sensorId,
            siteId
        },
    };
}

/**
*   A click on button select component for the choice of type
*   @param {object} type - data type
*/
const typeofSelectType = actionTypeValidator(
    struct({
        label: String,
        key: String
    })
);
export function selectType (type) {
    typeofSelectType(...arguments);
    return {
        type: SELECT_TYPE,
        payload: type
    };
}

/**
*   A click on site-compare-modal
*   @param {array} sites - id site of the two sites
*/
const typeofSelectMultipleSiteDomain = actionTypeValidator(
    tuple([String, String])
);
export function selectMultipleSite (sitesId) {
    typeofSelectMultipleSiteDomain(...arguments);
    return {
        type: SELECT_MULTIPLE_SITE,
        payload: sitesId
    };
}

/**
*   A click on date-compare-modal modal
*   @param {object} dateRanges - beginning date for the two temporal range and
*       temporal period to visualize.
*   Date value are in millisecond unix timestamp.
*/
const typeofSelectedDateRangesCompare = actionTypeValidator(
    struct({
        period: struct({
            label: String,
            key: String
        }),
        dateOne: Number
    })
);
export function selectDateRangesCompare (dateRanges) {
    typeofSelectedDateRangesCompare(...arguments);
    return {
        type: SELECT_DATA_RANGES_COMPARE,
        payload: dateRanges
    };
}

/**
*   A click on select environmental component for the choice of environmental
*   variable
*   @param {object} type - environmental variable
*/
const typeofEnvironmentalDomain = actionTypeValidator(
    struct({
        label: String,
        key: String,
        color: String,
        icon: String,
        selected: String
    })
);
export function selectEnvironmental (type) {
    typeofEnvironmentalDomain(...arguments);
    return {
        type: SELECT_ENVIRONMENTAL,
        payload: type
    };
}

/**
*   A click on select source button
*   @param {array} source - source of the data
*/
const typeofSelectSourceDomain = actionTypeValidator(
    tuple([struct({
        label: String,
        color: String,
        key: String
    })])
);
export function selectSource (sources) {
    typeofSelectSourceDomain(...arguments);
    return {
        type: SELECT_SOURCES,
        payload: sources
    };
}

/**
*   A click on select source button
*   @param {array} source - source of the data
*/
// export function selectSourceCompare (sources) {
//     return {
//         type: SELECT_SOURCES,
//         payload: sources
//     };
// }

/**
*   A click on dateFilter modal
*   @param {object} dateRanges - range of the date
*   Date value are in millisecond unix timestamp.
*/
const typeofSelectDateRanges = actionTypeValidator(
    struct({
        start: Number,
        end: Number
    })
);
export function selectDateRanges (dateRanges) {
    typeofSelectDateRanges(...arguments);
    return {
        type: SELECT_DATE_RANGES,
        payload: dateRanges
    };
}

/*
*   A click on reset-compare
*/
export function removeAllCompare () {
    return {
        type: REMOVE_ALL_COMPARE
    };
}
