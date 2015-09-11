var axios      = require("axios");
var Immutable  = require("immutable");
var Radium     = require("radium");
var R          = require("ramda");
var React      = require("react");
var bootstrap  = require("react-bootstrap");
var IPropTypes = require("react-immutable-proptypes");
var Router     = require("react-router");

var components      = require("components");
var CollectionUtils = require("lib/collection-utils");
var colors          = require("lib/colors");
var Icon            = require("lib/icons");
var stringIt        = require("lib/string-it");
var styles          = require("lib/styles");

var AlarmForm = React.createClass({
    propTypes: {
        alarm: IPropTypes.map.isRequired,
        onCancel: React.PropTypes.func,
        onSubmit: React.PropTypes.func,
        siti: IPropTypes.map.isRequired,
        type: React.PropTypes.oneOf(["insert", "update"]).isRequired
    },
    mixins: [React.addons.LinkedStateMixin],
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
            type: props.alarm.get("type"),
            sito: this.getSitoFromProps(props),
            threshold: R.path(
                ["reale", "$gt"],
                JSON.parse(props.alarm.get("rule") || "{}")
            ) || 300
        };
    },
    cancel: function () {
        console.log("Cancel");
    },
    reset: function () {
        this.setState(this.getStateFromProps(this.props));
    },
    onClickNotify: function () {
        console.log("Notifiche");
    },
    onClickRepeatNotification: function () {
        console.log("Ripeti notifiche");
    },
    submit: function () {
        this.setState({
            saving: true
        });
        var alarm = {
            active: this.state.active,
            name: this.state.name,
            podId: this.state.sito.get("pod"),
            rule: JSON.stringify({
                reale: {
                    $gt: parseInt(this.state.threshold)
                }
            })
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
    renderResetButton: function () {
        return (
            <Router.Link to={`/alarms/`}>
                <components.Button bsStyle="link" disabled={this.state.saving} onClick={this.reset}>
                    {<components.Icon icon="repeat" />}
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
        return (
            <span>
                Seleziona punto di misurazione
                <components.Icon icon="chevron-down" style={{float: "right"}}/>
            </span>
        );
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
                            <components.Icon icon="info" />
                        </components.Button>
                    </bootstrap.OverlayTrigger>
                </h5>
                <components.Popover
                    arrow="none"
                    style="inherit"
                    title={this.renderTitleSelectSite()}
                >
                    <components.SelectTree
                        allowedValues={this.props.siti}
                        buttonCloseDefault={true}
                        filter={CollectionUtils.siti.filter}
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
                        }}> {`Soglia (${this.state.threshold} kwh)`}
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
                    valueLink={this.linkState("name")}/>
                <h4 style={{color: colors.primary}}>{stringIt.titleAlarmNotify}</h4>
                <div onClick={this.onClickNotify} style={styles.divAlarmOpenModal}>
                    <components.Icon icon="arrow-right" style={{float: "right", paddingTop: "10px"}} />
                </div>
            </div>
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
            <div style={{marginBottom: "0px"}}>
                <h4 style={{color: colors.primary}}>{stringIt.titleAlarmRepeat}</h4>
                <div onClick={this.onClickRepeatNotification} style={styles.divAlarmOpenModal}>
                    <components.Icon icon="arrow-right" style={{float: "right", paddingTop: "10px"}} />
                </div>
            </div>
        );
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
                        {this.renderAlarmSelectSite()}
                    </bootstrap.Col>
                    <bootstrap.Col lg={6} md={6} xs={12}>
                        {this.renderAlarmThreshold()}
                    </bootstrap.Col>
                    <bootstrap.Col lg={6} md={6} xs={12}>
                        {this.renderAlarmName()}
                    </bootstrap.Col>
                    <bootstrap.Col lg={6} md={6} xs={12}>
                        {this.renderAlarmActive()}
                    </bootstrap.Col>
                    <bootstrap.Col lg={6} md={6} xs={12}>
                        {this.renderAlarmRepetition()}
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
