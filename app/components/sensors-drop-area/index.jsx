import React, {PropTypes} from "react";
import {DropTarget} from "react-dnd";
import IPropTypes from "react-immutable-proptypes";
import {Link} from "react-router";
import R from "ramda";
import * as bootstrap from "react-bootstrap";

import {Types} from "lib/dnd-utils";
import {getSensorId, getSensorLabel, getUnitOfMeasurementLabel} from "lib/sensors-utils";
import {defaultTheme} from "lib/theme";

import {CollectionItemList, Icon, TooltipIconButton} from "components";

const buttonStyle = ({colors}) => ({
    backgroundColor: colors.primary,
    border: "0px none",
    borderRadius: "100%",
    display: "block",
    width: "45px",
    height: "45px",
    textAlign: "center",
    lineHeight: "48px",
    padding: "0px !important",
    position: "absolute",
    top: "-15px",
    margin: "auto"
});

const sensorsTarget = {
    drop (props, monitor) {
        const item = monitor.getItem();
        if (props.sensors.indexOf(getSensorId(item.sensor)) < 0) {
            props.addSensorToWorkArea(item.sensor);
        }
        return {moved: true};
    }
};

function collect (connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        itemType: monitor.getItemType()
    };
}

var SensorsDropArea = React.createClass({
    propTypes: {
        addSensorToWorkArea: PropTypes.func.isRequired,
        allSensors: IPropTypes.map.isRequired,
        connectDropTarget: PropTypes.func,
        oldSensors: IPropTypes.list,
        onClickAggregate: PropTypes.func,
        onClickChart: PropTypes.func,
        removeSensorFromWorkArea: PropTypes.func.isRequired,
        sensors: PropTypes.array.isRequired,
        sensorsFilter: PropTypes.func,
        sensorsSort: PropTypes.func,
        workAreaInstructions: PropTypes.string,
        workAreaMessage: PropTypes.string
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    isNewSensor: function (sensorId) {
        return !this.props.oldSensors || this.props.oldSensors.indexOf(sensorId) < 0;
    },
    renderMessage: function (theme) {
        return (
            <label style={{
                width: "100%",
                color: theme.colors.white,
                fontSize: "14px",
                textAlign: "center"
            }}>
                {this.props.workAreaInstructions}
            </label>
        );
    },
    renderAggregateButton: function (theme) {
        return this.props.onClickAggregate ? (
            <TooltipIconButton
                buttonStyle={
                    R.merge(buttonStyle(theme), {
                        right: "50px",
                        padding: "1px 8px"
                    })
                }
                icon={"merge"}
                iconColor={theme.colors.iconHeader}
                iconSize={"30px"}
                iconStyle={{verticalAlign:"middle"}}
                onButtonClick={this.props.onClickAggregate}
                tooltipText={"Crea un sensore"}
            />
        ) : null;
    },
    renderChartButton: function (theme) {
        return this.props.onClickChart ? (
            <bootstrap.OverlayTrigger
                overlay={<bootstrap.Tooltip id="sensorsChart" className="buttonInfo">{"Visualizza grafico dei sensori"}</bootstrap.Tooltip>}
                placement="bottom"
                rootClose={true}
            >
                <Link
                    to={"/monitoring/chart/"}
                    onClick={() => this.props.onClickChart(this.props.sensors)}
                    style={
                        R.merge(buttonStyle(theme),
                        {right: "0px"})
                    }
                >
                    <Icon
                        color={theme.colors.iconHeader}
                        icon={"chart"}
                        size={"24px"}
                        style={{verticalAlign: "middle"}}
                    />
                </Link>
            </bootstrap.OverlayTrigger>
        ) : null;
    },
    renderSensor: function (element, elementId) {
        const {colors} = this.getTheme();
        return (
            <div
                key={elementId}
                style={{
                    width:"100%",
                    backgroundColor: this.isNewSensor(elementId) ? colors.buttonPrimary : "none",
                    height: "48px",
                    lineHeight: "48px",
                    borderTop: "1px solid " + colors.white,
                    borderBottom: "1px solid " + colors.white,
                    color: colors.white,
                    marginBottom: "1px",
                    padding: "0px 10px"
                }}
            >
                {
                    getSensorLabel(element) +
                    (element.get("description") ? " - " + element.get("description") : "") +
                    (element.get("unitOfMeasurement") ? " - " + getUnitOfMeasurementLabel(element.get("unitOfMeasurement")) : "")
                }
                <div
                    onClick={() => this.props.removeSensorFromWorkArea(elementId)}
                    style={{
                        display: "block",
                        float: "right",
                        border: "1px solid " + colors.white,
                        width: "20px",
                        height: "20px",
                        lineHeight: "18px",
                        overflow: "hidden",
                        borderRadius: "30px",
                        textAlign: "center",
                        textDecoration: "none",
                        marginTop: "13px",
                        color: colors.white,
                        cursor: "pointer"
                    }}
                >
                    <Icon
                        color={colors.mainFontColor}
                        icon={"delete"}
                        size={"15px"}
                        style={{
                            verticalAlign: "middle"
                        }}
                    />
                </div>
            </div>
        );
    },
    renderSensors: function (theme) {
        return (
            <div style={{position: "relative"}}>
                <h4 style={{
                    width: "100%",
                    color: theme.colors.navText,
                    fontSize: "14px",
                    textAlign: "center",
                    margin: "0px 0px 25px 0px",
                    padding: "0px"
                }}>
                    {this.props.workAreaMessage}
                </h4>
                <CollectionItemList
                    collections={this.props.allSensors.filter(sensor => this.props.sensors.indexOf(getSensorId(sensor)) >= 0)}
                    filter={this.props.sensorsFilter}
                    headerComponent={this.renderSensor}
                    sort={this.props.sensorsSort}
                />
                {this.renderAggregateButton(theme)}
                {this.renderChartButton(theme)}
            </div>
        );
    },
    render: function () {
        const theme = this.getTheme();
        const {connectDropTarget} = this.props;
        return connectDropTarget(
            <div style={{
                border: "1px solid " + theme.colors.borderContentModal,
                borderRadius: "20px",
                background: theme.colors.backgroundContentModal,
                margin: "30px 0px 40px 0px",
                minHeight: "210px",
                overflow: "auto",
                padding: "20px 10px",
                verticalAlign: "middle"
            }}>
                {this.props.sensors.length > 0 ? this.renderSensors(theme) : this.renderMessage(theme)}
            </div>
        );
    }
});

module.exports = DropTarget([Types.SENSOR_ROW], sensorsTarget, collect)(SensorsDropArea);
