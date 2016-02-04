import {Map} from "immutable";
import IPropTypes from "react-immutable-proptypes";
import Radium from "radium";
import React, {PropTypes} from "react";
import ReactPureRender from "react-addons-pure-render-mixin";

import * as colors from "lib/colors_restyling";
import components from "components";
import readingsDailyAggregatesToDygraphData from "lib/readings-daily-aggregates-to-dygraph-data";

var sitesCompare = React.createClass({
    propTypes: {
        chart: PropTypes.arrayOf(PropTypes.object),
        getYLabel: PropTypes.func,
        misure: IPropTypes.map,
        sites: PropTypes.arrayOf(IPropTypes.map)
    },
    mixins: [ReactPureRender],
    getCoordinates: function () {
        return readingsDailyAggregatesToDygraphData(this.props.misure, this.props.chart);
    },
    getLabels: function () {
        var sitesLabels = this.props.sites.map((sito = Map()) => {
            return sito.get("name");
        });
        return ["Data"].concat(sitesLabels);
    },
    render: function () {
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
