import React, {PropTypes} from "react";
import ReactPureRender from "react-addons-pure-render-mixin";
import {DragSource} from "react-dnd";
import IPropTypes from "react-immutable-proptypes";
import {Link} from "react-router";
import {partial} from "ramda";
import * as bootstrap from "react-bootstrap";

import {Types} from "lib/dnd-utils";
import {getSensorLabel} from "lib/sensors-utils";
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
        width: "200px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        verticalAlign: "middle",
        marginRight: "10px",
        borderRight: "1px solid" + colors.borderSensorsTable,
        lineHeight: "50px",
        paddingLeft: "10px"
    },
    tagsContainer: {
        float: "left",
        width: "calc(100% - 330px)"
    },
    buttonsContainer: {
        float: "right",
        maxWidth: "130px",
        overflow: "hidden"
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
    addTooltip: function (sensor) {
        // TODO Verificare con Davide se la formula sarà sempre presente e in caso se corretto
        // mostrare la description.

        const descriptionTooltip = sensor.get("formula") || sensor.get("description");
        return (
            <bootstrap.Tooltip id="createChartInfo">
                {descriptionTooltip}
            </bootstrap.Tooltip>
        );
    },
    renderSensorName: function () {
        let {sensor} = this.props;
        return (
            <div style={styles(this.getTheme()).sensorName}>
                {getSensorLabel(sensor)}
            </div>
        );
    },
    renderTags: function () {
        const theme = this.getTheme();
        let tags = [];
        if (this.props.sensor.get("tags")) {
            this.props.sensor.get("tags").forEach((tag) => {
                tags.push(
                    <label style={{
                        border: "solid 1px " + theme.colors.white,
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
                    color={theme.colors.mainFontColor}
                    icon={"tag"}
                    size={"27px"}
                    style={{
                        verticalAlign: "middle",
                        lineHeight: "49px"
                    }}
                />
                {tags}
            </div>
        );
    },
    renderInfoButton: function (sensor) {
        const theme = this.getTheme();
        return (
            <bootstrap.OverlayTrigger
                overlay={this.addTooltip(sensor)}
                placement="left"
                rootClose={true}
                trigger="click"
            >
                <bootstrap.Button
                    bsStyle="link"
                    style={{
                        height: "50px",
                        width: "50px",
                        textAlign: "center",
                        padding: "0px",
                        outline: "0px",
                        outlineStyle: "none",
                        outlineWidth: "0px"
                    }}
                >
                    <Icon
                        color={theme.colors.mainFontColor}
                        icon={"information"}
                        size={"34px"}
                        style={{
                            verticalAlign: "middle",
                            lineHeight: "55px"
                        }}
                    />
                </bootstrap.Button>
            </bootstrap.OverlayTrigger>
        );
    },
    renderChartButton: function () {
        const theme = this.getTheme();
        return (
            <Link
                to={"/monitoring/chart/"}
                onClick={() => this.props.selectSensorToDraw(this.props.sensor)}
                style={{
                    height: "50px",
                    width: "50px",
                    marginRight: "15px",
                    float: "right",
                    textAlign: "center",
                    backgroundColor: theme.colors.backgroundMonitoringRowChart
                }}
            >
                <Icon
                    color={theme.colors.mainFontColor}
                    icon={"chart"}
                    size={"32px"}
                    style={{
                        verticalAlign: "middle",
                        lineHeight: "55px"
                    }}
                />
            </Link>
        );
    },
    render: function () {
        const theme = this.getTheme();
        const {connectDragSource, isSelected, onClickSelect, sensor} = this.props;
        let divStyle = {
            ...styles(theme).container
        };
        if (isSelected) {
            divStyle = {
                ...divStyle,
                backgroundColor: theme.colors.buttonPrimary
            };
        }
        return connectDragSource(
            <div style={divStyle}>
                <div onClick={partial(onClickSelect, [sensor])} style={{cursor: "pointer"}}>
                    {this.renderSensorName()}
                    {this.renderTags()}
                </div>
                <div style={styles(theme).buttonsContainer}>
                    {this.renderChartButton()}
                    {this.renderInfoButton(sensor)}
                </div>
            </div>
        );
    }
});

module.exports = DragSource(Types.SENSOR_ROW, sensorSource, collect)(SensorRow);
