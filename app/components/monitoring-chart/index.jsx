import React from "react";
import {Button} from "react-bootstrap";
import ReactHighstock from "react-highcharts/bundle/ReactHighstock"; // Highstock is bundled
import {ObjectSelect} from "components";

const chartTypes = [
    {label: "Area", id: "areaspline"},
    {label: "Istogramma", id: "column"},
    {label: "In pila", id: "stacked"},
    {label: "In pila percentuale", id: "percent"}
];

let config;

var MonitoringChart = React.createClass({
    propTypes: {
        addToFavorite: React.PropTypes.func.isRequired,
        config: React.PropTypes.object,
        selectChartType: React.PropTypes.func.isRequired,
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
    getCommonConfig: function () {
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
                buttons: [
                    {type: "day", count: 1, text: "1d"},
                    {type: "week", count: 1, text: "1w"},
                    {type: "month", count: 1, text: "1m"},
                    {type: "year", count: 1, text: "1y"},
                    {type: "ytd", text: "YTD"},
                    {type: "all", text: "All"}
                ],
                selected: 2
            },
            title: {
                text: "Highstock"
            }
        };
    },
    getColumnConfig: function () {
        return {};
    },
    getStackedConfig: function () {
        return {};
    },
    getPercentConfig: function () {
        return {};
    },
    getAreasplineConfig: function () {
        return {};
    },
    getSpecificTypeConfig: function () {
        switch (this.props.type) {
            case "column":
                return this.getColumnConfig();
            case "stacked":
                return this.getStackedConfig();
            case "percent":
                return this.getPercentConfig();
            case "areaspline":
            default:
                return this.getAreasplineConfig();
        }
    },
    getHighstockConfig: function () {
        if (this.props.config) {
            config = this.props.config;
        } else {
            config = {
                ...this.getCommonConfig(),
                ...this.getSpecificTypeConfig(),
                ...this.getHighstockCoordinate()
            };
        }
        return config;
    },
    addToFavorite: function () {
        this.props.addToFavorite(config);
    },
    render: function () {
        return (
            <div>
                <ObjectSelect
                    options={chartTypes}
                    onBlur={this.props.selectChartType}
                    onChange={this.props.selectChartType}
                    value={this.props.type}
                />
                <Button bsStyle="primary" onClick={this.addToFavorite}>
                    {"Add to favorite"}
                </Button>
                <ReactHighstock config={this.getHighstockConfig()} />
            </div>
        );
    }
});

module.exports = MonitoringChart;