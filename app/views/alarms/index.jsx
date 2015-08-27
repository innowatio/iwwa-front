var Immutable  = require("immutable");
var moment     = require("moment");
var Radium     = require("radium");
var React      = require("react");
var bootstrap  = require("react-bootstrap");
var IPropTypes = require("react-immutable-proptypes");
var Router     = require("react-router");

var components = require("components");
var styles     = require("lib/styles");

var getKeyFromAlarm = function (alarm) {
    return alarm.get("_id");
};

var Alarms = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object,
        collections: IPropTypes.map
    },
    componentDidMount: function () {
        this.props.asteroid.subscribe("alarms");
    },
    getColumns: function () {
        return [
            "podId",
            "active",
            "name",
            {
                heading: "",
                key: "_id",
                "valueFormatter": function (value) {
                    return (
                        <Router.Link to={`/alarms/${value}`}>
                            <components.Icon icon="external-link" />
                        </Router.Link>
                    );
                }
            }
        ];
    },
    render: function () {
        return (
            <div style={styles.colVerticalPadding}>
                <bootstrap.Col sm={12}>
                    <Router.Link to="/alarms/new">
                        <bootstrap.Button>
                            {"Crea allarme"}
                        </bootstrap.Button>
                    </Router.Link>
                    <components.CollectionElementsTable
                        collection={this.props.collections.get("alarms") || Immutable.Map()}
                        columns={this.getColumns()}
                        getKey={getKeyFromAlarm}
                        hover={true}
                        striped={true}
                    />
                </bootstrap.Col>
            </div>
        );
    }
});

module.exports = Radium(Alarms);
