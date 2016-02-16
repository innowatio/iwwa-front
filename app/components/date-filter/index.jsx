var R               = require("ramda");
var Radium          = require("radium");
var React           = require("react");
var Calendar        = require("react-widgets").Calendar;
var moment          = require("moment");
var momentLocalizer = require("react-widgets/lib/localizers/moment");

import {ButtonGroupSelect} from "components";
import {defaultTheme} from "lib/theme";
import {styles} from "lib/styles_restyling";
import icons from "lib/icons";

const styleDateFilter = ({colors}) => ({
    borderRadius: "30px",
    outline: "0px",
    marginLeft: "30px",
    marginRight: "30px",
    backgroundColor: colors.backgroundCalendar,
    opacity: 0.8,
    border: `1px solid ${colors.white}`,
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
        border: `1px solid ${theme.colors.white}`,
        width: "17%",
        minWidth: "200px",
        height: "41px",
        marginRight: "8px",
        fontSize: "14px"
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
                start: moment.utc().startOf("month").valueOf(),
                end: moment.utc().endOf("month").valueOf(),
                valueType: {label: "calendario", key: "calendar"}
            }
        };
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    setMonthlyDate: function (dateValue) {
        const startDate = moment.utc(dateValue).valueOf();
        // Add one day to avoid to go in the past month.
        const endDate = moment.utc(dateValue).add({day: 1}).endOf("month").valueOf();
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
                start: moment.utc().subtract({day: 1}).startOf("day").valueOf(),
                end: moment.utc().subtract({day: 1}).endOf("day").valueOf(),
                valueType: temporalFilter
            });
            break;
        case "today":
            this.props.onChange({
                start: moment.utc().startOf("day").valueOf(),
                end: moment.utc().endOf("day").valueOf(),
                valueType: temporalFilter
            });
            break;
        case "lastWeek":
            this.props.onChange({
                start: moment.utc().subtract({week: 1}).startOf("isoWeek").valueOf(),
                end: moment.utc().subtract({week: 1}).endOf("isoWeek").valueOf(),
                valueType: temporalFilter
            });
            break;
        case "currentWeek":
            this.props.onChange({
                start: moment.utc().startOf("isoWeek").valueOf(),
                end: moment.utc().endOf("isoWeek").valueOf(),
                valueType: temporalFilter
            });
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
                            border: "1px solid" + colors.white,
                            boxShadow: "none",
                            WebkitBoxShadow: "none",
                            backgroundColor: colors.backgroundCalendar,
                            colors: colors.white
                        },
                        ".rw-state-focus:hover": {
                            borderColor: colors.white,
                            boxShadow: "none",
                            WebkitBoxShadow: "none"
                        },
                        ".rw-state-focus:click": {
                            borderColor: colors.white,
                            boxShadow: "none",
                            WebkitBoxShadow: "none"
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
                            border: `1px solid ${colors.white}`,
                            width: "90%",
                            marginLeft: "8%",
                            color: colors.white
                        },
                        ".rw-header": {
                            marginLeft: "2%",
                            marginTop: "2%"
                        },
                        ".rw-calendar .rw-header .rw-btn-view": {
                            backgroundColor: colors.backgroundCalendar,
                            borderLeft: "0px",
                            borderRight: "0px",
                            borderRadius: "0px",
                            borderTop: `1px solid ${colors.white}`,
                            borderBottom: `1px solid ${colors.white}`,
                            width: "89.3%",
                            color: colors.white,
                            outline: "none"
                        },
                        ".rw-calendar .rw-header .rw-btn-left": {
                            borderTop: `1px solid ${colors.white}`,
                            borderBottom: `1px solid ${colors.white}`,
                            borderLeft: `1px solid ${colors.white}`,
                            borderRight: "0px",
                            backgroundImage: `url(${icons.iconArrowLeft})`,
                            backgroundPosition: "center",
                            width: "5%",
                            height: "34px",
                            backgroundSize: "37px 37px",
                            backgroundRepeat: "no-repeat",
                            borderBottomLeftRadius: "30px",
                            borderTopLeftRadius: "30px",
                            outline: "none"
                        },
                        ".rw-i": {
                            display: "none"
                        },
                        ".rw-calendar .rw-header .rw-btn-right": {
                            borderTop: `1px solid ${colors.white}`,
                            borderBottom: `1px solid ${colors.white}`,
                            borderRight: `1px solid ${colors.white}`,
                            borderLeft: "0px",
                            backgroundImage: `url(${icons.iconArrowRightWhite})`,
                            backgroundPosition: "center",
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
                        "button.btn.btn-default:hover": {
                            background: `${colors.buttonPrimary} !important`,
                            border: "none !important"
                        }
                    }}
                    scopeSelector=".date-filter"
                />
                <div style={styleDateFilter(this.getTheme())}>
                    <Calendar
                        className="centering"
                        culture="it"
                        finalView="decade"
                        format="DD MMM YYYY"
                        initialView="year"
                        monthFormat="MMMM"
                        onChange={this.setMonthlyDate}
                        style={styleCalendar(this.getTheme())}
                        value={this.props.value.valueType.key === "calendar" ? new Date(this.props.value.start) : null}
                    />
                    <div style={{borderTop: `1px solid ${colors.white}`}} />
                    <div style={{marginTop: "4%", display: "flex", justifyContent: "center"}}>
                        <ButtonGroupSelect
                            allowedValues={this.getTemporalFilter()}
                            getKey={R.prop("key")}
                            getLabel={R.prop("label")}
                            onChange={this.setTimeInterval}
                            style={styleButtonGroupSelect(this.getTheme())}
                            styleToMergeWhenActiveState={{background: colors.buttonPrimary, border: "none"}}
                            value={[this.props.value.valueType]}
                        />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Radium(DateFilter);
