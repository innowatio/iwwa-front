import React, {PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import ReactPureRender from "react-addons-pure-render-mixin";
import {Link} from "react-router";
import {partial} from "ramda";

import {defaultTheme} from "lib/theme";
import components from "components";

const styles = ({colors}) => ({
    container: {
        borderBottom: "1px solid " + colors.white,
        width: "100%",
        height: "50px",
        margin: "0px",
        padding: "0px"
    },
    sensorName: {
        float: "left",
        width: "auto",
        minWidth: "10%",
        verticalAlign: "middle",
        marginRight: "10px",
        borderRight: "1px solid" + colors.white,
        lineHeight: "50px",
        paddingLeft: "10px"
    },
    tagsContainer: {
        float: "left",
        width: "auto",
        minWidth: "70%"
    },
    buttonsContainer: {
        float: "right",
        width: "auto",
        minWidth: "10%"
    }
});

var SensorRow = React.createClass({
    propTypes: {
        isSelected: PropTypes.bool,
        onClickSelect: PropTypes.func,
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
            <components.Icon
                color={colors.iconHeader}
                icon={"tag"}
                size={"27px"}
                style={{marginRight: "5px", verticalAlign: "middle", lineHeight: "50px"}}
            />
        );
    },
    renderInfoButton: function () {
        const {colors} = this.getTheme();
        return (
            <components.Icon
                color={colors.iconHeader}
                icon={"info"}
                size={"27px"}
                style={{
                    cursor: "pointer",
                    marginRight: "10px",
                    verticalAlign: "middle",
                    lineHeight: "49px",
                    float: "right"
                }}
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
                    size={"32px"}
                    style={{
                        verticalAlign: "middle",
                        lineHeight: "49px",
                        float: "right",
                        marginRight: "20px",
                        padding: "0px 10px",
                        backgroundColor: colors.backgroundMonitoringRowChart
                    }}
                />
            </Link>
        );
    },
    render: function () {
        let divStyle = {
            ...styles(this.getTheme()).container
        };
        if (this.props.isSelected) {
            divStyle = {
                ...divStyle,
                backgroundColor: this.getTheme().colors.buttonPrimary
            };
        }
        return (
            <div style={divStyle}>
                <div onClick={partial(this.props.onClickSelect, [this.props.sensor])} style={{cursor: "pointer"}}>
                    {this.renderSensorName()}
                    <div style={styles(this.getTheme()).tagsContainer}>
                        {this.renderTags()}
                    </div>
                </div>
                <div style={styles(this.getTheme()).buttonsContainer}>
                    {this.renderChartButton()}
                    {this.renderInfoButton()}
                </div>
            </div>
        );
    }
});

module.exports = SensorRow;
