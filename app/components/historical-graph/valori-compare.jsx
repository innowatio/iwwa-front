import Immutable from "immutable";
import IPropTypes from "react-immutable-proptypes";
import {prop, map, uniq} from "ramda";
import React, {PropTypes} from "react";
import ReactPureRender from "react-addons-pure-render-mixin";

import components from "components";
import readingsDailyAggregatesToDygraphData from "lib/readings-daily-aggregates-to-dygraph-data";

var ValoriCompare = React.createClass({
    propTypes: {
        chart: PropTypes.arrayOf(PropTypes.object),
        getY2Label: PropTypes.func,
        getYLabel: PropTypes.func,
        misure: IPropTypes.map,
        sites: PropTypes.arrayOf(IPropTypes.map)
    },
    mixins: [ReactPureRender],
    getCoordinates: function () {
        const start = Date.now();
        console.log("Start");
        const result = readingsDailyAggregatesToDygraphData(this.props.misure, this.props.chart);
        console.log(`Result in ${Date.now() - start}ms`);
        return result;
    },
    getLabels: function (sources) {
        var label = ["Data"].concat(
            map(prop("label"), sources)
        );
        if (this.props.chart.length > 1 && prop("label", this.props.chart[1].measurementType)) {
            label = label.concat(prop("label", this.props.chart[1].measurementType));
        }
        return label;
    },
    getColors: function (sources) {
        var colors = uniq(map(prop("color"), sources));
        if (this.props.chart.length > 1 && prop("color", this.props.chart[1].measurementType)) {
            colors = colors.concat(prop("color", this.props.chart[1].measurementType));
        }
        return colors;
    },
    render: function () {
        const sources = uniq(this.props.chart.map(singleSelection => singleSelection.source));
        return (
            <components.TemporalLineGraph
                alarms={this.props.chart[0].alarms}
                colors={this.getColors(sources)}
                coordinates={this.getCoordinates() || []}
                dateFilter={this.props.chart[0].date}
                labels={this.getLabels(sources)}
                ref="temporalLineGraph"
                showRangeSelector={true}
                site={this.props.sites[0] || Immutable.Map()}
                y2label={this.props.chart.length > 1 ? this.props.getY2Label(this.props.chart[1].measurementType.key) : null}
                yLabel={this.props.getYLabel(this.props.chart[0].measurementType.key)}
            />
        );
    }
});

module.exports = ValoriCompare;
