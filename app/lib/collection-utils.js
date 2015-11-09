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
        if (tipologia.key === 1) {
            return "kWh";
        } else if (tipologia.key === 2) {
            return "kW";
        } else if (tipologia.key === 3) {
            return "kVARh";
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
        const measuresFirstVariable = measures.get("readings").get(variables[0]);

        var splittedMeasures = R.map(function (value) {
            if (R.isNil(measures.get("readings").get(value))) {
                return [];
            }
            return measures.get("readings").get(value).split(",");
        }, R.slice(1, variables.length, variables));

        var toDateTime = function (index) {
            return startOfMonthInMS + (index * fiveMinutesInMS);
        };

        /*
            * Add 0 as placeholder for standard deviation
        */
        return measuresFirstVariable.split(",").map(function (value, index) {
            var arrayResult = [
                new Date(toDateTime(index)),
                [parseFloat(value), 0]
            ];
            splittedMeasures.forEach(function (measureByVariable) {
                arrayResult.push([parseFloat(measureByVariable[index]), 0]);
            });
            return arrayResult;
        });
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
            var toConcat = [NaN, 0];
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
