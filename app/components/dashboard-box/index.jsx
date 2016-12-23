import React, {PropTypes} from "react";
import * as bootstrap from "react-bootstrap";
import Radium from "radium";

import {defaultTheme} from "lib/theme";

const styles = () => ({
    colDataWrp:{
        height: "auto",
        paddingRight: "5px",
        paddingLeft: "5px"
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
            <bootstrap.Col
                md={3}
                sm={6}
                xs={12}
                className="data-col"
            >
                <Radium.Style
                    rules={styles(theme).colDataWrp}
                    scopeSelector=".data-col"
                />
                {this.props.children}
            </bootstrap.Col>
        );
    }
});

module.exports = DashboardBox;
