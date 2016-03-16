var Immutable = require("immutable");
var R         = require("ramda");
var titleCase = require("title-case");

exports.labelGraph = {
    getYLabel: function (tipologia) {
        if (tipologia.key === "activeEnergy") {
            return "kWh";
        } else if (tipologia.key === "maxPower") {
            return "kW";
        } else if (tipologia.key === "reactiveEnergy") {
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

exports.sites = {
    filter: function (item, search) {
        var searchRegExp = new RegExp(search, "i");
        return !R.isNil(item) ? (
            searchRegExp.test(item.get("_id")) ||
            searchRegExp.test(item.get("name").split(" - ").join(" "))
        ) : null;
    },
    getLabel: function (sito) {
        return R.is(Immutable.Map, sito) ? (
            titleCase(sito.get("name"))
        ) : "";
    },
    getKey: function (sito) {
        return R.is(Immutable.Map, sito) ? sito.get("_id") : "";
    }
};

exports.getKeyFromCollection = function (collection) {
    return collection.get("_id");
};