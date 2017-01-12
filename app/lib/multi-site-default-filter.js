
export const multisiteDefaultFilter = [
    {
        id: "status.telecontrol",
        label: "Connessione",
        options: [
            {label: "TUTTI", key: null},
            {label: "CONNESSI", key: "active"},
            {label: "NON CONNESSI", key: "error"}
        ],
        selectedValue: null,
        filterType: "optionsStatus",
        isAttribute: false
    }, {
        id: "status.alarms",
        label: "Allarmi",
        options: [
            {label: "TUTTI", key: null},
            {label: "IN ALLARME", key: "error"},
            {label: "NON IN ALLARME", key: "active"}
        ],
        selectedValue: null,
        filterType: "optionsStatus",
        isAttribute: false
    }, {
        id: "status.comfort",
        label: "Comfort",
        options: [
            {label: "TUTTI", key: null},
            {label: "IN COMFORT", key: "active"},
            {label: "NON IN COMFORT", key: "error,warning"}
        ],
        selectedValue: null,
        filterType: "optionsStatus",
        isAttribute: false
    }, {
        id: "areaInMq",
        label: "Mq commerciali",
        selectedValue: "",
        filterType: "range",
        isAttribute: false
    }, {
        id: "hourlyData",
        label: "Disponibilità dato orario",
        options: [
            {label: "TUTTI", key: null},
            {label: "DISPONIBILE", key: true},
            {label: "NON DISPONIBILE", key: false}
        ],
        selectedValue: null,
        filterType: "options",
        isAttribute: false
    }, {
        id: "lastUpdate",
        label: "Data ultimo aggiornamento",
        options: [
            {label: "TUTTI", key: 0},
            {label: "OGGI", key: 1},
            {label: "ULTIMI 7 GIORNI", key: 7},
            {label: "ULTIMI 30 GIORNI", key: 30}
        ],
        selectedValue: 0,
        filterType: "optionsTime",
        isAttribute: false
    }
];
