import React, {PropTypes} from "react";
import ReactPureRender from "react-addons-pure-render-mixin";
import {DragSource} from "react-dnd";
import IPropTypes from "react-immutable-proptypes";
import {Link} from "react-router";
import {partial} from "ramda";

import {Types} from "lib/dnd-utils";
import {defaultTheme} from "lib/theme";

import {Icon} from "components";

const styles = ({colors}) => ({
    container: {
        borderBottom: "1px solid " + colors.borderSensorsTable,
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
        borderRight: "1px solid" + colors.borderSensorsTable,
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

const sensorSource = {
    beginDrag (props) {
        return {
            sensor: props.sensor,
            type: Types.SENSOR_ROW
        };
    }
};

function collect (connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

var SensorRow = React.createClass({
    propTypes: {
        connectDragSource: PropTypes.func,
        isDragging: PropTypes.bool,
        isSelected: PropTypes.bool,
        onClickSelect: PropTypes.func,
        selectSensorToDraw: PropTypes.func,
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
        let {sensor} = this.props;
        return (
            <div style={styles(this.getTheme()).sensorName}>
                {sensor.get("name") ? sensor.get("name") : sensor.get("_id")}
            </div>
        );
    },
    renderTags: function () {
        const {colors} = this.getTheme();
        let tags = [];
        if (this.props.sensor.get("tags")) {
            this.props.sensor.get("tags").forEach((tag) => {
                tags.push(
                    <label style={{
                        border: "solid 1px " + colors.white,
                        padding: "2px 10px 2px 10px",
                        borderRadius: "35px",
                        marginRight: "5px"
                    }}
                    >
                        {tag}
                    </label>
                );
            });
        }
        return (
            <div style={styles(this.getTheme()).tagsContainer}>
                <Icon
                    color={colors.mainFontColor}
                    icon={"tag"}
                    size={"27px"}
                    style={{
                        display: "block",
                        margin: "8px 5px 0px 0px"
                    }}
                />
                {tags}
            </div>
        );
    },
    renderFavouriteButton: function () {
        const {colors} = this.getTheme();
        return (
            <div style={{
                display: "block",
                height: "50px",
                width: "45px",
                float: "right",
                textAlign: "center",
                cursor: "pointer"
            }}
            >
                <Icon
                    color={colors.mainFontColor}
                    icon={"star-o"}
                    size={"28px"}
                    style={{
                        lineHeight: "55px"
                    }}
                />
            </div>
        );
    },
    renderInfoButton: function () {
        const {colors} = this.getTheme();
        return (
            <div style={{
                display: "block",
                height: "50px",
                width: "50px",
                float: "right",
                textAlign: "center",
                cursor: "pointer"
            }}
            >
                <Icon
                    color={colors.mainFontColor}
                    icon={"information"}
                    size={"34px"}
                    style={{
                        lineHeight: "55px"
                    }}
                />
            </div>
        );
    },
    renderChartButton: function () {
        const {colors} = this.getTheme();
        return (
            <Link
                to={"/monitoring/chart/"}
                onClick={() => this.props.selectSensorToDraw(this.props.sensor)}
                style={{
                    display: "block",
                    height: "50px",
                    width: "50px",
                    marginRight: "15px",
                    float: "right",
                    textAlign: "center",
                    backgroundColor: colors.backgroundMonitoringRowChart
                }}
            >
                <Icon
                    color={colors.mainFontColor}
                    icon={"chart"}
                    size={"32px"}
                    style={{
                        lineHeight: "55px"
                    }}
                />
            </Link>
        );
    },
    render: function () {
        const {connectDragSource, isSelected, onClickSelect, sensor} = this.props;
        let divStyle = {
            ...styles(this.getTheme()).container
        };
        if (isSelected) {
            divStyle = {
                ...divStyle,
                backgroundColor: this.getTheme().colors.buttonPrimary
            };
        }
        return connectDragSource(
            <div style={divStyle}>
                <div onClick={partial(onClickSelect, [sensor])} style={{cursor: "pointer"}}>
                    {this.renderSensorName()}
                    {this.renderTags()}
                </div>
                <div style={styles(this.getTheme()).buttonsContainer}>
                    {this.renderChartButton()}
                    {this.renderInfoButton()}
                    {this.renderFavouriteButton()}
                </div>
            </div>
        );
    }
});

module.exports = DragSource(Types.SENSOR_ROW, sensorSource, collect)(SensorRow);
