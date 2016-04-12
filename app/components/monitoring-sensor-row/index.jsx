import React, {PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import ReactPureRender from "react-addons-pure-render-mixin";
import {Link} from "react-router";

import {defaultTheme} from "lib/theme";
import components from "components";

const styles = () => ({
    container: {
        display: "inline-block"
    },
    sensorName: {

    }
});

var SensorRow = React.createClass({
    propTypes: {
        sensor: IPropTypes.map.isRequired,
        sensorId: PropTypes.any.isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },
    mixin: [ReactPureRender],
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    renderSensorName: function () {
        return (
            <div style={styles(this.getTheme()).sensorName}>
                {this.props.sensor.get("_id")}
            </div>
        );
    },
    renderTags: function () {
        const {colors} = this.getTheme();
        return (
            <div>
                <components.Icon
                    color={colors.iconHeader}
                    icon={"tag"}
                    size={"27px"}
                />
            </div>
        );
    },
    renderInfoButton: function () {
        const {colors} = this.getTheme();
        return (
            <components.Icon
                color={colors.iconHeader}
                icon={"info"}
                size={"27px"}
            />
        );
    },
    renderChartButton: function () {
        const {colors} = this.getTheme();
        return (
            <Link to={"/monitoring/chart/"}>
                <components.Icon
                    color={colors.iconHeader}
                    icon={"chart"}
                    size={"27px"}
                />
            </Link>
        );
    },
    render: function () {
        console.log(this.props.sensor);
        return (
            <div style={styles(this.getTheme()).container}>
                <div>
                    {this.renderSensorName()}
                </div>
                <div>
                    {this.renderTags()}
                </div>
                <div>
                    {this.renderInfoButton()}
                </div>
                <div>
                    {this.renderChartButton()}
                </div>
            </div>
        );
    }
});

module.exports = SensorRow;
