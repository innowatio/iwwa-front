import React, {PropTypes} from "react";
import {Link} from "react-router";

import {Icon} from "components";

import {styles} from "lib/styles_restyling";
import {defaultTheme} from "lib/theme";

var SectionToolbar = React.createClass({
    propTypes: {
        backUrl: PropTypes.string,
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
        var {backUrl} = this.props;
        const theme = this.getTheme();
        if (backUrl) {
            return (
                <Link to={backUrl} style={{marginTop: "14px", marginRight: "10px"}}>
                    <Icon
                        color={theme.colors.iconHeader}
                        icon={"angle-left"}
                        size={"27px"}
                    />
                </Link>
            );
        }
    },
    render: function () {
        const theme = this.getTheme();
        return (
            <div style={styles(theme).titlePage}>
                {this.renderBackLink()}
                <div style={{fontSize: "18px", marginBottom: "0px", paddingTop: "18px", width: "100%"}}>
                    {this.props.title}
                </div>
                {this.props.children}
            </div>
        );
    }
});

module.exports = SectionToolbar;