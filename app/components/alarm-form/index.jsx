var axios      = require("axios");
var Immutable  = require("immutable");
var moment     = require("moment");
var Radium     = require("radium");
var R          = require("ramda");
var React      = require("react");
var bootstrap  = require("react-bootstrap");
var IPropTypes = require("react-immutable-proptypes");
var Router     = require("react-router");

var components      = require("components");
var CollectionUtils = require("lib/collection-utils");
var colors          = require("lib/colors");
var stringIt        = require("lib/string-it");
var styles          = require("lib/styles");
var tutorialString  = require("assets/JSON/tutorial-string.json");
var GetTutorialMixin   = require("lib/get-tutorial-mixin");
var icons           = require("lib/icons");

var less = function (time1, time2) {
    return (
        moment(time1, "hh:mm").toDate() <
        moment(time2, "hh:mm").toDate()
    );
};

var AlarmForm = React.createClass({
    propTypes: {
        alarm: IPropTypes.map.isRequired,
        onCancel: React.PropTypes.func,
        onSubmit: React.PropTypes.func,
        siti: IPropTypes.map.isRequired,
        type: React.PropTypes.oneOf(["insert", "update"]).isRequired
    },
    mixins: [React.addons.LinkedStateMixin, GetTutorialMixin(
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
            type: props.alarm.get("type"),
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
    cancel: function () {
        console.log("Cancel");
    },
    reset: function () {
        this.setState(this.getStateFromProps(this.props));
    },
    submit: function () {
        this.setState({
            saving: true
        });

        var rule = {
            $and: []
        };

        rule.$and.push({
            reale: {
                $gt: parseInt(this.state.threshold)
            }
        });

        if (!R.isEmpty(this.state.repetition.weekDays)) {
            rule.$and.push({
                "date.weekDay": {
                    $in: this.state.repetition.weekDays
                }
            });
        }
        if (this.state.repetition.day) {
            var day = moment(this.state.repetition.day);
            rule.$and.push({
                "date.monthDay": day.date(),
                "date.month": day.month(),
                "date.year": day.year()
            });
        }

        var timeStart = moment(this.state.repetition.timeStart, "hh:mm");
        var timeEnd = moment(this.state.repetition.timeEnd, "hh:mm");
        if (!less(this.state.repetition.timeEnd, this.state.repetition.timeStart)) {
            rule.$and.push({
                "date.hour": {
                    $lt: timeEnd.hour()
                }
            });
            rule.$and.push({
                "date.hour": {
                    $gt: timeStart.hour()
                }
            });
        }

        var alarm = {
            active: this.state.active,
            name: this.state.name,
            podId: this.state.sito.get("pod"),
            rule: JSON.stringify(rule)
        };

        var requestBody;
        if (this.props.type === "update") {
            requestBody = {
                method: "/alarms/replace",
                params: [this.props.alarm.get("_id"), alarm]
            };
        } else {
            requestBody = {
                method: "/alarms/insert",
                params: [alarm]
            };
        }
        var endpoint = WRITE_BACKEND_HOST + "/alarms";
        axios.post(endpoint, requestBody)
            .then(() => this.setState({saving: false}))
            .catch(() => this.setState({saving: false}));
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
        return (
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
                        style="inherit"
                        title={this.renderTitleSelectSite()}
                    >
                        <components.SelectTree
                            allowedValues={this.props.siti}
                            buttonCloseDefault={true}
                            filter={CollectionUtils.siti.filter}
                            getKey={CollectionUtils.siti.getKey}
                            getLabel={CollectionUtils.siti.getLabel}
                            valueLink={this.linkState("sito")}
                        />
                    </components.Popover>
            </div>
        );
    },
    renderAlarmThreshold: function () {
        return (
            <div>
                <h4 style={{color: colors.primary}}>{stringIt.titleAlarmThreshold}</h4>
                <div style={{backgroundColor: colors.greyBackground, textAlign: "center"}}>
                    <components.Spacer direction="v" size={3} />
                    <h4
                        style={{
                            color: colors.primary,
                            marginTop: "8px"
                        }}> {`Soglia (${this.state.threshold} kWh)`}
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
        );
    },
    renderAlarmName: function () {
        return (
            <div>
                <h4 style={{color: colors.primary}}>{stringIt.titleAlarmName}</h4>
                <bootstrap.Input
                    style={styles.inputLine}
                    type="text"
                    valueLink={this.linkState("name")}
                />
            </div>
        );
    },
    renderAlarmNotification: function () {
        return (
            <components.AlarmNotificationModal
                updateParentState={this.updateState}
                value={this.state.notification}
            />
        );
    },
    renderAlarmActive: function () {
        return (
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
        );
    },
    renderAlarmRepetition: function () {
        return (
            <components.AlarmRepetitionModal
                updateParentState={this.updateState}
                value={this.state.repetition}
            />
        );
    },
    renderResetButton: function () {
        return (
            <Router.Link to={`/alarms/`}>
                <components.Button bsStyle="link" disabled={this.state.saving} onClick={this.reset}>
                    {<img src={icons.iconReset} style={{width: "75%"}}/>}
                </components.Button>
            </Router.Link>
        );
    },
    renderSubmitButton: function () {
        return (
            <components.Button
                disabled={this.state.saving}
                onClick={this.submit}
                style={{
                    backgroundColor: colors.primary,
                    color: colors.white,
                    width: "230px",
                    height: "45px"
                }}>
                {this.props.type === "update" ? "SALVA" : "CREA"}
            </components.Button>
        );
    },
    renderTitleSelectSite: function () {
        return this.state.sito.size === 0 ?
            <span>
                Seleziona punto di misurazione
                <img src={icons.iconDown} style={{float: "right", paddingTop: "5px", width: "16px"}}/>
            </span> :
            <span>
                {CollectionUtils.siti.getLabel(this.state.sito)}
                <components.Spacer direction="h" size={30} />
                {this.state.sito.get("pod")}
                <img src={icons.iconDown} style={{float: "right", paddingTop: "5px", width: "16px"}}/>
            </span>;
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
                    <bootstrap.Col lg={6} md={6} xs={12}>
                        <components.TutorialAnchor
                            message={tutorialString.alarmForm.siti}
                            order={1}
                            position="right"
                            ref="siti"
                        >
                            {this.renderAlarmSelectSite()}
                        </components.TutorialAnchor>
                    </bootstrap.Col>
                    <bootstrap.Col lg={6} md={6} xs={12}>
                        <components.TutorialAnchor
                            message={tutorialString.alarmForm.threshold}
                            order={2}
                            position="left"
                            ref="threshold"
                        >
                            {this.renderAlarmThreshold()}
                        </components.TutorialAnchor>
                    </bootstrap.Col>
                    <bootstrap.Col lg={6} md={6} xs={12}>
                        <components.TutorialAnchor
                            message={tutorialString.alarmForm.name}
                            order={3}
                            position="right"
                            ref="name"
                        >
                            {this.renderAlarmName()}
                        </components.TutorialAnchor>
                        <components.TutorialAnchor
                            message={tutorialString.alarmForm.notification}
                            order={5}
                            position="right"
                            ref="notification"
                        >
                            {this.renderAlarmNotification()}
                        </components.TutorialAnchor>
                    </bootstrap.Col>
                    <bootstrap.Col lg={6} md={6} xs={12}>
                            {this.renderAlarmActive()}
                    </bootstrap.Col>
                    <bootstrap.Col lg={6} md={6} xs={12}>
                        <components.TutorialAnchor
                            message={tutorialString.alarmForm.repetition}
                            order={4}
                            position="left"
                            ref="repetition"
                        >
                            {this.renderAlarmRepetition()}
                        </components.TutorialAnchor>
                    </bootstrap.Col>
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
