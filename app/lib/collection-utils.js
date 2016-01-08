var Immutable = require("immutable");
var R         = require("ramda");
var titleCase = require("title-case");
var moment    = require("moment");

var icons     = require("lib/icons");

exports.labelGraph = {
    getYLabel: function (tipologia) {
        if (tipologia.key === "activeEnergy") {
            return "kWh";
        } else if (tipologia.key === "maxPower") {
            return "kW";
        } else if (tipologia.key === "reactiveEnergy") {
            return "kVARh";
        } else {
            return "";
        }
    },
    getY2Label: function (consumption) {
        if (consumption.key === "temperature") {
            return "°C";
        } else if (consumption.key === "humidity") {
            return "%";
        } else if (consumption.key === "illuminance") {
            return "Lux";
        } else if (consumption.key === "co2") {
            return "ppm";
        } else {
            return "";
        }
    }
};

/*
    objFromDB: {
        _id: sensorId-day,
        sensorId: innowatio sensor string,
        day: "YYYY-MM-DD",
        measurements: {
            "activeEnergy": JSON string of array,
            "reactiveEnergy": JSON string of array,
            "maxPower": JSON string of array
        }
    }
*/
exports.measures = {
    decorators: [
        Immutable.Map({
            key: "co2",
            icon: icons.iconCO2,
            type: "co2",
            unit: "ppm"
        }),
        Immutable.Map({
            key: "humidity",
            icon: icons.iconHumidity,
            type: "thl",
            unit: "g/m3"
        }),
        Immutable.Map({
            key: "illuminance",
            icon: icons.iconIdea,
            type: "thl",
            unit: "lx"
        }),
        Immutable.Map({
            key: "temperature",
            icon: icons.iconTemperature,
            type: "thl",
            unit: "°C"
        }),
        Immutable.Map({
            key: "activeEnergy",
            type: "pod",
            unit: "kWh"
        }),
        Immutable.Map({
            key: "maxPower",
            type: "pod",
            unit: "kW"
        }),
        Immutable.Map({
            key: "reactiveEnergy",
            type: "pod",
            unit: "kVARh"
        }),
        Immutable.Map({
            key: "activeEnergy",
            type: "pod-anz",
            unit: "kWh"
        }),
        Immutable.Map({
            key: "maxPower",
            type: "pod-anz",
            unit: "kW"
        }),
        Immutable.Map({
            key: "reactiveEnergy",
            type: "pod-anz",
            unit: "kVARh"
        })
    ],
    addValueToMeasures: function (sensors, measures) {
        return sensors.map(function (sensor) {
            const PATH = [sensor.get("id"), "measurements", sensor.get("keyType")];
            return sensor.merge({
                value: measures.getIn(PATH) || undefined
            });
        });
    },
    convertByVariables: R.memoize(function (measure, variables, startOfTime) {
        var mLength;
        const fiveMinutesInMS = 5 * 60 * 1000;
        const startOfDayInMS = startOfTime ?
            startOfTime:
            new Date(measure.get("day")).getTime();
        const measuresArray = R.map(variable => {
            const m = measure.getIn(["measurements", variable]) ?
                measure
                    .getIn(["measurements", variable])
                    .split(",")
                    .map(n => parseFloat(n)) :
                [0.01];
            mLength = m.length;
            var lastNotNull = 0.01;
            return R.range(0, mLength).map(idx => {
                if (!isNaN(m[idx])) {
                    lastNotNull = m[idx] || 0.01;
                    return m[idx] || 0.01;
                } else {
                    return lastNotNull;
                }
            });
        }, variables);
        const toDateTime = (index) => (
            startOfDayInMS + (index * fiveMinutesInMS)
        );
        const isInRange = (val1, val2) => (
            val1 * 1.10 > val2 &&
            val1 * 0.90 < val2
        );
        const getValue = (idx, ...vals) => {
            return [
                new Date(toDateTime(idx)),
                ...vals.map(val => [val])
            ];
        };
        const needsToAdd = (val, prevVal, idx) => {
            return val && (
                // Add the first
                idx === 0 ||
                // Add the last
                idx === mLength - 1 ||
                // Add out of range values
                !isInRange(prevVal, val) ||
                // Add every even hour
                idx % 24 === 12
            );
        };
        return R.reduce((acc, num) => {
            const needsTo = measuresArray.reduce((need, m, midx) => {
                return need || needsToAdd(
                    m[num],
                    R.path([midx + 1, 0], R.last(acc)),
                    num
                );
            }, false);
            return needsTo ? (
                acc.concat([getValue(
                    num,
                    ...measuresArray.map(m => m[num])
                )])
            ) : acc;
        }, [], R.range(0, mLength));
    }),
    convertBySensorsAndVariable: function (measures, sensors, variables, dateFilter) {
        var measuresBySensor = sensors.map((sensorId, index) => {
            return R.unnest(measures
                .filter(measure => measure.get("sensorId") === sensorId)
                .filter(measure => {
                    if (R.isEmpty(dateFilter)) {
                        return true;
                    }
                    const dateMeasure = moment(measure.get("day"), "YYYY-MM-DD").valueOf();
                    return (
                        dateFilter.start <= dateMeasure &&
                        dateFilter.end > dateMeasure
                    );
                })
                .sortBy(measure => measure.get("day"))
                .map(measure => exports.measures.convertByVariables(measure, [variables[index]]))
                .toArray()
            );
        });
        if (measuresBySensor.length === 1) {
            return measuresBySensor[0];
        }
        return this.mergeCoordinates(measuresBySensor[0] || [], measuresBySensor[1] || []);
    },
    convertBySitesAndVariable: function (measures, sitesId, variable) {
        var self = this;
        var measuresBySito = [];
        sitesId.forEach(siteId => {
            measures.filter(function (misura) {
                return misura.get("siteId") === siteId;
            })
            .forEach(function (values) {
                measuresBySito.push(self.convertByVariables(values, [variable]));
            });
        });
        return this.mergeCoordinates(measuresBySito[0] || [], measuresBySito[1] || []);
    },
    convertByDatesAndVariable: function (measures, sensorId, variable, dates) {
        const period = dates.period;
        var measuresBySensor = dates.map((date, index) => {
            return R.unnest(measures
                .filter(measure => measure.get("sensorId") === sensorId[0])
                .filter(measure => {
                    const dateMeasure = moment(measure.get("day"), "YYYY-MM-DD").valueOf();
                    return (new Date(date.start).getTime() <= dateMeasure && new Date(date.end).getTime() > dateMeasure);
                })
                .sortBy(measure => measure.get("day"))
                .map(measure => {
                    const dayStart = new Date(0) + measure.get("day") - date.start;
                    return exports.measures.convertByVariables(measure, [variable], dayStart);
                })
                .toArray());
        });
        return this.mergeCoordinates(measuresBySensor[0] || [], measuresBySensor[1] || []);
    },
    decorateMeasure: function (sensor) {
        // return an Immutable list for avoid subsequent `.flatten` mismatch
        return Immutable.List(R.filter(
            function (value) {
                return !R.isNil(value);
            },
            this.decorators.map(decorator => {
                if (decorator.get("type") === sensor.get("type")) {
                    return decorator.merge(
                        sensor
                        .set("key", sensor.get("id") + "-" + decorator.get("key"))
                        .set("keyType", decorator.get("key"))
                    );
                }
            })
        ));
    },
    findMeasuresBySitoAndVariables: R.memoize(function (measures, sito, variables) {
        return variables.map(function (variable) {
            var variableKey = variable.key;
            var podId = sito.get("siteId");
            var values = measures.filter(function (measure) {
                return measure.get("siteId") === podId;
            }).sort(function (a, b) {
                return a.get("month") > b.get("month");
            });

            return values.size > 0 && values.last().getIn(["measurements", variableKey]) ?
                values.last().getIn(["measurements", variableKey]).split(",").map(function (val) {
                    return parseFloat(val);
                }) : [];
        });
    }),
    mergeCoordinates: function (coordinate1, coordinate2) {
        /*
            f(a,b) => c

            a = [[[date1, [n01, dev01]], [date02, [n02, dev02]], ... ]
            b = [[[date1, [n11, dev11]], [date12, [n12, dev12]], ... ]
            c = [[[date1, [n01, dev01], [n11, dev11]], [date02, [n02, dev02], [n12, dev12]], ...]
        */
        var maxCriteria = function (a) {
            return !R.isNil(a) ? a.length : null;
        };
        var maxCoordinate = R.maxBy(maxCriteria, coordinate1, coordinate2);
        var minCoordinate = maxCoordinate === coordinate1 ? coordinate2 : coordinate1;

        return maxCoordinate.map(function (value, index) {
            var toConcat = [NaN];
            if (minCoordinate.length > index) {
                toConcat = minCoordinate[index][1];
            }
            if (coordinate1 === maxCoordinate) {
                return value.concat([toConcat]);
            } else {
                return [value[0], toConcat].concat([value[1]]);
            }
        });
    }
};

exports.sites = {
    filter: function (item, search) {
        var searchRegExp = new RegExp(search, "i");
        return !R.isNil(item) ? (
            searchRegExp.test(item.get("_id")) ||
            searchRegExp.test(item.get("name").split(" - ").join(" "))
        ) : null;
    },
    getLabel: function (sito) {
        return R.is(Immutable.Map, sito) ? (
            titleCase(sito.get("name"))
        ) : "";
    },
    getKey: function (sito) {
        return R.is(Immutable.Map, sito) ? sito.get("_id") : "";
    }
};
