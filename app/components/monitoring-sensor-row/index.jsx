import React, {PropTypes} from "react";
import ReactPureRender from "react-addons-pure-render-mixin";
import {DragSource} from "react-dnd";
import IPropTypes from "react-immutable-proptypes";
import {Link} from "react-router";
import {concat, partial} from "ramda";
import * as bootstrap from "react-bootstrap";

import {Types} from "lib/dnd-utils";
import {hasRole, VIEW_FORMULA_DETAILS} from "lib/roles-utils";
import {getSensorLabel} from "lib/sensors-utils";
import {defaultTheme} from "lib/theme";
import {Icon, TagList} from "components";

const styles = ({colors}) => ({
    container: {
        borderBottom: "1px solid " + colors.borderSensorsTable,
        width: "100%",
        height: "50px",
        margin: "0px",
        padding: "0px",
        marginRight: "-15px"
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
        width: "calc(100% - 330px)",
        cursor: "pointer",
        maxHeight: "50px",
        overflow: "hidden"
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
        asteroid: PropTypes.object,
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
        const sensorFormula = sensor.get("formulas") ? sensor.get("formulas").first().get("formula") : null;
        return (
            <bootstrap.Tooltip id="createChartInfo">
                {sensor.get("description")}
                <br />
                {sensorFormula && hasRole(this.props.asteroid, VIEW_FORMULA_DETAILS) ? sensorFormula : null}
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
        const primaryTags = this.props.sensor.get("primaryTags") ? this.props.sensor.get("primaryTags").toArray() : [];
        const tags = this.props.sensor.get("tags") ? this.props.sensor.get("tags").toArray() : [];
        return (
            <TagList
                tagIcon={true}
                tags={concat(primaryTags, tags)}
                style={styles(this.getTheme()).tagsContainer}
            />
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
        return this.props.selectSensorToDraw ? (
            <Link
                to={"/monitoring/chart/"}
                onClick={() => this.props.selectSensorToDraw(this.props.sensor)}
                style={{
                    height: "50px",
                    width: "50px",
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
        ) : null;
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
                <div onClick={onClickSelect ? partial(onClickSelect, [sensor]) : null} style={{cursor: "pointer"}}>
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
