var Immutable  = require("immutable");
var Radium     = require("radium");
var React      = require("react");
var bootstrap  = require("react-bootstrap");
var IPropTypes = require("react-immutable-proptypes");

var components = require("components");
var styles     = require("lib/styles");

var Alarm = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object,
        collections: IPropTypes.map,
        location: React.PropTypes.object,
        params: React.PropTypes.object
    },
    componentDidMount: function () {
        this.props.asteroid.subscribe("alarms");
        this.props.asteroid.subscribe("siti");
    },
    getAlarm: function () {
        return (
            this.props.collections.getIn(["alarms", this.props.params.id]) ||
            Immutable.Map()
        );
    },
    getSiti: function () {
        return this.props.collections.get("siti") || Immutable.Map();
    },
    getType: function () {
        return (this.props.params.id === "new" ? "insert" : "update");
    },
    render: function () {
        return (
            <div style={styles.colVerticalPadding}>
                <bootstrap.Col sm={6}>
                    <components.AlarmForm
                        alarm={this.getAlarm()}
                        siti={this.getSiti()}
                        type={this.getType()}
                    />
                </bootstrap.Col>
            </div>
        );
    }
});

module.exports = Radium(Alarm);
