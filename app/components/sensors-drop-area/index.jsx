import React, {PropTypes} from "react";
import {DropTarget} from "react-dnd";
import IPropTypes from "react-immutable-proptypes";
import {Link} from "react-router";
import R from "ramda";

import {Types} from "lib/dnd-utils";
import {getSensorId, getUnitOfMeasurementLabel} from "lib/sensors-utils";
import {defaultTheme} from "lib/theme";

import {Button, Icon} from "components";

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
        onClickAggregate: PropTypes.func.isRequired,
        onClickChart: PropTypes.func.isRequired,
        removeSensorFromWorkArea: PropTypes.func.isRequired,
        sensors: PropTypes.array.isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    renderMessage: function (theme) {
        return (
            <label style={{
                width: "100%",
                color: theme.colors.white,
                fontSize: "14px",
                textAlign: "center"
            }}>
                {"Trascina in questo spazio i sensori che vuoi graficare"}
            </label>
        );
    },
    renderSensors: function () {
        let sensors = [];
        let theme = this.getTheme();
        this.props.sensors.forEach((sensorId, index) => {
            let sensor = this.props.allSensors.get(sensorId);
            if (sensor) {
                sensors.push(
                    <div
                        key={sensorId}
                        style={{
                            width:"100%",
                            backgroundColor: theme.colors.buttonPrimary,
                            height: "48px",
                            lineHeight: "48px",
                            borderTop: "1px solid " + theme.colors.white,
                            borderBottom: "1px solid " + theme.colors.white,
                            color: theme.colors.white,
                            marginBottom: "1px",
                            padding: "0px 10px"
                        }}
                    >
                        {
                            (sensor.get("name") ? sensor.get("name") : sensorId) +
                            (sensor.get("description") ? " - " + sensor.get("description") : "") +
                            (sensor.get("unitOfMeasurement") ? " - " + getUnitOfMeasurementLabel(sensor.get("unitOfMeasurement")) : "")
                        }
                        <div
                            onClick={() => this.props.removeSensorFromWorkArea(index)}
                            style={{
                                display: "block",
                                float: "right",
                                border: "1px solid " + theme.colors.white,
                                width: "20px",
                                height: "20px",
                                lineHeight: "18px",
                                overflow: "hidden",
                                borderRadius: "30px",
                                textAlign: "center",
                                textDecoration: "none",
                                marginTop: "13px",
                                color: theme.colors.white,
                                cursor: "pointer"
                            }}
                        >
                            <Icon
                                color={theme.colors.mainFontColor}
                                icon={"delete"}
                                size={"15px"}
                                style={{
                                    verticalAlign: "middle"
                                }}
                            />
                        </div>
                    </div>
                );
            }
        });
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
                    {"Hai selezionato: "}
                </h4>
                {sensors}
                <Button
                    style={
                        R.merge(buttonStyle(theme), {
                            right: "50px",
                            padding: "1px 8px"
                        })
                    }
                    onClick={this.props.onClickAggregate}
                >
                    <Icon
                        color={theme.colors.iconHeader}
                        icon={"merge"}
                        size={"30px"}
                        style={{verticalAlign:"middle"}}
                    />
                </Button>
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
                {this.props.sensors.length > 0 ? this.renderSensors() : this.renderMessage(theme)}
            </div>
        );
    }
});

module.exports = DropTarget([Types.SENSOR_ROW], sensorsTarget, collect)(SensorsDropArea);
