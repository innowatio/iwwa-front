import React, {PropTypes} from "react";
import {map} from "ramda";
import ReactHighcharts from "react-highcharts/bundle/ReactHighcharts";

var HighCharts = React.createClass({
    propTypes: {
        // alarms: PropTypes.arrayOf(PropTypes.number),
        // colors: PropTypes.arrayOf(PropTypes.string),
        coordinates: PropTypes.arrayOf(PropTypes.number)
        // dateFilter: PropTypes.object,
        // dateWindow: PropTypes.object,
        // labels: PropTypes.array,
        // lockInteraction: PropTypes.bool,
        // showRangeSelector: PropTypes.bool,
        // site: IPropTypes.map,
        // xLabel: PropTypes.string,
        // xLegendFormatter: PropTypes.func,
        // xTicker: PropTypes.func,
        // y2Label: PropTypes.string,
        // yLabel: PropTypes.string
    },
    getSeries: function () {
        return map(coordinate => ({
            ...coordinate,
            connectNulls: true
        }), this.props.coordinates);
    },
    getConfig: function () {
        return {
            xAxis: {
                type: "datetime"
            },
            series: this.getSeries()
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
