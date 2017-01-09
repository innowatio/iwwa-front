
export const multisiteDefaultFilter = [
    {/*
        id: "siteBehavior",
        label: "Quali siti vuoi visualizzare?",
        options: [
            {label: "TUTTI", key: "Tutti"},
            {label: "IN ALLARME", key: "In allarme"},
            {label: "CONNESSI", key: "Connessi"},
            {label: "NON CONNESSI", key: "Non connessi"}
        ],
        selectedValue: "Tutti",
        filterType: "options",
        isAttribute: false
    }, {
        id: "comfort",
        label: "Comfort",
        options: [
            {label: "TUTTI", key: null},
            {label: "IN COMFORT", key: true},
            {label: "NON IN COMFORT", key: false}
        ],
        selectedValue: null,
        filterType: "options",
        isAttribute: false
    }, { */
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
            {label: "ULTIMI 30 GIORNI", key: 8}
        ],
        selectedValue: 0,
        filterType: "optionsTime",
        isAttribute: false
    }
];
