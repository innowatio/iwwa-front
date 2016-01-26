import React, {PropTypes} from "react";
import {Map} from "immutable";
import {range} from "ramda";
import moment from "moment";
import ReactPureRender from "react-addons-pure-render-mixin";
import IPropTypes from "react-immutable-proptypes";

import * as colors from "lib/colors";
import components from "components";
// import readingsDailyAggregatesToDygraphData from "lib/readings-daily-aggregates-to-dygraph-data";

var DateCompare = React.createClass({
    propTypes: {
        chart: PropTypes.arrayOf(PropTypes.object).isRequired,
        getYLabel: React.PropTypes.func.isRequired,
        misure: IPropTypes.map,
        sites: React.PropTypes.arrayOf(IPropTypes.map)
    },
    mixins: [ReactPureRender],
    getDateRanges: function () {
        var {dateOne, period} = this.props.chart[0].date;
        var rangeOne;
        var rangeTwo;
        if (period.key === "years") {
            rangeOne = moment(dateOne).subtract(4, "weeks");
            rangeTwo = moment(dateOne).subtract(57, "weeks");
        } else if (period.key === "months") {
            rangeOne = moment(dateOne).subtract(4, "weeks");
            rangeTwo = moment(dateOne).subtract(8, "weeks");
        } else {
            rangeOne = moment(dateOne).subtract(1, period.key);
            rangeTwo = moment(dateOne).subtract(2, period.key);
        }
        return {
            rangeOne: {
                start: rangeOne.format("YYYY-MM-DD"),
                end: rangeOne.format("YYYY-MM-DD")
            },
            rangeTwo: {
                start: rangeTwo.format("YYYY-MM-DD"),
                end: rangeTwo.format("YYYY-MM-DD")
            }
        };
    },
    // TODO
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
        const dateRanges = this.getDateRanges();
        return ["Data"].concat([
            moment(dateRanges.rangeOne.start).format("MMM DD, YYYY"),
            moment(dateRanges.rangeTwo.start).format("MMM DD, YYYY")
        ]);
    },
    getDateWindow: function () {
        const {period} = this.props.chart[0].date;
        if (period.key === "years" || period.key === "months") {
            // Get date window from 0 (1 Jan 1970) to 4 weeks later.
            return [0, moment(0).add(4, "weeks").valueOf()];
        }
        return [0, moment(0).add(1, period.key).valueOf()];
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
    getXTickerLabel: function (delta, rangeOne, rangeTwo) {
        return {
            v: delta,
            label: [
                "<small>" + rangeOne + "</small>",
                "<small style='color:red;'>" + rangeTwo + "</small>"
            ].join("<br />")
        };
    },
    xTicker: function () {
        const self = this;
        const {period} = self.props.chart[0].date;
        const dateRanges = self.getDateRanges();
        if (period.key === "days") {
            // Range of 24h.
            return range(0, 25).map(n => {
                const delta = moment(0).add(n, "hours").valueOf();
                var rangeOne = moment(dateRanges.rangeOne.start).add(n, "hours");
                var rangeTwo = moment(dateRanges.rangeTwo.start).add(n, "hours");
                if (n === 0) {
                    // In the first tick of the day, write day and month.
                    rangeOne.format("DD MMM");
                    rangeTwo.format("DD MMM");
                } else {
                    // In the other tick, write hour and minutes.
                    rangeOne.format("HH:mm");
                    rangeTwo.format("HH:mm");
                }
                return self.getXTickerLabel(delta, rangeOne, rangeTwo);
            });
        }
        if (period.key === "weeks") {
            // Range of 1 week --> 7 days.
            return range(0, 8).map(function (n) {
                const delta = moment(0).add(n, "days").valueOf();
                const rangeOne = moment(dateRanges.rangeOne.start).add(n, "days").format("DD MMM");
                const rangeTwo = moment(dateRanges.rangeTwo.start).add(n, "days").format("DD MMM");
                return self.getXTickerLabel(delta, rangeOne, rangeTwo);
            });
        }
        if (period.key === "months" || period.key === "years") {
            // Range of 4 weeks --> 28 days.
            return range(0, 29).map(function (n) {
                const delta = moment(0).add(n, "days").valueOf();
                var rangeOne = moment(dateRanges.rangeOne.start).add(n, "days");
                var rangeTwo = moment(dateRanges.rangeTwo.start).add(n, "days");
                if (n === 0 && period.key === "months") {
                    // In the first tick of the month, write day and month.
                    rangeOne.format("DD MMM");
                    rangeTwo.format("DD MMM");
                } else if (n === 0 && period.key === "years") {
                    // In the first tick of the year, write the year.
                    rangeOne.format("YYYY");
                    rangeTwo.format("YYYY");
                } else if (rangeOne.format("DD") === "01") {
                    // If is the first of the month, write also the month.
                    rangeOne.format("DD MMM");
                    rangeTwo.format("DD");
                } else if (rangeTwo.format("DD") === "01") {
                    // If is the first of the month, write also the month.
                    rangeOne.format("DD");
                    rangeTwo.format("DD MMM");
                } else {
                    // In the other cases, write only the day
                    rangeOne.format("DD");
                    rangeTwo.format("DD");
                }
                return self.getXTickerLabel(delta, rangeOne, rangeTwo);
            });
        }
        return [];
    },
    render: function () {
        const source = this.props.chart[0].source;
        /*
        *   `y2label` is empty. It's a workaround to prevent this dygraph
        *    bug: https://github.com/danvk/dygraphs/issues/629
        */
        return (
            <components.TemporalLineGraph
                colors={[source.color, colors.lineCompare]}
                coordinates={this.getCoordinates()}
                dateWindow={this.getDateWindow()}
                labels={this.getLabels()}
                lockInteraction={true}
                ref="temporalLineGraph"
                site={this.props.sites[0] || Map()}
                xLegendFormatter={this.xLegendFormatter}
                xTicker={this.xTicker}
                y2label={" "}
                yLabel={this.props.getYLabel(this.props.chart[0].sensorId)}
            />
        );
    }
});

module.exports = DateCompare;
