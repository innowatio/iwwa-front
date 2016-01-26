require("unit-setup.js");

var Immutable = require("immutable");

var CollectionUtils = proxyquire("lib/readings-real-time-aggregates-to-realtime-view", {});
var icons           = proxyquire("lib/icons", {});

describe("the `decorateMeasures` function", function () {
    it("should return more than an object if the given sensor is mapped on more than one decorator", function () {
        var sensor = Immutable.Map({
            id: "ZTHL01",
            children: [],
            description: "desc",
            type: "thl"
        });

        var expected = Immutable.List([Immutable.Map({
            key: "ZTHL01-humidity",
            icon: icons.iconHumidity,
            type: "thl",
            unit: "g/m3",
            id: "ZTHL01",
            children: [],
            description: "desc",
            keyType: "humidity"
        }),
        Immutable.Map({
            key: "ZTHL01-illuminance",
            icon: icons.iconIdea,
            type: "thl",
            unit: "lx",
            id: "ZTHL01",
            children: [],
            description: "desc",
            keyType: "illuminance"
        }),
        Immutable.Map({
            key: "ZTHL01-temperature",
            icon: icons.iconTemperature,
            type: "thl",
            unit: "°C",
            id: "ZTHL01",
            children: [],
            description: "desc",
            keyType: "temperature"
        })]);

        var result = CollectionUtils.measures.decorateMeasure(sensor);
        expect(result).to.deep.equal(expected);
    });
});

describe("the `addValueToMeasures` function", function () {
    it("should return attach the given measures at the given sensors", function () {
        var sensors = [Immutable.Map({
            key: "ZTHL01-humidity",
            icon: icons.iconHumidity,
            type: "thl",
            unit: "g/m3",
            id: "ZTHL01",
            children: [],
            description: "desc",
            keyType: "humidity"
        }),
        Immutable.Map({
            key: "ZTHL01-illuminance",
            icon: icons.iconIdea,
            type: "thl",
            unit: "lx",
            id: "ZTHL01",
            children: [],
            description: "desc",
            keyType: "illuminance"
        }),
        Immutable.Map({
            key: "ZTHL01-temperature",
            icon: icons.iconTemperature,
            type: "thl",
            unit: "°C",
            id: "ZTHL01",
            children: [],
            description: "desc",
            keyType: "temperature"
        })];

        var measures = Immutable.Map({
            "id": "un-id",
            "siteId": "siteid",
            "sensors": Immutable.Map({
                "ZTHL01": Immutable.Map({
                    "measurements": Immutable.Map({
                        "illuminance": 1,
                        "temperature": 2,
                        "activeEnergy": 3
                    }),
                    "lastUpdate": ""
                }),
                "AZN01": Immutable.Map({
                    "measurements": Immutable.Map({
                        "illuminance": 91,
                        "temperature": 92,
                        "activeEnergy": 93
                    }),
                    "lastUpdate": ""
                })
            })
        });

        var expected = [Immutable.Map({
            id: "ZTHL01",
            children: [],
            description: "desc",
            type: "thl",
            key: "ZTHL01-humidity",
            keyType: "humidity",
            icon: icons.iconHumidity,
            unit: "g/m3",
            value: undefined
        }),
        Immutable.Map({
            id: "ZTHL01",
            children: [],
            description: "desc",
            type: "thl",
            key: "ZTHL01-illuminance",
            keyType: "illuminance",
            icon: icons.iconIdea,
            unit: "lx",
            value: 1
        }),
        Immutable.Map({
            id: "ZTHL01",
            children: [],
            description: "desc",
            type: "thl",
            key: "ZTHL01-temperature",
            keyType: "temperature",
            icon: icons.iconTemperature,
            unit: "°C",
            value: 2
        })];

        var result = CollectionUtils.measures.addValueToMeasures(sensors, measures.get("sensors"));
        expect(result).to.deep.equal(expected);
    });
});
