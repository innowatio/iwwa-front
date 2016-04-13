import {
    ADD_TO_FAVORITE,
    CHANGE_Y_AXIS_VALUES,
    SAVE_CHART_CONFIG,
    SELECT_CHART_TYPE,
    SELECT_DATE_RANGES,
    SELECT_FAVORITE_CHART,
    SET_ZOOM_EXTREMES,
    RESET_ZOOM
} from "../actions/monitoring-chart";
import {SELECT_SENSOR} from "../actions/sensors";
import Immutable from "immutable";

let defaultState = {
    favorites: Immutable.Map(),
    dateRanges: [{
        key: "all",
        label: "Tutto"
    }],
    type: "spline",
    yAxis: {
        min: 0,
        max: 60
    }
};

let nextFavoriteId = 0;

export function monitoringChart (state = defaultState, action) {
    switch (action.type) {
        case ADD_TO_FAVORITE: {
            let favorites = state.favorites.set(nextFavoriteId, Immutable.Map({
                _id: nextFavoriteId,
                config: action.payload
            }));
            nextFavoriteId++;
            return {
                ...state,
                favorites: favorites
            };
        }
        case CHANGE_Y_AXIS_VALUES:
            return {
                ...state,
                config: null,
                yAxis: {
                    ...state.yAxis,
                    ...action.values
                }
            };
        case SAVE_CHART_CONFIG:
            return {
                ...state,
                config: action.payload
            };
        case SELECT_CHART_TYPE:
            return {
                ...state,
                config: null,
                type: action.payload
            };
        case SELECT_FAVORITE_CHART:
            return {
                ...state,
                config: action.payload,
                type: action.payload.chart.type,
                yAxis: action.payload.yAxis
            };
        case SELECT_SENSOR:
            return {
                ...state,
                config: null
            };
        case SELECT_DATE_RANGES:
            return {
                ...state,
                dateRanges: action.payload
            };
        case SET_ZOOM_EXTREMES:
            return {
                ...state,
                zoom: action.payload
            };
        case RESET_ZOOM:
            return {
                ...state,
                zoom: []
            };
        default:
            return state;
    }
}
