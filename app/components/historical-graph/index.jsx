import IPropTypes from "react-immutable-proptypes";
import React, {PropTypes} from "react";
import ReactPureRender from "react-addons-pure-render-mixin";
import titleCase from "title-case";
import {uniq} from "ramda";

import icons from "lib/icons";
import colors from "lib/colors";
import components from "components";
import DateCompareGraph from "./date-compare";
import ValoriCompareGraph from "./valori-compare";
import SitesCompareGraph from "./sites-compare";

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
    mixins: [ReactPureRender],
    exportPNG: function () {
        return this.refs.temporalLineGraph.exportPNG;
    },
    renderSiteTitle: function (site) {
        return site ? (
            <span>
                <strong>
                    {titleCase(site.get("name"))}
                </strong>
            </span>
        ) : null;
    },
    renderSensorTitle: function (sensor) {
        return sensor ? (
            <span>
                <strong>
                    {sensor}
                </strong>
            </span>
        ) : null;
    },
    renderTitle: function (singleSelectionChart, idx) {
        const numberOfSelectionInGraph = this.props.chart.length;
        return (
            <span key={idx}>
                {this.renderSiteTitle(this.props.sites[idx])}
                {" - "}
                {this.renderSensorTitle(singleSelectionChart.sensorId)}
                {numberOfSelectionInGraph > idx + 1 ? " & " : null}
            </span>
        );
    },
    renderDateCompareGraph: function () {
        return <DateCompareGraph {...this.props} ref="compareGraph"/>;
    },
    renderSitesCompareGraph: function () {
        return <SitesCompareGraph {...this.props} ref="compareGraph"/>;
    },
    renderValoriCompareGraph: function () {
        return <ValoriCompareGraph {...this.props} ref="compareGraph"/>;
    },
    renderGraph: function () {
        const site = uniq(this.props.chart.map(singleSelection => singleSelection.site));
        if (this.props.isDateCompareActive) {
            return this.renderDateCompareGraph();
        }
        if (site.length > 1) {
            return this.renderSitesCompareGraph();
        }
        return this.renderValoriCompareGraph();
    },
    render: function () {
        return (
            <div style={{width: "100%", height: "100%"}}>
                <h3 className="text-center" style={{marginTop: "20px"}}>
                    {this.props.chart.map(this.renderTitle)}
                </h3>
                <h4 className="text-center" style={{color: colors.greySubTitle}}>
                    {this.props.chart[0].measurementType.label}
                </h4>
                <div
                    onClick={this.props.resetCompare}
                    style={{
                        display: this.props.isComparationActive ? "flex" : "none",
                        positeson: "relative",
                        marginLeft: "50px",
                        cursor: "pointer"
                    }}
                >
                    <img src={icons.iconLogoutColor} style={{width: "30px", height: "20px"}}/>
                    <components.Spacer direction="h" size={5} />
                    {"Esci dal confronto"}
                </div>
                {this.renderGraph()}
            </div>
        );
    }
});

module.exports = HistoricalGraph;
