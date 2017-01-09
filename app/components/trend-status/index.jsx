import React from "react";
import * as bootstrap from "react-bootstrap";
import Radium from "radium";

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

    boxTitle: {
        fontSize: "20px",
        margin: "0px 0px 10px 0px",
        lineHeight: "20px",
        fontWeight: "300"
    }
});

class TrendStatus extends React.Component {

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
            {label: "Comfort:", key: "Comfort"},
            {label: "Consumo energetico:", key: "Consumo energetico"}
        ];
    }

    getTrendItems () {
        const theme = this.getTheme();
        return [
            {icon: "good-o", iconColor: theme.colors.iconActive, key: "good comfort", value: "35%"},
            {icon: "middle-o", iconColor: theme.colors.iconWarning, key: "middle comfort", value: "25%"},
            {icon: "bad-o", iconColor: theme.colors.iconError, key: "bad comfort", value: "40%"}
        ];
    }

    renderTabContent () {
        const theme = this.getTheme();
        const trendData = this.getTrendItems().map(item => {
            return (
                <div
                    key={item.key}
                    style={{
                        // float: "right",
                        // textAlign: "right",
                        // width: "75px"
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
        const trend = this.getTrendLabel().map(item => {
            return (
                <div
                    key={item.key}
                    style={{
                        // justifyContent: "space-between"
                        flexDirection: "column",
                        display: "flex",
                        marginBottom: "10px"
                    }}
                >
                    <span style={{
                        //width: "calc(100% - 75px)",
                        width: "100%",
                        ...styles(theme).trendText
                    }}>
                        {item.label}
                    </span>
                    <div style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        {trendData}
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
                    {this.renderTabContent(theme, tabParameters)}
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
        const theme = this.getTheme();
        return (
            <div style={styles(theme).dataWrp}>
                <h2 style={styles(theme).boxTitle}>
                    {"ANDAMENTO"}
                </h2>
                <div>
                    {this.renderTabs(theme)}
                </div>
            </div>
        );
    }

}

module.exports = TrendStatus;
