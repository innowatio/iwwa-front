var bootstrap  = require("react-bootstrap");
var icons      = require("lib/icons");
var Immutable  = require("immutable");
var IPropTypes = require("react-immutable-proptypes");
var Radium     = require("radium");
var React      = require("react");

var components   = require("components");

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {defaultTheme} from "lib/theme";
import {selectSite} from "actions/consumptions";


var styleLeftPane  = {
    width: "70%",
    float: "left"
};
var styleContent  = ({colors}) => ({
    textAlign: "center",
    backgroundColor: colors.primary,
    padding: "80px 0px",
    height: "calc(100vh - 100px)"
});
var styleTabContent  = ({colors}) => ({
    backgroundColor: colors.primary
});
var styleH2 = ({colors}) => ({
    fontSize: "20px",
    lineHeight: "15px",
    fontWeight: "400",
    textTransform: "uppercase",
    color: colors.white,
    padding: "0"
});

var styleH3 = ({colors}) => ({
    fontSize: "30px",
    lineHeight: "20px",
    fontWeight: "400",
    textTransform: "uppercase",
    color: colors.white
});
var styleRoundedDiv = ({colors}) => ({
    borderRadius: "100%",
    margin: "30px auto",
    width: "265px",
    height: "265px",
    padding: "30px",
    backgroundColor: colors.secondary
});
var styleMeasure  = ({colors}) => ({
    fontSize: "120px",
    fontWeight: "700",
    lineHeight: "130px",
    color: colors.white
});
var styleUnit  = ({colors}) => ({
    fontSize: "60px",
    fontWeight: "600",
    lineHeight: "10px",
    margin: "0",
    padding: "0",
    color: colors.white
});
var styleRightPane  = ({colors}) => ({
    width: "30%",
    float: "right",
    borderTop: "4px solid " + colors.secondary
});
var styleSiteButton = ({colors}) => ({
    width: "50px",
    height: "50px",
    padding: "0",
    border: "0",
    borderRadius: "100%",
    margin: "13px",
    backgroundColor: colors.secondary
});
var styleSiteButtonIcon = {
    width: "38px",
    textAlign: "center"
};
var SummaryConsumptions = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object,
        collections: IPropTypes.map.isRequired,
        consumptions: React.PropTypes.object.isRequired
    },
    getInitialState: function () {
        return {
            showModal: false,
            path: []
        };
    },
    componentDidMount: function () {
        this.props.asteroid.subscribe("sites");
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getTabParameters: function () {
        return [{periodMessage: "OGGI HAI UTILIZZATO", measureValue: "48", measureUnit: "kWh", period: "5 FEBBRAIO 2016", title: "OGGI", key: 1},
        {periodMessage: "OGGI HAI UTILIZZATO", measureValue: "48", measureUnit: "kWh", period: "5 FEBBRAIO 2016", title: "SETTIMANA CORRENTE", key: 2}];
    },
    closeModal: function () {
        this.setState ({showModal:false});
    },
    openModal: function () {
        this.setState ({showModal:true});
    },
    renderModalBody: function () {
        const sites = this.props.collections.get("sites") || Immutable.Map({});
        return (
            <components.SiteNavigator
                allowedValues={sites.sortBy(site => site.get("name"))}
                defaultPath={this.state.path}
                onChange={this.props.consumptions.fullPath || []}
                title={"Quale punto di misurazione vuoi visualizzare?"}
            />
        );
    },
    renderSingleTab: function (siteName, theme, tabParameters) {
        return (
            <bootstrap.Tab className="style-single-tab" eventKey={tabParameters.key} title={tabParameters.title}>
                {this.renderTabContent(siteName, theme, tabParameters)}
            </bootstrap.Tab>
        );
    },
    renderTabs: function (theme) {
        var siteName = "sites";
        var self = this;
        // siteName, theme, this.renderSingleTab
        const {colors} = this.getTheme();
        return (
            <bootstrap.Tabs className="style-tab" defaultActiveKey={1}>
                <Radium.Style
                    rules={{
                        "ul": {
                            border: "0px",
                            height: "55px",
                            backgroundColor: colors.secondary
                        },
                        "ul li": {
                            color: colors.white
                        },
                        "ul li a": {
                            height: "55px",
                            lineHeight: "55px",
                            fontSize: "18px",
                            textTransform: "uppercase",
                            margin: "0px 20px",
                            padding: "0px 5px"
                        },
                        ".nav-tabs > li > a": {
                            height: "44px",
                            color: colors.white,
                            border: "0",
                            borderBottom: "3px solid" + colors.secondary
                        },
                        ".nav-tabs > li:hover > a:hover": {
                            fontWeight: "400"
                        },
                        ".nav-tabs > li.active > a, .nav-tabs > li > a:hover, .nav-tabs > li.active > a:hover, .nav-tabs > li.active > a:focus": {
                            height: "44px",
                            fontSize: "18px",
                            fontWeight: "600",
                            color: colors.white,
                            border: "0px",
                            borderRadius: "0px",
                            backgroundColor: colors.secondary,
                            borderBottom: "3px solid" + colors.buttonPrimary
                        }
                    }}
                    scopeSelector=".style-tab"
                />
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
            <div style={styleContent(theme)}>
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
                <div style={styleLeftPane}>
                    <div style={styleTabContent(theme)}>
                        {this.renderTabs(theme)}
                    </div>
                </div>
                <div style={styleRightPane(theme)}>
                    <bootstrap.Button className="pull-right" onClick={this.openModal} style={styleSiteButton(theme)} >
                        <img src={icons.iconSiti} style={styleSiteButtonIcon} />
                    </bootstrap.Button>
                    <components.FullscreenModal
                        childComponent={this.renderModalBody()}
                        onHide={this.closeModal}
                        show={this.state.showModal}
                    />
                </div>
            </div>
        );
    }
});

function mapStateToProps (state) {
    return {
        collections: state.collections,
        consumptions: state.consumptions
    };
}
function mapDispatchToProps (dispatch) {
    return {
        selectSite: bindActionCreators(selectSite, dispatch)
    };
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(SummaryConsumptions);
