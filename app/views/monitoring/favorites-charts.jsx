import React, {PropTypes} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {selectFavoriteChart} from "actions/monitoring-chart";

import {SectionToolbar} from "components";

var MonitoringFavoritesCharts = React.createClass({
    propTypes: {
        selectFavoriteChart: PropTypes.func.isRequired
    },
    render: function () {
        return (
            <div>
                <SectionToolbar backUrl={"/monitoring/chart/"} title={"Torna al monitoring"} />
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    return {
        monitoringChart: state.monitoringChart
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        selectFavoriteChart: bindActionCreators(selectFavoriteChart, dispatch)
    };
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(MonitoringFavoritesCharts);