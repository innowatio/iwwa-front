import Immutable from "immutable";
import UUID from "uuid-js";

import {
    ADD_TO_FAVORITE,
    CHANGE_Y_AXIS_VALUES,
    RESET_Y_AXIS_VALUES,
    SAVE_CHART_CONFIG,
    SELECT_CHART_TYPE,
    SELECT_FAVORITE_CHART,
    SELECT_SENSORS_TO_DRAW
} from "../actions/monitoring-chart";
import {SELECT_SENSOR} from "../actions/sensors";

let defaultState = {
    dateRanges: [{
        key: "all",
        label: "Tutto"
    }],
    favorites: Immutable.Map(),
    sensorsToDraw: [],
    type: "spline",
    yAxis: {}
};

const defaultNullConfig = (state, object) => {
    return {
        ...state,
        config: null,
        ...object
    };
};

export function monitoringChart (state = defaultState, action) {
    switch (action.type) {
        case ADD_TO_FAVORITE: {
            let id = UUID.create().hex;
            let favorites = state.favorites.set(id, Immutable.Map({
                _id: id,
                config: action.payload
            }));
            return {
                ...state,
                favorites: favorites
            };
        }
        case CHANGE_Y_AXIS_VALUES:
            return defaultNullConfig(state, {
                yAxis: {
                    ...state.yAxis,
                    ...action.payload
                }
            });
        case RESET_Y_AXIS_VALUES:
            return defaultNullConfig(state, {yAxis: {}});
        case SAVE_CHART_CONFIG:
            return {
                ...state,
                config: action.payload
            };
        case SELECT_CHART_TYPE:
            return defaultNullConfig(state, {type: action.payload});
        case SELECT_FAVORITE_CHART:
            return {
                ...state,
                config: action.payload,
                type: action.payload.chart.type,
                yAxis: action.payload.yAxis
            };
        case SELECT_SENSOR:
            return defaultNullConfig(state);
        case SELECT_SENSORS_TO_DRAW:
            return defaultNullConfig(state, {sensorsToDraw: action.payload});
        default:
            return state;
    }
}
