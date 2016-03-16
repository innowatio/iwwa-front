import Immutable from "immutable";
import R from "ramda";
import React, {PropTypes} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {addToFavorite, changeYAxisValues, selectChartType, selectFavoriteChart} from "actions/monitoring-chart";

import {getKeyFromCollection} from "lib/collection-utils";
import {styles} from "lib/styles_restyling";
import {defaultTheme} from "lib/theme";

import {Button, CollectionElementsTable, DropdownButton, Icon, MonitoringChart, Popover, SectionToolbar} from "components";

const buttonStyle = ({colors}) => ({
    backgroundColor: colors.buttonPrimary,
    border: "0px none",
    borderRadius: "100%",
    height: "50px",
    margin: "auto",
    width: "50px",
    marginLeft: "10px"
});

let advancedOptions = function ({colors}) {
    return [];
};

var MonitoringChartView = React.createClass({
    propTypes: {
        addToFavorite: PropTypes.func.isRequired,
        changeYAxisValues: PropTypes.func.isRequired,
        monitoringChart: PropTypes.object.isRequired,
        selectChartType: PropTypes.func.isRequired,
        selectFavoriteChart: PropTypes.func.isRequired,
        selected: PropTypes.array
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getFavoritesChartsColumns: function () {
        return [
            {key: "_id"}
        ];
    },
    getChartSeries: function () {
        let measures = this.props.collections.get("readings-daily-aggregates") || Immutable.Map();
        console.log(measures);
        //TODO prendere le misure
        return this.props.selected;
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    render: function () {
        const theme = this.getTheme();
                    //<Button style={buttonStyle(theme)}>
                    //    <Icon
                    //        color={theme.colors.iconHeader}
                    //        icon={"star"}
                    //        size={"28px"}
                    //        style={{lineHeight: "20px"}}
                    //    />
                    //</Button>
        return (
            <div>
                <SectionToolbar backUrl={"/monitoring/"} title={"Torna alla gestione item"}>
                    <Popover
                        className="pull-right"
                        hideOnChange={true}
                        style={styles(theme).chartPopover}
                        title={
                            <Icon
                                color={theme.colors.iconHeader}
                                icon={"settings"}
                                size={"32px"}
                                style={{lineHeight: "20px", verticalAlign: "middle"}}
                            />
                        }
                    >
                        <DropdownButton
                            allowedValues={advancedOptions(this.getTheme())}
                            getColor={R.prop("color")}
                            getIcon={R.prop("iconClass")}
                            getKey={R.prop("key")}
                            getLabel={R.prop("label")}
                            style={styles(theme).chartDropdownButton}
                        />
                    </Popover>
                </SectionToolbar>

                <div>
                    <label style={{color: theme.colors.navText}}>
                        {"Grafici preferiti"}
                    </label>
                    <CollectionElementsTable
                        collection={this.props.monitoringChart.favorites}
                        columns={this.getFavoritesChartsColumns()}
                        getKey={getKeyFromCollection}
                        hover={true}
                        onRowClick={this.props.selectFavoriteChart}
                        width={"60%"}
                        style={{color: "white"}}
                    />
                </div>

                <MonitoringChart
                    addToFavorite={this.props.addToFavorite}
                    onChangeYAxisValues={this.props.changeYAxisValues}
                    chartState={this.props.monitoringChart}
                    selectChartType={this.props.selectChartType}
                    series={this.getChartSeries()}
                />
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    return {
        monitoringChart: state.monitoringChart,
        selected: state.sensors.selectedSensors
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addToFavorite: bindActionCreators(addToFavorite, dispatch),
        changeYAxisValues: bindActionCreators(changeYAxisValues, dispatch),
        selectChartType: bindActionCreators(selectChartType, dispatch),
        selectFavoriteChart: bindActionCreators(selectFavoriteChart, dispatch)
    };
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(MonitoringChartView);