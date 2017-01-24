import React, {PropTypes} from "react";
import * as bootstrap from "react-bootstrap";
import R from "ramda";
import Radium from "radium";
import moment from "moment";
import Immutable from "immutable";

import utils from "iwwa-utils";
import {defaultTheme} from "lib/theme";

import {
    Icon
} from "components";

const styles = ({colors}) => ({
    dataWrp:{
        minHeight: "200px",
        height: "auto",
        padding: "5px 10px",
        backgroundColor: colors.secondary,
        color: colors.white,
        marginBottom: "10px"
    },
    trendText: {
        height: "20px",
        lineHeight: "20px",
        fontSize: "14px",
        textAlign: "left",
        fontWeight: "300",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden"
    },
    boxTitle: {
        fontSize: "20px",
        margin: "0px 0px 10px 0px",
        lineHeight: "20px",
        fontWeight: "300"
    }
});

const DAILY_COMFORT = 24;

class TrendStatus extends React.Component {

    static propTypes = {
        statusAggregate: PropTypes.object.isRequired
    }

    constructor (props) {
        super(props);
        this.state ={};
    }

    getTheme () {
        return this.context.theme || defaultTheme;
    }

    getTitleTab (period) {
        switch (period) {
            case "day":
                return {
                    key: "day",
                    title: "GIORNO"
                };
            case "week":
                return {
                    key: "week",
                    title: "SETTIMANA"
                };
            case "month":
                return {
                    key: "month",
                    title: "MESE"
                };
            case "year":
                return {
                    key: "year",
                    title: "ANNO"
                };
            default:
                return {
                    key: "",
                    title: ""
                };
        }
    }

    getTabParameters () {
        const PERIODS = ["day", "week", "month", "year"];
        return PERIODS.map(period => this.getTitleTab(period));
    }

    getTrendLabel () {
        return [
            {label: "Comfort:", key: "comfort", iconGood: "good-o", iconMiddle: "middle-o", iconBad: "bad-o"},
            {label: "Consumo energetico:", key: "energy", iconGood: "consumption-o", iconMiddle: "consumption-o", iconBad: "consumption-o"}
        ];
    }

    getNumberOfReadings (key, defaultReadings) {
        switch (key) {
            case "week":
                return defaultReadings * 7;
            case "month":
                return defaultReadings * moment().daysInMonth();
            case "year":
                return defaultReadings * moment().endOf("year").diff(moment().startOf("year"), "days");
        }
        return defaultReadings;
    }

    getComfort (key) {
        var comfort ={red: 0, yellow: 0, green: 0, total:0};
        var nComfort = this.getNumberOfReadings(key, DAILY_COMFORT);

        if (this.props.statusAggregate.size>0) {
            var dateRange = utils.getTimeRangeByPeriod(key);

            this.props.statusAggregate.filter(value =>{
                return value.get("year") === moment().format("YYYY") &&
                value.get("measurementType") === "comfort";
            }).forEach(value => {
                const tot = parseFloat(utils.getSumByPeriod(dateRange, Immutable.Map({value})).toFixed(0));
                switch (Math.round(tot/nComfort)) {
                    case 0:
                        comfort.red +=1;
                        break;
                    case 1:
                        comfort.yellow +=1;
                        break;
                    case 2:
                        comfort.green +=1;
                        break;
                    default:
                }
                comfort.total +=1;
            });
        }
        return comfort;
    }

    getReference (key) {
        var reference ={red: 0, yellow: 0, green: 0, purple:0, total:0};
        if (this.props.statusAggregate.size>0) {
            const dateRange = utils.getTimeRangeByPeriod(key);
            const data = this.props.statusAggregate.filter(value =>{
                return value.get("year") === moment().format("YYYY") &&
                value.get("measurementType") === "activeEnergy";
            });

            const sensorsIds = R.uniq(data.map(x => x.get("sensorId")).toArray());

            sensorsIds.forEach(sensor => {
                const readingMap = data.filter(value =>{
                    return value.get("source") === "reading" &&
                        value.get("sensorId") === sensor;
                });
                const referenceMap = data.filter(value =>{
                    return value.get("source") === "reference" &&
                        value.get("sensorId") === sensor;
                });

                const referenceTot = parseFloat(utils.getSumByPeriod(dateRange, referenceMap).toFixed(2));
                const readingTot = parseFloat(utils.getSumByPeriod(dateRange, readingMap).toFixed(2));

                if (referenceTot != 0) {
                    const result = (readingTot-referenceTot) / referenceTot;
                    if (result <= -1) {
                        reference.purple += 1;
                    } else if (result > -1 && result <= -0.05) {
                        reference.green += 1;
                    } else if (result > -0.05 && result <= 0.1) {
                        reference.yellow += 1;
                    } else if (result > 0.1 && result < 1) {
                        reference.red += 1;
                    } else {
                        reference.purple += 1;
                    }
                    reference.total+= 1;
                }
            });
        }
        return reference;
    }

    getTrendItems (tabKey, item) {
        const theme = this.getTheme();
        const value = (item.key === "comfort") ? this.getComfort(tabKey) : this.getReference(tabKey);
        const green = (value.green / value.total * 100).toFixed(0);
        const yellow = (value.yellow / value.total * 100).toFixed(0);
        const red = (value.red / value.total * 100).toFixed(0);
        return [
            {
                icon: item.iconGood,
                iconColor: theme.colors.iconActive,
                key: "good",
                value: (isNaN(green) ? 0 : green) + "%"
            }, {
                icon: item.iconMiddle,
                iconColor: theme.colors.iconWarning,
                key: "middle",
                value: (isNaN(yellow) ? 0 : yellow) + "%"
            }, {
                icon: item.iconBad,
                iconColor: theme.colors.iconError,
                key: "bad",
                value: (isNaN(red) ? 0 : red) + "%"}
        ];
    }

    getTrendData (tabParameters, trendItem) {
        const theme = this.getTheme();
        const trendData = this.getTrendItems(tabParameters.key, trendItem).map(item => {
            return (
                <div
                    key={item.key}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >
                    <Icon
                        color={item.iconColor}
                        icon={item.icon}
                        size={"28px"}
                        style={{
                            marginRight: "5px",
                            width: "30px",
                            height: "30px",
                            lineHeight: "30px"
                        }}
                    />
                    <span style={{
                        ...styles(theme).trendText,
                        width: "auto",
                        display: "inline-block",
                        textAlign: "center"
                    }}>
                        {item.value}
                    </span>
                </div>
            );
        });
        return trendData;
    }

    renderTabContent (tabParameters) {
        const theme = this.getTheme();
        const trend = this.getTrendLabel().map(item => {
            return (
                <div
                    key={item.key}
                    style={{
                        flexDirection: "column",
                        display: "flex",
                        marginBottom: "10px"
                    }}
                >
                    <span style={{
                        width: "100%",
                        ...styles(theme).trendText
                    }}>
                        {item.label}
                    </span>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}>
                        {this.getTrendData(tabParameters, item)}
                    </div>
                </div>
            );
        });
        return trend;
    }

    renderSingleTab (theme, tabParameters) {
        return (
            <bootstrap.Tab
                className="style-single-tab"
                eventKey={tabParameters.key}
                key={tabParameters.key}
                title={tabParameters.title}
            >
                <div style={{marginTop: "5px"}}>
                    {this.renderTabContent(tabParameters)}
                </div>
            </bootstrap.Tab>
        );
    }

    renderTabs () {
        const theme = this.getTheme();
        return (
            <bootstrap.Tabs
                id={"trend-tabs"}
                className="style-tab"
                onSelect={this.onChangeTabValue}
            >
                <Radium.Style
                    rules={{
                        "ul": {
                            display: "flex",
                            overflow: "hidden",
                            border: "0px",
                            margin: "0 -10px",
                            alignContent: "stretch",
                            backgroundColor: theme.colors.primary
                        },
                        "ul li": {
                            flexGrow: "4",
                            justifyContent: "space-arund",
                            alignItems: "center",
                            color: theme.colors.white
                        },
                        "ul li a": {
                            lineHeight: "34px",
                            fontSize: "14px",
                            textTransform: "uppercase",
                            padding: "0px 2px"
                        },
                        ".nav-tabs > li > a": {
                            height: "34px",
                            color: theme.colors.white,
                            border: "0px",
                            outline: "none"
                        },
                        ".nav-tabs > li.active > a, .nav-tabs > li > a:hover, .nav-tabs > li.active > a:hover, .nav-tabs > li.active > a:focus": {
                            display: "inline",
                            height: "28px",
                            fontSize: "14px",
                            fontWeight: "400",
                            color: theme.colors.white,
                            border: "0px",
                            borderRadius: "0px",
                            outline: "none",
                            backgroundColor: theme.colors.primary,
                            outlineStyle: "none",
                            outlineWidth: "0px",
                            borderBottom: "3px solid" + theme.colors.buttonPrimary
                        },
                        ".nav > li > a:hover, .nav > li > a:focus": {
                            background: theme.colors.transparent
                        }
                    }}
                    scopeSelector=".style-tab"
                />
                {
                    this.getTabParameters().map(parameter => {
                        return this.renderSingleTab(theme, parameter);
                    })
                }
            </bootstrap.Tabs>
        );
    }

    render () {
        const start = moment().valueOf();
        const theme = this.getTheme();
        var result = (
            <div style={styles(theme).dataWrp}>
                <h2 style={styles(theme).boxTitle}>
                    {"ANDAMENTO"}
                </h2>
                <div>
                    {this.renderTabs(theme)}
                </div>
            </div>
        );
        console.log(`benchmark trend: ${moment().valueOf() - start} ms`);
        return result;
    }
}

module.exports = TrendStatus;
