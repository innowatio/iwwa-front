var axios      = require("axios");
var Immutable  = require("immutable");
var Radium     = require("radium");
var React      = require("react");
var bootstrap  = require("react-bootstrap");
var IPropTypes = require("react-immutable-proptypes");

var components      = require("components");
var CollectionUtils = require("lib/collection-utils");

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
            <bootstrap.Button disabled={this.state.saving} onClick={this.cancel}>
                {"Cancel"}
            </bootstrap.Button>
        ) : null;
    },
    renderResetButton: function () {
        return this.props.type === "update" ? (
            <bootstrap.Button disabled={this.state.saving} onClick={this.reset}>
                {"Reset"}
            </bootstrap.Button>
        ) : null;
    },
    renderSubmitButton: function () {
        return (
            <bootstrap.Button disabled={this.state.saving} onClick={this.submit}>
                {this.props.type === "update" ? "Save" : "Create"}
            </bootstrap.Button>
        );
    },
    render: function () {
        return (
            <div>
                <bootstrap.Input
                    label="Nome"
                    type="text"
                    valueLink={this.linkState("name")}
                />
                <bootstrap.Input
                    label="Tipo"
                    type="select"
                    valueLink={this.linkState("type")}
                >
                    <option value="on-off">{"On / Off"}</option>
                </bootstrap.Input>
                <components.Select
                    allowedValues={this.props.siti}
                    filter={CollectionUtils.siti.filter}
                    getLabel={CollectionUtils.siti.getLabel}
                    label="Sito"
                    valueLink={this.linkState("sito")}
                />
                <bootstrap.Input
                    checkedLink={this.linkState("active")}
                    label="Attivo"
                    type="checkbox"
                />
                <bootstrap.ButtonToolbar>
                    {this.renderCancelButton()}
                    {this.renderResetButton()}
                    {this.renderSubmitButton()}
                </bootstrap.ButtonToolbar>
            </div>
        );
    }
});

module.exports = Radium(AlarmForm);
