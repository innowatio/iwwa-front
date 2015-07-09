var R = require("ramda");

exports.sito = function (siti) {
    return {
        parse: function (query) {
            return siti.get(query);
        },
        stringify: function (value) {
            return value.get("_id");
        }
    };
};

exports.valore = function (valori) {
    return {
        parse: function (query) {
            var keys = query ? query.split(",") : [];
            return valori.filter(function (valore) {
                return (keys.indexOf(valore.key) !== -1);
            });
        },
        stringify: R.pipe(
            R.map(R.prop("key")),
            R.join(",")
        )
    };
};

exports.tipologia = function (tipologie) {
    return {
        parse: function (query) {
            return R.find(R.propEq("key", parseInt(query)), tipologie);
        },
        stringify: R.prop("key")
    };
};
