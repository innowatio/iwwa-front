
import * as bootstrap from "react-bootstrap";
var DateTimePicker = require("react-widgets").DateTimePicker;
import React, {PropTypes} from "react";
import components from "components";
import {defaultTheme} from "lib/theme";
import moment from "moment";
import {styles} from "lib/styles";
var Radium = require("radium");

const buttonExport = (theme) => ({
    display: "block",
    width: "260px",
    height: "260px",
    borderRadius: "100%",
    border: "0px",
    margin: "10% auto",
    backgroundColor: theme.colors.backgroundButtonExport
});

const dateTimePickerStyle = () => ({
    display: "block",
    width: "220px",
    height: "32px",
    border: "0px",
    margin: "10% auto"
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
                    style={buttonExport(theme)}
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
            <bootstrap.Col xs={6}>
                <components.Button
                    onClick={() => this.props.exportCsv(this.state.startDate, this.state.endDate)}
                    style={buttonExport(theme)}
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
            <div>
                <Radium.Style
                    rules={{
                        // Calendar CSS

                        "": {
                            backgroundColor: colors.backgroundCalendarExport,
                            borderTop: "0px",
                            borderLeft: "0px",
                            borderRight: "0px",
                            borderBottom: "1px solid " + colors.white
                        },
                        ":focus":{
                            outline: "none"
                        },
                        ".rw-calendar-popup": {
                            outline: "none"
                        },
                        ".rw-widget": {
                            //background: "none",
                            backgroundColor: colors.backgroundButtonExport,
                            outline: "none",
                            margin: "1px 0px",
                            paddingBottom: "15px",
                            borderColor: colors.borderButtonCalendar
                        },
                        ".rw-calendar-popup > div > table": {
                            borderTop: "1px solid " + colors.borderButtonCalendar
                        },
                        ".rw-calendar-popup table thead tr": {
                            border: "0px"
                        },
                        ".rw-state-focus": {
                            background: "none",
                            outline: "none"
                        },
                        ".rw-btn": {
                            textTransform: "uppercase",
                            textAlign: "center",
                            marginBottom: "10px",
                            outline: "none",
                            backgroundColor: colors.backgroundButtonExport
                        },

                        ".rw-calendar .rw-header .rw-btn-view": {
                            backgroundColor: colors.backgroundButtonExport
                        },

                        ".rw-select": {
                            backgroundColor: colors.backgroundButtonExport
                        },

                        ".rw-off-range": {
                            backgroundColor: "#3e50b4"
                        },
                        ".rw-now": {
                            border: `1px solid ${colors.buttonPrimary} !important`
                        },
                        ".rw-btn .rw-state-focus": {
                            border: "1px solid " + colors.borderButtonCalendar,
                            boxShadow: "none",
                            WebkitBoxShadow: "none",
                            backgroundColor: colors.backgroundContentModal,
                            colors: colors.white,
                            outline: "none"
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
                        ".rw-calendar-grid td .rw-btn": {
                            borderRadius: "30px",
                            border: `1px solid ${colors.borderButtonCalendar}`,
                            width: "90%",
                            margin: "5px 5%",
                            padding: "0px",
                            color: colors.white
                        },
                        ".rw-header": {
                            margin: "15px 10px 10px 10px",
                            padding: "0px"
                        },
                        ".rw-popup .rw-widget .rw-header .rw-btn-view": {
                            backgroundColor: colors.backgroundContentModal,
                            borderLeft: "0px",
                            borderRight: "0px",
                            borderRadius: "0px",
                            borderTop: `1px solid ${colors.borderButtonCalendar}`,
                            borderBottom: `1px solid ${colors.borderButtonCalendar}`,
                            width: "90%",
                            height: "34px",
                            color: colors.white,
                            outline: "none"
                        },
                        ".rw-popup .rw-widget .rw-header .rw-btn-left": {
                            borderTop: `1px solid ${colors.backgroundButtonExport}`,
                            borderBottom: `1px solid ${colors.backgroundButtonExport}`,
                            borderLeft: `1px solid ${colors.backgroundButtonExport}`,
                            borderRight: "0px",
                            // backgroundImage: `url(${icons.iconArrowLeft})`,
                            backgroundPosition: "center",
                            width: "5%",
                            height: "34px",
                            backgroundSize: "15px 15px",
                            backgroundRepeat: "no-repeat",
                            borderBottomLeftRadius: "30px",
                            borderTopLeftRadius: "30px",
                            outline: "none"
                        },
                        ".rw-i": {
                            display: "none"
                        },
                        ".rw-widget .rw-header .rw-btn-right": {
                            borderTop: `1px solid ${colors.backgroundButtonExport}`,
                            borderBottom: `1px solid ${colors.backgroundButtonExport}`,
                            borderRight: `1px solid ${colors.backgroundButtonExport}`,
                            borderLeft: "0px",
                            // backgroundImage: `url(${icons.iconArrowRightWhite})`,
                            backgroundPosition: "center",
                            width: "5%",
                            height: "34px",
                            backgroundSize: "15px 15px",
                            backgroundRepeat: "no-repeat",
                            borderBottomRightRadius: "30px",
                            borderTopRightRadius: "30px",
                            outline: "none"
                        },
                        ".rw-calendar-grid .rw-nav-view": {
                            outline: "none"
                        }
                    }}
                />
                <bootstrap.Col xs={3}>
                    <DateTimePicker
                        defaultValue={startDate}
                        onChange={(value) => this.setState({startDate: value})}
                        time={false}
                        style={dateTimePickerStyle(theme)}
                    />
                </bootstrap.Col>
                <bootstrap.Col xs={3}>
                    <DateTimePicker
                        defaultValue={endDate}
                        onChange={(value) => this.setState({endDate: value})}
                        time={false}
                        style={dateTimePickerStyle(theme)}
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
            </div>
        );
    }
});

module.exports = Export;
