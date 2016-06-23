import React, {PropTypes} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {selectFavoriteChart} from "actions/monitoring-chart";

// import {getKeyFromCollection} from "lib/collection-utils";
import {defaultTheme} from "lib/theme";
import {Button, CollectionItemList, Icon, SectionToolbar} from "components";


const styles = ({colors}) => ({
    headerContainer: {
        height: "50px",
        cursor: "pointer",
        borderTop: "1px solid " + colors.borderAlarmsRow,
        clear: "both",
        padding: "0px"
    },
    favouriteNameStyle: {
        width: "50%",
        float: "left",
        margin: "0px",
        padding: "0px 5px",
        fontSize: "18px",
        lineHeight: "48px",
        fontWeight: "300",
        color:colors.mainFontColor
    },
    hoverStyle: {
        clear: "both",
        backgroundColor: colors.backgroundMonitoringRowChart
    },
    lazyLoadButtonStyleContainer: {
        marginBottom: "50px",
        borderTop: "1px solid " + colors.mainFontColor
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
    renderFavoritesChartsColumns: function (element) {
        const theme = this.getTheme();
        return (
            <div style={styles(theme).headerContainer}>
                <div style={styles(theme).favouriteNameStyle}>
                    {element.get("name")}
                </div>
                <Button
                    className="pull-right"
                    style={{
                        backgroundColor: theme.colors.transparent,
                        border: "0px",
                        width: "60px",
                        height: "50px",
                        padding: "0px"
                    }}
                >
                    <Icon
                        color={theme.colors.iconHeader}
                        icon={"chart"}
                        onClick={() => {
                            this.props.selectFavoriteChart(element);
                            this.context.router.push("/monitoring/chart/");
                        }}
                        size={"34px"}
                        style={{verticalAlign: "middle", lineHeight: "55px"}}
                    />
                </Button>
            </div>
        );
    },
    render: function () {
        const theme = this.getTheme();
        return (
            <div>
                <SectionToolbar
                    backUrl={"/monitoring/chart/"}
                    title={"Torna al monitoring"}
                >
                    <div style={{float:"right", width: "auto"}}>
                        <Button
                            style={styles(theme).sectionToolbarIcon}
                            overStyle={{background:"blue"}}
                            activeStyle={{background:"red"}}
                        >
                            <Icon
                                color={theme.colors.iconAlarmAction}
                                icon={"star-o"}
                                size={"28px"}
                                style={{verticalAlign: "middle"}}
                            />
                        </Button>
                        <Button style={styles(theme).sectionToolbarIcon}>
                            <Icon
                                color={theme.colors.iconAlarmAction}
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
                    margin: "20px auto"
                }}>
                    <CollectionItemList
                        collections={this.props.monitoringChart.favorites}
                        headerComponent={this.renderFavoritesChartsColumns}
                        initialVisibleRow={10}
                        hover={true}
                        hoverStyle={styles(theme).hoverStyle}
                        lazyLoadButtonStyle={styles(theme).lazyLoadButtonStyle}
                        lazyLoadButtonStyleContainer={styles(theme).lazyLoadButtonStyleContainer}
                        lazyLoadLabel={"Carica altri"}
                        showFilterInput={true}
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
