import axios from "axios";
import UUID from "uuid-js";

import {WRITE_API_ENDPOINT} from "lib/config";

export const MONITORING_CHART_TYPE = "monitoring";

export const CHANGE_Y_AXIS_VALUES = "CHANGE_Y_AXIS_VALUES";
export const FAVORITE_INSERTION_SUCCESS = "FAVORITE_INSERTION_SUCCESS";
export const RESET_Y_AXIS_VALUES = "RESET_Y_AXIS_VALUES";
export const SAVE_CHART_CONFIG = "SAVE_CHART_CONFIG";
export const SELECT_CHART_TYPE = "SELECT_CHART_TYPE";
export const SELECT_FAVORITE_CHART = "SELECT_FAVORITE_CHART";
export const SELECT_SENSORS_TO_DRAW = "SELECT_SENSORS_TO_DRAW";
export const TOGGLE_COMPARISON_CHART = "TOGGLE_COMPARISON_CHART";

function getBasicObject (type, payload) {
    return {
        type: type,
        payload: payload
    };
}

export const addToFavorite = (config, name, userId) => {
    return dispatch => {
        dispatch({
            type: "ADDING_TO_FAVORITE"
        });
        var endpoint = "http://" + WRITE_API_ENDPOINT + "/favorite-charts";
        let favorite = {
            id: UUID.create().hex,
            name: name,
            owner: userId,
            type: MONITORING_CHART_TYPE,
            config: config
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

export const changeYAxisValues = (values) => getBasicObject(CHANGE_Y_AXIS_VALUES, values);

export const resetYAxisValues = () => getBasicObject(RESET_Y_AXIS_VALUES);

export const saveChartConfig = (config, yAxisDisabled) =>  {
    return {
        type: SAVE_CHART_CONFIG,
        config: config,
        yAxisDisabled: yAxisDisabled
    };
};

export const selectChartType = (chartType) => getBasicObject(SELECT_CHART_TYPE, chartType);

export const selectFavoriteChart = (favoriteChart) => getBasicObject(SELECT_FAVORITE_CHART, favoriteChart.get("config"));

export function selectSensorsToDraw (sensors) {
    let sensorsArray = (Array.isArray(sensors) ? sensors : [sensors]);
    return getBasicObject(SELECT_SENSORS_TO_DRAW, sensorsArray);
}

export const toggleComparisonChart = (comparisonChart) => getBasicObject(TOGGLE_COMPARISON_CHART, comparisonChart);
