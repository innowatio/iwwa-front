import React, {PropTypes} from "react";
import {browserHistory} from "react-router";

import {Icon} from "components";

import {styles} from "lib/styles";
import {defaultTheme} from "lib/theme";

var SectionToolbar = React.createClass({
    propTypes: {
        backLink: PropTypes.bool,
        children: PropTypes.node,
        title: PropTypes.string
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    renderBackLink: function () {
        const theme = this.getTheme();
        return (
            <div style={{textDecoration: "none"}}>
                <div
                    onClick={browserHistory.goBack}
                    style={{
                        cursor: "pointer",
                        float: "left",
                        marginTop: "6px",
                        marginRight: "10px",
                        backgroundColor: theme.colors.primary,
                        width: "43px",
                        height: "43px",
                        lineHeight: "45px",
                        borderRadius: "100%",
                        textAlign: "center"
                    }}
                >
                    <Icon
                        color={theme.colors.iconHeader}
                        icon={"angle-left"}
                        size={"27px"}
                        style={{verticalAlign: "middle"}}
                    />
                </div>
                <div style={{
                    display: "inline",
                    fontSize: "18px",
                    fontWeight: "300",
                    lineHeight: "55px",
                    marginBottom: "0px",
                    color: theme.colors.white
                }}>
                    {this.props.title}
                </div>
            </div>
        );
    },
    render: function () {
        const theme = this.getTheme();
        return (
            <div style={styles(theme).titlePageMonitoring}>
                {this.props.backLink ? this.renderBackLink() : null}
                {this.props.children}
            </div>
        );
    }
});

module.exports = SectionToolbar;
