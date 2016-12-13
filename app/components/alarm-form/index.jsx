import R from "ramda";
import Radium from "radium";
import React, {PropTypes} from "react";
import ReactPureRender from "react-addons-pure-render-mixin";
import {
    Col,
    FormControl,
    Row
} from "react-bootstrap";
import ImmutablePropTypes from "react-immutable-proptypes";

import {
    AlarmNotificationModal,
    Button,
    ButtonGroupSelect,
    Icon,
    Popover,
    SelectTree,
    Spacer,
    TooltipIconButton
} from "components";

import CollectionUtils from "lib/collection-utils";
import Globalization from "lib/globalization";
import {styles} from "lib/styles";
import {defaultTheme} from "lib/theme";

const styleH3 = ({colors}) => ({
    fontSize: "20px",
    lineHeight: "20px",
    fontWeight: "400",
    margin: "0px",
    color: colors.mainFontColor
});

const styleSiteButton = ({colors}) => ({
    width: "50px",
    height: "50px",
    padding: "0px",
    border: "0px",
    marginRight: "20px",
    borderRadius: "100%",
    backgroundColor: colors.secondary
});

const defaultState = {
    _id: undefined,
    name: "",
    sensorId: "",
    type: "daily",
    thresholdRule: "{\"$gt\": 300}",
    threshold: 300,
    unitOfMeasurement: "kWh",
    measurementType: "activeEnergy",
    notifications: ["push"]
};

const measurementTypeButtonStyle = (theme) => R.merge(styles(theme).buttonSelectChart, {
    minWidth: "132px",
    height: "45px",
    fontSize: "15px",
    fontWeight: "300",
    margin: "0 0 0 10px",
    padding: "0px"
});

var AlarmForm = React.createClass({
    propTypes: {
        alarm: PropTypes.object,
        onReset: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
        siti: ImmutablePropTypes.map.isRequired,
        status: PropTypes.string,
        userId: PropTypes.string
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
    mixins: [ReactPureRender],
    getInitialState: function () {
        return defaultState;
    },
    componentWillReceiveProps: function (props) {
        this.setState(props.alarm ? props.alarm : defaultState);
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    reset: function () {
        this.setState(defaultState);
        this.props.onReset();
    },
    submit: function () {
        this.props.onSubmit({
            ...this.state,
            rule: `{\"$and\": [{\"measurementType\": \"${this.state.measurementType}\"}, {\"source\": \"reading\"}]}`,
            userId: this.props.userId,
            email: R.contains("mail", this.state.notifications)
        });
    },
    getSubmitButtonLabel: function () {
        const {status} = this.props;
        switch (status) {
            case "started":
                return "CREAZIONE IN CORSO";
            case "success":
                return "ALLARME CREATO";
            case "error":
                return "ERRORE";
            default:
                return "CREA";
        }
    },
    renderAlarmName: function () {
        const theme = this.getTheme();
        return (
            <div>
                <h3 style={styleH3(theme)}>{Globalization.italian.titleAlarmName}</h3>
                <FormControl
                    style={styles(theme).inputLine}
                    type="text"
                    onChange={input => this.setState({name: input.target.value})}
                    value={this.state.name}
                />
            </div>
        );
    },
    renderAlarmSelectSite: function () {
        const theme = this.getTheme();
        return (
            <div>
                <Spacer direction="v" size={40} />
                <h3 style={styleH3(theme)}>{"Seleziona un punto da monitorare"}</h3>
                <Row>
                    <Col xs={10}>
                        <FormControl
                            disabled={true}
                            style={styles(theme).inputLine}
                            type="text"
                            value={this.state.sensorId}
                        />
                    </Col>
                    <Col xs={2}>
                        <Popover
                            arrow="none"
                            hideOnChange={true}
                            title={(
                                <span>
                                    <TooltipIconButton
                                        buttonClassName={"pull-right"}
                                        buttonStyle={styleSiteButton(theme)}
                                        icon={"map"}
                                        iconColor={theme.colors.iconSiteButton}
                                        iconSize={"38px"}
                                        iconStyle={{textAlign: "center", verticalAlign: "middle"}}
                                        onButtonClick={this.openModal}
                                        tooltipText={"Visualizza i tuoi punti di misurazione"}
                                    />
                                </span>
                            )}
                        >
                            <SelectTree
                                allowedValues={this.props.siti}
                                buttonCloseDefault={true}
                                className="site-select"
                                filter={CollectionUtils.sites.filter}
                                getKey={CollectionUtils.sites.getKey}
                                getLabel={CollectionUtils.sites.getLabel}
                                onChange={input => this.setState({sensorId: input[0]})}
                                value={this.state.value}
                            />
                        </Popover>
                    </Col>
                </Row>
            </div>
        );
    },
    renderAlarmVariables: function () {
        const theme = this.getTheme();
        const allowedValues = [{
            label: "Energia attiva", key: "activeEnergy"
        }, {
            label: "Potenza", key: "maxPower"
        }, {
            label: "Energia reattiva", key: "reactiveEnergy"
        }];
        const value = allowedValues.find(x => x.key === this.state.measurementType);
        return (
            <div>
                <h3 style={styleH3(theme)}>{Globalization.italian.titleAlarmVariables}</h3>
                <Spacer direction={"v"} size={20} />
                <ButtonGroupSelect
                    allowedValues={allowedValues}
                    getKey={R.prop("key")}
                    getLabel={R.prop("label")}
                    onChange={(input) => this.setState({measurementType: input[0].key})}
                    style={measurementTypeButtonStyle(theme)}
                    styleToMergeWhenActiveState={{
                        background: theme.colors.backgroundChartSelectedButton,
                        color: theme.colors.textSelectButton,
                        border: `1px solid ${theme.colors.borderChartSelectedButton}`
                    }}
                    value={[value]}
                />
            </div>
        );
    },
    renderAlarmMeasurementType: function () {
        const theme = this.getTheme();
        const allowedValues = [{
            label: "Realtime", key: "realtime"
        }, {
            label: "Giornaliero", key: "daily"
        }, {
            label: "Mensile", key: "monthly"
        }];
        const value = allowedValues.find(x => x.key === this.state.type);
        return (
            <div>
                <h3 style={styleH3(theme)}>{Globalization.italian.typeOfAlarm}</h3>
                <Spacer direction={"v"} size={20} />
                <ButtonGroupSelect
                    allowedValues={allowedValues}
                    getKey={R.prop("key")}
                    getLabel={R.prop("label")}
                    onChange={(input) => this.setState({type: input[0].key})}
                    style={measurementTypeButtonStyle(theme)}
                    styleToMergeWhenActiveState={{
                        background: theme.colors.backgroundChartSelectedButton,
                        color: theme.colors.textSelectButton,
                        border: `1px solid ${theme.colors.borderChartSelectedButton}`
                    }}
                    value={[value]}
                />
            </div>
        );
    },
    renderAlarmNotification: function () {
        return (
            <AlarmNotificationModal
                updateParentState={({notification}) => {
                    this.setState({
                        notifications: notification
                    });
                }}
                value={this.state.notifications}
            />
        );
    },
    renderAlarmUnitOfMeasurement: function () {
        const theme = this.getTheme();
        return (
            <div>
                <h3 style={styleH3(theme)}>{"Unità di misura"}</h3>
                <FormControl
                    style={styles(theme).inputLine}
                    type="text"
                    onChange={input => this.setState({unitOfMeasurement: input.target.value})}
                    value={this.state.unitOfMeasurement}
                />
            </div>
        );
    },
    renderAlarmThreshold: function () {
        const theme = this.getTheme();
        return (
            <div>
                <h3 style={styleH3(theme)}>{Globalization.italian.titleAlarmThreshold}</h3>
                <div style={{
                    backgroundColor: theme.colors.backgroundAlarmsSection,
                    textAlign: "center",
                    borderRadius: "20px",
                    margin: "30px 0",
                    border: `1px solid ${theme.colors.borderAlarmsSection}`,
                    padding: "20px 5%"
                }}>
                    <Spacer direction="v" size={3} />
                    <h4
                        style={{
                            color: theme.colors.mainFontColor,
                            fontSize: "16px",
                            fontWeight: "300"
                        }}
                    >
                        {`Soglia (${this.state.threshold} ${this.state.unitOfMeasurement})`}
                    </h4>
                    <Spacer direction="v" size={10} />
                    <div className="inputRangeBar">
                        <Radium.Style
                            rules={styles(theme).inputRangeBar}
                            scopeSelector=".inputRangeBar"
                        />
                        <FormControl
                            bsStyle={"success"}
                            max={600}
                            min={0}
                            step={1}
                            style={styles(theme).inputRange}
                            type="range"
                            onChange={input => this.setState({
                                threshold: input.target.value,
                                thresholdRule: `{"$gt": ${input.target.value}}`
                            })}
                            value={this.state.threshold}
                        />
                    </div>
                    <div style={{
                        width: "50%",
                        float:"left",
                        fontSize: "16px",
                        textAlign: "left",
                        fontWeight: "300",
                        color: theme.colors.mainFontColor
                    }}>
                        {`0 ${this.state.unitOfMeasurement}`}
                    </div>
                    <div style={{
                        width: "50%",
                        float:"right",
                        fontSize: "16px",
                        textAlign: "right",
                        fontWeight: "300",
                        color: theme.colors.mainFontColor
                    }}>
                        {`600 ${this.state.unitOfMeasurement}`}
                    </div>
                    <p style={{
                        marginTop: "50px",
                        color: theme.colors.mainFontColor,
                        fontStyle: "italic",
                        fontSize: "16px",
                        fontWeight: "300",
                        textAlign: "left"
                    }}>
                        {"Imposta il limite massimo "}
                    </p>
                </div>
            </div>
        );
    },
    renderSubmitButton: function () {
        const {colors} = this.getTheme();
        return (
            <Button
                onClick={this.submit}
                style={{
                    backgroundColor: colors.buttonPrimary,
                    color: colors.white,
                    width: "230px",
                    height: "45px",
                    borderRadius: "30px",
                    border: "0px"
                }}
            >
                {this.getSubmitButtonLabel()}
            </Button>
        );
    },
    renderResetButton: function () {
        return (
            <Button
                bsStyle="link"
                onClick={this.reset}
            >
                <Icon
                    color={this.getTheme().colors.iconArrow}
                    icon={"reset"}
                    size={"35px"}
                    style={{
                        float: "right",
                        verticalAlign: "middle",
                        lineHeight: "20px"
                    }}
                />
            </Button>
        );
    },
    render: function () {
        return (
            <Row className="alarm-form" style={{padding: "25px", height: "100%"}}>
                <Col lg={12} style={{height: "calc(100vh - 420px)"}}>
                    <Row>
                        <Col lg={6} md={6} xs={12}>
                            <Row style={{padding: "10px"}}>
                                {this.renderAlarmName()}
                            </Row>
                            <Row style={{padding: "10px"}}>
                            {this.renderAlarmSelectSite()}
                            </Row>
                        </Col>

                        <Col lg={6} md={6} xs={12}>
                            <Row style={{padding: "10px"}}>
                                {this.renderAlarmUnitOfMeasurement()}
                            </Row>
                            <Row style={{padding: "10px"}}>
                                {this.renderAlarmThreshold()}
                            </Row>
                        </Col>
                    </Row>

                    <Row>
                        <Col lg={6} md={6} xs={12}>
                            <Row style={{padding: "10px"}}>
                                {this.renderAlarmVariables()}
                            </Row>
                            <Row style={{padding: "10px"}}>
                                {this.renderAlarmNotification()}
                            </Row>
                        </Col>

                        <Col lg={6} md={6} xs={12}>
                            <Row style={{padding: "10px"}}>
                                {this.renderAlarmMeasurementType()}
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col style={{paddingTop: "8vh", textAlign: "center"}} xs={12}>
                    <Row style={{padding: "10px"}}>
                        {this.renderSubmitButton()}
                        {this.renderResetButton()}
                    </Row>
                </Col>
            </Row>
        );
    }
});

module.exports = AlarmForm;
