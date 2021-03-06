import color from "color";

import measures from "lib/measures";

export const styles = (theme) => ({
    pageContent: {
        position: "relative",
        display: "block",
        color: theme.colors.white,
        textAlign: "center"
    },
    titleFullScreenModal: {
        color: theme.colors.mainFontColor,
        marginTop: "0px",
        marginBottom: "50px",
        fontWeight: "400",
        fontSize: "28px"
    },
    titleFullScreenModalExport: {
        color: theme.colors.white,
        marginTop: "0px",
        marginBottom: "50px",
        fontWeight: "400",
        fontSize: "28px"
    },
    base: {
        display: "flex",
        justifyContent: "space-between",
        padding: "15px",
        width: "100%",
        height: "100%"
    },
    chartDropdownSelect: {
        backgroundColor: theme.colors.backgroundDropdown,
        color: theme.colors.white,
        outline: "none",
        fontSize: "15px",
        fontWeight: "300",
        whiteSpace: "nowrap"
    },
    chartPopover:{
        background: theme.colors.backgroundDropdown
    },
    buttonSelectChart: {
        position: "relative",
        background: theme.colors.backgroundChartButton,
        color: theme.colors.textChartButton,
        marginRight: "9px",
        marginTop: "6px",
        fontSize: "12px",
        border: `1px solid ${theme.colors.borderChartButton}`,
        borderRadius: "30px",
        fontWeight: "300"
    },
    colVerticalPadding: {
        paddingTop: "10px",
        paddingBottom: "15px",
        paddingLeft: "0px",
        paddingRight: "0px"
    },
    flexBase: {
        display: "flex"
    },
    flexCentered: {
        justifyContent: "center",
        alignItems: "center"
    },
    mainDivStyle: {
        width: "98%",
        marginLeft: "1%",
        marginTop: "1%",
        borderRadius: "3px",
        overflow: "hidden",
        padding: "10px",
        height: measures.mainComponentHeight
    },
    mainDivStyleScroll: {
        width: "98%",
        marginLeft: "1%",
        marginTop: "1%",
        borderRadius: "3px",
        overflow: "auto",
        padding: "10px",
        height: "100%"
    },
    titlePage: {
        width: "100%",
        color: theme.colors.titlePage,
        backgroundColor: theme.colors.backgroundTitlePage,
        paddingLeft: "10px",
        paddingRight: "10px",
        height: "56px",
        display: "flex",
        position: "relative"
    },
    titlePageMonitoring: {
        width: "100%",
        color: theme.colors.titlePage,
        backgroundColor: theme.colors.backgroundTitlePage,
        paddingLeft: "10px",
        paddingRight: "10px",
        height: "56px"
    },
    labelStyle: {
        width: "100%",
        color: theme.colors.mainFontColor,
        fontSize: "16px",
        fontWeight: "400",
        margin: "10px 0px 20px 0px"
    },
    inputLine: {
        borderTop: "0px",
        borderLeft: "0px",
        borderRight: "0px",
        borderRadius: "0px",
        WebkitBoxShadow: "none",
        boxShadow: "none",
        background: "none",
        fontSize: "16px",
        fontWeight: "300",
        outline: "none",
        padding: "0px",
        color: theme.colors.mainFontColor
    },
    inputRange: {
        width: "100%",
        height: "12px !important",
        borderRadius: "20px",
        padding: "0px",
        border: "0px",
        backgroundColor: theme.colors.alarmRangeBar,
        WebkitBoxShadow: "none",
        WebkitAppearance: "none",
        boxShadow: "none",
        outline: "0px"
    },
    inputRangeBar: {
        "::-webkit-slider-thumb": {
            WebkitAppearance: "none",
            backgroundColor: theme.colors.alarmRangePoint,
            width: "22px",
            height: "22px",
            borderRadius: "100%"
        }
    },
    divAlarmOpenModal: {
        height: "35px",
        width: "100%",
        borderBottom: `1px solid ${theme.colors.borderInputSettingsAlarm}`,
        cursor: "pointer",
        color: theme.colors.textSelectButton,
        fontSize: "16px",
        fontWeight: "300"
    },
    titleTab: {
        color: theme.colors.titleTabColor,
        fontSize: "16pt"
    },
    tabForm: {
        ".nav-tabs.nav > .active > a": {
            color: theme.colors.titleTabColor,
            backgroundColor: theme.colors.white,
            width: "200px",
            textAlign: "center"
        },
        ".nav-tabs.nav > li > a": {
            backgroundColor: theme.colors.primary,
            color: theme.colors.white,
            width: "200px",
            textAlign: "center"
        },
        ".tabbed-area > div": {
            height: "100%"
        },
        ".tab-content": {
            height: "82%",
            borderBottom: "solid 1px " + color(theme.colors.black).alpha(0.1).rgbString(),
            borderRight: "solid 1px " + color(theme.colors.black).alpha(0.1).rgbString(),
            borderLeft: "solid 1px " + color(theme.colors.black).alpha(0.1).rgbString(),
            borderTop: "0px",
            boxShadow: "2px 2px 5px " + theme.colors.greySubTitle
        }
    },
    tabsStyle: {
        "ul": {
            border: "0px",
            height: "56px",
            backgroundColor: theme.colors.secondary
        },
        "ul li": {
            color: theme.colors.mainFontColor,
            margin: "0 1.5%"
        },
        "ul li a": {
            height: "55px",
            lineHeight: "55px",
            fontSize: "17px",
            textTransform: "uppercase",
            padding: "0px 4px"
        },
        ".nav-tabs > li > a": {
            height: "44px",
            color: theme.colors.white,
            border: "0px",
            outline: "none",
            borderBottom: "3px solid " + theme.colors.secondary
        },
        ".nav-tabs > li:hover > a:hover": {
            fontWeight: "400"
        },
        ".nav-tabs > li.active > a, .nav-tabs > li > a:hover, .nav-tabs > li.active > a:hover, .nav-tabs > li.active > a:focus": {
            height: "44px",
            fontSize: "17px",
            fontWeight: "500",
            color: theme.colors.white,
            border: "0px",
            borderRadius: "0px",
            outline: "none",
            backgroundColor: theme.colors.secondary,
            borderBottom: "3px solid" + theme.colors.buttonPrimary,
            outlineStyle: "none",
            outlineWidth: "0px"
        },
        ".nav > li > a:hover, .nav > li > a:focus": {
            background: theme.colors.transparent
        }
    },
    consumptionsProgressBar: {
        ".progress": {
            fontSize: "10px",
            lineHeight: "0",
            height: "12px",
            borderRadius: "6px",
            backgroundColor: theme.colors.consumptionprogressBarBackground
        },
        ".progress-bar": {
            fontSize: "10px",
            lineHeight: "10px",
            height: "12px",
            borderRadius: "6px"
        },
        ".progress-bar-danger": {
            backgroundColor: theme.colors.consumptionprogressBarAlert
        },
        ".progress-bar-info": {
            backgroundColor: theme.colors.consumptionprogressBarInfo
        },
        ".progress-title": {
            fontSize: "18px",
            color: theme.colors.consumptionsText
        },
        ".progress-max": {
            fontSize: "16px",
            color: theme.colors.consumptionsText
        }
    },
    formFields: {
        "": {
            margin: "0 15% 0 15%",
            border: "1px solid " + theme.colors.borderContentModal,
            borderRadius: "20px",
            minHeight: "400px",
            height: "auto !important",
            maxHeight: "auto !important",
            backgroundColor: theme.colors.backgroundContentModal
        },
        ".form-group": {
            marginBottom: "0px"
        },
        ".col-xs-12": {
            padding: "0px",
            margin: "0px"
        },
        ".form-control:focus": {
            outline: "0px",
            outlineStyle: "none",
            outlineWidth: "0px",
            borderColor: theme.colors.textGrey
        },
        ".has-error .help-block": {
            width: "auto",
            float: "right",
            borderRadius: "5px",
            fontSize: "12px",
            fontWeight: "300",
            backgroundColor: theme.colors.textError,
            padding: "5px",
            marginTop: "5px",
            color: theme.colors.white
        },
        ".has-error .form-control": {
            borderColor: theme.colors.textError
        }
    },
    sensorModalSelect: {
        "": {
            cursor: "pointer",
            borderColor: theme.colors.textGrey,
            outline: "0px",
            outlineStyle: "none",
            outlineWidth: "0px",
            color: theme.colors.textGrey
        },
        ".Select-control": {
            outline: "0px",
            outlineStyle: "none",
            outlineWidth: "0px",
            overflow: "hidden",
            position: "relative",
            width: "100%",
            backgroundColor: theme.colors.transparent,
            color: theme.colors.white,
            fontSize: "16px",
            fontWeight: "300",
            padding: "0px",
            border: 0,
            borderRadius: "0px",
            borderBottom: "1px solid " + theme.colors.borderInputSearch
        },
        ".Select-noresults": {
            boxSizing: "border-box",
            color: theme.colors.white,
            fontSize: "15px",
            fontWeight: "300",
            cursor: "default",
            display: "block",
            padding: "8px 10px",
            backgroundColor: theme.colors.backgroundContentModal
        },
        ".Select-placeholder": {
            padding: "0px"
        },
        ".Select-arrow-zone > .Select-arrow": {
            borderColor: `${theme.colors.white} ${theme.colors.transparent} ${theme.colors.transparent}`
        },
        ".Select-control:not(.is-searchable) > .Select-input": {
            outline: "0px",
            outlineStyle: "none",
            outlineWidth: "0px",
            borderColor: theme.colors.borderInputSearch,
            boxShadow: "none"
        },
        ".is-focused:not(.is-open) > .Select-control": {
            outline: "0px",
            outlineStyle: "none",
            outlineWidth: "0px",
            borderColor: theme.colors.borderInputSearch,
            boxShadow: "none"
        },
        ".Select-input": {
            display: "block !important",
            width: "100%",
            padding: "0px"
        },
        ".Select-menu-outer": {
            boxShadow: "none",
            boxSizing: "border-box",
            marginTop: "-1px",
            maxHeight: "200px",
            position: "absolute",
            top: "100%",
            width: "100%",
            zIndex: "1",
            WebkitOverflowScrolling: "touch",
            backgroundColor: theme.colors.backgroundMenuSelect,
            border: "1px solid " + theme.colors.borderInputSearch,
            borderBottomRightRadius: "10px",
            borderBottomLeftRadius: "10px",
            color: theme.colors.mainFontColor,
            overflow: "hidden"
        },
        ".Select-menu": {
            maxHeight: "198px",
            overflowY: "auto"
        },
        ".Select-value-label": {
            lineHeight: "18px",
            color: theme.colors.white + "!important",
            padding: "0 10px 0 0"
        },
        ".Select-option": {
            boxSizing: "border-box",
            backgroundColor: theme.colors.backgroundMenuSelect,
            borderBottom: "1px solid " + theme.colors.borderInputSearch,
            color: theme.colors.mainFontColor + "!important",
            fontSize: "15px",
            fontWeight: "300",
            cursor: "pointer",
            display: "block",
            padding: "8px 10px"
        },
        ".Select-option:last-child": {
            borderBottomRightRadius: "9px",
            borderBottomLeftRadius: "9px",
            borderBottom: "0px"
        },
        ".Select-option.is-selected, .Select-option:hover": {
            backgroundColor: theme.colors.buttonPrimary,
            color: theme.colors.white
        },
        ".Select-value": {
            borderColor: theme.colors.white,
            color: theme.colors.white,
            borderRadius: "20px",
            fontSize: "14px",
            lineHeight: "16px",
            paddingBottom: "2px",
            marginLeft: "0px",
            marginRight: "5px",
            marginBottom: "3px",
            overflow: "hidden"
        },
        ".Select-value-icon": {
            borderColor: theme.colors.transparent,
            borderRight: "0px !important",
            padding: "0px 10px"
        },
        ".Select-value-icon:hover, .Select-value-icon:active": {
            color: theme.colors.white,
            backgroundColor: theme.colors.transparent
        }
    }
});
