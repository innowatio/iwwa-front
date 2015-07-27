var Immutable  = require("immutable");
var moment     = require("moment");
var Radium     = require("radium");
var R          = require("ramda");
var React      = require("react");
var IPropTypes = require("react-immutable-proptypes");

var components  = require("components");
var formatValue = require("./format-value.js");

var DateCompare = React.createClass({
    propTypes: {
        dateCompare: React.PropTypes.shape({
            period: React.PropTypes.object,
            dateOne: React.PropTypes.date,
            dateTwo: React.PropTypes.date
        }),
        misure: IPropTypes.map,
        siti: React.PropTypes.arrayOf(IPropTypes.map),
        tipologia: React.PropTypes.object,
        valori: React.PropTypes.arrayOf(React.PropTypes.object)
    },
    mixins: [React.addons.PureRenderMixin],
    getDateRanges: function () {
        var dc = this.props.dateCompare;
        return {
            rangeOne: {
                start: dc.dateOne.getTime(),
                end: moment(dc.dateOne).add(1, dc.period.key).valueOf()
            },
            rangeTwo: {
                start: dc.dateTwo.getTime(),
                end: moment(dc.dateTwo).add(1, dc.period.key).valueOf()
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
            moment(this.props.dateCompare.dateOne).format("MMM DD, YYYY"),
            moment(this.props.dateCompare.dateTwo).format("MMM DD, YYYY")
        ]);
    },
    getDateWindow: function () {
        return [
            0,
            moment(0).add(1, this.props.dateCompare.period.key).valueOf()
        ];
    },
    xLegendFormatter: function (value) {
        var date = moment(value);
        return [
            "<b style='color:red;'>",
            "Giorno " + date.format("DD"),
            ", ",
            "ore " + date.format("HH:mm"),
            "</b>"
        ].join("");
    },
    xTicker: function () {
        var self = this;
        if (self.props.dateCompare.period.key === "week") {
            return R.range(0, 8).map(function (n) {
                var delta = moment(0).add(n, "days").valueOf();
                return {
                    v: delta,
                    label: [
                        "<small>" + moment(self.props.dateCompare.dateOne).add(delta).format("MMM DD") + "</small>",
                        "<small>" + moment(self.props.dateCompare.dateTwo).add(delta).format("MMM DD") + "</small>"
                    ].join("<br />")
                };
            });
        }
        if (self.props.dateCompare.period.key === "month") {
            return R.range(0, 31).map(function (n) {
                var delta = moment(0).add(n, "days").valueOf();
                return {
                    v: delta,
                    label: [
                        "<small>" + moment(self.props.dateCompare.dateOne).add(delta).format("MMM DD") + "</small>",
                        "<small>" + moment(self.props.dateCompare.dateTwo).add(delta).format("MMM DD") + "</small>"
                    ].join("<br />")
                };
            });
        }
        if (self.props.dateCompare.period.key === "quarter") {
            return R.range(0, 4).map(function (n) {
                var delta = moment(0).add(n, "months").valueOf();
                return {
                    v: delta,
                    label: [
                        "<small>" + moment(self.props.dateCompare.dateOne).add(delta).format("MMM") + "</small>",
                        "<small>" + moment(self.props.dateCompare.dateTwo).add(delta).format("MMM") + "</small>"
                    ].join("<br />")
                };
            });
        }
        return [];
    },
    render: function () {
        return (
            <components.TemporalLineGraph
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
