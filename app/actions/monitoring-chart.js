export const ADD_TO_FAVORITE = "ADD_TO_FAVORITE";
export const CHANGE_Y_AXIS_VALUES = "CHANGE_Y_AXIS_VALUES";
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

export const addToFavorite = (config, name) => getBasicObject(ADD_TO_FAVORITE, {config, name});

export const changeYAxisValues = (values) => getBasicObject(CHANGE_Y_AXIS_VALUES, values);

export const resetYAxisValues = () => getBasicObject(RESET_Y_AXIS_VALUES);

export const saveChartConfig = (config) => getBasicObject(SAVE_CHART_CONFIG, config);

export const selectChartType = (chartType) => getBasicObject(SELECT_CHART_TYPE, chartType);

export const selectFavoriteChart = (favoriteChart) => getBasicObject(SELECT_FAVORITE_CHART, favoriteChart.get("config"));

export function selectSensorsToDraw (sensors) {
    let sensorsArray = (Array.isArray(sensors) ? sensors : [sensors]);
    return getBasicObject(SELECT_SENSORS_TO_DRAW, sensorsArray);
}

export const toggleComparisonChart = (comparisonChart) => getBasicObject(TOGGLE_COMPARISON_CHART, comparisonChart);
