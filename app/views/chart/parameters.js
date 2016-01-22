import colors from "lib/colors";
import icons from "lib/icons";

export function getMeasurementTypes () {
    return [
        {label: "Attiva", key: "activeEnergy"},
        {label: "Potenza Max", key: "maxPower"},
        {label: "Reattiva", key: "reactiveEnergy"}
    ];
}

export function getSources () {
    return [
        {label: "Reale", color: colors.lineReale, key: "reading", isDisabled: false},
        {label: "Previsionale", color: colors.linePrevisionale, key: "previsional", isDisabled: true}
    ];
}

export function getConsumptions () {
    return [
        {
            label: "Temperatura",
            color: colors.consumption,
            key: "temperature",
            icon: icons.iconTemperature,
            selected: icons.iconTemperatureSelected

        },
        {
            label: "Umidità",
            color: colors.consumption,
            key: "humidity",
            icon: icons.iconHumidity,
            selected: icons.iconHumiditySelected
        },
        {
            label: "Lux",
            color: colors.consumption,
            key: "illuminance",
            icon: icons.iconIdea,
            selected: icons.iconIdeaSelected
        },
        {
            label: "CO2",
            color: colors.consumption,
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