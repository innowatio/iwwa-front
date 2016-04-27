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
        style: PropTypes.object
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    renderOperator: function (operator) {
        const theme = this.getTheme();
        return (
            <div style={{display: "inline-block",
                width: "50px",
                height: "50px",
                lineHeight: "55px",
                textAlign: "center",
                margin: "5px",
                borderRadius: "100%",
                backgroundColor: theme.colors.iconOperator
            }}
            >
                <Icon
                    color={theme.colors.white}
                    icon={operator}
                    size={"40px"}
                    style={{
                        verticalAlign: "middle"
                    }}
                />
            </div>
        );
    },
    renderSensor: function (sensor) {
        let theme = this.getTheme();
        let sensorObj = typeof sensor === "string" ? findSensor(this.props.allSensors, sensor): sensor;
        return (
            <label style={{
                color: theme.colors.mainFontColor,
                textAlign: "left",
                border: "1px solid",
                borderRadius: "10px",
                height: "50px",
                padding: "10px",
                paddingTop: "15px",
                margin: "5px",
                display: "inherit"
            }}
            >
                {(sensorObj.get("name") ? sensorObj.get("name") : sensorObj.get("_id"))}
            </label>
        );
    },
    renderItems: function () {
        let items = [];
        this.props.formulaItems.forEach((el) => {
            let item;
            switch (el.type) {
                case Types.SENSOR: {
                    item = this.renderSensor(el.sensor);
                    break;
                }
                case Types.OPERATOR: {
                    item = this.renderOperator(el.operator);
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
