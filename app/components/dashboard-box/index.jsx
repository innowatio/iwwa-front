import React, {PropTypes} from "react";

import {defaultTheme} from "lib/theme";

const style = theme => ({
    container: {
        backgroundColor: theme.colors.backgroundTitlePage,
        display: "inline",
        marginRight: "20px",
        maxWidth: "300px",
        maxHeight: "300px",
        minWidth: "300px",
        minHeight: "300px"
    }
});

var DashboardBox = React.createClass({
    propTypes: {
        children: PropTypes.element
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
            <div style={style(theme).container}>
                {this.props.children}
            </div>
        );
    }
});

module.exports = DashboardBox;