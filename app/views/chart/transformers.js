var Immutable = require("immutable");
var moment    = require("moment");
var R         = require("ramda");

exports.dateCompare = function (periods) {
    return {
        parse: function (query) {
            var tokens = (query && query.split("-")) || [];
            return {
                period: R.find(R.propEq("key", tokens[0]), periods) || periods[0],
                dateOne: moment(tokens[1], "YYYYMMDD").toDate(),
                dateTwo: moment(tokens[2], "YYYYMMDD").toDate()
            };
        },
        stringify: function (value) {
            return [
                value.period.key,
                moment(value.dateOne).format("YYYYMMDD"),
                moment(value.dateTwo).format("YYYYMMDD")
            ].join("-");
        }
    };
};

exports.sito = function (siti) {
    return {
        parse: function (query) {
            return (
                siti.get(query) ||
                siti.first() ||
                Immutable.Map()
            );
        },
        stringify: function (value) {
            return value.get("_id");
        }
    };
};

exports.tipologia = function (tipologie) {
    return {
        parse: function (query) {
            return (
                R.find(R.propEq("key", parseInt(query)), tipologie) ||
                tipologie[0]
            );
        },
        stringify: R.pipe(
            R.prop("key"),
            // As of now prop `key` is a number. We therefore stringify it
            R.toString
        )
    };
};

exports.valore = function (valori) {
    return {
        parse: function (query) {
            var keys = query ? query.split(",") : [];
            var selected = valori.filter(function (valore) {
                return (keys.indexOf(valore.key) !== -1);
            });
            return (
                R.isEmpty(selected) ?
                valori.slice(0, 1) :
                selected
            );
        },
        stringify: R.pipe(
            R.map(R.prop("key")),
            R.join(",")
        )
    };
};
