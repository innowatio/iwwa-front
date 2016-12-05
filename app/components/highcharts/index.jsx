import React, {PropTypes} from "react";
import {equals, range, isEmpty} from "ramda";
import ReactHighcharts from "react-highcharts/bundle/ReactHighcharts";

import Exporting from "highcharts-exporting";
Exporting(ReactHighcharts.Highcharts);
import OfflineExport from "highcharts-offline-exporting";
OfflineExport(ReactHighcharts.Highcharts);
import ExportCSV from "highcharts-export-csv";
ExportCSV(ReactHighcharts.Highcharts);

import {getYLabel} from "./highchart-utils";
import {defaultTheme} from "lib/theme";
import moment from "lib/moment";

var HighCharts = React.createClass({
    propTypes: {
        alarmsData: PropTypes.arrayOf(PropTypes.object),
        colors: PropTypes.arrayOf(PropTypes.string),
        config: PropTypes.object,
        coordinates: PropTypes.arrayOf(PropTypes.object),
        dateCompare: PropTypes.arrayOf(PropTypes.object),
        dateFilter: PropTypes.object,
        forceUpdate: PropTypes.bool,
        isComparationActive: PropTypes.bool,
        isDateCompareActive: PropTypes.bool,
        resetZoom: PropTypes.func.isRequired,
        setZoomExtremes: PropTypes.func.isRequired,
        xLabel: PropTypes.arrayOf(PropTypes.string),
        yLabel: PropTypes.arrayOf(PropTypes.string),
        zoom: PropTypes.arrayOf(PropTypes.object)
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getDefaultProps: function () {
        return {
            coordinates: {data: []},
            isDateCompareActive: false,
            isComparationActive: false,
            zoom: []
        };
    },
    componentDidMount: function () {
        this.setZoom();
        ReactHighcharts.Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });
    },
    shouldComponentUpdate: function (newProps) {
        return this.props.forceUpdate || !(
            equals(this.props.coordinates, newProps.coordinates) &&
            equals(this.props.alarmsData, newProps.alarmsData)
        );
    },
    componentDidUpdate: function () {
        this.setZoom();
    },
    setZoom: function () {
        const zoom = this.props.zoom;
        if (!isEmpty(zoom)) {
            const chart = this.refs.chart.getChart();
            chart.xAxis.forEach((xAxis, index) => xAxis.setExtremes(zoom[index].min, zoom[index].max));
            chart.showResetZoom();
        }
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getYAxis: function () {
        return this.props.yLabel.map((yLabelKey, index) => {
            return getYLabel(yLabelKey, this.props.colors[index]);
        });
    },
    onSetExtreme: function (e) {
        e.resetSelection ?
        this.props.resetZoom() :
        this.props.setZoomExtremes(e.xAxis.map(xAxis => ({max: xAxis.max, min: xAxis.min})));
    },
    getXAxis: function () {
        const {colors} = this.getTheme();
        return this.props.isDateCompareActive ? range(0, this.props.coordinates.length).map((a, index) => ({
            type: "datetime",
            labels: {
                style: {
                    color: index === 1 ? colors.lineCompare : colors.axisLabel
                }
            },
            min: this.props.dateCompare[index].start,
            max: this.props.dateCompare[index].end,
            plotBands: this.getWeekendOverlay()
        })) : {
            type: "datetime",
            labels: {
                style: {
                    color: colors.axisLabel
                }
            },
            plotBands: this.getWeekendOverlay()
        };
    },
    getWeekendOverlay: function () {
        var weekendOverlay = [];
        const date = this.props.dateFilter || this.props.dateCompare[0];
        const dayInFilter = moment.utc(date.end).diff(moment.utc(date.start), "days");
        const firstSaturday = moment.utc(date.start).isoWeekday(6);
        for (var i=0; i<=dayInFilter/7; i++) {
            weekendOverlay.push({
                from: moment.utc(firstSaturday).add({day: i * 7}).startOf("day").valueOf(),
                to: moment.utc(firstSaturday).add({day: 1 + (i * 7)}).endOf("day").valueOf(),
                color: this.getTheme().colors.graphUnderlay
            });
        }
        return weekendOverlay;
    },
    getAlarmLabel: function (measurementType) {
        switch (measurementType) {
            case "activeEnergy":
                return "Soglia di energia attiva superata";
            case "reactiveEnergy":
                return "Soglia di energia reattiva superata";
            case "maxPower":
                return "Soglia di potenza superata";
            default:
                return "Soglia superata";
        }
    },
    getAlarmsSeries: function (measurements) {
        const {alarmsData} = this.props;
        const alarmsSeries = alarmsData.map(alarm => {
            const data = alarm.measurementTimes.split(",").map(time => {
                return [parseInt(time), measurements.find(x => x[0] >= time)[1]];
            });
            return {
                type: "scatter",
                name: this.getAlarmLabel(alarm.measurementType),
                marker: {
                    radius: 6,
                    fillColor: "red",
                    symbol: "circle"
                },
                data
            };
        });
        return alarmsSeries;
    },
    getSeries: function () {
        const {isComparationActive, isDateCompareActive} = this.props;
        const series = this.props.coordinates.map((coordinate, index) => ({
            ...coordinate,
            connectNulls: true,
            turboThreshold: 0,
            color: this.props.colors[index],
            xAxis: isDateCompareActive ? index : 0,
            yAxis: (
                this.getYAxis().length > 1 &&
                index > 0 &&
                !(isComparationActive || isDateCompareActive) ?
                index : 0
            ),
            fillColor: {
                linearGradient: [0, 0, 0, 400],
                stops: [
                    [0, this.props.colors[index]],
                    [1, ReactHighcharts.Highcharts.Color(this.getTheme().colors.background).setOpacity(0).get("hex")]
                ]
            }
        }));

        const alarmSeries = this.getAlarmsSeries(series[0] ? series[0].data : []);

        return [
            ...series,
            ...alarmSeries
        ];
    },
    getConfig: function () {
        const {colors} = this.getTheme();
        let config = {
            chart: {
                backgroundColor: colors.background,
                events: {
                    selection: this.onSetExtreme
                },
                ignoreHiddenSeries: false,
                panning: true,
                panKey: "shift",
                type: "area",
                zoomType: "x"
            },
            credits: {
                enabled: false
            },
            exporting: {
                enabled: false,
                scale: 1,
                csv: {
                    lineDelimiter: "\n",
                    itemDelimiter: ";"
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    }
                }
            },
            series: this.getSeries(),
            title: null,
            xAxis: this.getXAxis(),
            yAxis: this.getYAxis(),

            // Override with custom config
            ...this.props.config
        };
        return config;
    },
    render: function () {
        return (
            <div>
                <ReactHighcharts config={this.getConfig()} ref="chart" />
            </div>
        );
    }
});

module.exports = HighCharts;
