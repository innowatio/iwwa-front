export const SELECT_CHART_TYPE = "SELECT_CHART_TYPE";
export const ADD_TO_FAVORITE = "ADD_TO_FAVORITE";

export const selectChartType = (chartType) => {
    return {
        type: SELECT_CHART_TYPE,
        payload: chartType.id
    };
};

export const addToFavorite = (config) => {
    return {
        type: ADD_TO_FAVORITE,
        config: config
    };
};