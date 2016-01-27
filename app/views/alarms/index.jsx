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
var styles          = require("lib/styles");
var colors          = require("lib/colors");
var icons           = require("lib/icons");
import {
    displayAlarmsOnChart,
    modifyExistentAlarm,
    resetAlarmFormView,
    submitAlarmCreationOrChange,
    numberOfSelectedTabs
} from "actions/alarms";

var getKeyFromAlarm = function (alarm) {
    return alarm.get("_id");
};

var getKeyFromNotification = function (alarm) {
    return alarm.get("date");
};

function mapStateToProps (state) {
    return {
        location: state.router.location,
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
    getInitialState: function () {
        return {
            active: [
                "TUTTI"
            ]
        };
    },
    componentDidMount: function () {
        this.props.asteroid.subscribe("alarms");
        this.props.asteroid.subscribe("notifications");
        this.props.asteroid.subscribe("sites");
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
    getSitoByPod: function (pod) {
        return this.getSiti().find(
            sito => (
                sito.get("pod") === pod
            ));
    },
    getNotificationsList: function (notifications) {
        var notificationDates = [];
        notifications.forEach(function (notification) {
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
        var self = this;
        return [
            {
                key: "active",
                style: function (value) {
                    return {
                        backgroundColor: value ? colors.green : colors.grey,
                        width: "37px",
                        height: "100%",
                        textAlign: "center"
                    };
                },
                valueFormatter: function (value) {
                    return (
                        <img
                            src={value ? icons.iconFlag : icons.iconPause}
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
                valueFormatter: function (value, item) {
                    var sito = self.getSiti().find(siti => {
                        return siti.get("pod") === value;
                    });
                    var latest = R.last(self.getNotificationsList(item.get("notifications").sort()));
                    return (
                        <span>
                            {CollectionUtils.sites.getLabel(sito) + " - " + moment(latest).format("DD/MM/YYYY HH:mm")}
                        </span>
                    );
                }
            },
            {
                key: "_id",
                valueFormatter: function (value) {
                    return (
                        <img
                            onClick={R.partial(self.onClickAction, [value])}
                            src={icons.iconSettings}
                            style={{float: "right", height: "28px", cursor: "pointer"}}
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
                        const startDate = moment(notificationDates[notificationDates.length - 1])
                            .startOf("month").valueOf();
                        const endDate = moment(notificationDates[notificationDates.length - 1])
                            .endOf("month").valueOf();
                        const alarms = R.dropRepeats(notificationDates);
                        const siteId = self.getSitoByPod(item.get("podId")) ?
                            [self.getSitoByPod(item.get("podId")).get("_id")] :
                            [];
                        return (
                            <Router.Link to={"/chart/"}>
                                <img
                                    onClick={
                                        R.partial(
                                            self.props.displayAlarmsOnChart,
                                            [siteId, alarms, startDate, endDate]
                                        )
                                    }
                                    src={icons.iconPNG}
                                    style={{float: "right", height: "28px"}}
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
                            {CollectionUtils.sites.getLabel(sito)}
                        </span>
                    );
                }
            },
            {
                key: "dateNotification",
                valueFormatter: function (value, item) {
                    var notificationDate = item.get("date");
                    const startDate = moment(notificationDate).startOf("month").valueOf();
                    const endDate = moment(notificationDate).endOf("month").valueOf();
                    const siteId = self.getSitoByPod(item.get("podId")) ?
                        [self.getSitoByPod(item.get("podId")).get("_id")] :
                        [];
                    return (
                        <Router.Link to={"/chart/"}>
                            <img
                                onClick={
                                    R.partial(
                                        self.props.displayAlarmsOnChart,
                                        [siteId, [notificationDate], startDate, endDate]
                                    )
                                }
                                src={icons.iconPNG}
                                style={{float: "right", height: "28px"}}
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
        var active = this.state.active[0] === label || this.state.active[1] === label;
        return (
            <bootstrap.ListGroupItem
                key={[allowedValue, label]}
                onClick={R.partial(this.onClickFilter, [label, allowedValue])}
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
                }}
            >
                <h5>{"label"}</h5>
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
                            <h4 style={{color: colors.primary}}>{"Filter"}</h4>
                        </span>
                    }
                >
                    {this.renderFilter()}
                </components.Popover>
            </div>
        );
    },
    render: function () {
        var allowedValues = this.props.collections.get("alarms") || Immutable.Map();
        return (
            <div className="alarm-tab" style={{paddingBottom: "15px"}}>
                <Radium.Style
                    rules={styles.tabForm}
                    scopeSelector=".alarm-tab"
                />
                <div className="tabbed-area" style={styles.tabbedArea}>
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
                        <bootstrap.Tab eventKey={2} title="Allarmi">
                            {this.renderFilterButton()}
                            <components.CollectionElementsTable
                                collection={
                                    R.isNil(allowedValues) ?
                                    Immutable.Map() :
                                    allowedValues.filter(this.filterAlarms)}
                                columns={this.getColumnsAlarms()}
                                getKey={getKeyFromAlarm}
                                hover={true}
                                width={"40%"}
                            />
                        </bootstrap.Tab>
                        <bootstrap.Tab eventKey={3} title="Storico allarmi">
                            {/* <div style={{marginRight: "30px", height: "40px", paddingTop: "20px"}}>
                                <div onClick={this.onClickFilter}
                                    style={{float: "right", display: "flex", cursor: "pointer"}}>
                                    <components.Icon icon="filter" style={{paddingTop: "13px"}}/>
                                    <components.Spacer direction="h" size={10} />
                                    <h4 style={{color: colors.primary}}>Filter</h4>
                                </div>
                            </div> */}
                            <components.Spacer direction="v" size={30}/>
                            <components.CollectionElementsTable
                                collection={this.getNotifications().sort(R.partialRight(this.sortByDate, [false]))}
                                columns={this.getColumnsNotifications()}
                                getKey={getKeyFromNotification}
                                hover={true}
                                width={"30%"}
                            />
                        </bootstrap.Tab>
                    </bootstrap.Tabs>
                </div>
            </div>
        );
    }
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(Radium(Alarms));
