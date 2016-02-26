export function getChartSetting ({colors}) {
    return [{
        label: "Punti di misurazione",
        key: "siteNavigator",
        iconClass: "map",
        color: colors.iconDropdown
    },
    {
        label: "Periodo",
        key: "dateFilter",
        iconClass: "calendar",
        color: colors.iconDropdown
    },
    {
        label: "Confronto tra sensori",
        key: "siteCompare",
        iconClass: "confront",
        color: colors.iconDropdown
    },
    {
        label: "Confronto tra periodi",
        key: "dateCompare",
        iconClass: "confront",
        color: colors.iconDropdown
    },
    {
        label: "Esporta",
        key: "export",
        iconClass: "export",
        color: colors.iconDropdown
    }];
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

export function getConsumptions ({colors}) {
    return [
        {
            label: "Temperatura",
            iconColor: colors.iconSensors,
            color: colors.temperature,
            key: "temperature",
            type: "thl",
            iconClass: "thermometer"
        },
        {
            label: "Umidità",
            iconColor: colors.iconSensors,
            color: colors.humidity,
            key: "humidity",
            type: "thl",
            iconClass: "humidity"
        },
        {
            label: "Lux",
            iconColor: colors.iconSensors,
            color: colors.illuminance,
            key: "illuminance",
            type: "thl",
            iconClass: "lightbulb"
        },
        {
            label: "CO2",
            iconColor: colors.iconSensors,
            color: colors.co2,
            key: "co2",
            type: "co2",
            iconClass: "co2"
        }
        // {label: "Allarmi", key: "allarms", iconClass: "danger" }
    ];
}

export function getExportType () {
    return [
        {
            label: "Png",
            key: "png",
            iconClass: "png"
        },
        {
            label: "Csv",
            key: "csv",
            iconClass: "csv"
        }
    ];
}

export function getDateCompare () {
    return [
        {label: "IERI", key: "days"},
        {label: "7 GG FA", key: "7 days before"},
        {label: "SETTIMANA SCORSA", key: "week"},
        {label: "MESE SCORSO", key: "months"},
        {label: "12 MESI FA", key: "years"}
    ];
}
