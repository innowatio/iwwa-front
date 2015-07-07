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
            return R.find(R.propEq("key", query), valori);
        },
        stringify: R.prop("key")
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
