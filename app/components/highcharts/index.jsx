import React, {PropTypes} from "react";
import {addIndex, map} from "ramda";
import ReactHighcharts from "react-highcharts/bundle/ReactHighcharts";

import {getYLabel} from "./highchart-utils";
import {defaultTheme} from "lib/theme";

const mapIndexed = addIndex(map);

var HighCharts = React.createClass({
    propTypes: {
        // alarms: PropTypes.arrayOf(PropTypes.number),
        colors: PropTypes.arrayOf(PropTypes.string),
        coordinates: PropTypes.arrayOf(PropTypes.object),
        // dateFilter: PropTypes.object,
        // dateWindow: PropTypes.object,
        // labels: PropTypes.array,
        // lockInteraction: PropTypes.bool,
        // showRangeSelector: PropTypes.bool,
        // site: IPropTypes.map,
        // xLabel: PropTypes.string,
        // xLegendFormatter: PropTypes.func,
        // xTicker: PropTypes.func,
        yLabel: PropTypes.arrayOf(PropTypes.string)
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getDefaultProps: function () {
        return {
            coordinates: {data: []}
        };
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getSeries: function () {
        return mapIndexed((coordinate, index) => ({
            ...coordinate,
            connectNulls: true,
            turboThreshold: 0,
            color: this.props.colors[index],
            yAxis: this.getYAxis().length > 1 && index > 0 ? index : 0
        }), this.props.coordinates);
    },
    getYAxis: function () {
        return mapIndexed((yLabelKey, index) => {
            return getYLabel(yLabelKey, this.props.colors[index]);
        }, this.props.yLabel);
    },
    getConfig: function () {
        return {
            chart: {
                zoomType: "x"
            },
            credits: {
                enabled: false
            },
            series: this.getSeries(),
            title: null,
            xAxis: {
                type: "datetime",
                color: this.getTheme().graphUnderlay
            },
            yAxis: this.getYAxis()
        };
    },
    render: function () {
        return (
            <div>
                <ReactHighcharts config={this.getConfig()} />
            </div>
        );
    }
});

module.exports = HighCharts;
