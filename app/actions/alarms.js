export const DISPLAY_ALARMS_ON_CHART = "DISPLAY_ALARMS_ON_CHART";

export function displayAlarmsOnChart (siteId, alarms, startDate, endDate) {
    return {
        type: DISPLAY_ALARMS_ON_CHART,
        payload: {
            siteId,
            alarms,
            startDate,
            endDate
        }
    };
}
