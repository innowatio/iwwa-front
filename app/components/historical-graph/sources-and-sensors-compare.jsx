import IPropTypes from "react-immutable-proptypes";
import {isEmpty, prop, map, uniq} from "ramda";
import React, {PropTypes} from "react";
import ReactPureRender from "react-addons-pure-render-mixin";

import moment from "lib/moment";
import components from "components";
import readingsDailyAggregatesToHighchartsData from "lib/readings-daily-aggregates-to-highcharts-data";

var SourcesAndSensorsCompare = React.createClass({
    propTypes: {
        alarmsData: PropTypes.arrayOf(PropTypes.object),
        chartState: PropTypes.shape({
            zoom: PropTypes.arrayOf(PropTypes.object),
            charts: PropTypes.arrayOf(PropTypes.object).isRequired
        }).isRequired,
        misure: IPropTypes.map,
        resetZoom: PropTypes.func.isRequired,
        setZoomExtremes: PropTypes.func.isRequired
    },
    mixins: [ReactPureRender],
    getCoordinates: function () {
        return readingsDailyAggregatesToHighchartsData(this.props.misure, this.props.chartState.charts);
    },
    getYLabel: function () {
        const chartFilter = this.props.chartState.charts;
        const measurementTypes = uniq(
            chartFilter.map(singleSelection => singleSelection.measurementType)
        );
        return map(prop("key"), measurementTypes);
    },
    getColors: function () {
        const chartFilter = this.props.chartState.charts;
        const sources = uniq(chartFilter.map(singleSelection => singleSelection.source));
        var colors = map(prop("color"), sources);
        if (chartFilter.length > 1 && prop("color", chartFilter[1].measurementType)) {
            colors = [colors[0]].concat(prop("color", chartFilter[1].measurementType));
        }
        return colors;
    },
    getDateFilter: function () {
        return (
            isEmpty(this.props.chartState.charts[0].date) ?
            {start: moment().startOf("month").valueOf(), end: moment().endOf("month").valueOf()} :
            this.props.chartState.charts[0].date
        );
    },
    setZoomExtremes: function (zoom) {
        this.props.setZoomExtremes(zoom);
    },
    render: function () {
        const {
            alarmsData,
            chartState,
            resetZoom
        } = this.props;
        return (
            <components.HighCharts
                alarmsData={alarmsData}
                colors={this.getColors()}
                coordinates={this.getCoordinates()}
                dateFilter={this.getDateFilter()}
                ref="highcharts"
                resetZoom={resetZoom}
                setZoomExtremes={this.setZoomExtremes}
                yLabel={this.getYLabel()}
                zoom={chartState.zoom}
            />
        );
    }
});

module.exports = SourcesAndSensorsCompare;
