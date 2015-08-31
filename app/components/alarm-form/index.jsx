var axios      = require("axios");
var Immutable  = require("immutable");
var Radium     = require("radium");
var React      = require("react");
var bootstrap  = require("react-bootstrap");
var IPropTypes = require("react-immutable-proptypes");

var components      = require("components");
var CollectionUtils = require("lib/collection-utils");
var colors          = require("lib/colors");
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
            active: props.alarm.get("active"),
            name: props.alarm.get("name"),
            type: props.alarm.get("type"),
            sito: this.getSitoFromProps(props)
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
        var alarm = {
            active: this.state.active,
            name: this.state.name,
            podId: this.state.sito.get("pod"),
            rule: JSON.stringify({
                reale: {
                    $gt: 0
                },
                data: {
                    weekDay: {
                        $gt: 5
                    }
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
    renderCancelButton: function () {
        return this.props.type === "insert" ? (
            <components.Button disabled={this.state.saving} onClick={this.cancel}>
                {"Cancel"}
            </components.Button>
        ) : null;
    },
    renderResetButton: function () {
        return this.props.type === "update" ? (
            <components.Button disabled={this.state.saving} onClick={this.reset}>
                {"Reset"}
            </components.Button>
        ) : null;
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
                {this.props.type === "update" ? "Salva" : "Create"}
            </components.Button>
        );
    },
    renderAlertInfo: function () {
        var sito = CollectionUtils.siti.getLabel(this.state.sito);
        return this.state.saving ? (
            <bootstrap.Alert bsStyle="success" style={{width: "80%"}}>
                {stringIt.alertSuccessAlarm}
                <strong>{sito}</strong>
            </bootstrap.Alert>
        ) : null;
    },
    render: function () {
        return (
            <div>
                <div style={styles.colVerticalPadding}>
                    <span>
                        <h3 style={{color: colors.primary}}>{stringIt.titleTabImpostazioniAlarm}</h3>
                        <h5>Seleziona un punto da monitorare e le soglie di allarme</h5>
                    </span>
                    <div style={{float: "left", width: "50%"}}>
                        <bootstrap.Input
                            label="Nome"
                            style={{width: "80%"}}
                            type="text"
                            valueLink={this.linkState("name")}
                        />
                        <components.Select
                            allowedValues={this.props.siti}
                            filter={CollectionUtils.siti.filter}
                            getLabel={CollectionUtils.siti.getLabel}
                            label="Sito"
                            open=""
                            style={{width: "80%", zIndex: "0"}}
                            valueLink={this.linkState("sito")}
                        />
                    </div>
                    <div style={{float: "right", width: "40%"}}>
                        {this.renderAlertInfo()}
                        <h4 style={{color: colors.primary}}>{stringIt.typeOfAlarm}</h4>
                        <span className="alarm-type">
                            <bootstrap.Input
                                type="radio"
                                valueLink={this.linkState("type")}
                            >
                                <Radium.Style
                                    rules={{
                                        ".radio": {
                                            paddingLeft: "20px"
                                        }
                                    }}
                                    scopeSelector=".alarm-type"
                                />
                                <option value="on-off">{stringIt.selectAlarmType}</option>
                            </bootstrap.Input>
                        </span>
                        <bootstrap.Input
                            checkedLink={this.linkState("active")}
                            label="Attivo"
                            type="checkbox"
                        />
                    </div>
                </div>
                    <bootstrap.ButtonToolbar style={{position: "absolute", bottom: "8%", paddingLeft: "41%"}}>
                        {this.renderSubmitButton()}
                        {this.renderCancelButton()}
                        {this.renderResetButton()}
                    </bootstrap.ButtonToolbar>
            </div>
        );
    }
});

module.exports = Radium(AlarmForm);
