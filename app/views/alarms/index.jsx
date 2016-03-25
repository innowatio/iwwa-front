var Immutable  = require("immutable");
var Radium     = require("radium");
var React      = require("react");
var bootstrap  = require("react-bootstrap");
var IPropTypes = require("react-immutable-proptypes");
var R          = require("ramda");
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

var components      = require("components");
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
import CollectionUtils from "lib/collection-utils";
import {styles as stylesLib} from "lib/styles_restyling";

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
    panel: {
        backgroundColor: colors.backgroundAlarmsPanel,
        margin: "0",
        padding: "0",
        border: "0",
        borderRadius: "0px"
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
    onChangeInputFilter: function (value) {
        this.setState({inputFilter: value});
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
            <div style={{
                overflow: "auto",
                margin: "0px",
                border: "1px solid " + colors.borderDropdown,
                backgroundColor: colors.backgroundDropdown,
                borderRadius: "10px",
                color: colors.mainFontColor,
                outline: "none",
                fontSize: "15px",
                fontWeight: "300"
            }}
            >
            {alarmFilter.map(this.renderFilterCell)}
            </div>
        );
    },
    renderInputSearch: function () {
        const {colors} = this.getTheme();
        return (
            <div className="search-container">
                <Radium.Style
                    rules={{
                        ".input-search": {
                            height: "60px",
                            fontSize: "20px",
                            borderRight: "0px",
                            borderTopLeftRadius: "20px",
                            borderBottomLeftRadius: "20px",
                            backgroundColor: colors.backgroundInputSearch,
                            outline: "none !important",
                            color: colors.white
                        },
                        ".input-group-addon": {
                            backgroundColor: colors.backgroundInputSearch,
                            borderTopRightRadius: "20px",
                            borderBottomRightRadius: "20px",
                            cursor: "pointer"
                        }
                    }}
                    scopeSelector=".search-container"
                />
                <bootstrap.Input
                    addonAfter={
                        <components.Icon
                            color={colors.iconInputSearch}
                            icon={"search"}
                            size={"34px"}
                            style={{
                                lineHeight: "10px",
                                verticalAlign: "middle"
                            }}
                        />
                    }
                    className="input-search"
                    onChange={event => this.setState({inputFilter: event.target.value})}
                    placeholder="Ricerca"
                    type="text"
                    value={this.state.inputFilter}
                />
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
        return (
            <NotificationRow
                element={element}
                elementId={elementId}
                open={!R.equals(this.state.panelToOpen, elementId)}
                onClickPanel={this.onClickPanel}
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
                            {this.renderInputSearch()}
                            <components.CollectionItemList
                                collections={this.getNotifications()}
                                headerComponent={this.renderNotificationRow}
                                initialVisibleRow={10}
                                hover={true}
                                hoverStyle={styles(this.getTheme()).hoverStyle}
                                lazyLoadButtonStyle={styles(this.getTheme()).lazyLoadButtonStyle}
                                lazyLoadLabel={"Carica altri"}
                                sort={R.partialRight(this.sortByDate, [false])}
                                subListComponent={this.subListNotification}
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
