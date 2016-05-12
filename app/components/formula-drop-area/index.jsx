import React, {PropTypes} from "react";
import {DropTarget} from "react-dnd";
import IPropTypes from "react-immutable-proptypes";

import {Icon} from "components";

import {Types} from "lib/dnd-utils";
import {findSensor} from "lib/sensors-utils";
import {defaultTheme} from "lib/theme";

const formulaTarget = {
    drop (props, monitor) {
        const item = monitor.getItem();
        props.addItemToFormula(item);
        return {moved: true};
    }
};

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
        removeItemFromFormula: PropTypes.func.isRequired,
        style: PropTypes.object
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    renderOperator: function (operator, index, showRemove) {
        const theme = this.getTheme();
        return (
            <div style={{
                float: "left",
                width: "auto",
                height: "44px",
                lineHeight: "44px",
                padding: "0px 10px 0px 0px",
                margin: "5px",
                borderRadius: "10px",
                border: "1px solid " + theme.colors.white
            }}
            >
                <p style={{
                    display: "inline-block",
                    width: "30px",
                    height: "30px",
                    overflow: "hidden",
                    fontWeight: "300",
                    fontSize: "30px",
                    lineHeight: "28px",
                    textAlign: "center",
                    margin: "5px",
                    borderRadius: "100%",
                    backgroundColor: theme.colors.iconOperator,
                    color: theme.colors.white
                }}
                >
                    {operator}
                </p>
                {showRemove ? this.renderRemoveButton(index) : null}
            </div>
        );
    },
    renderSensor: function (sensor, index, showRemove) {
        let theme = this.getTheme();
        let sensorObj = typeof sensor === "string" ? findSensor(this.props.allSensors, sensor): sensor;
        return (
            <div style={{
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
                    display: "block",
                    float: "right",
                    border: "1px solid " + theme.colors.white,
                    width: "20px",
                    height: "20px",
                    lineHeight: "15px",
                    overflow: "hidden",
                    borderRadius: "30px",
                    textAlign: "center",
                    verticalAlign: "text-bottom",
                    textDecoration: "none",
                    margin: "10px 0px 0px 20px",
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
        );
    },
    renderItems: function () {
        let items = [];
        let lastItemIndex = this.props.formulaItems.length - 1;
        this.props.formulaItems.forEach((el, index) => {
            let item;
            switch (el.type) {
                case Types.SENSOR: {
                    item = this.renderSensor(el.sensor, index, lastItemIndex === index);
                    break;
                }
                case Types.OPERATOR: {
                    item = this.renderOperator(el.operator, index, lastItemIndex === index);
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
