import React, {PropTypes} from "react";
import moment from "moment";
import ReactHighcharts from "react-highcharts/bundle/ReactHighcharts";

import utils from "iwwa-utils";
import {defaultTheme} from "lib/theme";

var ConsumptionChart = React.createClass({
    propTypes:{
        collections: PropTypes.object,
        page: PropTypes.string
    },
    contextTypes: {
        theme: PropTypes.object
    },

    chartVisibility: function (page) {
        switch (page) {
            case "year":
                return {
                    visibility: "visible",
                    height: "auto"
                };
            default:
                return {
                    visibility: "hidden",
                    height: "0px"
                };
        }
    },

    getTheme: function () {
        return this.context.theme || defaultTheme;
    },

    getConfig: function () {
        const {colors} = this.getTheme();

        const categories = this.getCategories(0);
        const categoriesPy = this.getCategories(1);
        const cyData = this.getSeries(moment(), this.props.collections);
        const pyData = this.getSeries(moment().subtract(1, "years"), this.props.collections);
        var config = {
            chart: {
                backgroundColor: colors.background,
                events: {
                    selection: this.onSetExtreme
                },
                ignoreHiddenSeries: false,
                panning: true,
                panKey: "shift",
                type: "column"
            },
            title: {
                text: "Ultimi 12 mesi",
                style: {
                    color: colors.consumptionsText,
                    fontSize: "13px",
                    fontWeight: "300"
                }
            },
            credits: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            colors: [colors.primary, colors.secondary],
            xAxis: {
                categories: categories
            },
            yAxis: {
                min: 0,
                title: {
                    text: "Consumi"
                }
            },
            legend: {
                itemStyle: {
                    color: colors.consumptionsText
                },
                itemHoverStyle: {
                    color: colors.consumptionsText
                },
                itemHiddenStyle: {
                    color: colors.consumptionsText
                }
            },
            series: [
                {
                    name: "Reale",
                    data: cyData,
                    categories: categories

                },
                {
                    name: "Anno precedente",
                    data: pyData,
                    categories: categoriesPy
                }
            ],
            plotOptions: {
                column: {
                    pointPadding: 0.1,
                    borderWidth: 0
                }
            }
        };
        return config;
    },

    getCategories: function (period) {
        const categories =[];
        var lastDate = moment().subtract(period + 1, "years");
        for (var x=0; x < 12; x++) {
            const year = lastDate.format("YYYY");
            const month = lastDate.format("MMM");
            categories.push(month+" "+year);
            lastDate.add(1, "months");
        }
        return categories;
    },

    getSeries: function (lastDate, yearlyAggregate) {
        const series =[];
        lastDate.subtract(1, "years");
        for (var x=0; x < 12; x++) {
            const start = moment(lastDate).startOf("month");
            const end = moment(lastDate).endOf("month");

            const period = {
                start: start.format("YYYY-MM-DD HH:mm:ss"),
                end: end.format("YYYY-MM-DD HH:mm:ss")
            };

            const year = lastDate.format("YYYY");
            const filteredAggregated = yearlyAggregate.filter(agg => agg.get("year")=== year);

            series.push(utils.getSumByPeriod(period, filteredAggregated));
            lastDate.add(1, "months");
        }
        return series;
    },

    render: function () {
        return (
            <div style={this.chartVisibility(this.props.page)}>
                <ReactHighcharts config ={this.getConfig()} />
            </div>
        );
    }
});

module.exports = ConsumptionChart;
