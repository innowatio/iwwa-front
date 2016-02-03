import {equals, head, last, update} from "ramda";
import moment from "moment";

import * as colors from "lib/colors";
import {
    SELECT_SINGLE_ELECTRICAL_SENSOR,
    SELECT_ELECTRICAL_TYPE,
    SELECT_ENVIRONMENTAL_SENSOR,
    SELECT_SOURCE,
    SELECT_MULTIPLE_ELECTRICAL_SITE,
    SELECT_DATE_RANGES,
    SELECT_DATE_RANGES_COMPARE,
    REMOVE_ALL_COMPARE
} from "actions/chart";
import {DISPLAY_ALARMS_ON_CHART} from "actions/alarms";
import {getDateRangesCompare} from "./date-ranges";

const defaultChartState = [{
    alarms: undefined,
    sensorId: null,
    fullPath: [],
    date: {},
    measurementType: {label: "Attiva", key: "activeEnergy"},
    site: null,
    source: {label: "Reale", color: colors.lineReale, key: "reading"}
}];

export function chart (state = defaultChartState, {type, payload}) {
    switch (type) {
    case SELECT_SINGLE_ELECTRICAL_SENSOR:
        return [{
            ...state[0],
            alarms: undefined,
            fullPath: payload.fullPath,
            sensorId: payload.sensor || head(payload.fullPath),
            site: payload.site,
            date: state[0].date.type === "dateFilter" ? state[0].date : {}
        }];
    case SELECT_ELECTRICAL_TYPE:
        /*
        *   Update the state with electrical type. If there are all electrical sensors,
        *   update all the measurementType, if there is an electrical sensor and a
        *   consumption sensor, it upgrade only the first element in chart (that match
        *   with the electrical sensor).
        */
        const twoElectricalSensor = state.length === 1 || equals(state[0].measurementType, state[1].measurementType || {});
        return twoElectricalSensor ? state.map(stateObj => ({
            ...stateObj,
            alarms: undefined,
            measurementType: payload
        })) : update(0, {
            ...state[0],
            alarms: undefined,
            measurementType: payload
        }, state);
    case SELECT_MULTIPLE_ELECTRICAL_SITE:
        /*
        *   Update the state, with two different electrical sensor that can have
        *   also different site.
        *   The `measurementType` is the same.
        */
        const measurementType = state[0].measurementType;
        return payload.map((sensorId, idx) => ({
            ...state[0],
            alarms: undefined,
            sensorId: payload[idx],
            fullPath: [payload[idx]],
            site: payload[idx],
            measurementType,
            date: state[0].date.type === "dateFilter" ? state[0].date : {}
        }));
    case SELECT_DATE_RANGES_COMPARE:
        const dateRanges = getDateRangesCompare(payload);
        return dateRanges.map(dateRange => ({
            ...state[0],
            date: {
                period: payload.period,
                type: "dateCompare",
                start: dateRange.start,
                end: dateRange.end
            }
        }));
    case SELECT_ENVIRONMENTAL_SENSOR:
        /*
        *   When click on consumption button, this can have a toggle functionality.
        */
        const toggle = (
            equals(last(state).sensorId, payload.sensorId[0]) &&
            equals(last(state).measurementType, payload.type[0])
        );
        if (toggle) {
            return [state[0]];
        }
        const sensorId = payload.sensorId[0];
        const date = state[0].date.type === "dateFilter" ? state[0].date : {};
        const environmentalSensorState = {
            alarms: undefined,
            sensorId,
            site: state[0].site,
            fullPath: undefined,
            measurementType: payload.type[0],
            date,
            source: defaultChartState[0].source
        };
        return [{
            ...state[0],
            date
        }].concat([environmentalSensorState]);
    case SELECT_SOURCE:
        /*
        *   The source can be `reading` and/or `forecast`.
        *   Forecast is only for electrical sensor.
        *   Toggle functionality.
        */
        const toggleSource = (
            state.length > 1 &&
            equals({...state[0], source: null}, {...state[1], source: null})
        );
        if (toggleSource) {
            return [{
                ...state[0],
                source: payload[0]
            }];
        }
        const sameSourceToAllStateObj = state.length === 1 && payload.length === 2;
        return sameSourceToAllStateObj ? payload.map(source => ({
            ...state[0],
            alarms: undefined,
            source
        })) : state.map(stateObj => ({
            ...stateObj,
            alarms: undefined,
            source: payload[0]
        }));
    case SELECT_DATE_RANGES:
        /*
        *   Upgrade all the selection with the selected date range.
        */
        return state.map(stateObj => ({
            ...stateObj,
            date: {
                ...payload,
                type: "dateFilter"
            }
        }));
    case REMOVE_ALL_COMPARE:
        /*
        *   Remove all the comparation.
        */
        return [{
            ...state[0],
            date: {}
        }];
    case DISPLAY_ALARMS_ON_CHART:
        const alarmDate = last(payload.alarms);
        return [{
            ...defaultChartState[0],
            alarms: payload.alarms,
            site: payload.siteId,
            sensorId: payload.sensorId,
            fullPath: [payload.siteId],
            date: {
                start: moment.utc(alarmDate).startOf("month").valueOf(),
                end: moment.utc(alarmDate).endOf("month").valueOf(),
                type: "dateFilter"
            }
        }];
    default:
        return state;
    }
}
