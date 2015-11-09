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
                dateOne: moment(tokens[1], "YYYYMMDD").toDate() // Add HH if you want to select for hour
            };
        },
        stringify: function (value) {
            if (!value || value === "deleteValueFromURL") {
                return "";
            }
            return [
                value.period.key,
                moment(value.dateOne).format("YYYYMMDD") // Add HH if you want to select for hour
            ].join("-");
        }
    };
};

exports.dateFilter = function () {
    return {
        parse: function (query) {
            if (!query) {
                return null;
            }
            var tokens = query.split("-") || [];
            return {
                start: moment(tokens[0], "YYYYMMDD").toDate(),
                end: moment(tokens[1], "YYYYMMDD").toDate()
            };
        },
        stringify: function (value) {
            if (!value) {
                return "";
            }
            return [
                moment(value.start).format("YYYYMMDD"),
                moment(value.end).format("YYYYMMDD")
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
                R.find(R.propEq("key", query), tipologie) ||
                tipologie[0]
            );
        },
        stringify: R.prop("key")
    };
};

exports.consumption = function (consumptions) {
    return {
        parse: function (query) {
            return (
                R.find(R.propEq("key", query), consumptions) ||
                {}
            );
        },
        stringify: R.prop("key")
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

exports.alarms = function () {
    return {
        parse: function (query) {
            if (!query) {
                return null;
            }
            var tokens = query.split("-") || [];
            return tokens.map(function (value) {
                return Number(value);
            });
        },
        stringify: function (values) {
            if (!values) {
                return "";
            }
            return values.map(function (value) {
                return value.toString();
            }).join("-");
        }
    };
};
