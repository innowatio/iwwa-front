var Immutable  = require("immutable");
var Radium     = require("radium");
var React      = require("react");
var bootstrap  = require("react-bootstrap");
var IPropTypes = require("react-immutable-proptypes");
var Router     = require("react-router");
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

var getKeyFromNotification = function (alarm) {
    return alarm.get("date");
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
    getAlarms: function () {
        return this.props.collections.get("alarms") || Immutable.Map();
    },
    getSiti: function () {
        return this.props.collections.get("siti") || Immutable.Map();
    },
    getType: function () {
        return (this.props.params.id ? "update" : "insert");
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
    getChartUrl: function (sito, alarms, startDate, endDate) {
        var url = `/chart/`;
        url += `?sito=${sito}`;
        url += `&dateFilter=${startDate}-${endDate}`;
        url += `&alarms=${alarms}`;
        return url;
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
                            {CollectionUtils.siti.getLabel(sito) + " - " + moment(latest).format("DD/MM/YYYY HH:mm")}
                        </span>
                    );
                }
            },
            {
                key: "_id",
                valueFormatter: function (value) {
                    return (
                        <Router.Link onClick={self.onClickAction} to={`/alarms/${value}`}>
                            <img src={icons.iconSettings}
                                style={{float: "right", height: "28px"}}/>
                        </Router.Link>
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
                        var lowerDate = moment(notificationDates[notificationDates.length - 1]).subtract(15, "days").format("YYYYMMDD");
                        var upperDate = moment(notificationDates[notificationDates.length - 1]).add(15, "days").format("YYYYMMDD");
                        var alarms = R.dropRepeats(notificationDates).join("-");
                        const sito = self.getSitoByPod(item.get("podId")).get("_id");
                        var chartUrl = self.getChartUrl(sito, alarms, lowerDate, upperDate);
                        return (
                            <Router.Link to={chartUrl}>
                                <img src={icons.iconPNG}
                                    style={{float: "right", height: "28px"}}/>
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
                            {CollectionUtils.siti.getLabel(sito)}
                        </span>
                    );
                }
            },
            {
                key: "dateNotification",
                valueFormatter: function (value, item) {
                    var notificationDate = item.get("date");
                    var lowerDate = moment(notificationDate).subtract(15, "days").format("YYYYMMDD");
                    var upperDate = moment(notificationDate).add(15, "days").format("YYYYMMDD");
                    const sito = self.getSitoByPod(item.get("podId")).get("_id");
                    var chartUrl = self.getChartUrl(sito, notificationDate, lowerDate, upperDate);
                    return (
                        <Router.Link to={chartUrl}>
                            <img src={icons.iconPNG}
                                style={{float: "right", height: "28px"}}/>
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
                            <h4 style={{color: colors.primary}}>Filter</h4>
                        </span>}
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
                        activeKey={this.state.key}
                        animation={false}
                        bsStyle={"tabs"}
                        onSelect={this.activeKey}
                    >
                        <bootstrap.Tab eventKey={1} title="Impostazione">
                            <components.AlarmForm
                                alarm={this.getAlarm()}
                                siti={this.getSiti()}
                                type={this.getType()}
                            />
                        </bootstrap.Tab>
                        <bootstrap.Tab eventKey={2} title="Allarmi">
                            {this.renderFilterButton()}
                            <components.CollectionElementsTable
                                collection={ R.isNil(allowedValues) ? Immutable.Map() : allowedValues.filter(this.filterAlarms)}
                                columns={this.getColumnsAlarms()}
                                getKey={getKeyFromAlarm}
                                hover={true}
                                width={"40%"}
                            />
                        </bootstrap.Tab>
                        <bootstrap.Tab eventKey={3} title="Storico allarmi">
                            {/* <div style={{marginRight: "30px", height: "40px", paddingTop: "20px"}}>
                                <div onClick={this.onClickFilter} style={{float: "right", display: "flex", cursor: "pointer"}}>
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

module.exports = Radium(Alarms);
