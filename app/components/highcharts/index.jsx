import React, {PropTypes} from "react";
import {addIndex, map} from "ramda";
import ReactHighcharts from "react-highcharts/bundle/ReactHighcharts";
import Highcharts from "highcharts";
import moment from "moment";

import {getYLabel} from "./highchart-utils";
import {defaultTheme} from "lib/theme";

const mapIndexed = addIndex(map);

var HighCharts = React.createClass({
    propTypes: {
        colors: PropTypes.arrayOf(PropTypes.string),
        coordinates: PropTypes.arrayOf(PropTypes.object),
        dateFilter: PropTypes.object,
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
    getYAxis: function () {
        return mapIndexed((yLabelKey, index) => {
            return getYLabel(yLabelKey, this.props.colors[index]);
        }, this.props.yLabel);
    },
    getWeekendOverlay: function () {
        var weekendOverlay = [];
        const {dateFilter} = this.props;
        const dayInFilter = moment.utc(dateFilter.end).diff(moment.utc(dateFilter.start), "days");
        const firstSaturday = moment.utc(dateFilter.start).weekday(6);
        for (var i=0; i<=dayInFilter/7; i++) {
            weekendOverlay.push({
                from: moment.utc(firstSaturday).add({day: i*7}).startOf("day").valueOf(),
                to: moment.utc(firstSaturday).add({day: 1 + i*7}).endOf("day").valueOf(),
                color: this.getTheme().colors.graphUnderlay
            });
        }
        return weekendOverlay;
    },
    getSeries: function () {
        return mapIndexed((coordinate, index) => ({
            ...coordinate,
            connectNulls: true,
            turboThreshold: 0,
            color: this.props.colors[index],
            yAxis: this.getYAxis().length > 1 && index > 0 ? index : 0,
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
            legend: {
                itemHiddenStyle: {color: colors.legendLabelHidden},
                itemHoverStyle: {color: colors.legendLabelHover},
                itemStyle: {color: colors.axisLabel}
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
            xAxis: {
                labels: {
                    style: {
                        color: colors.axisLabel
                    }
                },
                plotBands: this.getWeekendOverlay(),
                type: "datetime"
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
