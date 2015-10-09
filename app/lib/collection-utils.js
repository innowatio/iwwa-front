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
    }
};
