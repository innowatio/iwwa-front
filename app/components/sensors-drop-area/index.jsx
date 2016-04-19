import React, {PropTypes} from "react";
import {DropTarget} from "react-dnd";
import {Link} from "react-router";

import {Types} from "lib/dnd-utils";
import {defaultTheme} from "lib/theme";

import {Button, Icon} from "components";

const buttonStyle = ({colors}) => ({
    backgroundColor: colors.buttonPrimary,
    border: "0px none",
    borderRadius: "100%",
    height: "50px",
    margin: "auto",
    width: "50px",
    marginLeft: "10px"
});

const sensorsTarget = {
    drop (props, monitor) {
        const item = monitor.getItem();
        console.log(item);
        props.addSensorToWorkArea(item.sensor);
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
        connectDropTarget: PropTypes.func,
        onClickAggregate: PropTypes.func.isRequired,
        onClickChart: PropTypes.func.isRequired,
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
            <label style={{width: "100%", color: theme.colors.navText, textAlign: "center"}}>
                {"Trascina in questo spazio i sensori che vuoi graficare"}
            </label>
        );
    },
    renderSensors: function () {
        let sensors = [];
        let theme = this.getTheme();
        this.props.sensors.forEach((el) => {
            sensors.push(
                <div>
                    {el}
                </div>
            );
        });
        return (
            <div>
                {sensors}
                <Button
                    style={buttonStyle(theme)}
                    onClick={this.props.onClickAggregate}
                >
                    <Icon
                        color={theme.colors.iconHeader}
                        icon={"add"}
                        size={"28px"}
                        style={{lineHeight: "20px"}}
                    />
                </Button>
                <Link to={"/monitoring/chart/"} onClick={() => this.props.onClickChart(this.props.sensors)}>
                    <Icon
                        color={theme.colors.iconHeader}
                        icon={"chart"}
                        size={"28px"}
                        style={{lineHeight: "20px"}}
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
                marginTop: "40px",
                minHeight: "200px",
                overflow: "auto",
                padding: "20px 10px",
                verticalAlign: "middle"
            }}
            >
                {this.props.sensors.length > 0 ? this.renderSensors() : this.renderMessage(theme)}
            </div>
        );
    }
});

module.exports = DropTarget([Types.SENSOR_ROW], sensorsTarget, collect)(SensorsDropArea);