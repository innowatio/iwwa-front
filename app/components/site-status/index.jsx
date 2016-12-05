import React, {PropTypes} from "react";
import * as bootstrap from "react-bootstrap";
import Radium from "radium";

import {defaultTheme} from "lib/theme";
import {
    Button,
    Icon
} from "components";

const styles = (theme) => ({
    iconOptionBtn: {
        float: "right",
        border: 0,
        backgroundColor: theme.colors.transparent
    },
    iconOption: {

    },
    siteWrp: {
        display: "block",
        marginBottom: "20px",
        minHeight: "100px",
        padding: "10px",
        textAlign: "left",
        border: `1px solid ${theme.colors.borderContentModal}`,
        backgroundColor: theme.colors.backgroundContentModal
    },
    siteHeader: {

    },
    siteName: {
        fontSize: "20px",
        display: "inline",
        fontWeight: "300"
    },
    sidebarTitle: {
        fontSize: "20px",
        display: "inline",
        fontWeight: "300"
    }
});

var SiteStatus = React.createClass({
    propTypes: {
        onClick: PropTypes.func,
        siteAddress: PropTypes.string.isRequired,
        siteName: PropTypes.string.isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    render: function () {
        const theme = this.getTheme();
        return (
            <bootstrap.Col xs={12} md={12} lg={6}>
                <div style={styles(theme).siteWrp}>
                    <div style={styles(theme).siteHeader}>
                        <h2 style={styles(theme).siteName}>
                            {this.props.siteName}
                        </h2>
                        <span>{this.props.siteAddress}</span>
                        <Button
                            className="button-option"
                            onClick={this.props.onClick}
                            style={styles(theme).iconOptionBtn}
                        >
                            <Radium.Style
                                rules={{
                                    "": {
                                        padding: "0px !important",
                                        margin: "0px !important"
                                    },
                                    ".btn": {
                                        padding: "0px !important",
                                        margin: "0px !important"
                                    }
                                }}
                                scopeSelector=".button-option"
                            />
                            <Icon
                                color={theme.colors.iconSiteButton}
                                icon={"option"}
                                size={"24px"}
                                style={styles(theme).iconOption}
                            />
                        </Button>
                    </div>
                </div>
            </bootstrap.Col>
        );
    }
});
module.exports = SiteStatus;
