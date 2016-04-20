import React, {PropTypes} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {selectFavoriteChart} from "actions/monitoring-chart";

import {getKeyFromCollection} from "lib/collection-utils";
import {defaultTheme} from "lib/theme";

import {CollectionElementsTable, Icon, SectionToolbar} from "components";

var MonitoringFavoritesCharts = React.createClass({
    propTypes: {
        monitoringChart: PropTypes.object.isRequired,
        selectFavoriteChart: PropTypes.func.isRequired
    },
    contextTypes: {
        router: React.PropTypes.object,
        theme: PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getFavoritesChartsColumns: function () {
        const theme = this.getTheme();
        return [
            {
                key: "_id",
                style: function () {
                    return {
                        borderRight: "solid 1px black",
                        width: "96%",
                        height: "100%",
                        textAlign: "left"
                    };
                }
            },
            {
                key: "chart",
                style: function () {
                    return {
                        backgroundColor: "#535353",
                        width: "1%"
                    };
                },
                valueFormatter: (value, item) => (
                    <Icon
                        color={theme.colors.iconHeader}
                        icon={"chart"}
                        onClick={() => {
                            this.props.selectFavoriteChart(item);
                            this.context.router.push("/monitoring/chart/");
                        }}
                        size={"27px"}
                    />
                )
            },
            {
                key: "",
                valueFormatter: () => (
                    <div />
                )
            }
        ];
    },
    render: function () {
        const {colors} = this.getTheme();
        return (
            <div>
                <SectionToolbar backUrl={"/monitoring/chart/"} title={"Torna al monitoring"} />
                <div style={{
                    color: colors.white,
                    border: "grey solid 1px",
                    borderRadius: "30px",
                    background: colors.backgroundContentModal,
                    padding: 0,
                    margin: "20px",
                    textAlign: "center"
                }}
                >
                    <CollectionElementsTable
                        collection={this.props.monitoringChart.favorites}
                        columns={this.getFavoritesChartsColumns()}
                        getKey={getKeyFromCollection}
                        hover={true}
                        width={"100%"}
                        style={{color: "white", padding: "0"}}
                    />

                    <label style={{color: colors.navText, padding: "20px"}}>
                        {"Carica tutti"}
                    </label>
                </div>
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
