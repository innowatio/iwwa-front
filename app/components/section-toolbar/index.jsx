import React, {PropTypes} from "react";
import {styles} from "lib/styles_restyling";
import {defaultTheme} from "lib/theme";

var SectionToolbar = React.createClass({
    propTypes: {
        children: PropTypes.node,
        title: PropTypes.string
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    render: function() {
        const theme = this.getTheme();
        return (
            <div style={styles(theme).titlePage}>
                <div style={{fontSize: "18px", marginBottom: "0px", paddingTop: "18px", width: "100%"}}>
                    {this.props.title}
                </div>
                {this.props.children}
            </div>
        );
    }
});

module.exports = SectionToolbar;