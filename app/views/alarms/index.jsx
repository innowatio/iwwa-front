var Immutable  = require("immutable");
var Radium     = require("radium");
var React      = require("react");
var bootstrap  = require("react-bootstrap");
var IPropTypes = require("react-immutable-proptypes");
var Router     = require("react-router");
var color      = require("color");
var moment     = require("moment");
var R          = require("ramda");

var CollectionUtils = require("lib/collection-utils");
var components      = require("components");
var styles          = require("lib/styles");
var colors          = require("lib/colors");
var icons           = require("lib/icons");

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
            key: 1,
            active: [
                "TUTTI"
            ]
        };
    },
    componentDidMount: function () {
        this.props.asteroid.subscribe("alarms");
        this.props.asteroid.subscribe("notifications");
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
    getColumnsAlarms: function () {
        var self = this;
        return [
            {
                key: "active",
                style: function (value) {
                    return {
                        backgroundColor: value ? colors.green : colors.red,
                        width: "37px",
                        height: "100%",
                        textAlign: "center"
                    };
                },
                valueFormatter: function (value) {
                    return (
                        <img
                            src={value ? icons.iconFlag : icons.iconActiveAlarm}
                            />
                    );
                }
            },
            "name",
            {
                key: "podId",
                style: function () {
                    return {
                        width: "40%"
                    };
                },
                valueFormatter: function (value) {
                    var sito = self.getSiti().find(siti => {
                        return siti.get("pod") === value;
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
                            <img src={icons.iconArrowRight}
                                style={{float: "right", height: "28px"}}/>
                        </Router.Link>
                    );
                }
            }
        ];
    },
    getColumnsNotifications: function () {
        var self = this;
        return [
            {
                key: "date",
                style: function () {
                    return {
                        width: "40%"
                    };
                },
                valueFormatter: function (value) {
                    var date = moment(value, "x");
                    return (
                        <span style={{marginLeft: "20px"}}>
                            {date.locale("it").format("LLL")}
                        </span>
                    );
                }
            },
            "name",
            {
                key: "podId",
                style: function () {
                    return {
                        width: "30%"
                    };
                },
                valueFormatter: function (value) {
                    var sito = self.getSiti().find(siti => {
                        return siti.get("pod") === value;
                    });
                    return (
                        <span style={{marginLeft: "20px"}}>
                            {CollectionUtils.siti.getLabel(sito)}
                        </span>
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
    alarmFilterTitle: function () {
        return [
            {title: "Quali allarmi vuoi visualizzare?", label: ["TUTTI", "ATTIVI", "INATTIVI"]}
        ];
    },
    onClickFilter: function (label, value) {
        if (R.equals(value, this.alarmFilterTitle()[0])) {
            this.setState({
                active: [
                    label
                ]
            });
        }
    },
    filterAlarms: function (value) {
        if (this.state.active[0] === "ATTIVI") {
            return value.get("active") === true;
        }
        if (this.state.active[0] === "INATTIVI") {
            return value.get("active") === false;
        }
        return value;
    },
    renderFilterTableCell: function (allowedValue, label) {
        var active = this.state.active[0] === label || this.state.active[1] === label;
        return (
            <bootstrap.ListGroupItem
                key={[allowedValue, label]}
                onClick={R.partial(this.onClickFilter, label, allowedValue)}
                style={{
                    paddingLeft: "10px",
                    borderRadius: "0px",
                    borderLeft: "0px",
                    borderRight: "0px",
                    color: active ? colors.white : colors.greySubTitle,
                    backgroundColor: active ? colors.primary : colors.white,
                    textAlign: "center",
                    paddingTop: "0px",
                    paddingBottom: "0px"
                }}>
                    <h5>{label}</h5>
            </bootstrap.ListGroupItem>
        );
    },
    renderFilterCell: function (value) {
        return (
            <div key={value.title}>
                <h5 style={{color: colors.primary, width: "250px", paddingLeft: "10px"}}>
                        {value.title}
                </h5>
                <bootstrap.ListGroup>
                    {
                        R.is(Array, value.label) ?
                        value.label.map(R.partial(this.renderFilterTableCell, value)) :
                        this.renderFilterTableCell(value, value.label)
                    }
                </bootstrap.ListGroup>
            </div>
        );
    },
    renderFilter: function () {
        var alarmFilter = this.alarmFilterTitle();
        return (
            <div className="alarm-filter" style={{overflow: "auto"}}>
                <Radium.Style
                    rules={{
                        ".list-group": {
                            marginBottom: "0px"
                        }
                    }}
                    scopeSelector=".alarm-filter"
                />
                {alarmFilter.map(this.renderFilterCell)}
            </div>
        );
    },
    renderFilterButton: function () {
        return (
            <div className="element-table" style={{marginRight: "84px", height: "40px", float: "right"}}>
                <Radium.Style
                    rules={{
                        ".btn": {
                            height: "40px",
                            textDecoration: "none"
                        }
                    }}
                    scopeSelector=".element-table"
                />
                <components.Popover
                    title={
                        <span style={{display: "flex", height: "40px"}}>
                            <img src={icons.iconFilter} style={{width: "26px"}}/>
                            <h4 style={{color: colors.primary}}>Filter</h4>
                        </span>}
                        >
                    {this.renderFilter()}
                </components.Popover>
            </div>
        );
    },
    render: function () {
        var allowedValues = this.props.collections.get("alarms");
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
                            {this.renderFilterButton()}
                            <components.CollectionElementsTable
                                collection={ R.isNil(allowedValues) ? Immutable.Map() : allowedValues.filter(this.filterAlarms)}
                                columns={this.getColumnsAlarms()}
                                getKey={getKeyFromAlarm}
                                hover={true}
                                width={"40%"}
                            />
                        </bootstrap.TabPane>
                        <bootstrap.TabPane eventKey={3} tab="Storico allarmi">
                            {/* <div style={{marginRight: "30px", height: "40px", paddingTop: "20px"}}>
                                <div onClick={this.onClickFilter} style={{float: "right", display: "flex", cursor: "pointer"}}>
                                    <components.Icon icon="filter" style={{paddingTop: "13px"}}/>
                                    <components.Spacer direction="h" size={10} />
                                    <h4 style={{color: colors.primary}}>Filter</h4>
                                </div>
                            </div> */}
                            <components.Spacer direction="v" size={30}/>
                            <components.CollectionElementsTable
                                collection={this.props.collections.get("notifications") || Immutable.Map()}
                                columns={this.getColumnsNotifications()}
                                getKey={getKeyFromAlarm}
                                hover={true}
                                width={"30%"}
                            />
                        </bootstrap.TabPane>
                    </bootstrap.TabbedArea>
                </div>
            </div>
        );
    }
});

module.exports = Radium(Alarms);
