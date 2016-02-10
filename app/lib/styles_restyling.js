import color from "color";

import measures from "lib/measures";

export const styles = (theme) => ({
    base: {
        display: "flex",
        justifyContent: "space-between",
        padding: "15px",
        width: "100%",
        height: "100%"
    },
    buttonSelectChart: {
        background: theme.colors.backgroundSelectButton,
        color: theme.colors.selectButton,
        marginRight: "9px",
        marginTop: "6px",
        fontSize: "12px",
        border: "0px none",
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
        boxShadow: "2px 2px 5px " + theme.colors.mainDivShadow,
        height: measures.mainComponentHeight
    },
    tabbedArea: {
        width: "96%",
        marginLeft: "2%",
        marginTop: "1%",
        height: "calc(100vh - 150px)",
        borderRadius: "3px",
        overflow: "hidden"
    },
    titlePage: {
        width: "100%",
        color: theme.colors.white,
        backgroundColor: theme.colors.titlePage,
        paddingLeft: "10px",
        paddingRight: "10px",
        marginTop: "-20px",
        height: "56px"
    },
    inputLine: {
        borderTop: "0px",
        borderLeft: "0px",
        borderRight: "0px",
        borderRadius: "0px",
        WebkitBoxShadow: "none",
        boxShadow: "none"
    },
    inputRange: {
        width: "80%",
        marginLeft: "10%",
        backgroundColor: theme.colors.greyBackground,
        padding: "0px",
        border: "0px",
        WebkitBoxShadow: "none",
        boxShadow: "none",
        outline: "0px"
    },
    divAlarmOpenModal: {
        height: "34px",
        width: "100%",
        borderBottom: "1px solid" + theme.colors.greyBorder,
        cursor: "pointer"
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
    }
});
