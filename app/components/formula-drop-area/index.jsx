import React, {PropTypes} from "react";
import {DropTarget} from "react-dnd";

import {Types} from "lib/dnd-utils";
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
        return (
            <div style={{width: "40px", height: "40px", display: "inline-block", margin: "5px"}}>
                <Icon
                    color={this.getTheme().colors.iconHeader}
                    icon={operator}
                    size={"40px"}
                    style={{lineHeight: "20px", width: "40px", height: "40px", borderRadius: "100%", background: "green"}}
                />
            </div>
        );
    },
    renderSensor: function (sensor) {
        return (
            <label style={{color: this.getTheme().colors.navText, textAlign: "left", border: "1px solid", borderRadius: "10px", padding: "7px", display: "inherit"}}>
                {(sensor.get("name") ? sensor.get("name") : sensor.get("_id"))}
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
