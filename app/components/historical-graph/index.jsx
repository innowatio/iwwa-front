import IPropTypes from "react-immutable-proptypes";
import React, {PropTypes} from "react";

import DateCompare from "./date-compare";
import SourcesAndSensorsCompare from "./sources-and-sensors-compare";
import SitesCompare from "./sites-compare";

var HistoricalGraph = React.createClass({
    propTypes: {
        chart: PropTypes.arrayOf(PropTypes.object).isRequired,
        isComparationActive: PropTypes.bool,
        isDateCompareActive: PropTypes.bool,
        misure: IPropTypes.map.isRequired
    },
    renderGraph: function () {
        if (this.props.isDateCompareActive) {
            return <DateCompare {...this.props}/>;
        }
        if (this.props.isComparationActive) {
            return <SitesCompare {...this.props}/>;
        }
        return <SourcesAndSensorsCompare {...this.props}/>;
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
