import React, {PropTypes} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {selectFavoriteChart} from "actions/monitoring-chart";

// import {getKeyFromCollection} from "lib/collection-utils";
import {defaultTheme} from "lib/theme";
import {Button, CollectionItemList, Icon, SectionToolbar} from "components";


const styles = ({colors}) => ({
    hoverStyle: {
        clear: "both",
        backgroundColor: colors.backgroundMonitoringRowChart
    },
    lazyLoadButtonStyleContainer: {
        marginBottom: "50px"
    },
    lazyLoadButtonStyle: {
        width: "230px",
        height: "45px",
        lineHeight: "43px",
        backgroundColor: colors.buttonPrimary,
        fontSize: "14px",
        color: colors.white,
        textTransform: "uppercase",
        fontWeight: "400",
        margin: "10px auto 0 auto",
        borderRadius: "30px",
        cursor: "pointer",
        textAlign: "center"
    },
    sectionToolbarIcon: {
        marginTop: "6px",
        marginRight: "10px",
        backgroundColor: colors.primary,
        width: "43px",
        height: "43px",
        lineHeight: "45px",
        borderRadius: "100%",
        padding: "0px",
        border: "0px",
        textAlign: "center"
    }
});

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
    renderFavoritesChartsColumns: function () {
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
                <SectionToolbar
                    backUrl={"/monitoring/chart/"}
                    title={"Torna al monitoring"}
                >
                    <div style={{float:"right", width: "auto"}}>
                        <Button style={styles(this.getTheme()).sectionToolbarIcon}>
                            <Icon
                                color={colors.iconAlarmAction}
                                icon={"star-o"}
                                size={"28px"}
                                style={{verticalAlign: "middle"}}
                            />
                        </Button>
                        <Button style={styles(this.getTheme()).sectionToolbarIcon}>
                            <Icon
                                color={colors.iconAlarmAction}
                                icon={"edit"}
                                size={"28px"}
                                style={{verticalAlign: "middle"}}
                            />
                        </Button>
                    </div>
                </SectionToolbar>
                <div style={{
                    height: "calc(100vh - 230px)",
                    width: "95%",
                    margin: "20px auto",
                    border: "1px solid " + colors.borderContentModal,
                    borderRadius: "30px",
                    background: colors.backgroundContentModal
                }}
                >
                    <CollectionItemList
                        collections={this.props.monitoringChart.favorites}
                        headerComponent={this.renderFavoritesChartsColumns}
                        initialVisibleRow={16}
                        filter={this.getSearchFilter}
                        hover={true}
                        hoverStyle={styles(this.getTheme()).hoverStyle}
                        lazyLoadButtonStyle={styles(this.getTheme()).lazyLoadButtonStyle}
                        lazyLoadButtonStyleContainer={styles(this.getTheme()).lazyLoadButtonStyleContainer}
                        lazyLoadLabel={"Carica altri"}
                        showFilterInput={false}
                    />
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
