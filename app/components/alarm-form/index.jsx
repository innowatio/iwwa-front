var bootstrap       = require("react-bootstrap");
var Immutable       = require("immutable");
var IPropTypes      = require("react-immutable-proptypes");
var R               = require("ramda");
var Radium          = require("radium");
var React           = require("react");
var ReactStateMixin = require("react-addons-linked-state-mixin");
import ReactPureRender from "react-addons-pure-render-mixin";

var components       = require("components");
var CollectionUtils  = require("lib/collection-utils");
var stringIt         = require("lib/string-it");
import {styles} from "lib/styles_restyling";
import {defaultTheme} from "lib/theme";

var styleH3 = ({colors}) => ({
    fontSize: "20px",
    lineHeight: "20px",
    fontWeight: "400",
    color: colors.mainFontColor
});
var styleH4 = ({colors}) => ({
    color: colors.mainFontColor,
    fontSize: "16px",
    margin: "0",
    padding: "0"
});

var styleSiteButton = ({colors}) => ({
    width: "50px",
    height: "50px",
    padding: "0",
    border: "0",
    marginRight: "20px",
    borderRadius: "100%",
    backgroundColor: colors.secondary
});

var AlarmForm = React.createClass({
    propTypes: {
        alarm: IPropTypes.map.isRequired,
        alarmsReduxState: React.PropTypes.object.isRequired,
        reset: React.PropTypes.func,
        siti: IPropTypes.map.isRequired,
        submit: React.PropTypes.func.isRequired,
        type: React.PropTypes.oneOf(["insert", "update"]).isRequired
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
    mixins: [ReactStateMixin, ReactPureRender],
    getInitialState: function () {
        return this.getStateFromProps(this.props);
    },
    componentWillReceiveProps: function (props) {
        this.setState(this.getStateFromProps(props));
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getSitoFromProps: function (props) {
        var pod = props.alarm.get("podId");
        return props.siti.find(function (sito) {
            return sito.get("pod") === pod;
        }) || Immutable.Map();
    },
    getStateFromProps: function (props) {
        return {
            active: props.alarm.get("active") || true,
            name: props.alarm.get("name"),
            notification: props.alarm.get("notification") || ["mail"],
            sito: this.getSitoFromProps(props),
            repetition: {
                weekDays: props.alarm.get("repetition") || [0, 1, 2, 3, 4, 5, 6],
                timeEnd: "00:00",
                timeStart: "00:00"
            },
            threshold: R.path(
                ["reale", "$gt"],
                JSON.parse(props.alarm.get("rule") || "{}")
            ) || 300,
            modalRepetitionOpen: false,
            modalNotificationOpen: false
        };
    },
    isAutomatic: function () {
        return (this.props.alarm.get("type") === "automatic");
    },
    reset: function () {
        this.props.reset();
        this.setState(this.getStateFromProps(this.props));
    },
    submit: function () {
        this.props.submit(this.state, this.props.type, this.props.alarm);
    },
    addTooltip: function () {
        return (
            <bootstrap.Tooltip id="createAlarmInfo">
                {stringIt.createAlarmInfoTooltip}
            </bootstrap.Tooltip>
        );
    },
    updateState: function (newValue) {
        this.setState(newValue);
    },
    getNotificationFromState: function () {
        return this.state.notification;
    },
    renderAlarmSelectSite: function () {
        const theme = this.getTheme();
        return !this.isAutomatic() ? (
            <bootstrap.Col lg={6} md={6} xs={12}>
                <h3 style={styleH3(theme)}>{stringIt.titleTabImpostazioniAlarm}</h3>
                <h4 style={styleH4(theme)}>
                    {"Seleziona un punto da monitorare e le soglie di allarme "}
                    <bootstrap.OverlayTrigger
                        overlay={this.addTooltip()}
                        placement="right"
                        rootClose={true}
                        trigger="click"
                    >
                        <components.Button  bsStyle="link">
                            <components.Icon
                                color={theme.colors.iconInfo}
                                icon={"info"}
                                size={"20px"}
                                style={{
                                    float: "right",
                                    verticalAlign: "middle",
                                    lineHeight: "20px"
                                }}
                            />
                        </components.Button>
                    </bootstrap.OverlayTrigger>
                </h4>
                <div style={{minHeight: "50px"}}>
                    {this.renderSiteButton()}
                    <components.Popover
                        arrow="none"
                        hideOnChange={true}
                        styleButton={{width: "400px"}}
                        title={this.renderTitleSelectSite()}
                    >
                        <components.SelectTree
                            allowedValues={this.props.siti}
                            buttonCloseDefault={true}
                            className="site-select"
                            filter={CollectionUtils.sites.filter}
                            getKey={CollectionUtils.sites.getKey}
                            getLabel={CollectionUtils.sites.getLabel}
                            valueLink={this.linkState("sito")}
                        />
                    </components.Popover>
                </div>
                {this.renderAlarmName()}
            </bootstrap.Col>
        ) : null;
    },
    renderAlarmThreshold: function () {
        const theme = this.getTheme();
        return !this.isAutomatic() ? (
            <bootstrap.Col lg={6} md={6} xs={12}>
                <h3 style={styleH3(theme)}>{stringIt.titleAlarmThreshold}</h3>
                <div style={{
                    backgroundColor: theme.colors.backgroundAlarmsSection,
                    textAlign: "center",
                    borderRadius: "20px",
                    margin: "30px 0",
                    border: `1px solid ${theme.colors.borderAlarmsSection}`,
                    padding: "20px 5%"
                }}
                >
                    <components.Spacer direction="v" size={3} />
                    <h4
                        style={{
                            color: theme.colors.mainFontColor,
                            fontSize: "16px",
                            fontWeight: "300"
                        }}
                    >
                        {`Soglia (${this.state.threshold} kWh)`}
                    </h4>
                    <components.Spacer direction="v" size={10} />
                    <div className="inputRangeBar">
                        <Radium.Style
                            rules={styles(theme).inputRangeBar}
                            scopeSelector=".inputRangeBar"
                        />
                        <bootstrap.Input
                            bsStyle={"success"}
                            max={600}
                            min={0}
                            step={5}
                            style={styles(theme).inputRange}
                            type="range"
                            valueLink={this.linkState("threshold")}
                        />
                    </div>
                    <div style={{
                        width: "50%",
                        float:"left",
                        fontSize: "16px",
                        textAlign: "left",
                        fontWeight: "300",
                        color: theme.colors.mainFontColor
                    }}
                    >
                        {"0 Kwh"}
                    </div>
                    <div style={{
                        width: "50%",
                        float:"right",
                        fontSize: "16px",
                        textAlign: "right",
                        fontWeight: "300",
                        color: theme.colors.mainFontColor
                    }}
                    >
                        {"600 Kwh"}
                    </div>
                    <p style={{
                        marginTop: "50px",
                        color: theme.colors.mainFontColor,
                        fontStyle: "italic",
                        fontSize: "16px",
                        fontWeight: "300",
                        textAlign: "left"
                    }}
                    >
                        {"Imposta il limite massimo "}
                    </p>
                </div>
            </bootstrap.Col>
        ) : null;
    },
    renderAlarmName: function () {
        const theme = this.getTheme();
        return (
            <div>
                <h3 style={styleH3(theme)}>{stringIt.titleAlarmName}</h3>
                {this.isAutomatic() ?
                    <h3 style={{
                        color: theme.colors.mainFontColor,
                        fontSize: "20px"
                    }}
                    >{this.props.alarm.get("name")}</h3> :
                    <bootstrap.Input
                        style={styles(theme).inputLine}
                        type="text"
                        valueLink={this.linkState("name")}
                    />
                }
            </div>
        );
    },
    renderAlarmNotification: function () {
        return (
            <bootstrap.Col lg={6} md={6} xs={12}>
                <components.AlarmNotificationModal
                    updateParentState={this.updateState}
                    value={this.state.notification}
                />
            </bootstrap.Col>
        );
    },
    renderAlarmActive: function () {
        const theme = this.getTheme();
        return (
            <bootstrap.Col lg={6} md={6} xs={12}>
                <div style={{display: this.props.type === "update" ? "block" : "none"}}>
                    <components.Spacer direction="v" size={30} />
                    <bootstrap.Input
                        checkedLink={this.linkState("active")}
                        label={
                            <h3 style={styleH3(theme)}>{stringIt.titleAlarmActive}</h3>
                        }
                        type="checkbox"
                    />
                </div>
            </bootstrap.Col>
        );
    },
    renderAlarmRepetition: function () {
        return !this.isAutomatic() ? (
            <bootstrap.Col lg={6} md={6} xs={12}>
                <components.AlarmRepetitionModal
                    updateParentState={this.updateState}
                    value={this.state.repetition}
                />
            </bootstrap.Col>
        ) : null;
    },
    renderResetButton: function () {
        return (
            <components.Button
                bsStyle="link"
                disabled={this.props.alarmsReduxState.statePostAlarm}
                onClick={this.reset}
            >
                {
                    <components.Icon
                        color={this.getTheme().colors.iconArrow}
                        icon={"reset"}
                        size={"35px"}
                        style={{
                            float: "right",
                            verticalAlign: "middle",
                            lineHeight: "20px"
                        }}
                    />
                }
            </components.Button>
        );
    },
    renderSubmitButton: function () {
        const {colors} = this.getTheme();
        return (
            <components.Button
                disabled={this.props.alarmsReduxState.statePostAlarm}
                onClick={this.submit}
                style={{
                    backgroundColor: colors.buttonPrimary,
                    color: colors.white,
                    width: "230px",
                    height: "45px",
                    borderRadius: "30px",
                    border: "0"
                }}
            >
                {this.props.type === "update" ? "SALVA" : "CREA"}
            </components.Button>
        );
    },
    renderSiteButton: function () {
        const theme = this.getTheme();
        return (
            <components.Button className="pull-left" onClick={this.openModal} style={styleSiteButton(theme)} >
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
        );
    },
    renderTitleSelectSite: function () {
        const theme = this.getTheme();
        return this.state.sito.size === 0 ?
            <span>
                {"Seleziona punto di misurazione"}
                <components.Icon
                    color={theme.colors.iconInputSelect}
                    icon={"arrow-down"}
                    size={"20px"}
                    style={{lineHeight: "20px", float: "right"}}
                />
            </span>
            :
            <span>
                {CollectionUtils.sites.getLabel(this.state.sito)}
                {this.state.sito.get("pod")}
                <components.Icon
                    color={theme.colors.iconInputSelect}
                    icon={"arrow-down"}
                    size={"20px"}
                    style={{lineHeight: "20px", float: "right"}}
                />
            </span>
        ;
    },
    renderAutomaticAlarmBanner: function () {
        const {colors} = this.getTheme();
        return this.isAutomatic() ? (
            <bootstrap.Col xs={12}>
                <bootstrap.Alert
                    style={{
                        backgroundColor: colors.backgroundContentModal,
                        borderColor: colors.borderContentModal,
                        color: colors.mainFontColor
                    }}
                >
                    <h4 style={{color: colors.mainFontColor}}>
                        {"Allarme automatico"}
                    </h4>
                    <p>
                        {"L'allarme scatta quando il valore misurato supera le seguenti soglie:"}
                    </p>
                    <ul>
                        <li>{"300% del valore previsionale dalle 22.00 alle 07.00"}</li>
                        <li>{"200% del valore previsionale dalle 07.00 alle 22.00"}</li>
                    </ul>
                </bootstrap.Alert>
            </bootstrap.Col>
        ) : null;
    },
    render: function () {
        const theme = this.getTheme();
        return (
            <div className="alarm-form" style={{height: "100%"}}>
                <div style={R.merge(styles(theme).colVerticalPadding, {height: "100%", overflow: "auto"})}>
                    <Radium.Style
                        rules={{
                            ".input-group-addon": {
                                backgroundColor: theme.colors.backgroundSelectSearch,
                                borderTop: "0",
                                borderRight: "0",
                                borderBottomRightRadius: "0",
                                padding: "0"
                            }
                        }}
                        scopeSelector=".alarm-form"
                    />
                    <div style={{height: "calc(100vh - 420px)"}}>
                        {this.renderAutomaticAlarmBanner()}
                        {this.renderAlarmSelectSite()}
                        {this.renderAlarmThreshold()}
                        <div style={{clear: "both"}}>
                            {this.renderAlarmNotification()}
                            {this.renderAlarmActive()}
                            {this.renderAlarmRepetition()}
                        </div>
                    </div>
                    <bootstrap.Col style={{paddingTop: "8vh", textAlign: "center"}} xs={12}>
                        {this.renderSubmitButton()}
                        {this.renderResetButton()}
                    </bootstrap.Col>
                </div>
            </div>
        );
    }
});

module.exports = Radium(AlarmForm);
