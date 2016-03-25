import React, {PropTypes} from "react";
import moment from "moment";
import IPropTypes from "react-immutable-proptypes";
import ReactPureRender from "react-addons-pure-render-mixin";
import {partial} from "ramda";

import components from "components";
import {defaultTheme} from "lib/theme";

const styles = ({colors}, active) => ({
    headerContainer: {
        height: "50px",
        borderTop: "1px solid " + colors.borderAlarmsRow,
        clear: "both",
        padding: "0px"
    },
    iconArrowDown: {
        display: "inline-block",
        lineHeight: "20px",
        verticalAlign: "middle",
        marginRight: "10px",
        transform: active ? "rotateY(180deg)" : null
    },
    iconChart: {
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
    }
});

var NotificationRow = React.createClass({
    propTypes: {
        element: IPropTypes.map.isRequired,
        elementId: PropTypes.any.isRequired,
        onClickPanel: PropTypes.func.isRequired,
        open: PropTypes.bool.isRequired
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
    render: function () {
        const {colors} = this.getTheme();
        const date = moment(this.props.element.get("date")).locale("it").format("LLL");
        return (
            <div style={styles(this.getTheme()).headerContainer}>
                <components.Button
                    className="pull-left"
                    onClick={partial(this.props.onClickPanel, [this.props.element.get("_id")])}
                    style={{
                        backgroundColor: colors.transparent,
                        border: "0px",
                        color: colors.mainFontColor,
                        boxShadow: "none",
                        minWidth: "auto",
                        width: "calc(100% - 105px)",
                        textAlign: "left"
                    }}
                >
                    <components.Icon
                        color={colors.mainFontColor}
                        icon={"arrow-down"}
                        size={"14px"}
                        style={styles(this.getTheme()).iconArrowDown}
                    />
                    <p style={styles(this.getTheme()).data}>{date}</p>
                    <h5 style={styles(this.getTheme()).sensorName}>{this.props.element.get("name")}</h5>
                </components.Button>
                <components.Button
                    className="pull-right"
                    style={{
                        backgroundColor: colors.transparent,
                        border: "0px",
                        width: "71px"
                    }}
                >
                    <components.Icon
                        color={colors.iconAlarmsChart}
                        icon={"chart"}
                        size={"34px"}
                        style={styles(this.getTheme()).iconChart}
                    />
                </components.Button>
            </div>
        );
    }
});

module.exports = NotificationRow;
