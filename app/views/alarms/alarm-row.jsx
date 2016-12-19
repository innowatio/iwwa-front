import React, {PropTypes} from "react";
import moment from "moment";
import IPropTypes from "react-immutable-proptypes";
import ReactPureRender from "react-addons-pure-render-mixin";
import {Link} from "react-router";

import components from "components";
import {defaultTheme} from "lib/theme";

const styles = ({colors}, active) => ({
    headerContainer: {
        height: "50px",
        borderTop: "1px solid " + colors.borderAlarmsRow,
        clear: "both",
        padding: "0px"
    },
    iconChart: {
        display: "inline-block",
        cursor: "pointer",
        lineHeight: "43px",
        verticalAlign: "middle"
    },
    iconSettings: {
        display: "inline-block",
        cursor: "pointer",
        marginRight: "20px",
        lineHeight: "43px",
        verticalAlign: "middle"
    },
    iconAlarmStatus: {
        backgroundColor: active ? colors.red : colors.pausedAlarm,
        color: colors.white,
        display: "inline-block",
        height: "49px",
        width: "45px",
        verticalAlign: "middle",
        lineHeight: "55px",
        textAlign: "center",
        marginRight: "10px"
    }
});

var AlarmRow = React.createClass({
    propTypes: {
        alarmAggregates: IPropTypes.map.isRequired,
        element: IPropTypes.map.isRequired,
        elementId: PropTypes.any.isRequired,
        onClickAlarmChart: PropTypes.func.isRequired,
        onClickAlarmSetting: PropTypes.func.isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getDefaultProps: function () {
        return {
            open: false
        };
    },
    mixin: [ReactPureRender],
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getLastTriggerTimestamp: function () {
        const {
            alarmAggregates
        } = this.props;
        const last = alarmAggregates.sortBy(x => x.get("date")).last();
        if (last) {
            const measurementValues = last.get("measurementValues").split(",");
            const measurementTimes = last.get("measurementTimes").split(",");
            const reversedMeasurements = measurementTimes.map((time, index) => {
                return {
                    time: measurementTimes[measurementTimes.length - (index + 1)],
                    value: parseInt(measurementValues[measurementValues.length - (index + 1)])
                };
            });
            const lastMeasurements = reversedMeasurements.find(x => x.value === 1);
            return lastMeasurements.time;
        }
        return 0;
    },
    getLastTrigger: function () {
        const timestamp = this.getLastTriggerTimestamp();
        return {
            timestamp,
            today: moment(parseInt(timestamp)).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD"),
            formatted: moment(parseInt(timestamp)).locale("it").format("LLL")
        };
    },
    getAlarmLabel: function (lastTrigger) {
        const {
            element
        } = this.props;
        const alarmName = element.get("name") || "Allarme";
        return `${alarmName} ${element.get("threshold")} ${element.get("unitOfMeasurement")} ${lastTrigger.timestamp > 0 ? lastTrigger.formatted : ""}`;
    },
    render: function () {
        const {colors} = this.getTheme();
        const lastTrigger = this.getLastTrigger();
        return (
            <div style={styles(this.getTheme()).headerContainer}>
                <div style={{float: "left", height: "48px", minWidth: "auto", width: "calc(100% - 200px)"}} >
                    <components.Icon
                        color={colors.iconAlarmAction}
                        icon={lastTrigger.today ? "danger" : "flag"}
                        size={"30px"}
                        style={styles(this.getTheme(), lastTrigger.today).iconAlarmStatus}
                    />
                    {this.getAlarmLabel(lastTrigger)}
                </div>
                <div style={{width: "100px", lineHeight: "48px", float: "right"}} >
                    <components.Icon
                        color={colors.iconAlarmAction}
                        icon={"settings"}
                        onClick={() => this.props.onClickAlarmSetting(this.props.element)}
                        size={"28px"}
                        style={styles(this.getTheme()).iconSettings}
                    />
                    <Link to={"/chart/"}>
                        <components.Icon
                            color={colors.iconAlarmsChart}
                            icon={"chart"}
                            onClick={() => this.props.onClickAlarmChart(this.props.element)}
                            size={"34px"}
                            style={styles(this.getTheme()).iconChart}
                        />
                    </Link>
                </div>
            </div>
        );
    }
});

module.exports = AlarmRow;
