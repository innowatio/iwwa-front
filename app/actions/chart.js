import {String, Number, tuple, struct, list, maybe} from "tcomb";

import actionTypeValidator from "../lib/action-type-validator";

export const SELECT_SINGLE_ELECTRICAL_SENSOR = "SELECT_SINGLE_ELECTRICAL_SENSOR";
export const SELECT_ELECTRICAL_TYPE = "SELECT_ELECTRICAL_TYPE";
export const SELECT_ENVIRONMENTAL_SENSOR = "SELECT_ENVIRONMENTAL_SENSOR";
export const SELECT_SOURCE = "SELECT_SOURCE";
export const SELECT_MULTIPLE_ELECTRICAL_SENSOR = "SELECT_MULTIPLE_ELECTRICAL_SENSOR";
export const SELECT_DATE_RANGES = "SELECT_DATE_RANGES";
export const SELECT_DATE_RANGES_COMPARE = "SELECT_DATE_RANGES_COMPARE";
export const REMOVE_ALL_COMPARE = "REMOVE_ALL_COMPARE";

/**
*   A click on select-tree component for the choice of site
*   @param {array} site - id site of the site
*/
const typeofSelectSingleElectricalSensor = actionTypeValidator(
    struct({
        sensor: String,
        site: String
    })
);
export function selectSingleElectricalSensor ({sensor, site}) {
    typeofSelectSingleElectricalSensor(...arguments);
    return {
        type: SELECT_SINGLE_ELECTRICAL_SENSOR,
        payload: {
            sensor,
            site
        }
    };
}

/**
*   A click on button select component for the choice of type
*   @param {object} type - data type
*/
const typeofSelectElectricalType = actionTypeValidator(
    struct({
        label: String,
        key: String
    })
);
export function selectElectricalType (electricalType) {
    typeofSelectElectricalType(...arguments);
    return {
        type: SELECT_ELECTRICAL_TYPE,
        payload: electricalType
    };
}

/**
*   A click on site-compare-modal
*   @param {array} sites - id site of the two sites
*/
const typeofSelectMultipleElectricalSensor = actionTypeValidator(
    tuple([String, String]),
    tuple([String, maybe(String)])
);
export function selectMultipleElectricalSensor (sensors, sites) {
    typeofSelectMultipleElectricalSensor(...arguments);
    return {
        type: SELECT_MULTIPLE_ELECTRICAL_SENSOR,
        payload: {
            sites,
            sensors
        }
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
        type: SELECT_DATE_RANGES_COMPARE,
        payload: dateRanges
    };
}

/**
*   A click on select environmental component for the choice of environmental
*   variable
*   @param {object} type - environmental variable
*/
const typeofEnvironmentalSensor = actionTypeValidator(
    tuple([String]),
    tuple([
        struct({
            label: String,
            key: String,
            color: String,
            icon: String,
            selected: String
        })
    ])
);
export function selectEnvironmentalSensor (sensorId, type) {
    typeofEnvironmentalSensor(...arguments);
    return {
        type: SELECT_ENVIRONMENTAL_SENSOR,
        payload: {
            sensorId,
            type
        }
    };
}

/**
*   A click on select source button
*   @param {array} source - source of the data
*/
const typeofSelectSource = actionTypeValidator(
    tuple([struct({
        label: String,
        color: String,
        key: String
    })])
);
export function selectSource (sources) {
    typeofSelectSource(...arguments);
    return {
        type: SELECT_SOURCE,
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
