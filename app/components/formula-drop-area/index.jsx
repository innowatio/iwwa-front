import React, {PropTypes} from "react";
import {DropTarget} from "react-dnd";
import IPropTypes from "react-immutable-proptypes";

import {Types} from "lib/dnd-utils";
import {findSensor} from "lib/sensors-utils";
import {defaultTheme} from "lib/theme";
import {Icon} from "components";

const formulaTarget = {
    drop (props, monitor) {
        const item = monitor.getItem();
        props.addItemToFormula(item);
        return {moved: true};
    }
};

const styles = (theme) => ({
    removeStyle: {
        display: "inline-block",
        float: "right",
        border: "1px solid " + theme.colors.white,
        width: "20px",
        height: "20px",
        lineHeight: "18px",
        overflow: "hidden",
        borderRadius: "30px",
        textAlign: "center",
        verticalAlign: "text-bottom",
        textDecoration: "none",
        marginTop: "10px",
        color: theme.colors.white,
        cursor: "pointer"
    },
    operatorStyle: {
        display: "inline-block",
        width: "38px",
        height: "38px",
        overflow: "hidden",
        textAlign: "center",
        margin: "2px",
        borderRadius: "100%",
        color: theme.colors.white
    }
});

function collect (connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        itemType: monitor.getItemType()
    };
}

var FormulaDropArea = React.createClass({
    propTypes: {
        addItemToFormula: PropTypes.func.isRequired,
        allSensors: IPropTypes.map,
        connectDropTarget: PropTypes.func,
        formulaItems: PropTypes.array.isRequired,
        operators: PropTypes.arrayOf(PropTypes.shape({
            type: PropTypes.string.isRequired,
            key: PropTypes.string.isRequired,
            backgroundColor: PropTypes.string
        })).isRequired,
        removeItemFromFormula: PropTypes.func.isRequired,
        style: PropTypes.object
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getOperatorBackgroundColor: function (operatorType) {
        const draggedOperator = this.props.operators.find(operator => operator.type === operatorType);
        return draggedOperator.backgroundColor;
    },
    renderOperator: function (operatorType, index, showRemove) {
        const theme = this.getTheme();
        return (
            <div
                key={index}
                style={{
                    float: "left",
                    width: "auto",
                    height: "44px",
                    lineHeight: "44px",
                    padding: "0px",
                    margin: "5px",
                    borderRadius: "10px",
                    border: "1px solid " + theme.colors.white
                }}
            >
                <p style={{
                    backgroundColor: this.getOperatorBackgroundColor(operatorType) || theme.colors.iconOperatorBg1,
                    ...styles(theme).operatorStyle
                }}
                >
                    <Icon
                        color={theme.colors.white}
                        icon={operatorType}
                        size={"30px"}
                        style={{lineHeight: "44px"}}
                    />
                </p>
                {showRemove ? this.renderRemoveButtonOperator(index) : null}
            </div>
        );
    },
    renderSensor: function (sensor, index, showRemove) {
        let theme = this.getTheme();
        let sensorObj = typeof sensor === "string" ? findSensor(this.props.allSensors, sensor): sensor;
        return (
            <div
                key={index}
                style={{
                    float: "left",
                    width: "auto",
                    height: "44px",
                    color: theme.colors.mainFontColor,
                    textAlign: "left",
                    border: "1px solid",
                    borderRadius: "10px",
                    lineHeight: "44px",
                    padding: "0px 10px",
                    margin: "5px"
                }}
            >
                {(sensorObj.get("name") ? sensorObj.get("name") : sensorObj.get("_id"))}
                {showRemove ? this.renderRemoveButton(index) : null}
            </div>
        );
    },
    renderRemoveButton: function (index) {
        let theme = this.getTheme();
        return (
            <div
                onClick={() => this.props.removeItemFromFormula(index)}
                style={{
                    marginLeft: "15px",
                    ...styles(theme).removeStyle
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
        );
    },
    renderRemoveButtonOperator: function (index) {
        let theme = this.getTheme();
        return (
            <div
                onClick={() => this.props.removeItemFromFormula(index)}
                style={{
                    margin: "0px 10px",
                    ...styles(theme).removeStyle
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
        );
    },
    renderItems: function () {
        let items = [];
        this.props.formulaItems.forEach((el, index) => {
            let item;
            var last = (index === this.props.formulaItems.length - 1);
            switch (el.type) {
                case Types.SENSOR: {
                    item = this.renderSensor(el.sensor, index, last);
                    break;
                }
                case Types.OPERATOR: {
                    item = this.renderOperator(el.operator, index, last);
                    break;
                }
            }
            items.push(item);
        });
        return items;
    },
    render: function () {
        const {connectDropTarget, style} = this.props;
        return connectDropTarget(
            <div style={style}>
                {this.renderItems()}
            </div>
        );
    }
});

module.exports = DropTarget([Types.SENSOR, Types.OPERATOR], formulaTarget, collect)(FormulaDropArea);
