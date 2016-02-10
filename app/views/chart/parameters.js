import icons from "lib/icons";

export function getChartSetting () {
    return [
        {label: "Punti di misurazione", key: "siteNavigator", icon: icons.iconSiti},
        {label: "Periodo", key: "datefilterMonthlyModal", icon: icons.iconCalendar},
        {label: "Confronto", key: "compare", icon: icons.iconCompare},
        {label: "Esporta", key: "export", icon: icons.iconExport}
    ];
}

export function getMeasurementTypes () {
    return [
        {label: "Energia attiva", key: "activeEnergy"},
        {label: "Potenza massima", key: "maxPower"},
        {label: "Energia reattiva", key: "reactiveEnergy"}
    ];
}

export function getSources (theme) {
    return [
        {label: "Reale", color: theme.colors.lineReale, key: "reading"},
        {label: "Previsionale", color: theme.colors.linePrevisionale, key: "forecast"}
    ];
}

export function getConsumptions (theme) {
    return [
        {
            label: "Temperatura",
            color: theme.colors.temperature,
            key: "temperature",
            icon: icons.iconTemperature,
            selected: icons.iconTemperatureSelected

        },
        {
            label: "Umidità",
            color: theme.colors.humidity,
            key: "humidity",
            icon: icons.iconHumidity,
            selected: icons.iconHumiditySelected
        },
        {
            label: "Lux",
            color: theme.colors.illuminance,
            key: "illuminance",
            icon: icons.iconIdea,
            selected: icons.iconIdeaSelected
        },
        {
            label: "CO2",
            color: theme.colors.co2,
            key: "co2",
            icon: icons.iconCO2,
            selected: icons.iconCO2Selected
        }
        // {label: "Allarmi", key: "allarms", icon: icons.iconAlarm}
    ];
}

export function getExportType () {
    return [
        {label: "Png", key: "png", icon: icons.iconPNG},
        {label: "Csv", key: "csv", icon: icons.iconCSV}
    ];
}

export function getDateCompare () {
    return [
        // {label: "IERI", key: "days"},
        // {label: "7 GG FA", key: "7 days before"},
        // {label: "SETTIMANA SCORSA", key: "weeks"},
        {label: "MESE SCORSO", key: "months"},
        {label: "12 MESI FA", key: "years"}
    ];
}
