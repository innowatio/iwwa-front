var Immutable  = require("immutable");
var Radium     = require("radium");
var React      = require("react");
var bootstrap  = require("react-bootstrap");
var IPropTypes = require("react-immutable-proptypes");
var Router     = require("react-router");
var moment     = require("moment");
var R          = require("ramda");
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

var CollectionUtils = require("lib/collection-utils");
var components      = require("components");
import {
    displayAlarmsOnChart,
    modifyExistentAlarm,
    resetAlarmFormView,
    submitAlarmCreationOrChange,
    numberOfSelectedTabs
} from "actions/alarms";
import {defaultTheme} from "lib/theme";

var getKeyFromCollection = function (collection) {
    return collection.get("_id");
};

var Alarms = React.createClass({
    propTypes: {
        alarms: React.PropTypes.object.isRequired,
        asteroid: React.PropTypes.object,
        collections: IPropTypes.map.isRequired,
        displayAlarmsOnChart: React.PropTypes.func.isRequired,
        location: React.PropTypes.object,
        modifyExistentAlarm: React.PropTypes.func.isRequired,
        numberOfSelectedTabs: React.PropTypes.func.isRequired,
        params: React.PropTypes.object,
        resetAlarmFormView: React.PropTypes.func.isRequired,
        submitAlarmCreationOrChange: React.PropTypes.func.isRequired
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
    getInitialState: function () {
        return {
            active: [
                "TUTTI"
            ]
        };
    },
    componentDidMount: function () {
        this.props.asteroid.subscribe("alarms");
        this.props.asteroid.subscribe("sites");
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getAlarm: function () {
        return (
            this.props.collections.getIn(["alarms", this.props.alarms.id]) ||
            Immutable.Map()
        );
    },
    getAlarms: function () {
        return this.props.collections.get("alarms") || Immutable.Map();
    },
    getSiti: function () {
        return this.props.collections.get("sites") || Immutable.Map();
    },
    getType: function () {
        return this.props.alarms.id ? "update" : "insert";
    },
    getSitoBySensor: function (sensorId) {
        return this.getSiti()
            .find((site = Immutable.Map()) =>
                R.contains(sensorId, site.get("sensorsIds").toArray())
            );
    },
    getNotificationsList: function (notifications) {
        var notificationDates = [];
        notifications.forEach(notification => {
            if (notification.get("date")) {
                notificationDates.push(notification.get("date"));
            }
        });
        return notificationDates;
    },
    getNotificationsFromAlarm: function (alarm) {
        const merger = alarm.delete("notifications").delete("_id");
        return alarm.get("notifications").reduce((acc, notification) => (
            acc.set(notification.get("_id"), merger.merge(notification))
        ), Immutable.Map());
    },
    getNotifications: function () {
        var ret = this.getAlarms().reduce((acc, alarm) => (
            acc.merge(this.getNotificationsFromAlarm(alarm))
        ), Immutable.Map());
        return ret;
    },
    getColumnsAlarms: function () {
        const {colors} = this.getTheme();
        var self = this;
        return [
            {
                key: "active",
                style: function (value) {
                    return {
                        backgroundColor: value ? colors.activeAlarm : colors.backgroundTableColoumn,
                        width: "37px",
                        height: "100%",
                        textAlign: "center"
                    };
                },
                valueFormatter: function (value) {
                    return (
                        <components.Icon
                            color={colors.iconAlarmAction}
                            icon={value ? "flag" : "pause"}
                            size={"20px"}
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
                            {CollectionUtils.sites.getLabel(sito)}
                        </span>
                    );
                }
            },
            {
                key: "_id",
                valueFormatter: function (value) {
                    return (
                        <components.Icon
                            color={colors.iconAlarmAction}
                            icon={"settings"}
                            onClick={R.partial(self.onClickAction, [value])}
                            size={"30px"}
                            style={{
                                float: "right",
                                cursor: "pointer",
                                verticalAlign: "middle"
                            }}
                        />
                    );
                }
            },
            {
                key: "notifications",
                style: function () {
                    return {width: "50px"};
                },
                valueFormatter: function (value, item) {
                    // value is a list of maps
                    var notificationDates = self.getNotificationsList(value);
                    if (notificationDates.length > 0) {
                        const alarms = R.dropRepeats(notificationDates);
                        const sensorId = item.get("podId");
                        const site = self.getSitoBySensor(sensorId) ?
                            self.getSitoBySensor(sensorId).get("_id") : null;
                        return (
                            <Router.Link to={"/chart/"}>
                                <components.Icon
                                    color={colors.iconChart}
                                    icon={"chart"}
                                    onClick={
                                        R.partial(
                                            self.props.displayAlarmsOnChart,
                                            [sensorId, site, alarms]
                                        )
                                    }
                                    size={"30px"}
                                    style={{
                                        float: "right",
                                        cursor: "pointer",
                                        verticalAlign: "middle"
                                    }}
                                />
                            </Router.Link>
                        );
                    } else {
                        return (
                            <div></div>
                        );
                    }

                }
            }
        ];
    },
    getColumnsNotifications: function () {
        const {colors} = this.getTheme();
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
                    var date = moment.utc(value, "x");
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
                            {CollectionUtils.sites.getLabel(sito)}
                        </span>
                    );
                }
            },
            {
                key: "dateNotification",
                valueFormatter: function (value, item) {
                    var notificationDate = [item.get("date")];
                    const sensorId = item.get("podId");
                    const site = self.getSitoBySensor(sensorId) ?
                        self.getSitoBySensor(sensorId).get("_id") : null;
                    return (
                        <Router.Link to={"/chart/"}>
                            <components.Icon
                                color={colors.iconChart}
                                icon={"chart"}
                                onClick={
                                    R.partial(
                                        self.props.displayAlarmsOnChart,
                                        [sensorId, site, notificationDate]
                                    )
                                }
                                size={"30px"}
                                style={{
                                    float: "right",
                                    cursor: "pointer",
                                    verticalAlign: "middle"
                                }}
                            />
                        </Router.Link>
                    );
                }
            }
        ];
    },
    onClickAction: function (alarmsId) {
        this.props.modifyExistentAlarm(alarmsId);
        this.props.numberOfSelectedTabs(1);
    },
    activeKey: function (key) {
        this.props.numberOfSelectedTabs(key);
    },
    alarmFilterTitle: function () {
        return [
            {title: "Quali allarmi vuoi visualizzare?", label: ["TUTTI", "ATTIVI", "INATTIVI"]}
        ];
    },
    sortByDate: function (a, b, asc) {
        var comparison = a.get("date") > b.get("date");
        return asc ? comparison : !comparison;
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
        const {colors} = this.getTheme();
        var active = this.state.active[0] === label || this.state.active[1] === label;
        return (
            <bootstrap.ListGroupItem
                key={[allowedValue, label]}
                onClick={R.partial(this.onClickFilter, [label, allowedValue])}
                style={{
                    marginLeft: "10px",
                    borderRadius: "0px",
                    borderLeft: "0px",
                    borderRight: "0px",
                    color: active ? colors.white : colors.greySubTitle,
                    backgroundColor: active ? colors.primary : colors.white,
                    textAlign: "center",
                    paddingTop: "0px",
                    paddingBottom: "0px"
                }}
            >
                <h5>{label}</h5>
            </bootstrap.ListGroupItem>
        );
    },
    renderFilterCell: function (value) {
        const {colors} = this.getTheme();
        return (
            <div key={value.title}>
                <h5 style={{color: colors.primary, width: "250px", paddingLeft: "10px"}}>
                    {value.title}
                </h5>
                <bootstrap.ListGroup>
                    {
                        R.is(Array, value.label) ?
                        value.label.map(R.partial(this.renderFilterTableCell, [value])) :
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
        const {colors} = this.getTheme();
        return (
            <div style={{marginTop: "10px", height: "auto", marginBottom: "10px", float: "right"}}>
                <components.Popover
                    title={
                        <span style={{
                            display: "inline-block",
                            width: "50px",
                            height: "50px",
                            borderRadius: "100%",
                            lineHeight: "4",
                            backgroundColor: colors.secondary
                        }}
                        >
                            <components.Icon
                                color={colors.iconFilter}
                                icon={"filter"}
                                size={"38px"}
                                style={{
                                    verticalAlign: "middle",
                                    lineHeight: "20px",
                                    textAlign: "center"
                                }}
                            />
                        </span>
                    }
                >
                    {this.renderFilter()}
                </components.Popover>
            </div>
        );
    },
    renderTabs: function () {
        var allowedValues = this.props.collections.get("alarms") || Immutable.Map();
        const {colors} = this.getTheme();
        return (
            <div className="alarm-tab" style={{}}>
                <Radium.Style
                    rules={{
                        "ul": {
                            border: "0px",
                            height: "56px",
                            backgroundColor: colors.secondary
                        },
                        "ul li": {
                            color: colors.white,
                            margin: "0 1.5%"
                        },
                        "ul li a": {
                            height: "55px",
                            lineHeight: "55px",
                            fontSize: "17px",
                            textTransform: "uppercase",
                            padding: "0px 4px"
                        },
                        ".nav-tabs > li > a": {
                            height: "44px",
                            color: colors.white,
                            border: "0",
                            outline: "none",
                            borderBottom: "3px solid" + colors.secondary
                        },
                        ".nav-tabs > li:hover > a:hover": {
                            fontWeight: "400"
                        },
                        ".nav-tabs > li.active > a, .nav-tabs > li > a:hover, .nav-tabs > li.active > a:hover, .nav-tabs > li.active > a:focus": {
                            height: "44px",
                            fontSize: "17px",
                            fontWeight: "500",
                            color: colors.white,
                            border: "0px",
                            borderRadius: "0px",
                            outline: "none",
                            backgroundColor: colors.secondary,
                            borderBottom: "3px solid" + colors.buttonPrimary,
                            outlineStyle: "none",
                            outlineWidth: "0px"
                        }
                    }}
                    scopeSelector=".alarm-tab"
                />
                <div className="tabbed-area">
                    <bootstrap.Tabs
                        activeKey={this.props.alarms.selectedTab}
                        animation={false}
                        bsStyle={"tabs"}
                        onSelect={this.activeKey}
                    >
                        <bootstrap.Tab eventKey={1} title="Impostazione">
                            <components.AlarmForm
                                alarm={this.getAlarm()}
                                alarmsReduxState={this.props.alarms}
                                reset={this.props.resetAlarmFormView}
                                siti={this.getSiti()}
                                submit={this.props.submitAlarmCreationOrChange}
                                type={this.getType()}
                            />
                        </bootstrap.Tab>
                        <bootstrap.Tab
                            eventKey={2}
                            style={{
                                height: "100%",
                                overflow: "scroll"
                            }}
                            title="Allarmi"
                        >
                            {this.renderFilterButton()}
                            <components.CollectionElementsTable
                                collection={
                                    R.isNil(allowedValues) ?
                                    Immutable.Map() :
                                    allowedValues.filter(this.filterAlarms)}
                                columns={this.getColumnsAlarms()}
                                getKey={getKeyFromCollection}
                                hover={true}
                                width={"40%"}
                            />
                        </bootstrap.Tab>
                        <bootstrap.Tab
                            eventKey={3}
                            style={{height: "100%", overflow: "scroll"}}
                            title="Storico allarmi"
                        >
                            <components.CollectionElementsTable
                                collection={this.getNotifications().sort(R.partialRight(this.sortByDate, [false]))}
                                columns={this.getColumnsNotifications()}
                                getKey={getKeyFromCollection}
                                hover={true}
                                width={"30%"}
                            />
                        </bootstrap.Tab>
                    </bootstrap.Tabs>
                </div>
            </div>
        );
    },
    render: function () {
        return (
            <div>
                {this.renderTabs()}
            </div>
        );
    }
});

function mapStateToProps (state) {
    return {
        collections: state.collections,
        alarms: state.alarms
    };
}
function mapDispatchToProps (dispatch) {
    return {
        displayAlarmsOnChart: bindActionCreators(displayAlarmsOnChart, dispatch),
        modifyExistentAlarm: bindActionCreators(modifyExistentAlarm, dispatch),
        submitAlarmCreationOrChange: bindActionCreators(submitAlarmCreationOrChange, dispatch),
        resetAlarmFormView: bindActionCreators(resetAlarmFormView, dispatch),
        numberOfSelectedTabs: bindActionCreators(numberOfSelectedTabs, dispatch)
    };
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(Radium(Alarms));
