import React, {PropTypes} from "react";
import {defaultTheme} from "lib/theme";

const styles = (theme) => ({
    pinpointContainer: {
        position: "absolute",
        left: -20 / 2,
        top: -20 / 2
    },
    pinpoint: {
        width: "20px",
        height: "20px",
        padding: "4px",
        mozTransform: "rotate(45deg)",
        webkitTransform: "rotate(45deg)",
        backgroundColor: theme.colors.transparent,
        border: "2px solid " + theme.colors.buttonPrimary,
        borderRadius: "30px",
        borderBottomRightRadius: "0px"
    }
});

// style={styles(theme).pinpointWrp}

var SiteMarker = React.createClass({
    propTypes: {
        siteId: PropTypes.string
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    viewSiteInfo: function () {
        console.log("triggered");
    },
    render: function () {
        const theme = this.getTheme();
        return (
            <div style={styles(theme).pinpointContainer}>
                <div style={styles(theme).pinpoint}>

                </div>
            </div>
        );
    }
});

module.exports = SiteMarker;
