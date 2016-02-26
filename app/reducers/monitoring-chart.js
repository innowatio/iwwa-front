import {SELECT_CHART_TYPE} from "../actions/monitoring-chart";

let defaultState = {
    type: "areaspline"
};

export function monitoringChart (state = defaultState, action) {
    switch (action.type) {
        case SELECT_CHART_TYPE:
            return {
                ...state,
                type: action.payload
            };
        default:
            return state;
    }
}