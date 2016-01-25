import Immutable from "immutable";
import moment from "moment";
import Radium from "radium";
import R from "ramda";
import React, {PropTypes} from "react";
import ReactPureRender from "react-addons-pure-render-mixin";
import IPropTypes from "react-immutable-proptypes";

import * as colors from "lib/colors";
import components from "components";
// import readingsDailyAggregatesToDygraphData from "lib/readings-daily-aggregates-to-dygraph-data";

var DateCompare = React.createClass({
    propTypes: {
        chart: PropTypes.arrayOf(PropTypes.object),
        getYLabel: React.PropTypes.func,
        misure: IPropTypes.map,
        sites: React.PropTypes.arrayOf(IPropTypes.map)
    },
    mixins: [ReactPureRender],
    getDateRanges: function () {
        const date = this.props.chart[0].date;
        if (date.period.key === "7 days before") {
            return {
                rangeOne: {
                    start: moment(date.dateOne).subtract(1, "days").valueOf(),
                    end: moment(date.dateOne).valueOf()
                },
                rangeTwo: {
                    start: moment(date.dateOne).subtract(1, "weeks").subtract(1, "days").valueOf(),
                    end: moment(date.dateOne).subtract(1, "weeks").valueOf()
                }
            };
        }
        if (date.period.key === "years") {
            return {
                rangeOne: {
                    start: moment(date.dateOne).subtract(5, "weeks").valueOf(),
                    end: moment(date.dateOne).valueOf()
                },
                rangeTwo: {
                    start: moment(date.dateOne).subtract(57, "weeks").valueOf(),
                    end: moment(date.dateOne).subtract(53, "weeks").valueOf()
                }
            };
        }
        if (date.period.key === "months") {
            return {
                rangeOne: {
                    start: moment(date.dateOne).subtract(5, "weeks").valueOf(),
                    end: moment(date.dateOne).valueOf()
                },
                rangeTwo: {
                    start: moment(date.dateOne).subtract(10, "weeks").valueOf(),
                    end: moment(date.dateOne).subtract(5, "weeks").valueOf()
                }
            };
        }
        return {
            rangeOne: {
                start: moment(date.dateOne).subtract(1, date.period.key).valueOf(),
                end: moment(date.dateOne).valueOf()
            },
            rangeTwo: {
                start: moment(date.dateOne).subtract(2, date.period.key).valueOf(),
                end: moment(date.dateOne).subtract(1, date.period.key).valueOf()
            }
        };
    },
    getDateFormatter: function () {
        const date = this.props.chart[0].date;
        const startTimeRangeOne = moment(date.dateOne).format("YYYY-MM-DD");
        const endTimeRangeOne = moment(date.dateOne).add(1, date.period.key).format("YYYY-MM-DD");
        const startTimeRangeTwo = moment(date.dateOne).subtract(1, date.period.key).format("YYYY-MM-DD");
        const endTimeRangeTwo = moment(date.dateOne).format("YYYY-MM-DD");
        return [{start: startTimeRangeOne, end: endTimeRangeOne}, {start: startTimeRangeTwo, end: endTimeRangeTwo}];
    },
    getCoordinates: function () {
        // return readingsDailyAggregatesToDygraphData(this.props.misure, this.props.chart, this.getDateFormatter());
        return [];
        // const sensorId = this.props.chart[0].sensorId;
        // return readingsDailyAggregatesToDygraphData.dateCompare(
        //     this.props.misure,
        //     sensorId,
        //     this.props.,
        //     this.getDateFormatter()
        // );
    },
    getLabels: function () {
        if (this.props.chart[0].date.period.key === "7 days before") {
            return ["Data"].concat([
                moment(this.props.chart[0].date.dateOne).subtract(1, "days").format("MMM DD, YYYY"),
                moment(this.props.chart[0].date.dateOne).subtract(1, "weeks").subtract(1, "days").format("MMM DD, YYYY")
            ]);
        }
        if (this.props.chart[0].date.period.key === "months") {
            return ["Data"].concat([
                moment(this.props.chart[0].date.dateOne).endOf("month").subtract(5, "weeks").format("MMM DD, YYYY"),
                moment(this.props.chart[0].date.dateOne).endOf("month").subtract(10, "weeks").format("MMM DD, YYYY")
            ]);
        }
        if (this.props.chart[0].date.period.key === "years") {
            return ["Data"].concat([
                moment(this.props.chart[0].date.dateOne).subtract(5, "weeks").format("MMM DD, YYYY"),
                moment(this.props.chart[0].date.dateOne).subtract(57, "weeks").format("MMM DD, YYYY")
            ]);
        }
        return ["Data"].concat([
            moment(this.props.chart[0].date.dateOne).subtract(1, this.props.chart[0].date.period.key).format("MMM DD, YYYY"),
            moment(this.props.chart[0].date.dateOne).subtract(2, this.props.chart[0].date.period.key).format("MMM DD, YYYY")
        ]);
    },
    getDateWindow: function () {
        if (this.props.chart[0].date.period.key === "7 days before") {
            return [
                0,
                moment(0).add(1, "days").valueOf()
            ];
        }
        if (this.props.chart[0].date.period.key === "years" || this.props.chart[0].date.period.key === "months") {
            return [
                0,
                moment(0).add(5, "weeks").valueOf()
            ];
        }
        return [
            0,
            moment(0).add(1, this.props.chart[0].date.period.key).valueOf()
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
        if (self.props.chart[0].date.period.key === "days") {
            return R.range(0, 25).map(function (n) {
                var delta = moment(0).add(n, "hours").valueOf();
                if (n === 0) {
                    return {
                        v: delta,
                        label: [
                            "<small>" + moment(self.props.chart[0].date.dateOne)
                                .subtract(1, "days").add(n, "hours").format("DD MMM") + "</small>",
                            "<small style='color:red;'>" + moment(self.props.chart[0].date.dateOne)
                                .subtract(2, "days").add(n, "hours").format("DD MMM") + "</small>"
                        ].join("<br />")
                    };
                }
                return {
                    v: delta,
                    label: [
                        "<small>" + moment(self.props.chart[0].date.dateOne)
                            .subtract(1, "days").add(n, "hours").format("HH:mm") + "</small>",
                        "<small style='color:red;'>" + moment(self.props.chart[0].date.dateOne)
                            .subtract(2, "days").add(n, "hours").format("HH:mm") + "</small>"
                    ].join("<br />")
                };
            });
        }
        if (self.props.chart[0].date.period.key === "7 days before") {
            return R.range(0, 25).map(function (n) {
                var delta = moment(0).add(n, "hours").valueOf();
                if (n === 0) {
                    return {
                        v: delta,
                        label: [
                            "<small>" + moment(self.props.chart[0].date.dateOne)
                                .subtract(1, "days").add(n, "hours").format("DD MMM") + "</small>",
                            "<small style='color:red;'>" + moment(self.props.chart[0].date.dateOne)
                                .subtract({weeks: 1, days: 1}).add(n, "hours").format("DD MMM") + "</small>"
                        ].join("<br />")
                    };
                }
                return {
                    v: delta,
                    label: [
                        "<small>" + moment(self.props.chart[0].date.dateOne)
                            .subtract(1, "days").add(n, "hours").format("HH:mm") + "</small>",
                        "<small style='color:red;'>" + moment(self.props.chart[0].date.dateOne)
                            .subtract({weeks: 1, days: 1}).add(n, "hours").format("HH:mm") + "</small>"
                    ].join("<br />")
                };
            });
        }
        if (self.props.chart[0].date.period.key === "weeks") {
            return R.range(0, 8).map(function (n) {
                var delta = moment(0).add(n, "days").valueOf();
                return {
                    v: delta,
                    label: [
                        "<small>" + moment(self.props.chart[0].date.dateOne)
                        .subtract(1, "weeks").add(n, "days").format("DD MMM") + "</small>",
                        "<small style='color:red;'>" + moment(self.props.chart[0].date.dateOne)
                        .subtract(2, "weeks").add(n, "days").format("DD MMM") + "</small>"
                    ].join("<br />")
                };
            });
        }
        if (self.props.chart[0].date.period.key === "months") {
            return R.range(0, 36).map(function (n) {
                var delta = moment(0).add(n, "days").valueOf();
                if (n === 0) {
                    return {
                        v: delta,
                        label: [
                            "<small>" + moment(self.props.chart[0].date.dateOne)
                                .subtract(5, "weeks").add(n, "days").format("DD MMM") + "</small>",
                            "<small style='color:red;'>" + moment(self.props.chart[0].date.dateOne)
                                .subtract(10, "weeks").add(n, "days").format("DD MMM") + "</small>"
                        ].join("<br />")
                    };
                }
                if (moment(self.props.chart[0].date.dateOne).subtract(5, "weeks").add(n, "days").format("DD") === "01") {
                    return {
                        v: delta,
                        label: [
                            "<small>" + moment(self.props.chart[0].date.dateOne)
                                .subtract(5, "weeks").add(n, "days").format("DD MMM") + "</small>",
                            "<small style='color:red;'>" + moment(self.props.chart[0].date.dateOne)
                                .subtract(10, "weeks").add(n, "days").format("DD") + "</small>"
                        ].join("<br />")
                    };
                }
                if (moment(self.props.chart[0].date.dateOne).subtract(10, "weeks").add(delta).format("DD") === "01") {
                    return {
                        v: delta,
                        label: [
                            "<small>" + moment(self.props.chart[0].date.dateOne)
                                .subtract(5, "weeks").add(n, "days").format("DD") + "</small>",
                            "<small style='color:red;'>" + moment(self.props.chart[0].date.dateOne)
                                .subtract(10, "weeks").add(n, "days").format("DD MMM") + "</small>"
                        ].join("<br />")
                    };
                }
                return {
                    v: delta,
                    label: [
                        "<small>" + moment(self.props.chart[0].date.dateOne)
                            .subtract(5, "weeks").add(n, "days").format("DD") + "</small>",
                        "<small style='color:red;'>" + moment(self.props.chart[0].date.dateOne)
                            .subtract(10, "weeks").add(n, "days").format("DD") + "</small>"
                    ].join("<br />")
                };
            });
        }
        if (self.props.chart[0].date.period.key === "years") {
            return R.range(0, 36).map(function (n) {
                var delta = moment(0).add(n, "days").valueOf();
                if (n === 0) {
                    return {
                        v: delta,
                        label: [
                            "<small>" + moment(self.props.chart[0].date.dateOne)
                                .subtract(5, "weeks").add(n, "days").format("YYYY") + "</small>",
                            "<small style='color:red;'>" + moment(self.props.chart[0].date.dateOne)
                                .subtract(57, "weeks").add(n, "days").format("YYYY") + "</small>"
                        ].join("<br />")
                    };
                }
                if (moment(self.props.chart[0].date.dateOne).subtract(5, "weeks").add(n, "days").format("DD") === "01") {
                    return {
                        v: delta,
                        label: [
                            "<small>" + moment(self.props.chart[0].date.dateOne)
                                .subtract(5, "weeks").add(n, "days").format("DD MMM") + "</small>",
                            "<small style='color:red;'>" + moment(self.props.chart[0].date.dateOne)
                                .subtract(57, "weeks").add(n, "days").format("DD") + "</small>"
                        ].join("<br />")
                    };
                }
                if (moment(self.props.chart[0].date.dateOne).subtract(53, "weeks").subtract(4, "weeks").add(delta).format("DD") === "01") {
                    return {
                        v: delta,
                        label: [
                            "<small>" + moment(self.props.chart[0].date.dateOne)
                                .subtract(5, "weeks").add(n, "days").format("DD") + "</small>",
                            "<small style='color:red;'>" + moment(self.props.chart[0].date.dateOne)
                                .subtract(57, "weeks").add(n, "days").format("DD MMM") + "</small>"
                        ].join("<br />")
                    };
                }
                return {
                    v: delta,
                    label: [
                        "<small>" + moment(self.props.chart[0].date.dateOne)
                            .subtract(5, "weeks").add(n, "days").format("DD") + "</small>",
                        "<small style='color:red;'>" + moment(self.props.chart[0].date.dateOne)
                            .subtract(57, "weeks").add(n, "days").format("DD") + "</small>"
                    ].join("<br />")
                };
            });
        }
        return [];
    },
    render: function () {
        const source = this.props.chart[0].source;
        /*
            WARNING: `y2label` is empty, it's a workaround to prevent this dygraph bug https://github.com/danvk/dygraphs/issues/629
        */
        return (
            <components.TemporalLineGraph
                colors={[source.color, colors.lineCompare]}
                coordinates={this.getCoordinates()}
                dateWindow={this.getDateWindow()}
                labels={this.getLabels()}
                lockInteraction={true}
                ref="temporalLineGraph"
                site={this.props.sites[0] || Immutable.Map()}
                xLegendFormatter={this.xLegendFormatter}
                xTicker={this.xTicker}
                y2label={" "}
                yLabel={this.props.getYLabel(this.props.chart[0].sensorId)}
            />
        );
    }
});

module.exports = Radium(DateCompare);
