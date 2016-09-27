var bootstrap  = require("react-bootstrap");
var Immutable  = require("immutable");
var IPropTypes = require("react-immutable-proptypes");
var R          = require("ramda");
var React      = require("react");
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import components from "components";
import * as sensorsDecorators from "lib/sensors-decorators";
import {styles} from "lib/styles";
import {selectRealTimeSite} from "actions/real-time";
import {defaultTheme} from "lib/theme";
import {getTitleForSingleSensor} from "lib/page-header-utils";
import mergeSiteSensors from "lib/merge-site-sensors";

const styleSiteButton = ({colors}) => ({
    width: "50px",
    height: "50px",
    padding: "0px",
    border: "0px",
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
        this.props.asteroid.subscribe("sensors");
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
                    <div>{params.description}</div>
                </div>
                <div
                    style={{
                        textAlign: "center",
                        fontSize: "18px",
                        color: colors.mainFontColor,
                        textTransform: "uppercase"
                    }}
                >
                    {params.id}</div>
            </div>
        );
    },
    drawGauges: function () {
        const {colors} = this.getTheme();
        if (this.findEnergyReadingsRealtime().size > 0) {
            return this.findEnergyReadingsRealtime().map((measure) => {
                var gaugeParams = {
                    id: measure.get("id"),
                    key: measure.get("key"),
                    description: measure.get("description"),
                    maximum: 100,
                    minimum: 0,
                    style: {height: "auto", width: "100%"},
                    styleGaugeBar: {stroke: colors.backgroundGaugeBar},
                    stylePointer: {fill: colors.backgroundGaugeBar},
                    styleTextLabel: {
                        color: colors.textGauge,
                        fontSize: "30px",
                        lineHeight: "34px"
                    },
                    styleTextUnit: {
                        color: colors.textGauge,
                        fontSize: "18px",
                        lineHeight: "20px",
                        marginBottom: "4px"
                    },
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
    getSensorById: function (sensorId) {
        return this.props.collections.getIn(["sensors", sensorId]);
    },
    numberOfConsumptionSensor: function (fullPath) {
        if (R.isArrayLike(fullPath) && fullPath.length > 0) {
            // All sensors under a site
            const site = this.getSitoById(fullPath[0]);
            if (site) {
                const sensorsType = site.get("sensorsIds").map(sensorId => {
                    const sensorObject = this.getSensorById(sensorId);
                    if (sensorObject) {
                        return sensorObject.get("type");
                    }
                });
                return sensorsType.reduce((acc, sensorsType) => {
                    return acc + sensorsDecorators.consumptionSensors(this.getTheme()).filter(consumptionSensor => {
                        return consumptionSensor.type === sensorsType;
                    }).length;
                }, 0);
            }
        }
        return 0;
    },
    drawGaugeTotal: function () {
        const {colors} = this.getTheme();
        if (this.findEnergyReadingsRealtime().size > 0) {
            const {value, unit} = this.findEnergyReadingsRealtime().reduce((acc, measure) => {
                return {
                    value: acc.value + parseFloat((measure.get("value")) || 0),
                    unit: measure.get("unit")
                };
            }, {value: 0, unit: ""});
            var gaugeParams = {
                description: "Consumi totali",
                id: getTitleForSingleSensor(this.props.realTime, this.props.collections),
                key: "Consumi totali",
                maximum: 100,
                minimum: 0,
                style: {height: "auto", width: "100%"},
                styleLabel: {top: "-15%"},
                stylePointer: {fill: colors.backgroundGaugeBar},
                styleTextLabel: {
                    color: colors.backgroundGaugeBar,
                    fontSize: "50px",
                    lineHeight: "60px"
                },
                styleTextUnit: {
                    color: colors.textGauge,
                    fontSize: "35px",
                    lineHeight: "40px",
                    marginBottom: "4px"
                },
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
    getGaugeLabel: function (params) {
        return (
            <components.MeasureLabel {...params} />
        );
    },
    findFilteredReadingsRealtime (criteria) {
        const decorators = R.unnest(sensorsDecorators.allSensorsDecorator(this.getTheme()));
        const sensorsData = this.props.collections.get("sensors") ? this.props.collections.get("sensors") : Immutable.List();
        const mergedSiteSensor = Immutable.fromJS(mergeSiteSensors(this.getSite(this.props.realTime.site), sensorsData));
        const results = this.getMeasures().map((measure, index) => {
            const decorator = decorators.find(x => (x.key === measure.get("measurementType")));
            const sensorData = mergedSiteSensor.get("sensors").find(x => x.get("id") == measure.get("sensorId"));
            if (decorator && sensorData) {
                measure = measure.set("key", index);
                measure = measure.set("color", decorator.color);
                measure = measure.set("icon", decorator.icon);
                measure = measure.set("id", measure.get("sensorId"));
                measure = measure.set("unit", measure.get("unitOfMeasurement"));
                measure = measure.set("value", measure.get("measurementValue"));
                measure = measure.set("keyType", measure.get("measurementType"));
                measure = measure.set("type", sensorData.get("type"));
                measure = measure.set("description", sensorData.get("description"));
                return measure;
            }
        }).filter(criteria).sortBy(x => x.get("sensorId"));
        return results.toList();
    },
    findReadingsRealtime () {
        const result = this.findFilteredReadingsRealtime(x => x && (x.get("type") !== "pod" && x.get("type") !== "pod-anz"));
        return result.sortBy(x => x.get("sensorId"));
    },
    findEnergyReadingsRealtime: function () {
        var measures = this.findFilteredReadingsRealtime(x => x && (x.get("type") === "pod" && x.get("keyType") === "activeEnergy"));
        return measures;
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
        this.props.selectRealTimeSite(this.state.value || this.props.realTime.fullPath);
        this.closeModal();
    },
    renderModalButton: function () {
        const theme = this.getTheme();
        return (
            <div>
                <bootstrap.OverlayTrigger
                    overlay={<bootstrap.Tooltip className="buttonInfo">
                        {"Seleziona punto di misurazione"}
                    </bootstrap.Tooltip>}
                    placement="bottom"
                    rootClose={true}
                >
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
                </bootstrap.OverlayTrigger>
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
        );
    },
    renderModalBody: function () {
        return (
            <components.SiteNavigator
                allowedValues={this.getSites()}
                onChange={this.onChangeWidgetValue}
                path={this.state.value || this.props.realTime.fullPath || []}
                title={"QUALE PUNTO DI MISURAZIONE VUOI VISUALIZZARE?"}
            />
        );
    },
    renderConsumptionPanel: function (numberOfConsumptionSensor) {
        const {colors} = this.getTheme();
        const selectedSiteName = this.getSelectedSiteName();
        return numberOfConsumptionSensor > 0 ? (
            <div
                style={{
                    position: "absolute",
                    top: "20px",
                    left: "0px",
                    width: "100%",
                    backgroundColor: colors.backgroundRealTimeButton,
                    borderTop: "1px solid " + colors.borderRealTimeButton,
                    borderBottom: "1px solid " + colors.borderRealTimeButton
                }}
            >
                <h3
                    className="text-center"
                    style={{
                        color: colors.mainFontColor,
                        fontSize: "24px",
                        fontWeight: "400",
                        textTransform: "uppercase"
                    }}
                >
                    {`${selectedSiteName ? selectedSiteName + " - " : ""}Rilevazioni ambientali`}
                </h3>
                <components.VariablesPanel
                    numberOfConsumptionSensor={numberOfConsumptionSensor}
                    values={this.findReadingsRealtime()}
                />
            </div>
        ) : null;
    },
    render: function () {
        const theme = this.getTheme();
        const selectedSiteName = this.getSelectedSiteName();
        const numberOfConsumptionSensor = this.numberOfConsumptionSensor(this.props.realTime.fullPath);
        return (
            <div>
                {/* Title page */}
                <div style={styles(this.getTheme()).titlePage}>
                    <div style={{fontSize: "18px", marginBottom: "0px", paddingTop: "18px", width: "100%"}}>
                    </div>
                    <bootstrap.Col sm={4}>
                        {this.renderModalButton()}
                    </bootstrap.Col>
                </div>
                <div style={styles(theme).mainDivStyle, {position: "relative"}}>
                    {this.renderConsumptionPanel(numberOfConsumptionSensor)}
                    <div
                        style={{
                            position: "relative",
                            top: numberOfConsumptionSensor > 0 ? "220px" : "20px",
                            margin: "0px 30px 0px 30px",
                            height: numberOfConsumptionSensor > 0 ? "calc(100vh - 395px)" : "calc(100vh - 175px)",
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
                                top: "0px",
                                bottom: "0px",
                                left: "0px",
                                right: "-20px"
                            }}
                        >
                            <h3
                                className="text-center"
                                style={{
                                    color: theme.colors.mainFontColor,
                                    fontSize: "24px",
                                    fontWeight: "400",
                                    textTransform: "uppercase"
                                }}
                            >
                                {`${selectedSiteName ? selectedSiteName + " - " : ""}Pods`}
                            </h3>
                            <bootstrap.Col
                                className="text-center"
                                md={4}
                                style={{padding: "20px", color: theme.colors.mainFontColor}}
                                xs={12}
                            >
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
