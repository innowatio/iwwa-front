import React, {PropTypes} from "react";
import {addIndex, map, range} from "ramda";
import ReactHighcharts from "react-highcharts/bundle/ReactHighcharts";
import Highcharts from "highcharts";
import moment from "moment";
import Exporting from "highcharts-exporting";
Exporting(ReactHighcharts.Highcharts);
import OfflineExport from "highcharts-offline-exporting";
OfflineExport(ReactHighcharts.Highcharts);
import ExportCSV from "highcharts-export-csv";
ExportCSV(ReactHighcharts.Highcharts);

import {getYLabel} from "./highchart-utils";
import {defaultTheme} from "lib/theme";

const mapIndexed = addIndex(map);

var HighCharts = React.createClass({
    propTypes: {
        colors: PropTypes.arrayOf(PropTypes.string),
        coordinates: PropTypes.arrayOf(PropTypes.object),
        dateCompare: PropTypes.arrayOf(PropTypes.object),
        dateFilter: PropTypes.object,
        isComparationActive: PropTypes.bool,
        isDateCompareActive: PropTypes.bool,
        xLabel: PropTypes.arrayOf(PropTypes.string),
        yLabel: PropTypes.arrayOf(PropTypes.string)
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getDefaultProps: function () {
        return {
            coordinates: {data: []},
            isDateCompareActive: false,
            isComparationActive: false
        };
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getYAxis: function () {
        return mapIndexed((yLabelKey, index) => {
            return getYLabel(yLabelKey, this.props.colors[index]);
        }, this.props.yLabel);
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
        const {dateFilter} = this.props;
        const dayInFilter = moment.utc(dateFilter.end).diff(moment.utc(dateFilter.start), "days");
        const firstSaturday = moment.utc(dateFilter.start).weekday(6);
        for (var i=0; i<=dayInFilter/7; i++) {
            weekendOverlay.push({
                from: moment.utc(firstSaturday).add({day: i * 7}).startOf("day").valueOf(),
                to: moment.utc(firstSaturday).add({day: 1 + (i * 7)}).endOf("day").valueOf(),
                color: this.getTheme().colors.graphUnderlay
            });
        }
        return weekendOverlay;
    },
    getSeries: function () {
        const {isComparationActive, isDateCompareActive} = this.props;
        return mapIndexed((coordinate, index) => ({
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
                    [1, Highcharts.Color(this.getTheme().colors.background).setOpacity(0).get("hex")]
                ]
            }
        }), this.props.coordinates);
    },
    getConfig: function () {
        const {colors} = this.getTheme();
        return {
            chart: {
                backgroundColor: colors.background,
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
            yAxis: this.getYAxis()
        };
    },
    render: function () {
        return (
            <div>
                <ReactHighcharts config={this.getConfig()} isPureConfig={true} ref="chart" />
            </div>
        );
    }
});

module.exports = HighCharts;
