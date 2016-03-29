import React, {PropTypes} from "react";
import moment from "moment";
import IPropTypes from "react-immutable-proptypes";
import ReactPureRender from "react-addons-pure-render-mixin";
import {partial} from "ramda";
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
        backgroundColor: active ? colors.activeAlarm : colors.pausedAlarm,
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
        element: IPropTypes.map.isRequired,
        elementId: PropTypes.any.isRequired,
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
    getFormattedDate: function () {
        const dateLastNotification = this.props.element.get("notifications").last().get("date");
        if (dateLastNotification) {
            return ` - ${moment(dateLastNotification).locale("it").format("LLL")}`;
        }
        return null;
    },
    render: function () {
        const {colors} = this.getTheme();
        const active = this.props.element.get("active");
        return (
            <div style={styles(this.getTheme()).headerContainer}>
                <div style={{float: "left", height: "48px", minWidth: "auto", width: "calc(100% - 200px)"}} >
                    <components.Icon
                        color={colors.iconAlarmAction}
                        icon={active ? "flag" : "pause"}
                        size={"30px"}
                        style={styles(this.getTheme(), active).iconAlarmStatus}
                    />
                    {`${this.props.element.get("name")}${this.getFormattedDate()}`}
                </div>
                <div style={{width: "100px", lineHeight: "48px", float: "right"}} >
                    <components.Icon
                        color={colors.iconAlarmAction}
                        icon={"settings"}
                        onClick={partial(this.props.onClickAlarmSetting, [this.props.elementId])}
                        size={"28px"}
                        style={styles(this.getTheme()).iconSettings}
                    />
                    <Link to={"/chart/"}>
                        <components.Icon
                            color={colors.iconAlarmsChart}
                            icon={"chart"}
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
