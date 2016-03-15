import IPropTypes from "react-immutable-proptypes";
import {isEmpty, prop, map, uniq} from "ramda";
import React, {PropTypes} from "react";
import ReactPureRender from "react-addons-pure-render-mixin";
import moment from "moment";

import components from "components";
import readingsDailyAggregatesToHighchartsData from "lib/readings-daily-aggregates-to-highcharts-data";

var SourcesAndSensorsCompare = React.createClass({
    propTypes: {
        chart: PropTypes.arrayOf(PropTypes.object),
        misure: IPropTypes.map
    },
    mixins: [ReactPureRender],
    getCoordinates: function () {
        return readingsDailyAggregatesToHighchartsData(this.props.misure, this.props.chart);
    },
    getYLabel: function () {
        const measurementTypes = uniq(this.props.chart.map(singleSelection => singleSelection.measurementType));
        return map(prop("key"), measurementTypes);
    },
    getColors: function () {
        const sources = uniq(this.props.chart.map(singleSelection => singleSelection.source));
        var colors = map(prop("color"), sources);
        if (this.props.chart.length > 1 && prop("color", this.props.chart[1].measurementType)) {
            colors = [colors[0]].concat(prop("color", this.props.chart[1].measurementType));
        }
        return colors;
    },
    getDateFilter: function () {
        return (
            isEmpty(this.props.chart[0].date) ?
            {start: moment.utc().startOf("month").valueOf(), end: moment.utc().endOf("month").valueOf()} :
            this.props.chart[0].date
        );
    },
    render: function () {
        return (
            <components.HighCharts
                colors={this.getColors()}
                coordinates={this.getCoordinates()}
                dateFilter={this.getDateFilter()}
                yLabel={this.getYLabel()}
            />
        );
    }
});

module.exports = SourcesAndSensorsCompare;
