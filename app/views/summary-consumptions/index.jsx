import {Map} from "immutable";
import get from "lodash.get";
import Radium from "radium";
import * as bootstrap from "react-bootstrap";
import React from "react";
import IPropTypes from "react-immutable-proptypes";
import moment from "moment";
import "moment/locale/it";
import utils from "iwwa-utils";

import {partial, is} from "ramda";
import {
    ConfirmModal,
    ConsumptionChart,
    Icon,
    FullscreenModal,
    ProgressBar,
    SiteNavigator,
    TooltipIconButton
} from "components";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
//import icons from "lib/icons";
import {defaultTheme} from "lib/theme";
import {tabParameters} from "lib/consumptions-utils";
import {selectSite, selectPeriod} from "actions/consumptions";

var styleLeftPane  = () => ({
    width: "70%",
    float: "left",
    height: "calc(100vh - 80px)",
    paddingBottom: "20px",
    overflow: "hidden"
});

var styleTabContent  = () => ({
    display: "flex",
    height: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    textAlign: "center"
});

var styleH2 = ({colors}) => ({
    fontSize: "20px",
    lineHeight: "18px",
    fontWeight: "400",
    textTransform: "uppercase",
    color: colors.white
});

var styleH3 = ({colors}) => ({
    fontSize: "18px",
    lineHeight: "15px",
    fontWeight: "300",
    textTransform: "uppercase",
    color: colors.white,
    margin: "0px"
});

var styleRoundedDiv = ({colors}) => ({
    borderRadius: "100%",
    margin: "15px auto",
    width: "300px",
    height: "300px",
    padding: "70px 10px 80px 10px",
    backgroundColor: colors.secondary
});

var styleRoundedDivYear = ({colors}) => ({
    borderRadius: "100%",
    margin: "15px auto",
    width: "120px",
    height: "120px",
    padding: "35px 5px 25px 5px",
    backgroundColor: colors.secondary
});

var styleMeasure  = ({colors}) => ({
    fontWeight: "600",
    lineHeight: "110px",
    color: colors.white
});

var styleMeasureYear  = ({colors}) => ({
    fontWeight: "600",
    lineHeight: "30px",
    color: colors.white
});

var styleUnit  = ({colors}) => ({
    fontWeight: "600",
    lineHeight: "10px",
    margin: "0px",
    padding: "0px",
    color: colors.white
});

// var styleCongratMessage = ({colors}) => ({
//     color: colors.white,
//     width: "95%",
//     margin: "10px auto 70px auto",
//     height: "auto",
//     padding: "10px",
//     fontSize: "20px",
//     textAlign: "left",
//     borderRadius: "20px",
//     border: "1px solid " + colors.borderConsumptionSection,
//     backgroundColor: colors.backgroundConsumptionSection
// });

var styleRightPane  = ({colors}) => ({
    display: "flex",
    flexDirection: "column",
    width: "30%",
    overflow: "hidden",
    height: "calc(100vh - 80px)",
    backgroundColor: colors.secondary
});

var styleSiteButton = ({colors}) => ({
    width: "50px",
    height: "50px",
    padding: "0px",
    border: "0px",
    borderRadius: "100%",
    clear: "both",
    margin: "3px 25px 0 0",
    backgroundColor: colors.primary
});

var comparisonDiv = ({colors}) => ({
    padding: "12px",
    marginBottom: "20px",
    border: "1px solid " + colors.borderConsumptionSection,
    backgroundColor: colors.backgroundConsumptionSection,
    borderRadius: "20px",
    color: colors.white
});

var styleProgressBar = ({colors}) => ({
    height: "16px",
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

var stylePeriodComparisonTitleLabel = ({colors}) => ({
    fontSize: "16px",
    fontWeight: "300",
    color: colors.progressBarFont,
    borderBottom: "1px solid " + colors.borderConsumptionSection,
    marginBottom: "8px",
    textAlign: "center"
});

var stylePeriodComparisonSubTitleLabel = ({
    fontSize: "12px",
    fontWeight: "300",
    marginBottom: "8px",
    textAlign: "center"
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
            showFullscreenModal: false,
            site: null
        };
    },
    componentDidMount: function () {
        this.props.asteroid.subscribe("sites");
    },

    subscribeToConsumptions: function () {
        const periods = [moment().subtract(1, "year").format("YYYY"), moment().format("YYYY")];
        const dateEnd = moment.utc().format("YYYY-MM-DD");
        const dateStart = moment.utc().subtract(7, "week").format("YYYY-MM-DD");

        periods.map(year => {
            this.props.asteroid.subscribe(
                "yearlyConsumptions",
                this.props.consumptions.fullPath[0],
                year,
                "reading",
                "activeEnergy"
            );
        });

        this.props.asteroid.subscribe(
            "dailyMeasuresBySensor",
            this.props.consumptions.fullPath[0],
            dateStart,
            dateEnd,
            "reading",
            "activeEnergy"
        );
    },

    getTheme: function () {
        return this.context.theme || defaultTheme;
    },

    getSelectedSite: function () {
        if (this.props.consumptions.fullPath && this.props.consumptions.fullPath[0]) {
            return this.props.collections.getIn(["sites", this.props.consumptions.fullPath[0]]);
        }
        return Map({name: ""});
    },

    getSum: function (dateRange) {
        const aggregates = (this.props.collections
            .get("consumptions-yearly-aggregates") || Map())
            .filter(agg => agg.get("sensorId") === this.props.consumptions.fullPath[0]);
        return parseFloat(utils.getSumByPeriod(dateRange, aggregates).toFixed(2));
    },

    getAggregates: function (isPreviousPeriod, key) {
        var aggregates;
        if (isPreviousPeriod) {
            aggregates = (this.props.collections.get("consumptions-yearly-aggregates") || Map())
                    .filter(agg => agg.get("sensorId") === this.props.consumptions.fullPath[0]);
        } else {
            aggregates = (this.props.collections.get("readings-daily-aggregates") || Map())
                    .filter(agg => agg.get("sensorId") === this.props.consumptions.fullPath[0]);
        }

        //for calc of avg year remove current year
        if (key=="year") {
            aggregates = aggregates.filter(agg => agg.get("year") != moment().format("YYYY"));
        }

        return aggregates;
    },

    isPercentageVisible: function (key) {
        switch (key) {
            case "today":
            case "avg-8-prev-today":
            case "today-7d-toNow":
            case "week-toNow":
            case "avg-8w-toNow":
            case "week-1w-toNow":
                return true;
            default:
                return false;
        }
    },

    isDangerEnable: function (key) {
        switch (key) {
            case "today":
            case "yesterday":
            case "week-toNow":
            case "week-1w":
                return true;
            default:
                return false;
        }
    },

    closeFullscreenModal: function () {
        this.setState ({
            showFullscreenModal: false,
            site: null
        });
    },

    openModal: function () {
        this.setState ({showFullscreenModal:true});
    },

    closeModals: function () {
        this.setState({
            showConfirmModal: false,
            showFullscreenModal: false
        });
    },

    onConfirmFullscreenModal: function () {
        this.props.selectSite(this.state.site || this.props.consumptions.fullPath);
        this.setState({showConfirmModal: true});
    },

    onChangeWidgetValue: function (site) {
        this.setState({site});
    },

    onChangeTabValue: function (tabPeriod) {
        this.setState({period: tabPeriod});
    },

    getFontSize: function (item, defaultFontSize) {
        const itemLength = is(Number, item) ? item.toString().length : item.length;
        return item.toString().length > 5 ? `${defaultFontSize - ((itemLength - 5) * 10)}px`: `${defaultFontSize}px`;
    },

    renderCustomersComparisons: function () {
        const {colors} = this.getTheme();
        const title = "Confronta i tuoi consumi con quelli di attività simili alla tua";
        const selectedTab = tabParameters().find(param => param.key === this.state.period);
        const now = parseInt(selectedTab.now(
            this.props.consumptions.fullPath[0],
            this.props.collections.get("consumptions-yearly-aggregates") || Map()).toFixed(0));
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
            }}>
                <p style={{
                    fontSize: "16px",
                    margin: "15px 0px",
                    fontWeight: "400",
                    color: colors.mainFontColor
                }}>{title}</p>
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
            }}>
                <div style={{
                    textAlign: "center"
                }}>
                    <Icon
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

    renderComparisonsDiv: function (selectedTab, isPreviousPeriod) {
        const colors = this.getTheme();
        const aggregates = this.getAggregates(isPreviousPeriod, selectedTab.key);
        const comparisons = isPreviousPeriod ? (selectedTab.comparisonsPrevPeriod || Map()) : (selectedTab.comparisons || Map());
        const title = isPreviousPeriod ? this.renderPrevPeriodComparisonsTitle(selectedTab.key) : this.renderPeriodComparisonsTitle(selectedTab.key);
        const subTitle = isPreviousPeriod ? null : selectedTab.key=="day" || selectedTab.key=="week" ? "(*Aggiornati all'ora corrente)" : null;

        //Calculate values for progress-bar
        var max = 0;
        comparisons.map(value => {
            const now = parseFloat(value.now(aggregates).toFixed(0));
            max = parseFloat((max < now) ? now : max);
        });

        if (max > 0) {
            return (
                <div style={comparisonDiv(colors)}>
                    <div style={stylePeriodComparisonTitleLabel(colors)}>
                        <div>{title}</div>
                        <div  style={stylePeriodComparisonSubTitleLabel}>{subTitle}</div>
                    </div>
                    {comparisons.map(partial(this.renderProgressBar, [selectedTab.now, aggregates, max]))}
                </div>
            );
        } else if (isPreviousPeriod) {
            return  (
                <div style={comparisonDiv(colors)}>{"Non ci sono dati disponibili al momento."}</div>
            );
        }
    },

    renderPeriodComparisons: function () {
        const selectedTab = tabParameters().find(param => param.key === this.state.period);
        const {comparisons, comparisonsPrevPeriod} = selectedTab;
        if (comparisons || comparisonsPrevPeriod) {
            return (
                <div>
                    {this.renderComparisonsDiv(selectedTab, false)}
                    {this.renderComparisonsDiv(selectedTab, true)}
                </div>
            );
        }
    },

    renderPeriodComparisonsTitle: function (divTitle) {
        switch (divTitle) {
            case "day":
                return "Confronta i consumi di oggi:";
            case "week":
                return "Confronta i consumi della settimana:";
            default:
                return null;
        }
    },

    renderPrevPeriodComparisonsTitle: function (divTitle) {
        switch (divTitle) {
            case "day":
                return "Confronta i consumi di ieri:";
            case "week":
                return "Confronta i consumi di settimana scorsa:";
            case "month":
                return "Confronta i consumi del mese:";
            case "year":
                return "Confronta i consumi dell'anno:";
            default:
                return null;
        }
    },

    renderProgressBar: function (comparisonNow, aggregates, max, comparisonParams) {
        const now = comparisonParams.now(aggregates).toFixed(0);
        return parseInt(max) ? this.renderStyledProgressBar(comparisonParams.key, max, now, comparisonParams.title) : null;
    },

    renderStyledProgressBar: function (key, max, now, title) {
        const colors = this.getTheme();
        return (
            <div key={key} style={{marginBottom: "15px"}}>
                <ProgressBar
                    isDangerEnable={this.isDangerEnable(key)}
                    isPercentageVisible={this.isPercentageVisible(key)}
                    key={key}
                    max={parseInt(max)}
                    now={parseInt(now)}
                    title={title}
                    rules={rulesProgressBar(colors)}
                    style={styleProgressBar(colors)}
                    styleMaxLabel={styleProgressBarMaxLabel(colors)}
                    styleTitleLabel={styleProgressBarTitleLabel(colors)}
                />
            </div>
        );
    },

    renderConfirmModal: function () {
        const fullPath = get(this.props, "consumptions.fullPath", []) || [];
        const subtitle = fullPath.join(" · ");
        return (
            <ConfirmModal
                onConfirm={() => this.setState({showConfirmModal: false})}
                onHide={this.closeModals}
                iconType={"flag"}
                renderFooter={true}
                show={this.state.showConfirmModal}
                subtitle={subtitle}
                title={"HAI SCELTO DI VISUALIZZARE "}
            />
        );
    },

    renderFullscreenModal: function () {
        const sites = this.props.collections.get("sites") || Map({});
        return (
            <FullscreenModal
                onConfirm={this.onConfirmFullscreenModal}
                onHide={this.closeFullscreenModal}
                onReset={this.closeFullscreenModal}
                renderConfirmButton={true}
                show={this.state.showFullscreenModal}
            >
                <SiteNavigator
                    allowedValues={sites.sortBy(site => site.get("name"))}
                    onChange={this.onChangeWidgetValue}
                    path={this.state.site || this.props.consumptions.fullPath || []}
                    title={"QUALE PUNTO DI MISURAZIONE VUOI VISUALIZZARE?"}
                />
            </FullscreenModal>
        );
    },

    renderSingleTab: function (siteName, theme, tabParameters) {
        return (
            <bootstrap.Tab
                className="style-single-tab"
                eventKey={tabParameters.key}
                key={tabParameters.key}
                title={tabParameters.title}
                style={{height: "100%"}}
            >
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
                        "": {
                            height: "100%"
                        },
                        ".tab-content": {
                            height: "100%"
                        },
                        "ul": {
                            overflow: "hidden",
                            border: "0px",
                            height: "55px",
                            backgroundColor: colors.secondary,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-around",
                            alignItems: "flex-start"
                        },
                        "ul li": {

                            color: colors.white
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
        const chartCollection = (this.props.collections.get("consumptions-yearly-aggregates") || Map())
        .filter(agg => agg.get("sensorId") === this.props.consumptions.fullPath[0]);
        var sum = 0;
        if (this.props.consumptions.fullPath) {
            this.subscribeToConsumptions();
            sum = this.getSum(utils.getTimeRangeByPeriod(tabParameters.period));
        }
        const overflow = tabParameters.key=="year" ? "auto" : "hidden";
        const measure = sum >= 100 ? Math.round(sum) : Math.round(sum * 10, -1) / 10;
        // const congratMessage = "Ieri hai utilizzato il 12% in meno dell’energia che utilizzi di solito.";
        // const congratTitle = "COMPLIMENTI!";
        const styleRound = tabParameters.key=="year" ? styleRoundedDivYear(theme) : styleRoundedDiv(theme);
        const fontMeasure = tabParameters.key=="year" ? 35 : 80;
        const fontUnit = tabParameters.key=="year" ? 25 : 50;
        const styleMeasureVar= tabParameters.key=="year" ? styleMeasureYear(theme): styleMeasure(theme);
        return (
            <div style={{...styleTabContent(theme), overflow: overflow}}>
                <div>
                    <h2 style={styleH2(theme)}>{siteName}</h2>
                    <h3 style={styleH3(theme)}>{tabParameters.periodTitle}</h3>
                </div>
                <div style={styleRound}>
                    <p style={{
                        ...styleMeasureVar,
                        fontSize: this.getFontSize(measure, fontMeasure)
                    }}>{measure}</p>
                    <span style={{
                        ...styleUnit(theme, fontUnit),
                        fontSize: fontUnit+"px"
                    }}>{tabParameters.measureUnit}</span>
                </div>
                <p style={styleH2(theme)}>{tabParameters.periodSubtitle}</p>
                <ConsumptionChart
                    collections={chartCollection}
                    page={tabParameters.key}
                />
                {/*
                    <div style={styleCongratMessage(theme)}>
                        <bootstrap.Col xs={3} md={4} lg={3} style={{
                            textAlign: "left",
                            float: "left",
                            backgroundImage: `url(${icons.iconGoGreen})`,
                            backgroundRepeat: "none",
                            backgroundSize: "cover",
                            width: "80px",
                            height: "80px"
                        }}></bootstrap.Col>
                        <bootstrap.Col xs={9} md={8} lg={9} style={{float: "left"}}>
                            <span style={{fontWeight: "400"}}>{congratTitle}</span>
                            <br></br>
                            <span style={{fontWeight: "300"}}>{congratMessage}</span>
                        </bootstrap.Col>
                        <div style={{clear: "both"}} />
                    </div>
                */}
            </div>
        );
    },

    render: function () {
        const theme = this.getTheme();
        return (
            <div style={{width: "100%", clear: "both"}}>
                <div style={styleLeftPane(theme)}>
                    {this.renderTabs(theme)}
                </div>
                <div style={styleRightPane(theme)}>
                    <div style={{
                        height: "57px",
                        width: "100%",
                        borderBottom: "2px solid " + theme.colors.background
                    }}>
                        <TooltipIconButton
                            buttonClassName={"pull-right"}
                            buttonStyle={styleSiteButton(theme)}
                            icon={"map"}
                            iconColor={theme.colors.iconSiteButton}
                            iconSize={"38px"}
                            iconStyle={{textAlign: "center", verticalAlign: "middle"}}
                            onButtonClick={this.openModal}
                            tooltipText={"Seleziona punto di misurazione"}
                        />
                    </div>
                    <div style={{margin: "10px 20px"}}>
                        {this.props.consumptions.fullPath ? this.renderPeriodComparisons() : null}
                        {/* this.props.consumptions.fullPath ? this.renderCustomersComparisons() : null */}
                        {/* this.props.consumptions.fullPath ? this.renderFeedbackBox() : null */}
                    </div>
                </div>
                {this.renderFullscreenModal()}
                {this.renderConfirmModal()}
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
