import IPropTypes from "react-immutable-proptypes";
import {prop, map, uniq} from "ramda";
import React, {PropTypes} from "react";
import ReactPureRender from "react-addons-pure-render-mixin";

import components from "components";
import readingsDailyAggregatesToHighchartsData from "lib/readings-daily-aggregates-to-highcharts-data";

var ValoriCompare = React.createClass({
    propTypes: {
        chart: PropTypes.arrayOf(PropTypes.object),
        getY2Label: PropTypes.func,
        getYLabel: PropTypes.func,
        misure: IPropTypes.map,
        sites: PropTypes.arrayOf(IPropTypes.map)
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
    render: function () {
        return (
            <components.HighCharts
                colors={this.getColors()}
                coordinates={this.getCoordinates()}
                yLabel={this.getYLabel()}
            />
        );
    }
});

module.exports = ValoriCompare;
