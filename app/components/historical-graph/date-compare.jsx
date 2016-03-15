import React, {PropTypes} from "react";
import moment from "moment";
import ReactPureRender from "react-addons-pure-render-mixin";
import IPropTypes from "react-immutable-proptypes";

import components from "components";
import readingsDailyAggregatesToHighchartsData from "lib/readings-daily-aggregates-to-highcharts-data";
import {defaultTheme} from "lib/theme";

var DateCompare = React.createClass({
    propTypes: {
        chart: PropTypes.arrayOf(PropTypes.object).isRequired,
        isDateCompareActive: PropTypes.bool,
        misure: IPropTypes.map
    },
    contextTypes: {
        theme: PropTypes.object
    },
    mixins: [ReactPureRender],
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getDatesFromChartState: function () {
        return this.props.chart.map(singleSelection => singleSelection.date);
    },
    getCoordinates: function () {
        return readingsDailyAggregatesToHighchartsData(this.props.misure, this.props.chart);
    },
    getXLabels: function () {
        const dates = this.getDatesFromChartState();
        return [
            moment.utc(dates[0].start).format("DD-MMM-YYYY"),
            moment.utc(dates[1].start).format("DD-MMM-YYYY")
        ];
    },
    render: function () {
        return (
            <components.HighCharts
                colors={[this.props.chart[0].source.color, this.getTheme().colors.lineCompare]}
                coordinates={this.getCoordinates()}
                dateFilter={this.getDatesFromChartState()[0]}
                isDateCompareActive={this.props.isDateCompareActive}
                xLabel={this.getXLabels()}
                yLabel={[this.props.chart[0].measurementType.key]}
            />
        );
    }
});

module.exports = DateCompare;
