var R               = require("ramda");
var Radium          = require("radium");
var React           = require("react");
var Calendar        = require("react-widgets").Calendar;
var momentLocalizer = require("react-widgets/lib/localizers/moment");

import {ButtonGroupSelect} from "components";
import {defaultTheme} from "lib/theme";
import {styles} from "lib/styles";
import icons from "lib/icons";
import get from "lodash.get";
import moment from "lib/moment";

const styleDateFilter = ({colors}) => ({
    borderRadius: "20px",
    outline: "0px",
    marginLeft: "30px",
    marginRight: "30px",
    backgroundColor: colors.backgroundContentModal,
    border: `1px solid ${colors.borderContentModal}`,
    height: "55vh",
    minHeight: "400px"
});

const styleCalendar = ({colors}) => ({
    outline: "0px",
    backgroundColor: colors.transparent,
    border: "0px",
    width: "91%",
    marginLeft: "4.5%"
});

const styleButtonGroupSelect = (theme) => R.merge(
    styles(theme).buttonSelectChart, {
        background: theme.colors.transparent,
        border: `1px solid ${theme.colors.borderButtonCalendar}`,
        color: theme.colors.mainFontColor,
        width: "17%",
        minWidth: "200px",
        height: "41px",
        marginRight: "8px",
        fontSize: "14px",
        fontWeight: "400"
    }
);

momentLocalizer(moment);

var DateFilter = React.createClass({
    propTypes: {
        getKey: React.PropTypes.func,
        getLabel: React.PropTypes.func,
        onChange: React.PropTypes.func.isRequired,
        title: React.PropTypes.node,
        value: React.PropTypes.shape({
            start: React.PropTypes.number,
            end: React.PropTypes.number,
            valueType: React.PropTypes.oneOfType([
                React.PropTypes.string,
                React.PropTypes.object
            ])
        })
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
    getDefaultProps: function () {
        return {
            value: {
                start: moment().startOf("month").valueOf(),
                end: moment().endOf("month").valueOf(),
                valueType: {label: "calendario", key: "calendar"}
            }
        };
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    setMonthlyDate: function (dateValue) {
        const startDate = moment(dateValue).valueOf();
        const endDate = moment(dateValue).endOf("month").valueOf();
        this.props.onChange({
            start: startDate,
            end: endDate,
            valueType: {label: "calendario", key: "calendar"}
        });
    },
    setTimeInterval: function ([temporalFilter]) {
        switch (temporalFilter.key) {
            case "yesterday":
                this.props.onChange({
                    start: moment().subtract({day: 1}).startOf("day").valueOf(),
                    end: moment().subtract({day: 1}).endOf("day").valueOf(),
                    valueType: temporalFilter
                });
                break;
            case "today":
                this.props.onChange({
                    start: moment().startOf("day").valueOf(),
                    end: moment().endOf("day").valueOf(),
                    valueType: temporalFilter
                });
                break;
            case "lastWeek":
                this.props.onChange({
                    start: moment().subtract({week: 1}).startOf("isoWeek").valueOf(),
                    end: moment().subtract({week: 1}).endOf("isoWeek").valueOf(),
                    valueType: temporalFilter
                });
                break;
            case "currentWeek":
                this.props.onChange({
                    start: moment().startOf("isoWeek").valueOf(),
                    end: moment().endOf("isoWeek").valueOf(),
                    valueType: temporalFilter
                });
                break;
        }
    },
    getTemporalFilter: function () {
        return [
            {label: "IERI", key: "yesterday"},
            {label: "OGGI", key: "today"},
            {label: "SETTIMANA CORRENTE", key: "currentWeek"},
            {label: "SETTIMANA SCORSA", key: "lastWeek"}
        ];
    },
    render: function () {
        const {colors} = this.getTheme();
        return (
            <div className="date-filter">
                <h3 className="text-center" style={styles(this.getTheme()).titleFullScreenModal}>
                    {this.props.title}
                </h3>
                <Radium.Style
                    rules={{
                        // Calendar CSS
                        ".rw-btn .rw-state-focus .rw-state-selected": {
                            backgroundColor: colors.primary
                        },
                        ".rw-state-focus": {
                            background: "none"
                        },
                        ".rw-btn": {
                            textTransform: "uppercase"
                        },
                        ".rw-now": {
                            border: `1px solid ${colors.buttonPrimary} !important`
                        },
                        ".rw-btn .rw-state-focus": {
                            border: "1px solid " + colors.borderButtonCalendar,
                            boxShadow: "none",
                            WebkitBoxShadow: "none",
                            backgroundColor: colors.backgroundButtonCalendar
                        },
                        ".rw-state-focus:hover": {
                            borderColor: colors.borderButtonCalendar,
                            boxShadow: "none",
                            WebkitBoxShadow: "none"
                        },
                        ".rw-state-focus:click": {
                            borderColor: colors.borderButtonCalendar,
                            boxShadow: "none",
                            WebkitBoxShadow: "none"
                        },
                        ".rw-state-selected": {
                            backgroundColor: colors.buttonPrimary,
                            color: colors.white + "!important",
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
                            marginLeft: "8%",
                            color: colors.mainFontColor
                        },
                        ".rw-header": {
                            marginLeft: "2%",
                            marginTop: "2%"
                        },
                        ".rw-calendar .rw-header .rw-btn-view": {
                            backgroundColor: colors.backgroundButtonCalendar,
                            borderLeft: "0px",
                            borderRight: "0px",
                            borderRadius: "0px",
                            borderTop: `1px solid ${colors.borderButtonCalendar}`,
                            borderBottom: `1px solid ${colors.borderButtonCalendar}`,
                            width: "89.3%",
                            color: colors.mainFontColor,
                            outline: "none"
                        },
                        ".rw-calendar .rw-header .rw-btn-left": {
                            borderTop: `1px solid ${colors.borderButtonCalendar}`,
                            borderBottom: `1px solid ${colors.borderButtonCalendar}`,
                            borderLeft: `1px solid ${colors.borderButtonCalendar}`,
                            borderRight: "0px",
                            backgroundImage: `url(${icons.iconArrowLeft})`,
                            backgroundPosition: "center",
                            backgroundColor: colors.backgroundCalendarArrowSwitch,
                            width: "5%",
                            height: "34px",
                            backgroundSize: "42px 42px",
                            backgroundRepeat: "no-repeat",
                            borderBottomLeftRadius: "30px",
                            borderTopLeftRadius: "30px",
                            outline: "none"
                        },
                        ".rw-i": {
                            display: "none"
                        },
                        ".rw-calendar .rw-header .rw-btn-right": {
                            borderTop: `1px solid ${colors.borderButtonCalendar}`,
                            borderBottom: `1px solid ${colors.borderButtonCalendar}`,
                            borderRight: `1px solid ${colors.borderButtonCalendar}`,
                            borderLeft: "0px",
                            backgroundImage: `url(${icons.iconArrowRightWhite})`,
                            backgroundPosition: "center",
                            backgroundColor: colors.backgroundCalendarArrowSwitch,
                            width: "5%",
                            height: "34px",
                            backgroundSize: "45px 45px",
                            backgroundRepeat: "no-repeat",
                            borderBottomRightRadius: "30px",
                            borderTopRightRadius: "30px",
                            outline: "none"
                        },
                        ".rw-calendar-grid .rw-nav-view": {
                            outline: "none"
                        },
                        ".rw-calendar-grid": {
                            outline: "none"
                        },
                        ".btn.btn-default:hover": {
                            background: `${colors.buttonPrimary} !important`,
                            border: "none !important",
                            color: colors.white + "!important"
                        },
                        ".rw-state-selected .btn-default": {
                            background: `${colors.buttonPrimary} !important`,
                            border: "none !important",
                            color: colors.white
                        },
                        ".rw-widget.rw-state-focus, .rw-widget.rw-state-focus:hover": {
                            outline: "none",
                            border: "none",
                            boxShadow: "none",
                            WebkitBoxShadow: "none"
                        }
                    }}
                    scopeSelector=".date-filter"
                />
                <div style={styleDateFilter(this.getTheme())}>
                    <Calendar
                        className="centering"
                        culture={window.navigator.language}
                        finalView="decade"
                        format="DD MMM YYYY"
                        initialView="year"
                        monthFormat="MMMM"
                        onChange={this.setMonthlyDate}
                        style={styleCalendar(this.getTheme())}
                        value={
                            get(this.props, "value.valueType.key") === "calendar" ?
                            new Date(this.props.value.start) :
                            null
                        }
                    />
                    <div style={{borderTop: `1px solid ${colors.borderButtonCalendar}`}} />
                    <div style={{marginTop: "4%", display: "flex", justifyContent: "center"}}>
                        <ButtonGroupSelect
                            allowedValues={this.getTemporalFilter()}
                            getKey={R.prop("key")}
                            getLabel={R.prop("label")}
                            onChange={this.setTimeInterval}
                            style={styleButtonGroupSelect(this.getTheme())}
                            styleToMergeWhenActiveState={{
                                background: colors.buttonPrimary,
                                color: colors.white,
                                border: "none"
                            }}
                            value={[this.props.value.valueType]}
                        />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Radium(DateFilter);
