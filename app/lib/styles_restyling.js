import color from "color";

import measures from "lib/measures";

export const styles = (theme) => ({
    titleFullScreenModal: {
        color: theme.colors.mainFontColor,
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
    chartDropdownButton: {
        border: "1px solid " + theme.colors.borderDropdown,
        backgroundColor: theme.colors.backgroundDropdown,
        color: theme.colors.white,
        outline: "none",
        fontSize: "15px",
        fontWeight: "300"
    },
    chartPopover:{
        background: theme.colors.backgroundDropdown
    },
    buttonSelectChart: {
        position: "relative",
        background: theme.colors.backgroundSelectButton,
        color: theme.colors.selectButton,
        marginRight: "9px",
        marginTop: "96px",
        fontSize: "12px",
        border: `1px solid ${theme.colors.borderSelectButton}`,
        borderRadius: "30px"
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
    titlePage: {
        width: "100%",
        color: theme.colors.white,
        backgroundColor: theme.colors.titlePage,
        paddingLeft: "10px",
        paddingRight: "10px",
        height: "56px",
        display: "flex",
        position: "relative"
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
        outline: "none",
        padding: "0 5px",
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
        borderBottom: "1px solid" + theme.colors.white,
        cursor: "pointer",
        color: theme.colors.textSelectButton,
        fontSize: "16px",
        fontWeight: "300"
    },
    titleTab: {
        color: theme.colors.titleColor,
        fontSize: "16pt"
    },
    tabForm: {
        ".nav-tabs.nav > .active > a": {
            color: theme.colors.titleColor,
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
            backgroundColor: theme.colors.consumptionprogressBarBackground,
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
    }
});
