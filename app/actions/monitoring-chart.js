export const ADD_TO_FAVORITE = "ADD_TO_FAVORITE";
export const CHANGE_Y_AXIS_VALUES = "CHANGE_Y_AXIS_VALUES";
export const SELECT_CHART_TYPE = "SELECT_CHART_TYPE";
export const SELECT_FAVORITE_CHART = "SELECT_FAVORITE_CHART";

export const addToFavorite = (config) => {
    return {
        type: ADD_TO_FAVORITE,
        config: config
    };
};

export const changeYAxisValues = (values) => {
    return {
        type: CHANGE_Y_AXIS_VALUES,
        values: values
    };
};

export const selectChartType = (chartType) => {
    return {
        type: SELECT_CHART_TYPE,
        payload: chartType.id
    };
};

export const selectFavoriteChart = (favoriteChart) => {
    return {
        type: SELECT_FAVORITE_CHART,
        payload: favoriteChart.get("config")
    };
};
