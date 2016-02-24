var bootstrap  = require("react-bootstrap");
var Immutable  = require("immutable");
var IPropTypes = require("react-immutable-proptypes");
var R          = require("ramda");
var React      = require("react");
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

var components        = require("components");
var readingsRealTime  = require("lib/readings-real-time-aggregates-to-realtime-view");
import {styles} from "lib/styles_restyling";
import {selectRealTimeSite} from "actions/real-time";
import {defaultTheme} from "lib/theme";
import {getTitleForSingleSensor} from "lib/page-header-utils";

const styleSiteButton = ({colors}) => ({
    width: "50px",
    height: "50px",
    padding: "0",
    border: "0",
    borderRadius: "100%",
    margin: "3px 0 0 0",
    backgroundColor: colors.primary
});

var RealTime = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object,
        collections: IPropTypes.map,
        realTime: React.PropTypes.object.isRequired,
        selectRealTimeSite: React.PropTypes.func.isRequired
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
    getInitialState: function () {
        return {
            showModal: false,
            value: null
        };
    },
    componentDidMount: function () {
        this.props.asteroid.subscribe("sites");
        if (this.props.realTime.site) {
            this.props.asteroid.subscribe("readingsRealTimeAggregatesBySite", this.props.realTime.site);
        }
    },
    componentWillReceiveProps: function () {
        if (this.props.realTime.site) {
            this.props.asteroid.subscribe("readingsRealTimeAggregatesBySite", this.props.realTime.site);
        }
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    drawGauge: function (params) {
        const {colors} = this.getTheme();
        return (
            <div style={{margin: "auto", width: R.path(["style", "width"], params) || "200px"}}>
                <components.Gauge
                    valueLabel={this.getGaugeLabel({
                        id: params.id,
                        styleTextLabel: params.styleTextLabel,
                        styleTextUnit: params.styleTextUnit,
                        unit: params.unit || "",
                        value: params.value
                    })}
                    {...params}
                />
                <div
                    style={{
                        textAlign: "center",
                        fontSize: "18px",
                        color: colors.backgroundGaugeBar,
                        textTransform: "uppercase"
                    }}
                >
                    <div>{params.id}</div>
                </div>
            </div>
        );
    },
    drawGauges: function () {
        const {colors} = this.getTheme();
        if (this.findLatestMeasuresForEnergy().size > 0) {
            return this.findLatestMeasuresForEnergy().map((measure) => {
                var gaugeParams = {
                    id: measure.get("id"),
                    key: measure.get("key"),
                    maximum: 100,
                    minimum: 0,
                    style: {height: "auto", width: "100%"},
                    styleGaugeBar: {stroke: colors.backgroundGaugeBar},
                    stylePointer: {fill: colors.backgroundGaugeBar},
                    styleTextLabel: {color: colors.backgroundGaugeBar, fontSize: "30px", lineHeight: "34px"},
                    styleTextUnit: {color: colors.backgroundGaugeBar, fontSize: "18px", lineHeight: "20px", marginBottom: "4px"},
                    unit: measure.get("unit"),
                    value: parseFloat(measure.get("value")).toFixed(2) / 1 || 0
                };
                return (
                    <bootstrap.Col
                        key={measure.get("key")}
                        md={4}
                        xs={6}
                        style={{padding: "20px"}}
                    >
                        {this.drawGauge(gaugeParams)}
                    </bootstrap.Col>);
            });
        }
    },
    drawGaugeTotal: function () {
        const {colors} = this.getTheme();
        if (this.findLatestMeasuresForEnergy().size > 0) {
            const {value, unit} = this.findLatestMeasuresForEnergy().reduce((acc, measure) => {
                return {
                    value: acc.value + parseFloat((measure.get("value")) || 0),
                    unit: measure.get("unit")
                };
            }, {value: 0, unit: ""});
            var gaugeParams = {
                id: "Consumi totali",
                key: "Consumi totali",
                maximum: 100,
                minimum: 0,
                style: {height: "auto", width: "100%"},
                styleLabel: {top: "-15%"},
                stylePointer: {fill: colors.backgroundGaugeBar},
                styleTextLabel: {color: colors.backgroundGaugeBar, fontSize: "50px", lineHeight: "60px"},
                styleTextUnit: {color: colors.backgroundGaugeBar, fontSize: "35px", lineHeight: "40px", marginBottom: "4px"},
                unit: unit,
                value: parseFloat(value).toFixed(2) / 1
            };
            return this.drawGauge(gaugeParams);
        }
    },
    getSites: function () {
        return this.props.collections.get("sites") || Immutable.Map();
    },
    getSite: function (siteId) {
        return this.getSites().find(function (site) {
            return site.get("_id") === siteId;
        });
    },
    getMeasures: function () {
        return this.props.collections.get("readings-real-time-aggregates") || Immutable.Map();
    },
    closeModal: function () {
        this.setState({
            showModal: false,
            value: null
        });
    },
    getSelectedSiteName: function () {
        return (
            this.props.realTime.fullPath &&
            this.getSites().size > 0 &&
            this.getSite(this.props.realTime.site) ?
            this.getSite(this.props.realTime.site).get("name") :
            null
        );
    },
    getMeasuresBySite: function () {
        var selectedSiteId = this.props.realTime.site ?
            this.getSite(this.props.realTime.fullPath[0]).get("_id") :
            null;
        var selectSite = this.getMeasures().find(function (measure) {
            return measure.get("_id") === selectedSiteId;
        });
        return selectSite ?
        selectSite.get("sensors") :
        Immutable.Map();
    },
    getGaugeLabel: function (params) {
        return (
            <components.MeasureLabel {...params} />
        );
    },
    findLatestMeasuresWithCriteria: function (criteria) {
        var res = readingsRealTime.decorators(this.getTheme()).filter(criteria);
        if (this.props.realTime.fullPath && this.getMeasures().size) {
            var decoMeasurements = this.getSite(this.props.realTime.fullPath[0]).get("sensors")
                .map(sensor => {
                    return readingsRealTime.decorateMeasure(sensor, this.getTheme());
                });
            res = R.filter(
                criteria,
                readingsRealTime.addValueToMeasures(
                    decoMeasurements.flatten(1),
                    this.getMeasuresBySite()
            ));
        }
        return res;
    },
    findLatestMeasuresForEnergy: function () {
        var measures = this.findLatestMeasuresWithCriteria(function (decorator) {
            return decorator.get("type") === "pod" && decorator.get("keyType") === "activeEnergy";
        });
        return measures.map(pod => {
            var anzId = (pod.get("children") || Immutable.List()).map(anz => {
                return readingsRealTime.decorateMeasure(anz, this.getTheme());
            });
            return pod.set("value", readingsRealTime.addValueToMeasures(
                anzId.flatten(1),
                this.getMeasuresBySite()
            ).filter(decorator => {
                return decorator.get("keyType") === "activeEnergy";
            }).reduce((acc, measure) => {
                return acc + (measure.get("value") || 0);
            }, 0));
        });
    },
    findLatestMeasuresForVariables: function () {
        return this.findLatestMeasuresWithCriteria(function (decorator) {
            return decorator.get("type") !== "pod" && decorator.get("type") !== "pod-anz";
        });
    },
    getSitoById: function (sitoId) {
        const sites = this.props.collections.get("sites") || Immutable.Map();
        return sites.find(site => {
            return site.get("_id") === sitoId;
        });
    },
    openModal: function () {
        this.setState({showModal:true});
    },
    onChangeWidgetValue: function (value) {
        this.setState({value});
    },
    onConfirmFullscreenModal: function () {
        const siteId = this.state.value[0];
        this.props.asteroid.subscribe("readingsRealTimeAggregatesBySite", siteId);
        this.props.selectRealTimeSite(this.state.value);
        this.closeModal();
    },
    renderModalButton: function () {
        const theme = this.getTheme();
        return (
            <div>
                <components.Button className="pull-right" onClick={this.openModal} style={styleSiteButton(theme)} >
                    <components.Icon
                        color={this.getTheme().colors.iconSiteButton}
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
                    show={this.state.showModal}
                >
                    {this.renderModalBody()}
                </components.FullscreenModal>
            </div>
        );
    },
    renderModalBody: function () {
        return (
            <components.SiteNavigator
                allowedValues={this.getSites()}
                onChange={this.onChangeWidgetValue}
                path={this.state.value || this.props.realTime.fullPath || []}
                title={"Quale punto di misurazione vuoi visualizzare?"}
            />
        );
    },
    render: function () {
        const theme = this.getTheme();
        const selectedSiteName = this.getSelectedSiteName();
        return (
            <div>
                <div style={styles(this.getTheme()).titlePage}>
                    <div style={{fontSize: "18px", marginBottom: "0px", paddingTop: "18px", width: "100%"}}>
                        {getTitleForSingleSensor(this.props.realTime, this.props.collections)}
                    </div>
                    <bootstrap.Col sm={4}>
                        {this.renderModalButton()}
                    </bootstrap.Col>
                </div>
                <div style={styles(theme).mainDivStyle, {position: "relative"}}>
                    <div
                        style={{
                            position: "absolute",
                            top: "20px",
                            left: "0px",
                            width: "100%",
                            backgroundColor: theme.colors.backgroundRealTimeSection,
                            borderTop: "1px solid " + theme.colors.borderRealTimeSection,
                            borderBottom: "1px solid " + theme.colors.borderRealTimeSection
                        }}
                    >
                        <h3
                            className="text-center"
                            style={{color: theme.colors.mainFontColor, fontSize: "24px", fontWeight: "400", textTransform: "uppercase"}}
                        >
                            {`${selectedSiteName ? selectedSiteName + " - " : ""}Rilevazioni ambientali`}
                        </h3>
                        <components.VariablesPanel
                            values={this.findLatestMeasuresForVariables()}
                        />
                    </div>
                    <div
                        style={{
                            position: "relative",
                            top: "220px",
                            margin: "0px 30px 0px 30px",
                            height: "calc(100vh - 395px)",
                            overflow: "hidden",
                            backgroundColor: theme.colors.backgroundRealTimeSection,
                            border: "1px solid " + theme.colors.borderRealTimeSection,
                            borderRadius: "20px"
                        }}
                    >
                        <div
                            style={{
                                overflow: "auto",
                                position: "absolute",
                                top: "0",
                                bottom: "0",
                                left: "0",
                                right: "-20px"
                            }}
                        >
                            <h3
                                className="text-center"
                                style={{color: theme.colors.mainFontColor, fontSize: "24px", fontWeight: "400", textTransform: "uppercase"}}
                            >
                                {`${selectedSiteName ? selectedSiteName + " - " : ""}Pods`}
                            </h3>
                            <bootstrap.Col className="text-center" md={4} xs={12} style={{padding: "20px", color: theme.colors.mainFontColor}}>
                                {this.drawGaugeTotal()}
                            </bootstrap.Col>
                            <bootstrap.Col md={8} xs={12}>
                                {this.drawGauges()}
                            </bootstrap.Col>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

function mapStateToProps (state) {
    return {
        collections: state.collections,
        realTime: state.realTime
    };
}
function mapDispatchToProps (dispatch) {
    return {
        selectRealTimeSite: bindActionCreators(selectRealTimeSite, dispatch)
    };
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(RealTime);
