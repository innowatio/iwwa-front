import {String, Number, Object as object, tuple, struct, maybe, list} from "tcomb";

import actionTypeValidator from "../lib/action-type-validator";

export const SELECT_SINGLE_ELECTRICAL_SENSOR_CHART = "SELECT_SINGLE_ELECTRICAL_SENSOR_CHART";
export const SELECT_ELECTRICAL_TYPE = "SELECT_ELECTRICAL_TYPE";
export const SELECT_ENVIRONMENTAL_SENSOR = "SELECT_ENVIRONMENTAL_SENSOR";
export const SELECT_SOURCE = "SELECT_SOURCE";
export const SELECT_MULTIPLE_ELECTRICAL_SITE = "SELECT_MULTIPLE_ELECTRICAL_SITE";
export const SELECT_DATE_RANGES = "SELECT_DATE_RANGES";
export const SELECT_DATE_RANGES_COMPARE = "SELECT_DATE_RANGES_COMPARE";
export const REMOVE_ALL_COMPARE = "REMOVE_ALL_COMPARE";

/**
*   A click on select-tree component for the choice of site
*   @param {array} path - path in site of the selected sensor
*/
const typeofSelectSingleElectricalSensor = actionTypeValidator(list(String));
export function selectSingleElectricalSensor (fullPath) {
    typeofSelectSingleElectricalSensor(...arguments);
    return {
        type: SELECT_SINGLE_ELECTRICAL_SENSOR_CHART,
        payload: fullPath
    };
}

/**
*   A click on button select component for the choice of type
*   @param {object} type - data type
*/
const typeofSelectElectricalType = actionTypeValidator(
    tuple([
        struct({
            label: String,
            key: String
        })
    ])
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
const typeofSelectMultipleElectricalSensor = actionTypeValidator(list(String));
export function selectMultipleElectricalSensor (sites) {
    typeofSelectMultipleElectricalSensor(...arguments);
    return {
        type: SELECT_MULTIPLE_ELECTRICAL_SITE,
        payload: sites
    };
}

/**
*   A click on date-compare-modal modal
*   @param {object} value -
*       key: - {Number} dateOne: date,
*            - {object} period: period selected
*   Date value are in millisecond unix timestamp.
*/
const typeofSelectedDateRangesCompare = actionTypeValidator(
    struct({
        dateOne: Number,
        period: struct({
            label: String,
            key: String
        })
    })
);
export function selectDateRangesCompare (value) {
    typeofSelectedDateRangesCompare(...arguments);
    return {
        type: SELECT_DATE_RANGES_COMPARE,
        payload: value
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
            iconColor: String,
            color: String,
            iconClass: String
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
const structureExpected = struct({
    label: String,
    color: String,
    key: String
});
const typeofSelectSource = actionTypeValidator(
    tuple([
        structureExpected,
        maybe(structureExpected)
    ])
);
export function selectSource (sources) {
    typeofSelectSource(...arguments);
    return {
        type: SELECT_SOURCE,
        payload: sources
    };
}

/**
*   A click on dateFilter modal
*   @param {object} dateRanges - range of the date
*   Date value are in millisecond unix timestamp.
*/
const typeofSelectDateRanges = actionTypeValidator(
    struct({
        start: Number,
        end: Number,
        valueType: struct({
            label: maybe(String),
            key: maybe(String)
        })
    })
);
export function selectDateRanges (dateRanges) {
    typeofSelectDateRanges(...arguments);
    return {
        type: SELECT_DATE_RANGES,
        payload: dateRanges
    };
}

/**
*   A click on reset-compare
*/
export function removeAllCompare () {
    return {
        type: REMOVE_ALL_COMPARE
    };
}

/**
*   Export chart as PNG image
*/
const typeofExportPNGImage = actionTypeValidator(object);
export function exportPNGImage (chart) {
    typeofExportPNGImage(...arguments);
    chart.exportChartLocal();
}

/**
*   Export chart as PDF image
*/
const typeofExportCSV = actionTypeValidator(object);
export function exportCSV (chart) {
    typeofExportCSV(...arguments);
    return chart.getCSV();
}
