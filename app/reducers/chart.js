import {equals, path, last} from "ramda";

import * as colors from "lib/colors";
import {
    SELECT_SINGLE_ELECTRICAL_SENSOR,
    SELECT_ELECTRICAL_TYPE,
    SELECT_ENVIRONMENTAL_SENSOR,
    SELECT_SOURCE,
    SELECT_MULTIPLE_ELECTRICAL_SENSOR,
    SELECT_DATE_RANGES,
    SELECT_DATE_RANGES_COMPARE,
    REMOVE_ALL_COMPARE
} from "../actions/chart";

import {DISPLAY_ALARMS_ON_CHART} from "../actions/alarms";

const defaultChartState = [{
    alarms: undefined,
    sensorId: null,
    date: {},
    measurementType: {label: "Attiva", key: "activeEnergy"},
    sites: null,
    source: {label: "Reale", color: colors.lineReale, key: "real"}
}];

export function chart (state = defaultChartState, {type, payload}) {
    switch (type) {
    case SELECT_SINGLE_ELECTRICAL_SENSOR:
        return [{
            ...state[0],
            alarms: undefined,
            sensorId: payload.sensor,
            site: payload.site
        }];
    case SELECT_ELECTRICAL_TYPE:
        return state.map((stateObj, idx) => ({
            ...state[idx],
            alarms: undefined,
            measurementType: payload
        }));
    case SELECT_MULTIPLE_ELECTRICAL_SENSOR:
        const measurementType = state[0].measurementType;
        return payload.sensors.map((sensorId, idx) => ({
            ...state[0],
            alarms: undefined,
            sensorId,
            site: payload.sites.length <= 1 ? payload.sites[0] : payload.sites[idx],
            measurementType,
            date: state[0].date.range === "dateFilter" ?
                state[0].date :
                {}
        }));
    // case SELECT_DATE_RANGES_COMPARE:
    //     const
    //     return
    //
    //     {
    //         ...state,
    //         alarms: undefined,
    //         dateRanges: payload,
    //         electricalSensors: firstElectricalSensor,
    //         consumptionSensors: [],
    //         consumptionTypes: []
    //     };
    case SELECT_ENVIRONMENTAL_SENSOR:
        const toggle = (
            equals(last(state).sensorId, payload.sensorId) &&
            equals(last(state).measurementType, payload.type[0])
        );
        if (toggle) {
            return state[0];
        }
        const environmentalSensor = {
            alarms: undefined,
            sensorId: payload.sensorId[0],
            site: state[0].site,
            measurementType: payload.type[0],
            date: path(["range"], state[0].date) === "dateFilter" ?
                state[0].date :
                {},
            source: defaultChartState[0].source
        };
        return state.length <= 1 ?
            state.concat(environmentalSensor) :
            state[0].concat(environmentalSensor);
    case SELECT_SOURCE:
        return payload.map(source => ({
            ...state[0],
            alarms: undefined,
            source
        }));
    case SELECT_DATE_RANGES:
        return state.map((stateObj, idx) => ({
            ...state[idx],
            date: payload
        }));
    case REMOVE_ALL_COMPARE:
        return state[0];
    case DISPLAY_ALARMS_ON_CHART:
        // TODO
        return state;
    default:
        return state;
    }
}
