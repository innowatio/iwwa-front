import {COLLECTIONS_CHANGE} from "../actions/collections";
import {
    CHANGE_Y_AXIS_VALUES,
    RESET_Y_AXIS_VALUES,
    SAVE_CHART_CONFIG,
    SELECT_CHART_TYPE,
    SELECT_FAVORITE_CHART,
    SELECT_SENSORS_TO_DRAW,
    TOGGLE_COMPARISON_CHART
} from "../actions/monitoring-chart";
import {SELECT_SENSOR} from "../actions/sensors";

const defaultState = {
    comparisonCharts: {
        "year": false,
        "month": false,
        "week": false
    },
    dateRanges: [{
        key: "all",
        label: "Tutto"
    }],
    sensorsToDraw: [],
    type: "spline",
    xAxis: {},
    yAxis: {
        disabled: false
    }
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
        case CHANGE_Y_AXIS_VALUES:
            return defaultNullConfig(state, {
                xAxis: {
                    ...action.xAxisPeriod
                },
                yAxis: {
                    ...state.yAxis,
                    ...action.yAxisValues
                }
            });
        case RESET_Y_AXIS_VALUES:
            return defaultNullConfig(state, {yAxis: {}});
        case SAVE_CHART_CONFIG:
            return {
                ...state,
                config: action.config,
                yAxis: {
                    ...state.yAxis,
                    disabled: action.yAxisDisabled
                }
            };
        case SELECT_CHART_TYPE:
            return defaultNullConfig(state, {
                type: action.chartType,
                xAxis: {
                    ...action.xAxisPeriod
                }
            });
        case SELECT_FAVORITE_CHART:
            return action.payload;
        case COLLECTIONS_CHANGE:
        case SELECT_SENSOR:
            return defaultNullConfig(state);
        case SELECT_SENSORS_TO_DRAW:
            return defaultNullConfig(defaultState, {sensorsToDraw: action.payload});
        case TOGGLE_COMPARISON_CHART: {
            let newComparison = {
                comparisonCharts: {}
            };
            newComparison.comparisonCharts[action.comparisonChart] = !state.comparisonCharts[action.comparisonChart];
            return defaultNullConfig(state, {
                comparisonCharts: {
                    ...state.comparisonCharts,
                    ...newComparison.comparisonCharts
                },
                xAxis: {
                    ...action.xAxisPeriod
                }
            });
        }
        default:
            return state;
    }
}
