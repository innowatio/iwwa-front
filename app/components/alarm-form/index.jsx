var bootstrap       = require("react-bootstrap");
var Immutable       = require("immutable");
var IPropTypes      = require("react-immutable-proptypes");
var R               = require("ramda");
var Radium          = require("radium");
var React           = require("react");
var ReactStateMixin = require("react-addons-linked-state-mixin");

var components       = require("components");
var CollectionUtils  = require("lib/collection-utils");
var colors           = require("lib/colors_restyling");
var stringIt         = require("lib/string-it");
var styles           = require("lib/styles_restyling");
var tutorialString   = require("assets/JSON/tutorial-string.json");
var GetTutorialMixin = require("lib/get-tutorial-mixin");
var icons            = require("lib/icons");

var AlarmForm = React.createClass({
    propTypes: {
        alarm: IPropTypes.map.isRequired,
        alarmsReduxState: React.PropTypes.object.isRequired,
        reset: React.PropTypes.func,
        siti: IPropTypes.map.isRequired,
        submit: React.PropTypes.func.isRequired,
        type: React.PropTypes.oneOf(["insert", "update"]).isRequired
    },
    mixins: [ReactStateMixin, GetTutorialMixin(
        "alarm-form", ["siti", "threshold", "name", "notification", "repetition"])],
    getInitialState: function () {
        return this.getStateFromProps(this.props);
    },
    componentWillReceiveProps: function (props) {
        this.setState(this.getStateFromProps(props));
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
        console.log("SUBMIT");
        this.props.submit(this.state, this.props.type, this.props.alarm);
    },
    addTooltip: function () {
        return (
            <bootstrap.Tooltip
                id="createAlarmInfo"
            >
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
        return !this.isAutomatic() ? (
            <bootstrap.Col lg={6} md={6} xs={12}>
                <components.TutorialAnchor
                    message={tutorialString.alarmForm.siti}
                    order={1}
                    position="right"
                    ref="siti"
                >
                    <div>
                        <h3 style={{color: colors.primary}}>{stringIt.titleTabImpostazioniAlarm}</h3>
                        <h5>
                            {"Seleziona un punto da monitorare e le soglie di allarme "}
                            <bootstrap.OverlayTrigger
                                overlay={this.addTooltip()}
                                placement="right"
                                rootClose={true}
                                trigger="click"
                            >
                                <components.Button  bsStyle="link">
                                    <img src={icons.iconInfo} style={{width: "75%"}}/>
                                </components.Button>
                            </bootstrap.OverlayTrigger>
                        </h5>
                        <components.Popover
                            arrow="none"
                            hideOnChange={true}
                            title={this.renderTitleSelectSite()}
                        >
                            <components.SelectTree
                                allowedValues={this.props.siti}
                                buttonCloseDefault={true}
                                filter={CollectionUtils.sites.filter}
                                getKey={CollectionUtils.sites.getKey}
                                getLabel={CollectionUtils.sites.getLabel}
                                valueLink={this.linkState("sito")}
                            />
                        </components.Popover>
                    </div>
                </components.TutorialAnchor>
            </bootstrap.Col>
        ) : null;
    },
    renderAlarmThreshold: function () {
        return !this.isAutomatic() ? (
            <bootstrap.Col lg={6} md={6} xs={12}>
                <components.TutorialAnchor
                    message={tutorialString.alarmForm.threshold}
                    order={2}
                    position="left"
                    ref="threshold"
                >
                    <div>
                        <h4 style={{color: colors.primary}}>{stringIt.titleAlarmThreshold}</h4>
                        <div style={{backgroundColor: colors.greyBackground, textAlign: "center"}}>
                            <components.Spacer direction="v" size={3} />
                            <h4
                                style={{
                                    color: colors.primary,
                                    marginTop: "8px"
                                }}
                            >
                                {`Soglia (${this.state.threshold} kWh)`}
                            </h4>
                            <components.Spacer direction="v" size={10} />
                            <bootstrap.Input
                                max={600}
                                min={0}
                                step={5}
                                style={styles.inputRange}
                                type="range"
                                valueLink={this.linkState("threshold")}
                            />
                        </div>
                    </div>
                </components.TutorialAnchor>
            </bootstrap.Col>
        ) : null;
    },
    renderAlarmName: function () {
        return (
            <bootstrap.Col lg={6} md={6} xs={12}>
                <components.TutorialAnchor
                    message={tutorialString.alarmForm.name}
                    order={3}
                    position="right"
                    ref="name"
                >
                    <div>
                        <h4 style={{color: colors.primary}}>{stringIt.titleAlarmName}</h4>
                        {this.isAutomatic() ?
                            <h5>{this.props.alarm.get("name")}</h5> :
                            <bootstrap.Input
                                style={styles.inputLine}
                                type="text"
                                valueLink={this.linkState("name")}
                            />
                        }
                    </div>
                </components.TutorialAnchor>
            </bootstrap.Col>
        );
    },
    renderAlarmNotification: function () {
        return (
            <bootstrap.Col lg={6} md={6} xs={12}>
                <components.TutorialAnchor
                    message={tutorialString.alarmForm.notification}
                    order={5}
                    position="right"
                    ref="notification"
                >
                    <components.AlarmNotificationModal
                        updateParentState={this.updateState}
                        value={this.state.notification}
                    />
                </components.TutorialAnchor>
            </bootstrap.Col>
        );
    },
    renderAlarmActive: function () {
        return (
            <bootstrap.Col lg={6} md={6} xs={12}>
                <div style={{display: this.props.type === "update" ? "block" : "none"}}>
                    <components.Spacer direction="v" size={30} />
                    <bootstrap.Input
                        checkedLink={this.linkState("active")}
                        label={
                            <h4 style={{color: colors.primary, marginTop: "0px"}}>
                                {stringIt.titleAlarmActive}
                            </h4>
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
                <components.TutorialAnchor
                    message={tutorialString.alarmForm.repetition}
                    order={4}
                    position="left"
                    ref="repetition"
                >
                    <components.AlarmRepetitionModal
                        updateParentState={this.updateState}
                        value={this.state.repetition}
                    />
                </components.TutorialAnchor>
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
                {<img src={icons.iconReset} style={{width: "75%"}}/>}
            </components.Button>
        );
    },
    renderSubmitButton: function () {
        return (
            <components.Button
                disabled={this.props.alarmsReduxState.statePostAlarm}
                onClick={this.submit}
                style={{
                    backgroundColor: colors.primary,
                    color: colors.white,
                    width: "230px",
                    height: "45px"
                }}
            >
                {this.props.type === "update" ? "SALVA" : "CREA"}
            </components.Button>
        );
    },
    renderTitleSelectSite: function () {
        return this.state.sito.size === 0 ?
            <span>
                {"Seleziona punto di misurazione"}
                <img src={icons.iconDown} style={{float: "right", paddingTop: "5px", width: "16px"}}/>
            </span> :
            <span>
                {CollectionUtils.sites.getLabel(this.state.sito)}
                <components.Spacer direction="h" size={30} />
                {this.state.sito.get("pod")}
                <img src={icons.iconDown} style={{float: "right", paddingTop: "5px", width: "16px"}}/>
            </span>;
    },
    renderAutomaticAlarmBanner: function () {
        return this.isAutomatic() ? (
            <bootstrap.Col xs={12}>
                <bootstrap.Alert
                    style={{
                        backgroundColor: colors.greyBackground,
                        borderColor: colors.greyBorder,
                        color: colors.titleColor
                    }}
                >
                    <h4>
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
        return (
            <div className="alarm-form" style={{height: "100%"}}>
                <div style={R.merge(styles.colVerticalPadding, {height: "100%", overflow: "auto"})}>
                    <Radium.Style
                        rules={{
                            ".input-group-addon": {
                                backgroundColor: colors.white,
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
                        {this.renderAlarmName()}
                        {this.renderAlarmNotification()}
                        {this.renderAlarmActive()}
                        {this.renderAlarmRepetition()}
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
