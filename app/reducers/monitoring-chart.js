import {ADD_TO_FAVORITE, CHANGE_Y_AXIS_VALUES, SELECT_CHART_TYPE} from "../actions/monitoring-chart";

let defaultState = {
    favourites: [],
    type: "spline",
    yAxis: {
        min: 0,
        max: 60
    }
};

export function monitoringChart (state = defaultState, action) {
    switch (action.type) {
        case ADD_TO_FAVORITE: {
            let favourite = state.favourites.slice();
            favourite.push(action.config);
            return {
                ...state,
                favourites: favourite
            };
        }
        case CHANGE_Y_AXIS_VALUES:
            return {
                ...state,
                yAxis: {
                    ...state.yAxis,
                    ...action.values
                }
            };
        case SELECT_CHART_TYPE:
            return {
                ...state,
                type: action.payload
            };
        default:
            return state;
    }
}