import IPropTypes from "react-immutable-proptypes";
import React, {PropTypes} from "react";
import ReactPureRender from "react-addons-pure-render-mixin";
import {uniq} from "ramda";

import components from "components";
import DateCompareGraph from "./date-compare";
import SourcesAndSensorsCompare from "./sources-and-sensors-compare";
import SitesCompareGraph from "./sites-compare";
import {defaultTheme} from "lib/theme";

var HistoricalGraph = React.createClass({
    propTypes: {
        chart: PropTypes.arrayOf(PropTypes.object).isRequired,
        getY2Label: PropTypes.func,
        getYLabel: PropTypes.func.isRequired,
        isComparationActive: PropTypes.bool,
        isDateCompareActive: PropTypes.bool,
        misure: IPropTypes.map.isRequired,
        resetCompare: PropTypes.func.isRequired,
        sites: PropTypes.arrayOf(IPropTypes.map).isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },
    mixins: [ReactPureRender],
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    exportPNG: function () {
        return this.refs.temporalLineGraph.exportPNG;
    },
    renderDateCompareGraph: function () {
        return <DateCompareGraph {...this.props} ref="compareGraph"/>;
    },
    renderSitesCompareGraph: function () {
        return <SitesCompareGraph {...this.props} ref="compareGraph"/>;
    },
    renderValoriCompareGraph: function () {
        return <SourcesAndSensorsCompare {...this.props} ref="compareGraph"/>;
    },
    renderGraph: function () {
        const sites = uniq(this.props.chart.map(singleSelection => singleSelection.site));
        if (this.props.isDateCompareActive) {
            return this.renderDateCompareGraph();
        }
        if (sites.length > 1) {
            return this.renderSitesCompareGraph();
        }
        return this.renderValoriCompareGraph();
    },
    render: function () {
        const {colors} = this.getTheme();
        return (
            <div style={{width: "100%", height: "100%"}}>
                <div
                    onClick={this.props.resetCompare}
                    style={{
                        color: colors.resetCompare,
                        display: this.props.isComparationActive ? "flex" : "none",
                        positeson: "relative",
                        marginLeft: "50px",
                        cursor: "pointer"
                    }}
                >
                    <components.Icon
                        color={this.getTheme().colors.iconLogout}
                        icon={"logout"}
                        size={"28px"}
                        style={{lineHeight: "20px"}}
                    />
                    <components.Spacer direction="h" size={5} />
                    {"Esci dal confronto"}
                </div>
                {this.renderGraph()}
            </div>
        );
    }
});

module.exports = HistoricalGraph;
