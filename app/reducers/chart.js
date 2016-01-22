import {equals, path} from "ramda";

import * as colors from "lib/colors";
import {
    SELECT_SINGLE_ELECTRICAL_SENSOR,
    SELECT_ELECTRICAL_TYPE,
    SELECT_ENVIRONMENTAL_SENSOR,
    SELECT_SOURCES,
    SELECT_MULTIPLE_ELECTRICAL_SENSOR,
    SELECT_DATE_RANGES,
    SELECT_DATE_RANGES_COMPARE,
    REMOVE_ALL_COMPARE
} from "../actions/chart";

import {DISPLAY_ALARMS_ON_CHART} from "../actions/alarms";

const defaultChartState = {
    alarms: undefined,
    consumptionSensors: [],
    consumptionTypes: [{}],
    dateRanges: {},
    electricalSensors: [],
    electricalTypes: [{label: "Attiva", key: "activeEnergy"}],
    fullPath: [],
    sites: [],
    sources: [{label: "Reale", color: colors.lineReale, key: "real"}]
};

export function chart (state = defaultChartState, {type, payload}) {
    const firstElectricalSensor = state.electricalSensors.slice(0, 1) || [];
    const firstSites = state.sites.slice(0, 1) || [];
    switch (type) {
    case SELECT_SINGLE_ELECTRICAL_SENSOR:
        return {
            ...state,
            alarms: undefined,
            electricalSensors: [payload.sensor],
            fullPath: payload.fullPath,
            sites: [payload.site]
        };
    case SELECT_ELECTRICAL_TYPE:
        return {
            ...state,
            alarms: undefined,
            electricalTypes: [payload]
        };
    case SELECT_MULTIPLE_ELECTRICAL_SENSOR:
        return {
            ...state,
            alarms: undefined,
            electricalSensors: payload,
            dateRanges: path("range", state.dateRanges) === "dateFilter" ?
                state.dateRanges :
                {},
            consumptionSensors: [],
            consumptionTypes: []
        };
    case SELECT_DATE_RANGES_COMPARE:
        return {
            ...state,
            alarms: undefined,
            dateRanges: payload,
            electricalSensors: firstElectricalSensor,
            consumptionSensors: [],
            consumptionTypes: []
        };
    case SELECT_ENVIRONMENTAL_SENSOR:
        const toggle = (
            equals(state.consumptionSensors, payload.sensorId) &&
            equals(state.consumptionTypes, payload.type)
        );
        return {
            ...state,
            alarms: undefined,
            consumptionSensors: toggle ? [] : payload.sensorId,
            consumptionTypes: toggle ? [{}] : payload.type,
            dateRanges: path(["range"], state.dateRanges) === "dateFilter" ?
                state.dateRanges :
                {},
            electricalSensors: firstElectricalSensor
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
            dateRanges: path(["range"], state.dateRanges) === "dateFilter" ?
                state.dateRanges :
                {},
            alarms: undefined,
            electricalSensors: firstElectricalSensor,
            sites: firstSites,
            consumptionSensors: [],
            consumptionTypes: [{}]
        };
    case DISPLAY_ALARMS_ON_CHART:
        return {
            ...state,
            dateRanges: {
                start: payload.startDate,
                end: payload.endDate
            },
            electricalSensors: payload.sensorId,
            alarms: payload.alarms,
            types: [{label: "Attiva", key: "activeEnergy"}]
        };
    default:
        return state;
    }
}
