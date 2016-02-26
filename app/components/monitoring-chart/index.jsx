import React from "react";
import ReactHighstock from "react-highcharts/bundle/ReactHighstock"; // Highstock is bundled

var MonitoringChart = React.createClass({
    propTypes: {
        series: React.PropTypes.array.isRequired,
        type: React.PropTypes.string.isRequired
    },
    getRandomValue: function () {
        return Math.floor((Math.random() * 100) + 1);
    },
    getHighstockCoordinate: function () {
        var self = this;
        var series = [];
        var occurences = 1000;
        var currentTime = new Date();

        this.props.series.forEach (function (item) {
            series.push({
                name: item.fields.name,
                data: [[currentTime.getTime(), self.getRandomValue()]]
            });
        });

        series.push();
        for (let i = 1; i < occurences; i++) {
            currentTime.setDate(currentTime.getDate() + 1);

            this.props.series.forEach (function (item, index) {
                series[index].data.push([currentTime.getTime(), self.getRandomValue()]);
            });
        }

        return {
            series: series
        };
    },
    getHighstockConfig: function () {
        return {
            chart: {
                type: this.props.type
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: true
            },
            rangeSelector: {
                selected: 1
            },
            title: {
                text: "Highstock"
            },
            ...this.getHighstockCoordinate()
        };
    },
    render: function () {
        return (
            <ReactHighstock config = {this.getHighstockConfig()} />
        );
    }
});

module.exports = MonitoringChart;