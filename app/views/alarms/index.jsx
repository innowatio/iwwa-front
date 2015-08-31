var Immutable  = require("immutable");
var Radium     = require("radium");
var React      = require("react");
var bootstrap  = require("react-bootstrap");
var IPropTypes = require("react-immutable-proptypes");
var Router     = require("react-router");

var components = require("components");
var styles     = require("lib/styles");
var colors     = require("lib/colors");

var getKeyFromAlarm = function (alarm) {
    return alarm.get("_id");
};

var Alarms = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object,
        collections: IPropTypes.map,
        location: React.PropTypes.object,
        params: React.PropTypes.object
    },
    getInitialState: function () {
        return {
            key: 1
        };
    },
    componentDidMount: function () {
        this.props.asteroid.subscribe("alarms");
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
        return (this.props.params.id ? "update" : "insert");
    },
    getColumns: function () {
        var self = this;
        return [
            "podId",
            "active",
            "name",
            {
                heading: "",
                key: "_id",
                "valueFormatter": function (value) {
                    return (
                        <Router.Link onClick={self.onClickAction} to={`/alarms/${value}`}>
                            <components.Icon icon="external-link" />
                        </Router.Link>
                    );
                }
            }
        ];
    },
    onClickAction: function () {
        this.activeKey(1);
    },
    activeKey: function (key) {
        this.setState({
            key: key
        });
    },
    render: function () {
        return (
            <div className="alarm-tab" style={styles.colVerticalPadding}>
                <h2
                    className="text-center"
                    style={styles.titlePage}
                >
                    <components.Spacer direction="v" size={5} />
                    Allarmi
                </h2>
                <Radium.Style
                    rules={{
                        ".nav-tabs.nav-justified > .active > a": {
                            color: colors.titleColor,
                            backgroundColor: colors.white
                        },
                        ".nav-tabs.nav-justified > li > a": {
                            backgroundColor: colors.primary,
                            color: colors.white
                        },
                        ".tab-content": {
                            width: "96%",
                            marginLeft: "2%",
                            marginTop: "2%"
                        },
                        ".nav-tabs.nav-justified": {
                            width: "100.15%"
                        }
                    }}
                    scopeSelector=".alarm-tab"
                />
            <div style={styles.tabbedArea}>
                <bootstrap.TabbedArea
                    activeKey={this.state.key}
                    animation={false}
                    bsStyle={"tabs"}
                    justified
                    onSelect={this.activeKey}
                >
                        <bootstrap.TabPane eventKey={1} tab="Impostazione">
                            <bootstrap.Col>
                                <components.AlarmForm
                                    alarm={this.getAlarm()}
                                    siti={this.getSiti()}
                                    type={this.getType()}
                                />
                            </bootstrap.Col>
                        </bootstrap.TabPane>
                        <bootstrap.TabPane eventKey={2} tab="Allarmi">
                            <components.CollectionElementsTable
                                collection={this.props.collections.get("alarms") || Immutable.Map()}
                                columns={this.getColumns()}
                                getKey={getKeyFromAlarm}
                                hover={true}
                                striped={true}
                            />
                        </bootstrap.TabPane>
                        <bootstrap.TabPane eventKey={3} tab="Storico allarmi">
                            Storico allarmi
                        </bootstrap.TabPane>
                    </bootstrap.TabbedArea>
                </div>
            </div>
        );
    }
});

module.exports = Radium(Alarms);
