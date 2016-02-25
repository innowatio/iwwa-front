import IPropTypes from "react-immutable-proptypes";
import React, {PropTypes} from "react";

import DateCompareGraph from "./date-compare";
import SourcesAndSensorsCompare from "./sources-and-sensors-compare";
import SitesCompareGraph from "./sites-compare";

var HistoricalGraph = React.createClass({
    propTypes: {
        chart: PropTypes.arrayOf(PropTypes.object).isRequired,
        getY2Label: PropTypes.func,
        getYLabel: PropTypes.func.isRequired,
        isComparationActive: PropTypes.bool,
        isDateCompareActive: PropTypes.bool,
        misure: IPropTypes.map.isRequired,
        sites: PropTypes.arrayOf(IPropTypes.map).isRequired
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
        if (this.props.isDateCompareActive) {
            return this.renderDateCompareGraph();
        }
        if (this.props.isComparationActive) {
            return this.renderSitesCompareGraph();
        }
        return this.renderValoriCompareGraph();
    },
    render: function () {
        return (
            <div style={{width: "100%", height: "100%"}}>
                {this.renderGraph()}
            </div>
        );
    }
});

module.exports = HistoricalGraph;
