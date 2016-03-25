import {ADD_TO_FAVORITE, CHANGE_Y_AXIS_VALUES, SAVE_CHART_CONFIG, SELECT_CHART_TYPE, SELECT_FAVORITE_CHART} from "../actions/monitoring-chart";
import Immutable from "immutable";

let defaultState = {
    favorites: Immutable.Map(),
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
                config: state.config
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
        default:
            return state;
    }
}