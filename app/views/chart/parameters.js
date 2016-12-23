export function getChartSetting ({colors}) {
    return [{
        label: "Punti di misurazione",
        key: "siteNavigator",
        iconClass: "map",
        hoverColor: colors.white,
        color: colors.iconDropdown
    },
    {
        label: "Periodo",
        key: "dateFilter",
        iconClass: "calendar",
        hoverColor: colors.white,
        color: colors.iconDropdown
    },
    {
        label: "Confronto tra sensori",
        key: "siteCompare",
        iconClass: "confront",
        hoverColor: colors.white,
        color: colors.iconDropdown
    },
    {
        label: "Confronto tra periodi",
        key: "dateCompare",
        iconClass: "confront",
        hoverColor: colors.white,
        color: colors.iconDropdown
    },
    {
        label: "Esporta",
        key: "export",
        iconClass: "export",
        hoverColor: colors.white,
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
        {label: "Previsionale", color: theme.colors.linePrevisionale, key: "forecast"},
        {label: "Riferimento", color: theme.colors.linePrevisionale, key: "reference"}
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
        {label: "7 GIORNI FA", key: "7 days before"},
        {label: "SETTIMANA SCORSA", key: "week"},
        {label: "MESE SCORSO", key: "months"},
        {label: "12 MESI FA", key: "years"}
    ];
}
