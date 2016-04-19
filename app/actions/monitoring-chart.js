import {Number, String, struct, list} from "tcomb";

import actionTypeValidator from "../lib/action-type-validator";

export const ADD_TO_FAVORITE = "ADD_TO_FAVORITE";
export const CHANGE_Y_AXIS_VALUES = "CHANGE_Y_AXIS_VALUES";
export const SAVE_CHART_CONFIG = "SAVE_CHART_CONFIG";
export const SELECT_CHART_TYPE = "SELECT_CHART_TYPE";
export const SELECT_DATE_RANGES = "SELECT_DATE_RANGES";
export const SELECT_FAVORITE_CHART = "SELECT_FAVORITE_CHART";
export const SELECT_SENSORS_TO_DRAW = "SELECT_SENSORS_TO_DRAW";
export const SET_ZOOM_EXTREMES = "SET_ZOOM_EXTREMES";
export const RESET_ZOOM = "RESET_ZOOM";

export const addToFavorite = (config) => {
    return {
        type: ADD_TO_FAVORITE,
        payload: config
    };
};

export const changeYAxisValues = (values) => {
    return {
        type: CHANGE_Y_AXIS_VALUES,
        values: values
    };
};

export const saveChartConfig = (config) => {
    return {
        type: SAVE_CHART_CONFIG,
        payload: config
    };
};

export const selectChartType = (chartType) => {
    return {
        type: SELECT_CHART_TYPE,
        payload: chartType
    };
};

export const selectFavoriteChart = (favoriteChart) => {
    return {
        type: SELECT_FAVORITE_CHART,
        payload: favoriteChart.get("config")
    };
};

const typeofSelectDateRanges = actionTypeValidator(
    list(
        struct({
            key: String,
            label: String
        })
    )
);

export function selectDateRanges (dateRange) {
    typeofSelectDateRanges(dateRange);
    return {
        type: SELECT_DATE_RANGES,
        payload: dateRange
    };
}

const typeOfSetZoomExtremes = actionTypeValidator(list(
    struct({
        max: Number,
        min: Number
    })
));

export function setZoomExtremes (zoomExtremes) {
    typeOfSetZoomExtremes(...arguments);
    return {
        type: SET_ZOOM_EXTREMES,
        payload: zoomExtremes
    };
}

export function resetZoom () {
    return {
        type: RESET_ZOOM
    };
}

export function selectSensorsToDraw (sensors) {
    let sensorsArray = (Array.isArray(sensors) ? sensors : [sensors]);
    return {
        type: SELECT_SENSORS_TO_DRAW,
        payload: sensorsArray
    };
}