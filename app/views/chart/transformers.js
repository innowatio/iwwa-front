var Immutable = require("immutable");
var R         = require("ramda");

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
