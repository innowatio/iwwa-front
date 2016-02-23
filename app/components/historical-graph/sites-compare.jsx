import {Map} from "immutable";
import IPropTypes from "react-immutable-proptypes";
import Radium from "radium";
import React, {PropTypes} from "react";
import ReactPureRender from "react-addons-pure-render-mixin";

import components from "components";
import readingsDailyAggregatesToDygraphData from "lib/readings-daily-aggregates-to-dygraph-data";
import {defaultTheme} from "lib/theme";

var sitesCompare = React.createClass({
    propTypes: {
        chart: PropTypes.arrayOf(PropTypes.object),
        getYLabel: PropTypes.func,
        misure: IPropTypes.map,
        sites: PropTypes.arrayOf(IPropTypes.map)
    },
    contextTypes: {
        theme: PropTypes.object
    },
    mixins: [ReactPureRender],
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getCoordinates: function () {
        return readingsDailyAggregatesToDygraphData(this.props.misure, this.props.chart);
    },
    getLabels: function () {
        return ["Data"].concat([this.props.chart[0].sensorId, this.props.chart[1].sensorId]);
    },
    render: function () {
        const {colors} = this.getTheme();
        return (
            <components.TemporalLineGraph
                colors={[this.props.chart[0].source.color, colors.lineCompare]}
                coordinates={this.getCoordinates() || []}
                dateFilter={this.props.chart[0].date}
                labels={this.getLabels()}
                ref="temporalLineGraph"
                site={this.props.sites[0] || Map()}
                xLabel=""
                yLabel={this.props.getYLabel(this.props.chart[0].measurementType)}
            />
        );
    }
});

module.exports = Radium(sitesCompare);
