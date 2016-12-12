import Immutable from "immutable";
import Radium from "radium";
import React from "react";
import * as bootstrap from "react-bootstrap";
import IPropTypes from "react-immutable-proptypes";
import R from "ramda";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import moment from "moment";
import get from "lodash.get";

import components from "components";
import {
    selectSingleElectricalSensor
} from "actions/chart";
import {
    resetAlarmFormView,
    numberOfSelectedTabs,
    filterCollection,
    resetFilter,
    selectAlarm,
    upsertAlarm
} from "actions/alarms";
import {defaultTheme} from "lib/theme";
import NotificationRow from "./notification-row";
import AlarmRow from "./alarm-row";
import {styles as stylesLib} from "lib/styles";
import CollectionUtils from "lib/collection-utils";
import SubListNotification from "./sub-list-notification.jsx";

const styles = ({colors}) => ({
    hoverStyle: {
        clear: "both",
        backgroundColor: colors.backgroundAlarmsRowHover
    },
    lazyLoadButtonStyleContainer: {
        borderTop: "1px solid " + colors.borderAlarmsRow,
        marginBottom: "50px"
    },
    lazyLoadButtonStyle: {
        width: "230px",
        height: "45px",
        lineHeight: "43px",
        backgroundColor: colors.buttonPrimary,
        fontSize: "14px",
        color: colors.white,
        textTransform: "uppercase",
        fontWeight: "400",
        margin: "10px auto 0 auto",
        borderRadius: "30px",
        cursor: "pointer",
        textAlign: "center"
    },
    tabStyle: {
        height: "100%",
        width: "95%",
        margin: "0px auto",
        color: colors.mainFontColor,
        fontSize: "18px",
        fontWeight: "300",
        position: "relative"
    }
});

const alarmButtonFilter = [{
    title: "Quali allarmi vuoi visualizzare?",
    filter: [
        {label: "TUTTI", key: "all"},
        {label: "ATTIVI", key: "active"},
        {label: "INATTIVI", key: "inactive"},
        {label: "IN PAUSA", key: "pause"}
    ],
    key: "status"
}];

const notificationButtonFilter = [{
    title: "Seleziona periodo",
    filter: [
        {label: "SEMPRE", key: "-1"},
        {label: "ULTIMI 7 GIORNI", key: "7"},
        {label: "ULTIMI 30 GIORNI", key: "30"}
    ],
    key: "period"
}];

var Alarms = React.createClass({
    propTypes: {
        alarms: React.PropTypes.object.isRequired,
        asteroid: React.PropTypes.object,
        collections: IPropTypes.map.isRequired,
        filterCollection: React.PropTypes.func.isRequired,
        location: React.PropTypes.object,
        numberOfSelectedTabs: React.PropTypes.func.isRequired,
        params: React.PropTypes.object,
        resetAlarmFormView: React.PropTypes.func.isRequired,
        resetFilter: React.PropTypes.func,
        selectAlarm: React.PropTypes.func.isRequired,
        selectSingleElectricalSensor: React.PropTypes.func.isRequired,
        upsertAlarm: React.PropTypes.func.isRequired
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
        this.props.asteroid.subscribe("notifications");
        this.props.asteroid.subscribe("sites");
        this.props.asteroid.subscribe("userAlarmsAggregates");
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
    getAlarmsAggregates: function () {
        return this.props.collections.get("alarms-aggregates") || Immutable.Map();
    },
    getNotifications: function () {
        return this.props.collections.get("notifications") || Immutable.Map();
    },
    getSiti: function () {
        return this.props.collections.get("sites") || Immutable.Map();
    },
    getType: function () {
        return this.props.alarms.id ? "update" : "insert";
    },
    getFilteredNotifications: function () {
        const selectedPeriod = parseInt(get(this.props, "alarms.filter.notification.period"));
        const today = moment();
        let startDate = moment("1970-01-01");

        if (selectedPeriod > 0) {
            startDate = today.subtract({
                days: parseInt(selectedPeriod)
            });
        }

        return this.getNotifications().filter(notification => {
            const alarmDate = moment(notification.get("date"));
            return startDate.isBefore(alarmDate);
        });
    },
    getAlarmFilter: function (item) {
        const statusSelected = get(this.props, "alarms.filter.alarm.status");
        return CollectionUtils.filters.status(item.get("active"), statusSelected);
    },
    onClickAlarmChart: function (alarm) {
        this.props.selectSingleElectricalSensor([alarm.get("sensorId")]);
    },
    onClickAlarmSetting: function (alarmsId) {
        this.props.selectAlarm(alarmsId.toJS());
        this.props.numberOfSelectedTabs(1);
    },
    activeKey: function (key) {
        if (key) {
            this.props.numberOfSelectedTabs(key);
        }
    },
    sortByDate: function (a, b, asc) {
        if (asc) {
            return a.get("date") > b.get("date") ? 1 : -1;
        }
        return a.get("date") > b.get("date") ? -1 : 1;
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
    getSearchFilter: function (item, search) {
        return (
            CollectionUtils.sites.filter(item, search) ||
            this.dateFilter(item, search)
        );
    },
    getNotificationsFilter: function (item, search) {
        var searchRegExp = new RegExp(search.trim(), "i");
        return !R.isNil(item) ? (
            searchRegExp.test(item.get("title")) ||
            searchRegExp.test(item.get("message").split(" - ").join(" "))
        ) : null;
    },
    renderSubListNotification: function (components, index) {
        const isExpanded = this.state.panelToOpen === index;
        return (
            <SubListNotification
                isExpanded={isExpanded}
                label={components.get("message")}
            />
        );
    },
    renderAlarmRow: function (element, elementId) {
        const alarmAggregates = this.getAlarmsAggregates().filter(x => x.get("alarmId") === element.get("_id"));
        return (
            <AlarmRow
                alarmAggregates={alarmAggregates}
                element={element}
                elementId={elementId}
                onClickAlarmChart={this.onClickAlarmChart}
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
        return (
            <div className="alarm-tab">
                <Radium.Style
                    rules={stylesLib(this.getTheme()).tabsStyle}
                    scopeSelector=".alarm-tab"
                />
                <div className="tabbed-area">
                    <bootstrap.Tabs
                        activeKey={this.props.alarms.selectedTab || 1}
                        id={"alarm"}
                        bsStyle={"tabs"}
                        onSelect={this.activeKey}
                    >
                        <bootstrap.Tab eventKey={1} title="Impostazione">
                            <components.AlarmForm
                                alarm={this.props.alarms.selectedAlarm}
                                onReset={this.props.resetAlarmFormView}
                                onSubmit={this.props.upsertAlarm}
                                siti={this.getSiti()}
                            />
                        </bootstrap.Tab>
                        <bootstrap.Tab
                            className="alarm-table"
                            eventKey={2}
                            style={styles(this.getTheme()).tabStyle}
                            title="Allarmi"
                        >
                            <components.ButtonFilter
                                activeFilter={this.props.alarms.filter}
                                filterList={alarmButtonFilter}
                                onConfirm={R.partialRight(this.props.filterCollection, ["alarm"])}
                            />
                            <components.CollectionItemList
                                collections={allowedValues.filter(this.getAlarmFilter) || Immutable.Map()}
                                headerComponent={this.renderAlarmRow}
                                initialVisibleRow={10}
                                filter={this.getSearchFilter}
                                hover={true}
                                hoverStyle={styles(this.getTheme()).hoverStyle}
                                lazyLoadButtonStyle={styles(this.getTheme()).lazyLoadButtonStyle}
                                lazyLoadButtonStyleContainer={styles(this.getTheme()).lazyLoadButtonStyleContainer}
                                lazyLoadLabel={"Carica altri"}
                                showFilterInput={true}
                            />
                        </bootstrap.Tab>
                        <bootstrap.Tab
                            eventKey={3}
                            title="Storico allarmi"
                            style={styles(this.getTheme()).tabStyle}
                        >
                            <components.ButtonFilter
                                activeFilter={this.props.alarms.filter}
                                filterList={notificationButtonFilter}
                                onConfirm={R.partialRight(this.props.filterCollection, ["notification"])}
                            />
                            <components.CollectionItemList
                                collections={this.getFilteredNotifications()}
                                headerComponent={this.renderNotificationRow}
                                initialVisibleRow={10}
                                filter={this.getNotificationsFilter}
                                hover={true}
                                hoverStyle={styles(this.getTheme()).hoverStyle}
                                lazyLoadButtonStyle={styles(this.getTheme()).lazyLoadButtonStyle}
                                lazyLoadButtonStyleContainer={styles(this.getTheme()).lazyLoadButtonStyleContainer}
                                lazyLoadLabel={"Carica altri"}
                                showFilterInput={true}
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
        filterCollection: bindActionCreators(filterCollection, dispatch),
        selectSingleElectricalSensor: bindActionCreators(selectSingleElectricalSensor, dispatch),
        resetAlarmFormView: bindActionCreators(resetAlarmFormView, dispatch),
        resetFilter: bindActionCreators(resetFilter, dispatch),
        selectAlarm: bindActionCreators(selectAlarm, dispatch),
        upsertAlarm: bindActionCreators(upsertAlarm, dispatch),
        numberOfSelectedTabs: bindActionCreators(numberOfSelectedTabs, dispatch)
    };
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(Radium(Alarms));
