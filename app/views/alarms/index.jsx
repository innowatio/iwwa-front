import Immutable from "immutable";
import Radium from "radium";
import React from "react";
import * as bootstrap from "react-bootstrap";
import IPropTypes from "react-immutable-proptypes";
import R from "ramda";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import moment from "moment";

import components from "components";
import {
    displayAlarmsOnChart,
    modifyExistentAlarm,
    resetAlarmFormView,
    submitAlarmCreationOrChange,
    numberOfSelectedTabs
} from "actions/alarms";
import {defaultTheme} from "lib/theme";
import NotificationRow from "./notification-row";
import AlarmRow from "./alarm-row";
import {styles as stylesLib} from "lib/styles_restyling";
import CollectionUtils from "lib/collection-utils";
import SubListNotification from "./sub-list-notification.jsx";

const styles = ({colors}) => ({
    hoverStyle: {
        backgroundColor: colors.backgroundAlarmsRowHover
    },
    lazyLoadButtonStyle: {
        width: "230px",
        height: "45px",
        lineHeight: "43px",
        backgroundColor: colors.buttonPrimary,
        fontSize: "14px",
        textTransform: "uppercase",
        fontWeight: "400",
        margin: "10px auto 0 auto",
        borderRadius: "30px",
        cursor: "pointer",
        textAlign: "center"
    },
    tabStyle: {
        height: "100%",
        width: "98%",
        margin: "0px auto",
        overflow: "scroll",
        color: colors.mainFontColor,
        fontSize: "18px",
        fontWeight: "300",
        position: "relative"
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
    onClickAlarmSetting: function (alarmsId) {
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
    onClickPanel: function (elementId) {
        const isPanelOpen = !R.equals(this.state.panelToOpen, elementId);
        return this.setState({panelToOpen: isPanelOpen ? elementId : null});
    },
    dateFilter: function (item, search) {
        const searchRegExp = new RegExp(search, "i");
        return !R.isNil(item) ? (
            searchRegExp.test(moment(item.get("date")).locale("it").format("LLL"))
        ) : null;
    },
    getNotificationFilter: function (item, search) {
        return (
            CollectionUtils.sites.filter(item, search) ||
            this.dateFilter(item, search)
        );
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
    renderSubListNotification: function (components, index) {
        const isExpanded = this.state.panelToOpen === index;
        return <SubListNotification isExpanded={isExpanded} />;
    },
    renderFilterButton: function () {
        return (
            <components.ButtonFilter
                filterList={this.alarmFilterTitle()}
                onClickFilter={this.onClickFilter}
            />
        );
    },
    renderAlarmRow: function (element, elementId) {
        return (
            <AlarmRow
                element={element}
                elementId={elementId}
                onClickAlarmSetting={this.onClickAlarmSetting}
            />
        );
    },
    renderNotificationRow: function (element, elementId) {
        const open = this.state.panelToOpen === elementId;
        return (
            <NotificationRow
                element={element}
                elementId={elementId}
                onClickPanel={this.onClickPanel}
                open={open}
            />
        );
    },
    render: function () {
        var allowedValues = this.props.collections.get("alarms") || Immutable.Map();
        const {colors} = this.getTheme();
        return (
            <div className="alarm-tab">
                <Radium.Style
                    rules={stylesLib(this.getTheme()).tabsStyle}
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
                            style={styles(this.getTheme()).tabStyle}
                            title="Allarmi"
                        >
                            <Radium.Style
                                rules={{
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
                            <components.CollectionItemList
                                collections={R.isNil(allowedValues) ? Immutable.Map() : allowedValues.filter(this.filterAlarms)}
                                headerComponent={this.renderAlarmRow}
                                initialVisibleRow={10}
                                filter={this.notificationFilter}
                                hover={true}
                                hoverStyle={styles(this.getTheme()).hoverStyle}
                                lazyLoadButtonStyle={styles(this.getTheme()).lazyLoadButtonStyle}
                                lazyLoadLabel={"Carica altri"}
                            />
                        </bootstrap.Tab>
                        <bootstrap.Tab
                            eventKey={3}
                            title="Storico allarmi"
                            style={styles(this.getTheme()).tabStyle}
                        >
                            {this.renderFilterButton()}
                            <components.CollectionItemList
                                collections={this.getNotifications()}
                                headerComponent={this.renderNotificationRow}
                                initialVisibleRow={10}
                                filter={this.getNotificationFilter}
                                hover={true}
                                hoverStyle={styles(this.getTheme()).hoverStyle}
                                lazyLoadButtonStyle={styles(this.getTheme()).lazyLoadButtonStyle}
                                lazyLoadLabel={"Carica altri"}
                                sort={R.partialRight(this.sortByDate, [false])}
                                subListComponent={this.renderSubListNotification}
                            />
                        </bootstrap.Tab>
                    </bootstrap.Tabs>
                </div>
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
