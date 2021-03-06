import * as R from "ramda";
import get from "lodash.get";
import Immutable from "immutable";
import * as bootstrap from "react-bootstrap";
import React from "react";
import IPropTypes from "react-immutable-proptypes";
import moment from "moment";

import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {
    ConfirmModal,
    FullscreenModal,
    Gauge,
    MeasureLabel,
    SiteNavigator,
    TooltipIconButton,
    VariablesPanel
} from "components";

import * as sensorsDecorators from "lib/sensors-decorators";
import {styles} from "lib/styles";
import {selectRealTimeSite} from "actions/real-time";
import {defaultTheme} from "lib/theme";
import {getTitleForSingleSensor} from "lib/page-header-utils";
import getLastUpdate from "lib/date-utils";

const styleSiteButton = ({colors}) => ({
    width: "50px",
    height: "50px",
    border: "0px",
    borderRadius: "100%",
    marginRight: "15px",
    backgroundColor: colors.primary
});
const styleTextNodata = ({colors}) => ({
    padding: "30px",
    border: "0px",
    fontSize: "20px",
    fontWeight: "600",
    borderRadius: "30px",
    textAlign: "center",
    color: colors.buttonPrimary
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
            showFullscreenModal: false,
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
    getRealTimeData: function () {
        const realtimeData = this.props.collections.get("readings-real-time-aggregates");
        if (realtimeData) {
            const sites = this.props.collections.get("sites");
            const site = sites.get(this.props.realTime.site);
            if (site) {
                const filter = [
                    "co2",
                    "temperature",
                    "humidity",
                    "illuminance",
                    "activeEnergy"
                ];
                const siteSensors = site.get("sensorsIds");
                if (siteSensors) {
                    const realtimeSite = realtimeData
                        .filter(x => R.contains(x.get("sensorId"), siteSensors.toJS()))
                        .filter(x => x.get("day") === moment().format("YYYY-MM-DD"))
                        .filter(x => R.contains(x.get("measurementType"), filter))
                        .filter(x => x);
                    return realtimeSite;
                }
            }
        }
        return Immutable.List();
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    drawGauge: function (params) {
        const {colors} = this.getTheme();
        return (
            <div style={{
                margin: "auto",
                width: R.path(["style", "width"],
                params) || "200px",
                textAlign: "center"
            }}>
                <Gauge
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
                        fontSize: "calc(11px + .5vw)",
                        lineHeight: "calc(11px + .5vw)",
                        color: colors.backgroundGaugeBar,
                        textTransform: "uppercase"
                    }}
                >
                    <div>{params.description}</div>
                    <div style={{
                        fontWeight: "300",
                        fontSize: "calc(7px + .5vw)",
                        lineHeight: "calc(7px + .5vw)",
                        margin: "6px 0",
                        color: colors.mainFontColor
                    }}>
                        {params.measurementTime}
                    </div>
                </div>
                <div
                    style={{
                        fontWeight: "300",
                        fontSize: "calc(10px + .5vw)",
                        lineHeight: "calc(11px + .5vw)",
                        color: colors.mainFontColor,
                        textTransform: "uppercase"
                    }}
                >
                    {params.id}
                </div>
            </div>
        );
    },
    drawGauges: function () {
        const {colors} = this.getTheme();
        if (this.findEnergyReadingsRealtime().size > 0) {
            return this.findEnergyReadingsRealtime().map((measure) => {
                var gaugeParams = {
                    id: measure.name || measure._id,
                    key: measure.key,
                    description: measure.description,
                    measurementTime: getLastUpdate(measure.measurementTime),
                    maximum: 100,
                    minimum: 0,
                    style: {height: "auto", width: "100%"},
                    styleGaugeBar: {stroke: colors.backgroundGaugeBar},
                    stylePointer: {fill: colors.backgroundGaugeBar},
                    styleTextLabel: {
                        color: colors.mainFontColor,
                        fontSize: "calc(22px + 1vw)",
                        lineHeight: "40px"
                    },
                    styleTextUnit: {
                        color: colors.textGauge,
                        fontSize: "calc(12px + .5vw)",
                        lineHeight: "40px"
                    },
                    unit: measure.unit || measure.unitOfMeasurement,
                    value: parseFloat(measure.measurementValue).toFixed(2) / 1 || 0
                };
                return (
                    <bootstrap.Col
                        key={measure.key}
                        lg={4}
                        md={6}
                        xs={4}
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
    numberOfConsumptionSensor: function () {
        return this.findReadingsRealtime().size;
    },
    drawGaugeTotal: function () {
        const {colors} = this.getTheme();

        const isRealtimeAnytime = this.getRealTimeData();
        if (isRealtimeAnytime.size === 0) {
            return (
                <bootstrap.Col
                    className="text-center"
                    xs={12}
                >
                    <div style={styleTextNodata({colors})}>
                        {"Non sono disponibili dati realtime"}
                    </div>
                </bootstrap.Col>
            );
        }

        if (this.findEnergyReadingsRealtime().size > 0) {
            const {value, unit} = this.findEnergyReadingsRealtime().reduce((acc, measure) => {
                return {
                    value: acc.value + parseFloat((measure.measurementValue) || 0),
                    unit: measure.unit || measure.unitOfMeasurement
                };
            }, {value: 0, unit: ""});
            var gaugeParams = {
                description: "Consumi totali",
                id: getTitleForSingleSensor(this.props.realTime, this.props.collections),
                key: "Consumi totali",
                maximum: 100,
                minimum: 0,
                style: {height: "auto", width: "100%"},
                styleLabel: {top: "-20%"},
                stylePointer: {fill: colors.backgroundGaugeBar},
                styleTextLabel: {
                    color: colors.mainFontColor,
                    fontSize: "calc(40px + 1vw)",
                    lineHeight: "60px"
                },
                styleTextUnit: {
                    color: colors.textGauge,
                    fontSize: "calc(16px + 1vw)",
                    lineHeight: "60px"
                },
                unit: unit,
                value: parseFloat(value).toFixed(2) / 1
            };
            return (
                <bootstrap.Col
                    className="text-center"
                    lg={4}
                    lgOffset={0}
                    md={5}
                    mdOffset={0}
                    sm={6}
                    smOffset={3}
                    xs={8}
                    xsOffset={2}
                    style={{padding: "20px"}}
                >
                    {this.drawGauge(gaugeParams)}
                </bootstrap.Col>
            );
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
    closeModals: function () {
        this.setState({
            showConfirmModal: false,
            showFullscreenModal: false,
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
            <MeasureLabel
                {...params}
                style={{
                    justifyContent: "center",
                    alignItems: "center"
                }}
            />
        );
    },
    getSensorsData () {
        return this.props.collections.get("sensors") ? this.props.collections.get("sensors") : Immutable.List();
    },
    decorateRealtime (realtime, decorators) {
        const sensorData = this.getSensorsData().find(x => x.get("_id") === realtime.get("sensorId"));
        const decorationData = decorators.find(x => (x.key === realtime.get("measurementType")));
        if (sensorData && decorationData) {
            const decorated = {
                ...realtime.toJS(),
                ...sensorData.toJS(),
                ...decorationData,
                key: `${realtime.get("sensorId")}-${realtime.get("measurementType")}`
            };
            return decorated;
        }
    },
    findRealtimeByMeasurementTypes (measurementTypes = []) {
        const decorationsData = R.unnest(sensorsDecorators.allSensorsDecorator(this.getTheme()));
        const realtimeData = this.getRealTimeData().filter(x => x && R.contains(x.get("measurementType"), measurementTypes));
        const decoratedData = realtimeData.map(ambience => {
            return this.decorateRealtime(ambience, decorationsData);
        }).filter(x => x).sortBy(x => x.sensorId);

        return decoratedData.toList();
    },
    findReadingsRealtime () {
        return this.findRealtimeByMeasurementTypes([
            "co2",
            "temperature",
            "humidity",
            "illuminance"
        ]);
    },
    findEnergyReadingsRealtime: function () {
        return this.findRealtimeByMeasurementTypes([
            "activeEnergy"
        ]);
    },
    getSitoById: function (sitoId) {
        const sites = this.props.collections.get("sites") || Immutable.Map();
        return sites.find(site => {
            return site.get("_id") === sitoId;
        });
    },
    onChangeWidgetValue: function (value) {
        this.setState({value});
    },
    onConfirmFullscreenModal: function () {
        const siteId = this.state.value[0];
        this.props.asteroid.subscribe("readingsRealTimeAggregatesBySite", siteId);
        this.props.selectRealTimeSite(this.state.value || this.props.realTime.fullPath);
        this.setState({showConfirmModal: true});
    },
    renderButton: function () {
        const theme = this.getTheme();
        return (
            <TooltipIconButton
                buttonClassName={"pull-right"}
                buttonStyle={styleSiteButton(theme)}
                icon={"map"}
                iconColor={theme.colors.iconSiteButton}
                iconSize={"38px"}
                iconStyle={{textAlign: "center", verticalAlign: "middle"}}
                onButtonClick={() => this.setState({showFullscreenModal: true})}
                tooltipText={"Seleziona punto di misurazione"}
            />
        );
    },
    renderConfirmModal: function () {
        const fullPath = get(this.props, "realTime.fullPath", []) || [];
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
        return (
            <FullscreenModal
                onConfirm={this.onConfirmFullscreenModal}
                onHide={() => this.setState({showFullscreenModal: false})}
                onReset={() => this.setState({showFullscreenModal: false})}
                renderConfirmButton={true}
                show={this.state.showFullscreenModal}
            >
                <SiteNavigator
                    allowedValues={this.getSites()}
                    onChange={this.onChangeWidgetValue}
                    path={this.state.value || this.props.realTime.fullPath || []}
                    title={"QUALE PUNTO DI MISURAZIONE VUOI VISUALIZZARE?"}
                />
            </FullscreenModal>
        );
    },
    renderConsumptionPanel: function (numberOfConsumptionSensor) {
        const {colors} = this.getTheme();
        const selectedSiteName = this.getSelectedSiteName();
        return numberOfConsumptionSensor > 0 ? (
            <div
                style={{
                    marginTop: "20px",
                    width: "100%",
                    height: "auto",
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
                        textTransform: "uppercase",
                        marginBottom: "20px"
                    }}
                >
                    {`${selectedSiteName ? selectedSiteName + " - " : ""}Rilevazioni ambientali`}
                </h3>
                <VariablesPanel
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
                <div style={{...styles(theme).titlePage, alignItems: "center", justifyContent: "flex-end"}}>
                    {this.renderButton()}
                </div>
                <div style={styles(theme).mainDivStyle, {position: "relative"}}>
                    {this.renderConsumptionPanel(numberOfConsumptionSensor)}
                    <div
                        style={{
                            position: "relative",
                            margin: "20px 30px 0px 30px",
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
                                {`${selectedSiteName ? selectedSiteName : ""}`}
                            </h3>
                            {this.drawGaugeTotal()}
                            <bootstrap.Col lg={8} md={7} xs={12}>
                                {this.drawGauges()}
                            </bootstrap.Col>
                        </div>
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
        realTime: state.realTime
    };
}
function mapDispatchToProps (dispatch) {
    return {
        selectRealTimeSite: bindActionCreators(selectRealTimeSite, dispatch)
    };
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(RealTime);
