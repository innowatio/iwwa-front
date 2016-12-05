import axios from "axios";
import Immutable from "immutable";
import {map} from "ramda";
import UUID from "uuid-js";

import {WRITE_API_ENDPOINT} from "lib/config";

export const MONITORING_CHART_TYPE = "monitoring";

export const ADD_MORE_DATA = "ADD_MORE_DATA";
export const CHANGE_Y_AXIS_VALUES = "CHANGE_Y_AXIS_VALUES";
export const FAVORITE_INSERTION_SUCCESS = "FAVORITE_INSERTION_SUCCESS";
export const RESET_Y_AXIS_VALUES = "RESET_Y_AXIS_VALUES";
export const SAVE_CHART_CONFIG = "SAVE_CHART_CONFIG";
export const SELECT_CHART_TYPE = "SELECT_CHART_TYPE";
export const SELECT_FAVORITE_CHART = "SELECT_FAVORITE_CHART";
export const SELECT_PERIOD = "SELECT_PERIOD";
export const SELECT_SENSORS_TO_DRAW = "SELECT_SENSORS_TO_DRAW";
export const SELECT_TIME_INTERVAL = "SELECT_TIME_INTERVAL";
export const TOGGLE_COMPARISON_CHART = "TOGGLE_COMPARISON_CHART";

function getBasicObject (type, payload) {
    return {
        type: type,
        payload: payload
    };
}

export const addMoreData = (backward) => getBasicObject(ADD_MORE_DATA, backward);

export const addToFavorite = (state, name, userId) => {
    return dispatch => {
        dispatch({
            type: "ADDING_TO_FAVORITE"
        });
        state.config = null;
        var endpoint = "http://" + WRITE_API_ENDPOINT + "/favorite-charts";
        let favorite = {
            id: UUID.create().hex,
            name: name,
            owner: userId,
            type: MONITORING_CHART_TYPE,
            state: state
        };
        axios.post(endpoint, favorite)
            .then(() => dispatch({
                type: FAVORITE_INSERTION_SUCCESS,
                payload: favorite
            }))
            .catch(() => dispatch({
                type: "FAVORITE_INSERTION_FAIL"
            }));
    };

};

export const changeYAxisValues = (values, xAxisPeriod) => {
    return {
        type: CHANGE_Y_AXIS_VALUES,
        yAxisValues: values,
        xAxisPeriod: xAxisPeriod
    };
};

export const resetYAxisValues = () => getBasicObject(RESET_Y_AXIS_VALUES);

export const saveChartConfig = (config, yAxisDisabled) =>  {
    return {
        type: SAVE_CHART_CONFIG,
        config: config,
        yAxisDisabled: yAxisDisabled
    };
};

export const selectChartType = (chartType, xAxisPeriod) => {
    return {
        type: SELECT_CHART_TYPE,
        chartType: chartType,
        xAxisPeriod: xAxisPeriod
    };
};

export function selectFavoriteChart (favoriteChart) {
    let state = favoriteChart.get("state").toJS();
    state.sensorsToDraw = map(sensor => typeof sensor === "string" ? sensor : Immutable.fromJS(sensor), state.sensorsToDraw);
    return getBasicObject(SELECT_FAVORITE_CHART, state);
}

export const selectPeriod = (xAxisPeriod) => getBasicObject(SELECT_PERIOD, xAxisPeriod);

export function selectSensorsToDraw (sensors) {
    let sensorsArray = (Array.isArray(sensors) ? sensors : [sensors]);
    return getBasicObject(SELECT_SENSORS_TO_DRAW, sensorsArray);
}

export const toggleComparisonChart = (comparisonChart, xAxisPeriod) => {
    return {
        type: TOGGLE_COMPARISON_CHART,
        comparisonChart: comparisonChart,
        xAxisPeriod: xAxisPeriod
    };
};

export const selectTimeInterval = (timeInterval) => getBasicObject(SELECT_TIME_INTERVAL, timeInterval);
