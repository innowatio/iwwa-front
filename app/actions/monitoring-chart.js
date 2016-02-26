export const SELECT_CHART_TYPE = "SELECT_CHART_TYPE";

export const selectChartType = (chartType) => {
    return {
        type: SELECT_CHART_TYPE,
        payload: chartType.id
    };
};