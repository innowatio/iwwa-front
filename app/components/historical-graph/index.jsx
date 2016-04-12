import IPropTypes from "react-immutable-proptypes";
import React, {PropTypes} from "react";

import DateCompare from "./date-compare";
import SourcesAndSensorsCompare from "./sources-and-sensors-compare";
import SitesCompare from "./sites-compare";

var HistoricalGraph = React.createClass({
    propTypes: {
        chartState: PropTypes.shape({
            zoom: PropTypes.arrayOf(PropTypes.object),
            charts: PropTypes.arrayOf(PropTypes.object).isRequired
        }).isRequired,
        isComparationActive: PropTypes.bool,
        isDateCompareActive: PropTypes.bool,
        misure: IPropTypes.map.isRequired,
        resetZoom: PropTypes.func.isRequired,
        setZoomExtremes: PropTypes.func.isRequired
    },
    renderGraph: function () {
        if (this.props.isDateCompareActive) {
            return <DateCompare {...this.props} ref="graphType" />;
        }
        if (this.props.isComparationActive) {
            return <SitesCompare {...this.props}  ref="graphType" />;
        }
        return <SourcesAndSensorsCompare {...this.props}  ref="graphType" />;
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
