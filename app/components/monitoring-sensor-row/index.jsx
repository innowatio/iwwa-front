import React, {PropTypes} from "react";
import ReactPureRender from "react-addons-pure-render-mixin";
import {DragSource} from "react-dnd";
import IPropTypes from "react-immutable-proptypes";
import {Link} from "react-router";
import {partial} from "ramda";

import {Types} from "lib/dnd-utils";
import {hasRole, VIEW_FORMULA_DETAILS} from "lib/roles-utils";
import {getSensorLabel} from "lib/sensors-utils";
import {defaultTheme} from "lib/theme";
import {Icon, TagList, TooltipIconButton} from "components";

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
        paddingLeft: "10px",
        paddingRight: "10px"
    },
    tagsContainer: {
        float: "left",
        width: "calc(100% - 340px)",
        cursor: "pointer",
        maxHeight: "50px",
        overflow: "hidden"
    },
    buttonsContainer: {
        float: "left",
        width: "100px",
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
    renderSensorName: function () {
        let {sensor} = this.props;
        return (
            <div style={styles(this.getTheme()).sensorName}>
                {getSensorLabel(sensor)}
            </div>
        );
    },
    renderTags: function (isSelected) {
        const theme = this.getTheme();
        const primaryTags = this.props.sensor.get("primaryTags") ? this.props.sensor.get("primaryTags").toArray() : [];
        const tags = this.props.sensor.get("tags") ? this.props.sensor.get("tags").toArray() : [];
        return (
            <TagList
                isSelected={isSelected}
                primaryTags={primaryTags}
                tagIcon={true}
                tags={tags}
                containerStyle={styles(theme).tagsContainer}
            />
        );
    },
    renderInfoButton: function (sensor) {
        const theme = this.getTheme();
        const sensorFormula = sensor.get("formulas") && sensor.get("formulas").size > 0 ? sensor.get("formulas").first().get("formula") : null;
        const tooltipText = (
            <label>
                {sensor.get("description")}
                <br />
                {sensorFormula && hasRole(this.props.asteroid, VIEW_FORMULA_DETAILS) ? sensorFormula : null}
            </label>
        );
        return (
            <TooltipIconButton
                buttonBsStyle={"link"}
                buttonStyle={{
                    height: "50px",
                    width: "50px",
                    textAlign: "center",
                    padding: "0px",
                    outline: "0px",
                    outlineStyle: "none",
                    outlineWidth: "0px"
                }}
                icon={"information"}
                iconColor={theme.colors.mainFontColor}
                iconSize={"34px"}
                iconStyle={{verticalAlign: "middle", lineHeight: "55px"}}
                tooltipId={"createChartInfo"}
                tooltipPlacement={"left"}
                tooltipText={tooltipText}
                tooltipTrigger={"click"}
            />
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
                    backgroundColor: theme.colors.backgroundButtonOpacity
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
                    {this.renderTags(isSelected)}
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
