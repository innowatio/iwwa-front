import React, {PropTypes} from "react";
import {styles} from "lib/styles_restyling";
import {defaultTheme} from "lib/theme";

var MonitoringSearch = React.createClass({
    contextTypes: {
        theme: PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    render: function() {
        return (
            <div style={{width: "30%", float: "left", marginTop: "2px"}}>
                <div style={styles(this.getTheme()).titlePage}>
                </div>
            </div>
        );
    }
});

module.exports = MonitoringSearch;