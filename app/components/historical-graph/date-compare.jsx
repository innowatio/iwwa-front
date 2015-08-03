var Immutable  = require("immutable");
var moment     = require("moment");
var Radium     = require("radium");
var R          = require("ramda");
var React      = require("react");
var IPropTypes = require("react-immutable-proptypes");

var colors      = require("lib/colors");
var components  = require("components");
var formatValue = require("./format-value.js");

var DateCompare = React.createClass({
    propTypes: {
        dateCompare: React.PropTypes.shape({
            period: React.PropTypes.object,
            dateOne: React.PropTypes.date
        }),
        misure: IPropTypes.map,
        siti: React.PropTypes.arrayOf(IPropTypes.map),
        tipologia: React.PropTypes.object,
        valori: React.PropTypes.arrayOf(React.PropTypes.object)
    },
    mixins: [React.addons.PureRenderMixin],
    getDateRanges: function () {
        var dc = this.props.dateCompare;
        if (dc.period.key === "7 days before") {
            return {
                rangeOne: {
                    start: moment(dc.dateOne).subtract(1, "days").valueOf(),
                    end: dc.dateOne.getTime()
                },
                rangeTwo: {
                    start: moment(dc.dateOne).subtract(1, "weeks").subtract(1, "days").valueOf(),
                    end: moment(dc.dateOne).subtract(1, "weeks").valueOf()
                }
            };
        }
        return {
            rangeOne: {
                start: moment(dc.dateOne).subtract(1, dc.period.key).valueOf(),
                end: dc.dateOne.getTime()
            },
            rangeTwo: {
                start: moment(dc.dateOne).subtract(2, dc.period.key).valueOf(),
                end: moment(dc.dateOne).subtract(1, dc.period.key).valueOf()
            }
        };
    },
    getCoordinates: function () {
        var self = this;
        var sito = self.props.siti[0] || Immutable.Map();
        var pod = sito.get("pod");
        var ranges = self.getDateRanges();
        var valore = self.props.valori[0];
        return self.props.misure
            .filter(function (misura) {
                return misura.get("pod") === pod;
            })
            .filter(function (misura) {
                return misura.get("tipologia") === self.props.tipologia.key;
            })
            .reduce(function (acc, misura) {
                var date = moment(misura.get("data")).valueOf();
                if (
                    moment(date).isBetween(ranges.rangeOne.start, ranges.rangeOne.end)
                ) {
                    acc = acc.withMutations(function (map) {
                        var position = date - ranges.rangeOne.start;
                        var value = map.get(position) || [position, null, null];
                        value[1] = formatValue(misura.get(valore.key));
                        map.set(position, value);
                    });
                }
                if (
                    moment(date).isBetween(ranges.rangeTwo.start, ranges.rangeTwo.end)
                ) {
                    acc = acc.withMutations(function (map) {
                        var position = date - ranges.rangeTwo.start;
                        var value = map.get(position) || [position, null, null];
                        value[2] = formatValue(misura.get(valore.key));
                        map.set(position, value);
                    });
                }
                return acc;
            }, Immutable.Map())
            .toList()
            .sort(function (m1, m2) {
                return (m1[0] < m2[0] ? -1 : 1);
            })
            .toArray();
    },
    getLabels: function () {
        return ["Data"].concat([
            moment(this.props.dateCompare.dateOne).subtract(1, this.props.dateCompare.period.key).format("MMM DD, YYYY"),
            moment(this.props.dateCompare.dateOne).subtract(2, this.props.dateCompare.period.key).format("MMM DD, YYYY")
        ]);
    },
    getDateWindow: function () {
        if (this.props.dateCompare.period.key === "7 days before") {
            return [
                0,
                moment(0).add(1, "days").valueOf()
            ];
        }
        return [
            0,
            moment(0).add(1, this.props.dateCompare.period.key).valueOf()
        ];
    },
    xLegendFormatter: function (value) {
        var date = moment(value);
        return [
            "<b style='color:black;'>",
            "Giorno " + date.format("DD"),
            ", ",
            "ore " + date.format("HH:mm"),
            "</b>"
        ].join("");
    },
    xTicker: function () {
        var self = this;
        if (self.props.dateCompare.period.key === "days") {
            return R.range(0, 25).map(function (n) {
                var delta = moment(0).add(n, "hours").valueOf();
                if (n === 0) {
                    return {
                        v: delta,
                        label: [
                            "<small>" + moment(self.props.dateCompare.dateOne)
                                .subtract(1, "days").add(delta).format("D MMM") + "</small>",
                            "<small style='color:red;'>" + moment(self.props.dateCompare.dateOne)
                                .subtract(2, "days").add(delta).format("D MMM") + "</small>"
                        ].join("<br />")
                    };
                }
                return {
                    v: delta,
                    label: [
                        "<small>" + moment(self.props.dateCompare.dateOne)
                            .subtract(1, "days").add(delta).format("HH:mm") + "</small>",
                        "<small style='color:red;'>" + moment(self.props.dateCompare.dateOne)
                            .subtract(2, "days").add(delta).format("HH:mm") + "</small>"
                    ].join("<br />")
                };
            });
        }
        if (self.props.dateCompare.period.key === "7 days before") {
            return R.range(0, 25).map(function (n) {
                var delta = moment(0).add(n, "hours").valueOf();
                if (n === 0) {
                    return {
                        v: delta,
                        label: [
                            "<small>" + moment(self.props.dateCompare.dateOne)
                                .subtract(1, "days").add(delta).format("D MMM") + "</small>",
                            "<small style='color:red;'>" + moment(self.props.dateCompare.dateOne)
                                .subtract(1, "weeks").subtract(1, "days").add(delta).format("DD MMM") + "</small>"
                        ].join("<br />")
                    };
                }
                return {
                    v: delta,
                    label: [
                        "<small>" + moment(self.props.dateCompare.dateOne)
                            .subtract(1, "days").add(delta).format("HH:mm") + "</small>",
                        "<small style='color:red;'>" + moment(self.props.dateCompare.dateOne)
                            .subtract(1, "weeks").subtract(1, "days").add(delta).format("HH:mm") + "</small>"
                    ].join("<br />")
                };
            });
        }
        if (self.props.dateCompare.period.key === "weeks") {
            return R.range(0, 8).map(function (n) {
                var delta = moment(0).add(n, "days").valueOf();
                return {
                    v: delta,
                    label: [
                        "<small>" + moment(self.props.dateCompare.dateOne)
                        .subtract(1, "weeks").add(delta).format("D MMM") + "</small>",
                        "<small style='color:red;'>" + moment(self.props.dateCompare.dateOne)
                        .subtract(2, "weeks").add(delta).format("D MMM") + "</small>"
                    ].join("<br />")
                };
            });
        }
        if (self.props.dateCompare.period.key === "months") {
            return R.range(0, 31).map(function (n) {
                var delta = moment(0).add(n, "days").valueOf();
                if (n === 0 ||
                    moment(self.props.dateCompare.dateOne).subtract(1, "months").add(delta).format("D") === "1" &&
                    moment(self.props.dateCompare.dateOne).subtract(2, "months").add(delta).format("D") === "1") {
                    return {
                        v: delta,
                        label: [
                            "<small>" + moment(self.props.dateCompare.dateOne)
                                .subtract(1, "months").add(delta).format("D MMM") + "</small>",
                            "<small style='color:red;'>" + moment(self.props.dateCompare.dateOne)
                                .subtract(2, "months").add(delta).format("D MMM") + "</small>"
                        ].join("<br />")
                    };
                }
                if (moment(self.props.dateCompare.dateOne).subtract(1, "months").add(delta).format("D") === "1") {
                    return {
                        v: delta,
                        label: [
                            "<small>" + moment(self.props.dateCompare.dateOne)
                                .subtract(1, "months").add(delta).format("D MMM") + "</small>",
                            "<small style='color:red;'>" + moment(self.props.dateCompare.dateOne)
                                .subtract(2, "months").add(delta).format("D") + "</small>"
                        ].join("<br />")
                    };
                }
                if (moment(self.props.dateCompare.dateOne).subtract(2, "months").add(delta).format("D") === "1") {
                    return {
                        v: delta,
                        label: [
                            "<small>" + moment(self.props.dateCompare.dateOne)
                                .subtract(1, "months").add(delta).format("D") + "</small>",
                            "<small style='color:red;'>" + moment(self.props.dateCompare.dateOne)
                                .subtract(2, "months").add(delta).format("D MMM") + "</small>"
                        ].join("<br />")
                    };
                }
                return {
                    v: delta,
                    label: [
                        "<small>" + moment(self.props.dateCompare.dateOne)
                            .subtract(1, "months").add(delta).format("D") + "</small>",
                        "<small style='color:red;'>" + moment(self.props.dateCompare.dateOne)
                            .subtract(2, "months").add(delta).format("D") + "</small>"
                    ].join("<br />")
                };
            });
        }
        if (self.props.dateCompare.period.key === "years") {
            return R.range(0, 13).map(function (n) {
                var delta = moment(0).add(n, "months").valueOf();
                if (n === 0 ||
                    moment(self.props.dateCompare.dateOne).subtract(1, "years").add(delta).format("MMM") === "Jan") {
                    return {
                        v: delta,
                        label: [
                            "<small>" + moment(self.props.dateCompare.dateOne)
                                .subtract(1, "years").add(delta).format("YYYY") + "</small>",
                            "<small style='color:red;'>" + moment(self.props.dateCompare.dateOne)
                                .subtract(2, "years").add(delta).format("YYYY") + "</small>"
                        ].join("<br />")
                    };
                }
                return {
                    v: delta,
                    label: [
                        "<small>" + moment(self.props.dateCompare.dateOne)
                            .subtract(1, "years").add(delta).format("MMM") + "</small>",
                        "<small style='color:red;'>" + moment(self.props.dateCompare.dateOne)
                            .subtract(2, "years").add(delta).format("MMM") + "</small>"
                    ].join("<br />")
                };
            });
        }
        return [];
    },
    render: function () {
        var valori = this.props.valori[0];
        return (
            <components.TemporalLineGraph
                colors={[valori.color, colors.lineCompare]}
                coordinates={this.getCoordinates()}
                dateWindow={this.getDateWindow()}
                labels={this.getLabels()}
                lockInteraction={true}
                xLegendFormatter={this.xLegendFormatter}
                xTicker={this.xTicker}
                yLabel="kWh"/>
        );
    }
});

module.exports = Radium(DateCompare);
