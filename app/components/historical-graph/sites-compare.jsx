import IPropTypes from "react-immutable-proptypes";
import React, {PropTypes} from "react";
import ReactPureRender from "react-addons-pure-render-mixin";
import {isEmpty} from "ramda";
import moment from "moment";

import components from "components";
import readingsDailyAggregatesToHighchartsData from "lib/readings-daily-aggregates-to-highcharts-data";
import {defaultTheme} from "lib/theme";

var SitesCompare = React.createClass({
    propTypes: {
        chart: PropTypes.arrayOf(PropTypes.object),
        isComparationActive: PropTypes.bool,
        misure: IPropTypes.map
    },
    contextTypes: {
        theme: PropTypes.object
    },
    mixins: [ReactPureRender],
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getCoordinates: function () {
        return readingsDailyAggregatesToHighchartsData(this.props.misure, this.props.chart);
    },
    getDateFilter: function () {
        return (
            isEmpty(this.props.chart[0].date) ?
            {start: moment.utc().startOf("month").valueOf(), end: moment.utc().endOf("month").valueOf()} :
            this.props.chart[0].date
        );
    },
    render: function () {
        const {colors} = this.getTheme();
        return (
            <components.HighCharts
                colors={[this.props.chart[0].source.color, colors.lineCompare]}
                coordinates={this.getCoordinates()}
                dateFilter={this.getDateFilter()}
                isComparationActive={this.props.isComparationActive}
                yLabel={[this.props.chart[0].measurementType.key]}
            />
        );
    }
});

module.exports = SitesCompare;
