var Immutable  = require("immutable");
var Radium     = require("radium");
var React      = require("react");
var bootstrap  = require("react-bootstrap");
var IPropTypes = require("react-immutable-proptypes");
var Router     = require("react-router");
var color      = require("color");

var CollectionUtils = require("lib/collection-utils");
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
            "active",
            // {
            //     key: "active",
            //     valueFormatter: function (value) {
            //         return (
            //             <components.Icon
            //                 icon={value ? "check" : "exclamation"}
            //                 style={{/*color: colors.white*/}/>
            //         );
            //     }
            // },
            "name",
            {
                key: "podId",
                valueFormatter: function (value) {
                    var sito = self.getSiti().find(s => {
                        return s.get("pod") === value;
                    });
                    return (
                        <span>
                            {CollectionUtils.siti.getLabel(sito)}
                        </span>
                    );
                }
            },
            {
                key: "_id",
                valueFormatter: function (value) {
                    return (
                        <Router.Link onClick={self.onClickAction} to={`/alarms/${value}`}>
                            <components.Icon icon="arrow-right"
                                style={{float: "right", paddingRight: "10px", paddingTop: "2px"}}/>
                        </Router.Link>
                    );
                }
            }
        ];
    },
    onClickAction: function () {
        this.activeKey(1);
    },
    onClickFilter: function () {
        console.log("Filtro");
    },
    activeKey: function (key) {
        this.setState({
            key: key
        });
    },
    render: function () {
        return (
            <div className="alarm-tab" style={{paddingBottom: "15px"}}>
                <h2
                    className="text-center"
                    style={styles.titlePage}
                >
                    <components.Spacer direction="v" size={5} />
                    Allarmi
                </h2>
                <Radium.Style
                    rules={{
                        ".nav-tabs.nav > .active > a": {
                            color: colors.titleColor,
                            backgroundColor: colors.white,
                            width: "200px",
                            textAlign: "center"
                        },
                        ".nav-tabs.nav > li > a": {
                            backgroundColor: colors.primary,
                            color: colors.white,
                            width: "200px",
                            textAlign: "center"
                        },
                        ".tabbed-area > div": {
                            height: "100%"
                        },
                        ".tab-content": {
                            height: "90%",
                            borderBottom: "solid 1px " + color(colors.darkBlack).alpha(0.1).rgbString(),
                            borderRight: "solid 1px " + color(colors.darkBlack).alpha(0.1).rgbString(),
                            borderLeft: "solid 1px " + color(colors.darkBlack).alpha(0.1).rgbString(),
                            borderTop: "0px",
                            boxShadow: "2px 2px 5px " + colors.greySubTitle
                        }
                    }}
                    scopeSelector=".alarm-tab"
                />
            <div className="tabbed-area" style={styles.tabbedArea}>
                <bootstrap.TabbedArea
                    activeKey={this.state.key}
                    animation={false}
                    bsStyle={"tabs"}
                    onSelect={this.activeKey}
                >
                    <bootstrap.TabPane eventKey={1} tab="Impostazione">
                        <components.AlarmForm
                            alarm={this.getAlarm()}
                            siti={this.getSiti()}
                            type={this.getType()}
                        />
                    </bootstrap.TabPane>
                        <bootstrap.TabPane eventKey={2} tab="Allarmi">
                            <div style={{marginRight: "30px", height: "40px", paddingTop: "20px"}}>
                                <div onClick={this.onClickFilter} style={{float: "right", display: "flex", cursor: "pointer"}}>
                                    <components.Icon icon="filter" style={{paddingTop: "13px"}}/>
                                    <components.Spacer direction="h" size={10} />
                                    <h4 style={{color: colors.primary}}>Filter</h4>
                                </div>
                            </div>
                            <components.CollectionElementsTable
                                collection={this.props.collections.get("alarms") || Immutable.Map()}
                                columns={this.getColumns()}
                                getKey={getKeyFromAlarm}
                                hover={true}
                                siti={this.getSiti()}
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
