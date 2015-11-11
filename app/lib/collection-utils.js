var Immutable = require("immutable");
var R         = require("ramda");
var titleCase = require("title-case");

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
        } else if (tipologia.key === "potenza totale") {
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
            "energia attiva" : JSON string of array,
            "energia reattiva" : JSON string of array,
            ...
        }
    }
*/
exports.measures = {
    convertByVariables: R.memoize(function (measures, variables, startOfTime) {
        const fiveMinutesInMS = 5 * 60 * 1000;
        const startOfMonthInMS = !R.isNil(startOfTime) ? startOfTime.getTime() : new Date(measures.get("month")).getTime();
        const measuresArray = R.map(variable => {
            const m = measures.getIn(["readings", variable])
                .split(",")
                .map(v => parseFloat(v));
            return R.range(0, 8640).map(idx => m[idx] || 0.01);
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
            return (
                // Add the first
                idx === 0 ||
                // Add the last
                idx === 8639 ||
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
        }, [], R.range(0, 8640));
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
        // console.log(measures);
        // console.log(pod);
        // console.log(variable);
        // console.log(dates);
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
