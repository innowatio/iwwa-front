var Immutable = require("immutable");
var R         = require("ramda");
var titleCase = require("title-case");

var icons     = require("lib/icons");

exports.siti = {
    filter: function (item, search) {
        var searchRegExp = new RegExp(search, "i");
        return !R.isNil(item) ? (
            searchRegExp.test(item.get("societa")) ||
            searchRegExp.test(item.get("idCoin")) ||
            searchRegExp.test(item.get("pod"))
        ) : null;
    },
    getLabel: function (sito) {
        return R.is(Immutable.Map, sito) ? (
            [
                titleCase(sito.get("societa")),
                titleCase(sito.get("idCoin"))
            ].join(" - ")
        ) : "";
    },
    getKey: function (sito) {
        return R.is(Immutable.Map, sito) ? sito.get("_id") : "";
    }
};

exports.labelGraph = {
    getYLabel: function (tipologia) {
        if (tipologia.key === "energia attiva") {
            return "kWh";
        } else if (tipologia.key === "potenza massima") {
            return "kW";
        } else if (tipologia.key === "energia reattiva") {
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
        _id: uuid,
        sitoId: innowatio pod string,
        podId: uuid,
        month: "YYYY-MM",
        readings: {
            "energia attiva": JSON string of array,
            "energia reattiva": JSON string of array,
            "potenza massima": JSON string of array,
            ...
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
    convertByVariables: R.memoize(function (measures, variables, startOfTime) {
        var mLength;
        const fiveMinutesInMS = 5 * 60 * 1000;
        const startOfMonthInMS = !R.isNil(startOfTime) ? startOfTime.getTime() : new Date(measures.get("month")).getTime();
        const measuresArray = R.map(variable => {
            const m = (measures.getIn(["readings", variable]) || "")
                .split(",")
                .map(v => parseFloat(v));
            mLength = m.length;
            var lastNotNull = null;
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
            startOfMonthInMS + (index * fiveMinutesInMS)
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
    convertBySitesAndVariable: function (measures, pods, variable) {
        var self = this;
        var measuresBySito = [];
        pods.forEach(pod => {
            measures.filter(function (misura) {
                return misura.get("podId") === pod;
            })
            .forEach(function (values) {
                measuresBySito.push(self.convertByVariables(values, [variable]));
            });
        });
        return this.mergeCoordinates(measuresBySito[0] || [], measuresBySito[1] || []);
    },
    convertByDatesAndVariable: function (measures, pod, variable, dates) {
        var self = this;
        var measuresByDates = [];
        dates.forEach(date => {
            measures.filter(function (misura) {
                return misura.get("podId") === pod;
            })
            .filter(function (misura) {
                return misura.get("month") === date;
            })
            .forEach(function (values) {
                measuresByDates.push(self.convertByVariables(values, [variable], new Date(0)));
            });
        });
        return this.mergeCoordinates(measuresByDates[0] || [], measuresByDates[1] || []);
    },
    decorateMeasure: function (sensor) {
        // return an Immutable list for avoid subsequent `.flatten` mismatch
        return Immutable.List(R.filter(
            function (value) {
                return !R.isNil(value);
            },
            this.decorators.map(function (decorator) {
                if (decorator.get("type") === sensor.get("type")) {
                    return decorator.merge(
                        sensor
                        .set("key", sensor.get("id") + "-" + decorator.get("key"))
                        .set("keyType", decorator.get("key"))
                    );
                }
            })));
    },
    findMeasuresBySitoAndVariables: R.memoize(function (measures, sito, variables) {
        return variables.map(function (variable) {
            var variableKey = variable.key;
            var podId = sito.get("pod");
            var values = measures.filter(function (measure) {
                return measure.get("podId") === podId;
            }).sort(function (a, b) {
                return a.get("month") > b.get("month");
            });

            return values.size > 0 && values.last().getIn(["readings", variableKey]) ?
                values.last().getIn(["readings", variableKey]).split(",").map(function (val) {
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
            searchRegExp.test(item.get("name"))
        ) : null;
    },
    getLabel: function (sito) {
        return R.is(Immutable.Map, sito) ? (
            [
                titleCase(sito.get("_id")),
                titleCase(sito.get("name"))
            ].join(" - ")
        ) : "";
    },
    getKey: function (sito) {
        return R.is(Immutable.Map, sito) ? sito.get("_id") : "";
    }
};
