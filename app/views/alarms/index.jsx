var Immutable  = require("immutable");
var Radium     = require("radium");
var React      = require("react");
var bootstrap  = require("react-bootstrap");
var IPropTypes = require("react-immutable-proptypes");
var Router     = require("react-router");
var R          = require("ramda");
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import moment from "moment";

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

const styles = ({colors}) => ({
    headerContainer: {
        height: "55px",
        lineHeight: "48px",
        borderTop: "1px solid " + colors.white,
        padding: "3px 0px",
        clear: "both"
    },
    iconArrowDown: {
        display: "inline-block",
        lineHeight: "40px",
        verticalAlign: "middle",
        marginRight: "10px"
    },
    iconChart: {
        float: "right",
        marginRight: "5px",
        cursor: "pointer",
        lineHeight: "20px",
        verticalAlign: "middle"
    },
    data: {
        display: "inline-block",
        margin: "0px 20px 0px 0px",
        padding: "0px",
        lineHeight: "35px",
        fontSize: "18px",
        fontWeight: "300"
    },
    sensorName: {
        display: "inline-block",
        margin: "0px",
        padding: "0px",
        fontSize: "18px",
        lineHeight: "35px",
        fontWeight: "300",
        color:colors.alarmSiteName
    },
    panel: {
        backgroundColor: colors.backgroundAlarmsPanel,
        margin: "0",
        padding: "0",
        border: "0",
        borderRadius: "0px"
    }
});

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
            alarmToVisualize: "TUTTI",
            panelToOpen: null
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
                        width: "47px",
                        height: "100%",
                        color: colors.mainFontColor,
                        textAlign: "center"
                    };
                },
                valueFormatter: function (value) {
                    return (
                        <components.Icon
                            color={colors.iconAlarmAction}
                            icon={value ? "flag" : "pause"}
                            size={"34px"}
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
                            size={"32px"}
                            style={{
                                float: "right",
                                cursor: "pointer",
                                lineHeight: "20px",
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
                                    size={"34px"}
                                    style={{
                                        float: "right",
                                        marginRight: "5px",
                                        cursor: "pointer",
                                        lineHeight: "20px",
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
    headerNotificationsList: function (collection, index) {
        const {colors} = this.getTheme();
        const isActivePanel = R.equals(this.state.panelToOpen, index);
        const date = moment(collection.get("date")).locale("it").format("LLL");
        return (
            <div style={styles(this.getTheme()).headerContainer}>
                <components.Button
                    onClick={() => this.setState({
                        panelToOpen: isActivePanel ? null : index
                    })}
                    style={{
                        backgroundColor: colors.transparent,
                        border: "0px",
                        color: colors.mainFontColor
                    }}
                >
                    <components.Icon
                        color={colors.white}
                        icon={"arrow-down"}
                        size={"14px"}
                        style={styles(this.getTheme()).iconArrowDown}
                    />
                    <p style={styles(this.getTheme()).data}>{date}</p>
                    <h5 style={styles(this.getTheme()).sensorName}>{collection.get("name")}</h5>
                </components.Button>
                <components.Button
                    className="pull-right"
                    style={{
                        backgroundColor: colors.transparent,
                        border: "0px"
                    }}
                >
                    <components.Icon
                        color={colors.iconChart}
                        icon={"chart"}
                        size={"34px"}
                        style={styles(this.getTheme()).iconChart}
                    />
                </components.Button>
            </div>
        );
    },
    subListNotification: function (components, index) {
        const isActive = this.state.panelToOpen === index;
        return (
            <bootstrap.Panel
                accordion={true}
                collapsible={true}
                expanded={isActive}
                style={styles(this.getTheme()).panel}
            >
                {"Consumi maggiori del 41% rispetto alla media - 2 anomalie simili (15.5.15, 08.06.15)"}
            </bootstrap.Panel>
        );
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
            {title: "Quali allarmi vuoi visualizzare?", label: ["TUTTI", "ATTIVI", "INATTIVI"], key: "alarmToVisualize"}
        ];
    },
    sortByDate: function (a, b, asc) {
        if (asc) {
            return a.get("date") > b.get("date") ? 1 : -1;
        }
        return a.get("date") > b.get("date") ? -1 : 1;
    },
    onClickFilter: function (value, label) {
        if (R.equals(value, this.alarmFilterTitle()[0])) {
            this.setState({
                [value.key]: label
            });
        }
    },
    filterAlarms: function (value) {
        if (this.state.alarmToVisualize[0] === "ATTIVI") {
            return value.get("active") === true;
        }
        if (this.state.alarmToVisualize[0] === "INATTIVI") {
            return value.get("active") === false;
        }
        return value;
    },
    renderFilterTableCell: function (allowedValue, label, index) {
        return (
            <div key={index} onClick={R.partial(this.onClickFilter, [allowedValue, label])}>
                <bootstrap.Input
                    defaultValue={R.equals(this.state[allowedValue.key], label)}
                    name={allowedValue.key}
                    type={"radio"}
                    value={label}
                />
                {label}
            </div>
        );
    },
    renderFilterCell: function (value) {
        const {colors} = this.getTheme();
        return (
            <div key={value.title}>
                <h5 style={{color: colors.mainFontColor}}>
                    {value.title}
                </h5>
                <bootstrap.ListGroup style={{paddingLeft: "30px"}}>
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
        const {colors} = this.getTheme();
        var alarmFilter = this.alarmFilterTitle();
        return (
            <div className="alarm-filter">
                <Radium.Style
                    rules={{
                        "": {
                            overflow: "auto",
                            margin: "0px",
                            border: "1px solid " + colors.borderDropdown,
                            backgroundColor: colors.backgroundDropdown,
                            borderRadius: "10px",
                            color: colors.mainFontColor,
                            outline: "none",
                            fontSize: "15px",
                            fontWeight: "300"
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
            <div className="alarm-tab">
                <Radium.Style
                    rules={{
                        "ul": {
                            border: "0px",
                            height: "56px",
                            backgroundColor: colors.secondary
                        },
                        "ul li": {
                            color: colors.mainFontColor,
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
                            color: colors.mainFontColor,
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
                            color: colors.mainFontColor,
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
                            className="alarm-table"
                            eventKey={2}
                            title="Allarmi"
                        >
                            <Radium.Style
                                rules={{
                                    "": {
                                        height: "100%",
                                        width: "98%",
                                        margin: "0px auto",
                                        overflow: "scroll",
                                        color: colors.mainFontColor,
                                        fontSize: "18px",
                                        fontWeight: "300"
                                    },
                                    "table tr:hover": {
                                        backgroundColor: colors.tableRowRollover
                                    },
                                    "table tr > td": {
                                        padding: "3px 0px"
                                    }
                                }}
                                scopeSelector=".alarm-table"
                            />

                            {this.renderFilterButton()}
                            <components.CollectionElementsTable
                                collection={
                                    R.isNil(allowedValues) ?
                                    Immutable.Map() :
                                    allowedValues.filter(this.filterAlarms)}
                                columns={this.getColumnsAlarms()}
                                getKey={getKeyFromCollection}
                                hover={true}
                                width={"30%"}
                            />
                        </bootstrap.Tab>
                        <bootstrap.Tab
                            eventKey={3}
                            title="Storico allarmi"
                            style={{
                                height: "100%",
                                width: "98%",
                                margin: "0px auto",
                                overflow: "scroll",
                                color: colors.mainFontColor,
                                fontSize: "18px",
                                fontWeight: "300",
                                position: "relative"
                            }}
                        >
                            {this.renderFilterButton()}
                            <components.CollectionPanelList
                                collections={this.getNotifications()}
                                headerComponent={this.headerNotificationsList}
                                initialVisibleRow={10}
                                sort={R.partialRight(this.sortByDate, [false])}
                                subListComponent={this.subListNotification}
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
