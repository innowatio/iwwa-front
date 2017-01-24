
import * as bootstrap from "react-bootstrap";
var DateTimePicker = require("react-widgets").DateTimePicker;
import React, {PropTypes} from "react";
import components from "components";
import {defaultTheme} from "lib/theme";
import icons from "lib/icons";
import moment from "moment";
import {styles} from "lib/styles";
var Radium = require("radium");

const exportStyle = (theme) => ({
    iconArrow: {
        position: "absolute",
        right: "8px",
        top: "12px",
        lineHeight: "1px"
    },
    buttonExport: {
        display: "block",
        width: "260px",
        height: "260px",
        borderRadius: "100%",
        border: "0px",
        margin: "10% auto",
        backgroundColor: theme.colors.backgroundButtonExport
    },
    pickerWrp: {
        marginHeight: "260px",
        margin: "10% auto"
    },
    dateTimePickerStyle: {
        display: "block",
        height: "42px",
        border: "0px"
    }
});

var Export = React.createClass({
    propTypes: {
        exportCsv: PropTypes.func,
        exportEnd: PropTypes.number,
        exportPng: PropTypes.func,
        exportStart: PropTypes.number,
        title: PropTypes.string
    },
    contextTypes: {
        theme: PropTypes.object
    },

    getInitialState: function () {
        return {
            startDate: this.props.exportStart,
            endDate: this.props.exportEnd
        };
    },

    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    renderExportButtonPng: function (theme) {
        return (
            <bootstrap.Col xs={6}>
                <components.Button
                    onClick={this.props.exportPng}
                    style={exportStyle(theme).buttonExport}
                >
                    <components.Icon
                        color={theme.colors.iconExport}
                        icon={"file-png"}
                        size={"200px"}
                        style={{verticalAlign: "middle"}}
                    />
                </components.Button>
            </bootstrap.Col>
        );
    },
    renderExportButtonCsv: function (theme) {
        return (
            <bootstrap.Col xs={12} sm={12} md={6}>
                <components.Button
                    onClick={() => this.props.exportCsv(this.state.startDate, this.state.endDate)}
                    style={exportStyle(theme).buttonExport}
                >
                    <components.Icon
                        color={theme.colors.iconExport}
                        icon={"file-csv"}
                        size={"200px"}
                        style={{verticalAlign: "middle"}}
                    />
                </components.Button>
            </bootstrap.Col>
        );
    },

    renderDateTimePicker: function (theme) {
        const startDate = moment(this.props.exportStart).toDate();
        const endDate = moment(this.props.exportEnd).toDate();
        const {colors} = theme;
        return (
            <div style={{
                diplay: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Radium.Style
                    rules={{
                        // Calendar CSS
                        ".rw-input": {
                            height: "42px"
                        },
                        ":focus, .rw-state-focus":{
                            outline: "none"
                        },
                        ".rw-btn-calendar.rw-btn": {
                            width: "40px",
                            backgroundImage: `url(${icons.iconArrowRightWhite})`,
                            backgroundColor: colors.backgroundButtonExport,
                            borderBottomRightRadius: "4px",
                            borderTopRightRadius: "4px"
                        },
                        ".rw-btn-calendar.rw-btn > .rw-i": {
                            display: "none"
                        },
                        ".rw-widget>.rw-select": {
                            display: "block",
                            width: "40px"
                        },
                        ".rw-calendar": {
                            backgroundColor: colors.backgroundContentModal,
                            border: "1px solid " + colors.borderContentModal
                        },
                        ".rw-widget": {
                            width: "100%"
                        },
                        ".rw-popup.rw-widget.rw-calendar.rw-widget": {
                            width: "100%"
                        },
                        ".rw-widget.rw-open": {
                            outline: "none",
                            width: "100%"
                        },
                        ".rw-btn-view.rw-btn": {
                            backgroundColor: colors.transparent,
                            color: colors.white,
                            fontWeight: "300",
                            textTransform: "uppercase"
                        },
                        ".rw-header": {
                            backgroundColor: colors.secondary,
                            padding: "20px",
                            borderBottom: "1px solid " + colors.borderContentModal
                        },
                        ".rw-calendar .rw-header > .rw-i": {
                            color: colors.transparent
                        },
                        ".rw-btn, .rw-i": {
                            color: colors.transparent
                        },
                        ".rw-i": {
                            display: "block",
                            width: "35px",
                            height: "30px"
                        },
                        ".rw-i-caret-right": {
                            float: "right",
                            backgroundPosition: "center right",
                            backgroundImage: `url(${icons.iconArrowRightWhite})`,
                            backgroundRepeat: "no-repeat",
                            color: colors.transparent
                        },
                        ".rw-i-caret-left": {
                            float: "left",
                            backgroundPosition: "center left",
                            backgroundImage: `url(${icons.iconArrowLeft})`,
                            backgroundRepeat: "no-repeat",
                            color: colors.transparent
                        },
                        ".rw-calendar .rw-header .rw-btn-view": {
                            backgroundColor: colors.transparent,
                            textTransform: "uppercase"
                        },
                        ".rw-calendar-popup table thead tr": {
                            border: "0px",
                            fontWeight: "300 !important",
                            textTransform: "uppercase",
                            color: colors.white
                        },
                        ".rw-calendar-popup table thead tr th": {
                            fontWeight: "300 !important"
                        },
                        ".rw-calendar-grid th": {
                            paddingTop: "5px",
                            paddingBottom: "15px"
                        },
                        ".rw-calendar-popup > div > table": {
                            color: colors.white,
                            margin: "10px 0",
                            textTransform: "uppercase",
                            borderTop: "1px solid " + colors.borderButtonCalendar
                        },
                        ".rw-calendar-grid td .rw-btn": {
                            border: "0",
                            width: "100%",
                            margin: "4px 5%",
                            padding: "0px",
                            color: colors.white
                        },
                        ".rw-calendar .rw-footer .rw-btn": {
                            backgroundColor: colors.secondary,
                            padding: "10px",
                            color: colors.white
                        },
                        ".rw-calendar .rw-footer .rw-btn:hover": {
                            backgroundColor: colors.secondary,
                            padding: "10px",
                            color: colors.white
                        },
                        ".rw-header .rw-btn-view": {
                            width: "100%",
                            margin: "0"
                        },
                        ".rw-calendar-grid td .rw-btn.rw-off-range": {
                            color: colors.secondary
                        },
                        ".rw-now": {
                            border: `1px solid ${colors.buttonPrimary} !important`
                        },
                        ".rw-btn .rw-state-focus": {
                            boxShadow: "none",
                            WebkitBoxShadow: "none",
                            colors: colors.white,
                            outline: "none"
                        },
                        ".rw-state-focus": {
                            border: "1px solid " + colors.buttonPrimary,
                            backgroundColor: colors.transparent + " !important"
                        },
                        ".rw-state-focus:hover": {
                            borderColor: colors.borderButtonCalendar,
                            boxShadow: "none",
                            WebkitBoxShadow: "none"
                        },
                        ".rw-state-focus:click": {
                            borderColor: colors.borderButtonCalendar,
                            boxShadow: "none",
                            WebkitBoxShadow: "none",
                            outline: "none"
                        },
                        ".rw-state-selected": {
                            backgroundColor: colors.buttonPrimary,
                            color: colors.white,
                            border: "none !important"
                        },
                        ".rw-calendar-grid td .rw-btn:hover": {
                            backgroundColor: colors.buttonPrimary,
                            color: colors.white,
                            border: "none"
                        },
                        ".rw-popup": {
                            width: "100%",
                            padding: "0 !important",
                            borderRadius: "4px"
                        },
                        ".rw-popup .rw-widget .rw-header .rw-btn-view": {
                            backgroundColor: colors.backgroundContentModal,
                            borderLeft: "0px",
                            borderRight: "0px",
                            borderRadius: "0px",
                            borderTop: `1px solid ${colors.borderButtonCalendar}`,
                            borderBottom: `1px solid ${colors.borderButtonCalendar}`,
                            width: "100%",
                            padding: "0",
                            height: "34px",
                            color: colors.white,
                            outline: "none"
                        }
                    }}
                />
                <bootstrap.Col xs={12} sm={6} md={3} style={exportStyle(theme).pickerWrp}>
                    <DateTimePicker
                        defaultValue={startDate}
                        onChange={(value) => this.setState({startDate: parseInt(moment(value).format("x"))})}
                        time={false}
                        style={exportStyle(theme).dateTimePickerStyle}
                    />
                </bootstrap.Col>
                <bootstrap.Col xs={12} sm={6} md={3} style={exportStyle(theme).pickerWrp}>
                    <DateTimePicker
                        defaultValue={endDate}
                        onChange={(value) => this.setState({endDate: parseInt(moment(value).format("x"))})}
                        time={false}
                        style={exportStyle(theme).dateTimePickerStyle}
                    />
                </bootstrap.Col>
            </div>
        );
    },

    render: function () {
        const theme = this.getTheme();
        return (
            <div>
                <h3 className="text-center" style={styles(this.getTheme()).titleFullScreenModalExport}>
                    {this.props.title}
                </h3>
                {this.renderDateTimePicker(theme)}
                {this.renderExportButtonCsv(theme)}
                {/* this.renderExportButtonPng(theme)*/}
                <div style={{clear: "both"}}></div>
            </div>
        );
    }
});

module.exports = Export;
