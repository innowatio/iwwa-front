import React, {PropTypes} from "react";
import * as bootstrap from "react-bootstrap";
import ReactPureRender from "react-addons-pure-render-mixin";

import {defaultTheme} from "lib/theme";

const styles = ({colors}) => ({
    panel: {
        backgroundColor: colors.backgroundAlarmsPanel,
        margin: "0px",
        padding: "0px",
        border: "0px",
        borderRadius: "0px"
    }
});

var SubListNotification = React.createClass({
    propTypes: {
        isExpanded: PropTypes.bool,
        label: PropTypes.string.isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },
    mixins: [ReactPureRender],
    getDefaultProps: function () {
        return {
            isExpanded: false
        };
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    render: function () {
        const {
            label
        } = this.props;
        return (
            <bootstrap.Panel
                collapsible={true}
                expanded={this.props.isExpanded}
                style={styles(this.getTheme()).panel}
            >
                {label}
            </bootstrap.Panel>
        );
    }
});

module.exports = SubListNotification;
