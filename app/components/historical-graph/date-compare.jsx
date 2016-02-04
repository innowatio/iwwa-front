import React, {PropTypes} from "react";
import {Map} from "immutable";
import {range} from "ramda";
import moment from "moment";
import ReactPureRender from "react-addons-pure-render-mixin";
import IPropTypes from "react-immutable-proptypes";

import * as colors from "lib/colors_restyling";
import components from "components";
import readingsDailyAggregatesToDygraphData from "lib/readings-daily-aggregates-to-dygraph-data";

var DateCompare = React.createClass({
    propTypes: {
        chart: PropTypes.arrayOf(PropTypes.object).isRequired,
        getYLabel: React.PropTypes.func.isRequired,
        misure: IPropTypes.map,
        sites: React.PropTypes.arrayOf(IPropTypes.map)
    },
    mixins: [ReactPureRender],
    getDatesFromChartState: function () {
        return this.props.chart.map(singleSelection => singleSelection.date);
    },
    getCoordinates: function () {
        return readingsDailyAggregatesToDygraphData(this.props.misure, this.props.chart);
    },
    getLabels: function () {
        const dates = this.getDatesFromChartState();
        return ["Data"].concat([
            moment.utc(dates[0].start).format("MMM DD, YYYY"),
            moment.utc(dates[1].start).format("MMM DD, YYYY")
        ]);
    },
    getDateWindow: function () {
        const {period, start} = this.props.chart[0].date;
        if (period.key === "years" || period.key === "months") {
            // Get date window from 0 (1 Jan 1970) to 5 or 6 weeks later (this is
            // found from the function `weeksToAdd`).
            return {
                start,
                dayToAdd: this.weeksToAdd() * 7,
                dateArray: [0, moment.utc(0).add({weeks: this.weeksToAdd()}).valueOf()]
            };
        }
        return {};
    },
    weeksToAdd: function () {
        const {start, end} = this.props.chart[0].date;
        return moment.utc(end).diff(start, "weeks");
    },
    xLegendFormatter: function (value) {
        return [
            "<b style='color:black;'>",
            "Giorno " + moment.utc(value).format("DD"),
            ", ",
            "ore " + moment.utc(value).format("HH:mm"),
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
        const dates = this.getDatesFromChartState();
        // if (period.key === "days") {
        //     // Range of 24h.
        //     return range(0, 25).map(n => {
        //         const delta = moment.utc(0).add(n, "hours").valueOf();
        //         var rangeOne = moment.utc(dates[0].start).add(n, "hours");
        //         var rangeTwo = moment.utc(dates[1].start).add(n, "hours");
        //         if (n === 0) {
        //             // In the first tick of the day, write day and month.
        //             rangeOne.format("DD MMM");
        //             rangeTwo.format("DD MMM");
        //         } else {
        //             // In the other tick, write hour and minutes.
        //             rangeOne.format("HH:mm");
        //             rangeTwo.format("HH:mm");
        //         }
        //         return self.getXTickerLabel(delta, rangeOne, rangeTwo);
        //     });
        // }
        // if (period.key === "weeks") {
        //     // Range of 1 week --> 7 days.
        //     return range(0, 8).map(function (n) {
        //         const delta = moment.utc(0).add(n, "days").valueOf();
        //         const rangeOne = moment.utc(dates[0].start).add(n, "days").format("DD MMM");
        //         const rangeTwo = moment.utc(dates[1].start).add(n, "days").format("DD MMM");
        //         return self.getXTickerLabel(delta, rangeOne, rangeTwo);
        //     });
        // }
        if (period.key === "months" || period.key === "years") {
            // Range of 5 or 6 weeks --> (5 || 6) * 7 days.
            return range(0, (this.weeksToAdd() * 7) + 1).map(n => {
                const delta = moment.utc(0).add(n, "days").valueOf();
                var rangeOne = moment.utc(dates[0].start).add(n, "days");
                var rangeTwo = moment.utc(dates[1].start).add(n, "days");
                if (n === 0 && period.key === "months") {
                    // In the first tick of the month, write the day and the month.
                    rangeOne = moment.utc(rangeOne).format("DD MMM");
                    rangeTwo = moment.utc(rangeTwo).format("DD MMM");
                } else if (n === 0 && period.key === "years") {
                    // In the first tick of the year, write the year.
                    rangeOne = moment.utc(rangeOne).format("YYYY");
                    rangeTwo = moment.utc(rangeTwo).format("YYYY");
                } else if (n === 1 && period.key === "years") {
                    // In the second tick of the year, write the day and the month.
                    rangeOne = moment.utc(rangeOne).format("DD MMM");
                    rangeTwo = moment.utc(rangeTwo).format("DD MMM");
                } else if (rangeOne.format("DD") === "01") {
                    // If is the first of the month, write also the month.
                    rangeOne = moment.utc(rangeOne).format("DD MMM");
                    rangeTwo = moment.utc(rangeTwo).format("DD");
                } else if (rangeTwo.format("DD") === "01") {
                    // If is the first of the month, write also the month.
                    rangeOne = moment.utc(rangeOne).format("DD");
                    rangeTwo = moment.utc(rangeTwo).format("DD MMM");
                } else {
                    // In the other cases, write only the day
                    rangeOne = moment.utc(rangeOne).format("DD");
                    rangeTwo = moment.utc(rangeTwo).format("DD");
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
