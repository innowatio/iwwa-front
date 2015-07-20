var moment = require("moment");
var R      = require("ramda");

exports.dateCompare = function (periods) {
    return {
        parse: function (query) {
            if (!query) {
                return null;
            }
            var tokens = query.split("-") || [];
            return {
                period: R.find(R.propEq("key", tokens[0]), periods) || periods[0],
                dateOne: moment(tokens[1], "YYYYMMDD").toDate(),
                dateTwo: moment(tokens[2], "YYYYMMDD").toDate()
            };
        },
        stringify: function (value) {
            if (!value) {
                return "";
            }
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
            if (!query) {
                return [];
            }
            var sitoIds = query.split(",");
            return R.pipe(
                R.map(function (sitoId) {
                    return siti.get(sitoId);
                }),
                R.reject(R.isNil)
            )(sitoIds);
        },
        stringify: R.pipe(
            R.map(function (sito) {
                return sito.get("_id");
            }),
            R.join(",")
        )
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
