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
    convertByVariables: R.memoize(function (measures, variables) {
        const fiveMinutesInMS = 5 * 60 * 1000;
        const startOfMonthInMS = new Date(measures.get("month")).getTime();
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
                toDateTime(index),
                [parseFloat(value), 0]
            ];
            splittedMeasures.forEach(function (measureByVariable) {
                arrayResult.push([parseFloat(measureByVariable[index]), 0]);
            });
            return arrayResult;
        });
    })
};
