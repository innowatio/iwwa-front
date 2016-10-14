import IPropTypes from "react-immutable-proptypes";
import React, {PropTypes} from "react";
import ReactPureRender from "react-addons-pure-render-mixin";
import {isEmpty} from "ramda";

import components from "components";
import readingsDailyAggregatesToHighchartsData from "lib/readings-daily-aggregates-to-highcharts-data";
import {defaultTheme} from "lib/theme";
import moment from "lib/moment";

var SitesCompare = React.createClass({
    propTypes: {
        chartState: PropTypes.shape({
            zoom: PropTypes.arrayOf(PropTypes.object),
            charts: PropTypes.arrayOf(PropTypes.object).isRequired
        }).isRequired,
        isComparationActive: PropTypes.bool,
        misure: IPropTypes.map,
        resetZoom: PropTypes.func.isRequired,
        setZoomExtremes: PropTypes.func.isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },
    mixins: [ReactPureRender],
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getCoordinates: function () {
        return readingsDailyAggregatesToHighchartsData(this.props.misure, this.props.chartState.charts);
    },
    getDateFilter: function () {
        return (
            isEmpty(this.props.chartState.charts[0].date) ?
            {start: moment.utc().startOf("month").valueOf(), end: moment.utc().endOf("month").valueOf()} :
            this.props.chartState.charts[0].date
        );
    },
    render: function () {
        const {colors} = this.getTheme();
        const {charts} = this.props.chartState;
        return (
            <components.HighCharts
                colors={[charts[0].source.color, colors.lineCompare]}
                coordinates={this.getCoordinates()}
                dateFilter={this.getDateFilter()}
                isComparationActive={this.props.isComparationActive}
                ref="highcharts"
                resetZoom={this.props.resetZoom}
                setZoomExtremes={this.props.setZoomExtremes}
                yLabel={[charts[0].measurementType.key]}
                zoom={this.props.chartState.zoom}
            />
        );
    }
});

module.exports = SitesCompare;
