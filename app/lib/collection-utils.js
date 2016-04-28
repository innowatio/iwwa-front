var Immutable = require("immutable");
var R         = require("ramda");
var changeCase = require("change-case");
var moment    = require("moment");

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

exports.filters = {
    date: (date, days) => {
        if (days < 0) {
            return true;
        }
        return moment(moment().valueOf()).diff(date, "days") < days;
    },
    status: (status, selectedStatus) => {
        // This filter is provvisory. Need to change alarm status.
        if (selectedStatus === "all") {
            return true;
        }
        return selectedStatus === "active" ? status : !status;
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
            changeCase.titleCase(sito.get("name"))
        ) : "";
    },
    getKey: function (sito) {
        return R.is(Immutable.Map, sito) ? sito.get("_id") : "";
    }
};
