var bootstrap  = require("react-bootstrap");
var Immutable  = require("immutable");
var IPropTypes = require("react-immutable-proptypes");
var Radium     = require("radium");
var React      = require("react");
import moment from "moment";
import {partial} from "ramda";
import icons from "lib/icons";

var components   = require("components");
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {defaultTheme} from "lib/theme";
import {selectSite, selectPeriod} from "actions/consumptions";
import {getSumBySiteAndPeriod, getTimeRangeByPeriod, tabParameters} from "lib/consumptions-utils";


var styleLeftPane  = {
    width: "70%",
    float: "left"
};
var styleContent  = ({colors}) => ({
    textAlign: "center",
    backgroundColor: colors.primary,
    height: "calc(100vh - 130px)"
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
    padding: "0px"
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
    width: "300px",
    height: "300px",
    padding: "70px 10px 0px 10px",
    backgroundColor: colors.secondary
});
var styleMeasure  = ({colors}) => ({
    fontSize: "90px",
    fontWeight: "600",
    lineHeight: "110px",
    color: colors.white
});
var styleUnit  = ({colors}) => ({
    fontSize: "60px",
    fontWeight: "600",
    lineHeight: "10px",
    margin: "0px",
    padding: "0px",
    color: colors.white
});
var styleCongratMessage = ({colors}) => ({
    color: colors.white,
    width: "90%",
    margin: "60px auto 20px auto",
    minHeight: "100px",
    height: "auto",
    padding: "20px",
    fontSize: "20px",
    textAlign: "left",
    borderRadius: "20px",
    backgroundColor: colors.secondary
});
var styleRightPane  = ({colors}) => ({
    width: "30%",
    float: "right",
    borderTop: "4px solid " + colors.secondary,
    display: "block"
});
var styleSiteButton = ({colors}) => ({
    width: "50px",
    height: "50px",
    padding: "0px",
    border: "0px",
    borderRadius: "100%",
    clear: "both",
    margin: "12px 12px 0 0",
    backgroundColor: colors.secondary
});

var styleProgressBar = ({colors}) => ({
    height: "14px",
    margin: "auto",
    borderRadius: "35px",
    maxWidth: "100%",
    backgroundColor: colors.consumptionprogressBarBackground
});

var styleProgressBarTitleLabel = ({colors}) => ({
    fontSize: "16px",
    fontWeight: "300",
    color: colors.progressBarFont
});

var styleProgressBarMaxLabel = ({colors}) => ({
    color: colors.progressBarFont,
    float: "right",
    fontSize: "14px",
    fontWeight: "300"
});

var rulesProgressBar = ({colors}) => ({
    ".progress-bar": {
        color: colors.progressBarFont,
        fontSize: "10px",
        padding: "0px 5px",
        lineHeight: "12px",
        borderRadius: "20px",
        textAlign: "left"
    },
    ".progress-bar-danger": {
        backgroundColor: colors.progressBarDanger + "!important",
        color: colors.white
    },
    ".progress-bar-info": {
        backgroundColor: colors.progressBarInfo + "!important",
        color: colors.white
    }
});

var SummaryConsumptions = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object,
        collections: IPropTypes.map.isRequired,
        consumptions: React.PropTypes.object.isRequired,
        selectPeriod: React.PropTypes.func.isRequired,
        selectSite: React.PropTypes.func.isRequired
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
    getInitialState: function () {
        return {
            period: tabParameters()[0].key,
            showModal: false,
            site: null
        };
    },
    componentDidMount: function () {
        this.props.asteroid.subscribe("sites");
    },
    subscribeToConsumptions: function () {
        const periods = [moment().subtract(1, "year").format("YYYY"), moment().format("YYYY")];
        periods.map(year => {
            this.props.asteroid.subscribe(
                "yearlyConsumptions",
                this.props.consumptions.fullPath[0],
                year,
                "reading",
                "activeEnergy"
            );
        });
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getSelectedSite: function () {
        if (this.props.consumptions.fullPath && this.props.consumptions.fullPath[0]) {
            return this.props.collections.getIn(["sites", this.props.consumptions.fullPath[0]]);
        }
        return Immutable.Map({name: ""});
    },
    getSum: function (dateRange) {
        return parseFloat(
            getSumBySiteAndPeriod(
                dateRange,
                this.props.consumptions.fullPath[0],
                this.props.collections.get("consumptions-yearly-aggregates") || Immutable.Map())
            .toFixed(2));
    },
    closeModal: function () {
        this.setState ({
            showModal: false,
            site: null
        });
    },
    openModal: function () {
        this.setState ({showModal:true});
    },
    onConfirmFullscreenModal: function () {
        this.props.selectSite(this.state.site || this.props.consumptions.fullPath);
        this.closeModal();
    },
    onChangeWidgetValue: function (site) {
        this.setState({site});
    },
    onChangeTabValue: function (tabPeriod) {
        this.setState({period: tabPeriod});
    },
    renderCustomersComparisons: function () {
        const {colors} = this.getTheme();
        const title = "Confronta i tuoi consumi con quelli di attività simili alla tua";
        const selectedTab = tabParameters().find(param => param.key === this.state.period);
        const now = parseInt(selectedTab.now(
            this.props.consumptions.fullPath[0],
            this.props.collections.get("consumptions-yearly-aggregates") || Immutable.Map()).toFixed(0));
        return (
            <div style={{
                height: "auto",
                padding: "10px",
                borderTopLeftRadius: "25px",
                borderTopRightRadius: "25px",
                borderLeft: "1px solid " + colors.borderConsumptionSection,
                borderRight: "1px solid " + colors.borderConsumptionSection,
                borderTop: "1px solid " + colors.borderConsumptionSection,
                borderBottom: "0px",
                backgroundColor: colors.backgroundConsumptionSection
            }}
            >
                <p style={{
                    fontSize: "16px",
                    margin: "15px 0px",
                    fontWeight: "400",
                    color: colors.mainFontColor
                }}
                >{title}</p>
                {this.renderStyledProgressBar(
                    "neighbors-efficient",
                    parseInt((now * 1.1).toFixed(0)),
                    now,
                    "I tuoi vicini più efficienti"
                )}
                {this.renderStyledProgressBar(
                    "you",
                    parseInt((now * 1.3).toFixed(0)),
                    now,
                    "Tu"
                )}
                {this.renderStyledProgressBar(
                    "neighbors-all",
                    parseInt((now * 1.4).toFixed(0)),
                    now,
                    "Tutti i tuoi vicini"
                )}
            </div>
        );
    },
    renderFeedbackBox: function () {
        const {colors} = this.getTheme();
        const feedbackMessage = "Stai andando molto bene. Hai usato il 10% di energia in meno dei tuoi vicini.";
        return (
            <div style={{
                height: "auto",
                padding: "10px",
                borderBottomLeftRadius: "25px",
                borderBottomRightRadius: "25px",
                borderLeft: "1px solid " + colors.borderConsumptionSection,
                borderRight: "1px solid " + colors.borderConsumptionSection,
                borderBottom: "1px solid " + colors.borderConsumptionSection,
                borderTop: "0px",
                backgroundColor: colors.backgroundConsumptionSection
            }}
            >
                <div style={{
                    textAlign: "center"
                }}
                >
                    <components.Icon
                        color={colors.feedbackGood}
                        icon={"good"}
                        size={"50px"}
                        style={{
                            clear: "both",
                            lineHeight: "20px"
                        }}
                    />
                    <p style={{color: colors.feedbackGood, fontSize: "20px"}}>
                        {"GRANDE!"}
                    </p>
                </div>
                <p style={{color: colors.mainFontColor, fontSize: "14px", fontWeight:"300"}}>{feedbackMessage}</p>
            </div>
        );
    },
    renderPeriodComparisons: function () {
        const selectedTab = tabParameters().find(param => param.key === this.state.period);
        const comparisons = selectedTab.comparisons;
        return (
            <div style={{padding: "12px", marginBottom: "20px"}}>
                {comparisons.map(partial(this.renderProgressBar, [selectedTab.now]))}
            </div>
        );
    },
    renderProgressBar: function (comparisonNow, comparisonParams) {
        const max = parseInt(comparisonParams.max(
            this.props.consumptions.fullPath[0],
            this.props.collections.get("consumptions-yearly-aggregates") || Immutable.Map()).toFixed(0));
        const now = parseInt(
            comparisonNow(
                this.props.consumptions.fullPath[0],
                this.props.collections.get("consumptions-yearly-aggregates") || Immutable.Map()).toFixed(0));
        return this.renderStyledProgressBar(comparisonParams.key, max, now, comparisonParams.title);
    },
    renderStyledProgressBar: function (key, max, now, title) {
        const colors = this.getTheme();
        return (
            <div key={key} style={{marginBottom: "15px"}}>
                <components.ProgressBar
                    key={key}
                    max={max}
                    now={now}
                    title={title}
                    rules={rulesProgressBar(colors)}
                    style={styleProgressBar(colors)}
                    styleMaxLabel={styleProgressBarMaxLabel(colors)}
                    styleTitleLabel={styleProgressBarTitleLabel(colors)}
                />
            </div>);
    },
    renderModalBody: function () {
        const sites = this.props.collections.get("sites") || Immutable.Map({});
        return (
            <components.SiteNavigator
                allowedValues={sites.sortBy(site => site.get("name"))}
                onChange={this.onChangeWidgetValue}
                path={this.state.site || this.props.consumptions.fullPath || []}
                title={"QUALE PUNTO DI MISURAZIONE VUOI VISUALIZZARE?"}
            />
        );
    },
    renderSingleTab: function (siteName, theme, tabParameters) {
        return (
            <bootstrap.Tab className="style-single-tab" eventKey={tabParameters.key} key={tabParameters.key} title={tabParameters.title}>
                {this.renderTabContent(siteName, theme, tabParameters)}
            </bootstrap.Tab>
        );
    },
    renderTabs: function (theme) {
        var site = this.getSelectedSite();
        var siteName = site ? site.get("name") : "";
        var self = this;
        const {colors} = this.getTheme();
        return (
            <bootstrap.Tabs
                activeKey={this.state.period}
                className="style-tab"
                id={"summary-consumptions"}
                onSelect={this.onChangeTabValue}
            >
                <Radium.Style
                    rules={{
                        "ul": {
                            border: "0px",
                            height: "55px",
                            backgroundColor: colors.secondary
                        },
                        "ul li": {
                            color: colors.white,
                            margin: "0 1.5%"
                        },
                        "ul li a": {
                            height: "55px",
                            lineHeight: "55px",
                            fontSize: "17px",
                            textTransform: "uppercase",
                            padding: "0px 4px"
                        },
                        ".nav-tabs > li > a": {
                            height: "44px",
                            color: colors.white,
                            border: "0px",
                            outline: "none",
                            borderBottom: "3px solid" + colors.secondary
                        },
                        ".nav-tabs > li:hover > a:hover": {
                            fontWeight: "400"
                        },
                        ".nav-tabs > li.active > a, .nav-tabs > li > a:hover, .nav-tabs > li.active > a:hover, .nav-tabs > li.active > a:focus": {
                            height: "44px",
                            fontSize: "17px",
                            fontWeight: "500",
                            color: colors.white,
                            border: "0px",
                            borderRadius: "0px",
                            outline: "none",
                            backgroundColor: colors.secondary,
                            borderBottom: "3px solid" + colors.buttonPrimary,
                            outlineStyle: "none",
                            outlineWidth: "0px"
                        },
                        ".nav > li > a:hover, .nav > li > a:focus": {
                            background: colors.transparent
                        }
                    }}
                    scopeSelector=".style-tab"
                />
                {
                    tabParameters().map(parameter => {
                        return self.renderSingleTab(siteName, theme, parameter);
                    })
                }
            </bootstrap.Tabs>
        );
    },
    renderTabContent: function (siteName, theme, tabParameters) {
        var sum = 0;
        if (this.props.consumptions.fullPath) {
            this.subscribeToConsumptions();
            sum = this.getSum(getTimeRangeByPeriod(tabParameters.period));
        }
        const congratMessage = "COMPLIMENTI! Ieri hai utilizzato il 12% in meno dell’energia che utilizzi di solito.";
        return (
            <div style={styleContent(theme)}>
                <h2 style={styleH2(theme)}>{siteName}</h2>
                <h3 style={styleH3(theme)}>{tabParameters.periodTitle}</h3>
                <div style={styleRoundedDiv(theme)}>
                    <p style={styleMeasure(theme)}>{sum >= 100 ? Math.trunc(sum) : Math.round(sum * 10, -1) / 10}</p>
                    <span style={styleUnit(theme)}>{tabParameters.measureUnit}</span>
                </div>
                <p style={styleH2(theme)}>{tabParameters.periodSubtitle}</p>
                <div style={styleCongratMessage(theme)}>
                    <bootstrap.Col xs={12} md={8} lg={9} style={{float: "left"}}>{congratMessage}</bootstrap.Col>
                    <bootstrap.Col xs={12} md={4} lg={3} style={{
                        textAlign: "right",
                        float: "right",
                        backgroundImage: `url(${icons.iconGoGreen})`,
                        backgroundRepeat: "none",
                        width: "116px",
                        height: "116px"
                    }}
                    ></bootstrap.Col>
                    <div style={{clear: "both"}} />
                </div>
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
                    <div style={{clear: "both", height: "50px", width: "100%"}}>
                        <components.Button className="pull-right" onClick={this.openModal} style={styleSiteButton(theme)} >
                            <components.Icon
                                color={theme.colors.iconSiteButton}
                                icon={"map"}
                                size={"38px"}
                                style={{
                                    textAlign: "center",
                                    verticalAlign: "middle",
                                    lineHeight: "20px"
                                }}
                            />
                        </components.Button>
                        <components.FullscreenModal
                            onConfirm={this.onConfirmFullscreenModal}
                            onHide={this.closeModal}
                            onReset={this.closeModal}
                            renderConfirmButton={true}
                            show={this.state.showModal}
                        >
                            {this.renderModalBody()}
                        </components.FullscreenModal>
                    </div>
                    <div style={{margin: "5px 20px"}}>
                        {this.props.consumptions.fullPath ? this.renderPeriodComparisons() : undefined}
                        {this.props.consumptions.fullPath ? this.renderCustomersComparisons() : undefined}
                        {this.props.consumptions.fullPath ? this.renderFeedbackBox() : undefined}
                    </div>
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
        selectSite: bindActionCreators(selectSite, dispatch),
        selectPeriod: bindActionCreators(selectPeriod, dispatch)
    };
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(SummaryConsumptions);
