var bootstrap  = require("react-bootstrap");
var Radium     = require("radium");
var React      = require("react");

var components   = require("components");

import {defaultTheme} from "lib/theme";

var styleH2 = ({colors}) => ({
    fontSize:"20px",
    textTransform:"uppercase",
    color: colors.white
});

var styleH3 = ({colors}) => ({
    fontSize:"30px",
    textTransform:"uppercase",
    color: colors.white
});

var styleRoundedDiv = ({colors}) => ({
    borderRadius: "100%",
    margin: "50px auto",
    width: "261px",
    height: "261px",
    backgroundColor: colors.secondary
});

var styleMeasure  = ({colors}) => ({
    fontSize:"120px",
    fontWeight:"700",
    color: colors.white
});

var styleUnit  = ({colors}) => ({
    fontSize:"60px",
    fontWeight:"500",
    lineHeight: "40px",
    margin: "0",
    padding: "0",
    color: colors.white
});

var styleTabContent  = ({colors}) => ({
    width:"70%",
    textAlign: "center",
    padding: "50px 0",
    backgroundColor: colors.primary
});

var SummaryConsumptions = React.createClass({
    propTypes: {
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getTabParameters: function () {
        return [{periodMessage: "OGGI HAI UTILIZZATO", measureValue: "48", measureUnit: "kWh", period: "5 FEBBRAIO 2016", title: "oggi"}];
    },
    renderSingleTab: function (siteName, theme, tabParameters) {
        console.log(tabParameters);
        return (
            <bootstrap.Tab eventKey={1} title={tabParameters.title}>
                {this.renderTabContent(siteName, theme, tabParameters)}
            </bootstrap.Tab>
        );
    },
    renderTabs: function (theme) {
        var siteName = "Nome sito";
        var self = this;
        // siteName, theme, this.renderSingleTab
        return (
            <bootstrap.Tabs defaultActiveKey={1}>
                {
                    this.getTabParameters().map(function (parameter) {
                        return self.renderSingleTab (siteName, theme, parameter);
                    })
                }
            </bootstrap.Tabs>
        );
    },
    renderTabContent: function (siteName, theme, tabParameters) {
        return (
            <div style={styleTabContent(theme)}>
                <h2 style={styleH2(theme)}>{siteName}</h2>
                <h3 style={styleH3(theme)}>{tabParameters.periodMessage}</h3>
                <div style={styleRoundedDiv(theme)}>
                    <p style={styleMeasure(theme)}>{tabParameters.measureValue}</p>
                    <span style={styleUnit(theme)}>{tabParameters.measureUnit}</span>
                </div>
                <p style={styleH2(theme)}>{tabParameters.period}</p>
            </div>
        );
    },
    render: function () {
        const theme = this.getTheme();

        return (
            <div>
                <div>
                    {this.renderTabs(theme)}
                </div>
                <div style={styleTabContent(theme)}>
                </div>
                <div style={{width:"30%"}}></div>
            </div>
        );
    }
});

module.exports = Radium(SummaryConsumptions);
