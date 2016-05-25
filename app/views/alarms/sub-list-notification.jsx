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
        isExpanded: PropTypes.bool
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
        return (
            <bootstrap.Panel
                accordion={true}
                collapsible={true}
                expanded={this.props.isExpanded}
                style={styles(this.getTheme()).panel}
            >
                {"Consumi maggiori del 41% rispetto alla media - 2 anomalie simili (15.04.16, 08.05.16)"}
            </bootstrap.Panel>
        );
    }
});

module.exports = SubListNotification;
