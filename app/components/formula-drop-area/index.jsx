import React, {PropTypes} from "react";
import {DropTarget} from "react-dnd";
import IPropTypes from "react-immutable-proptypes";

import {Types} from "lib/dnd-utils";
import {findSensor} from "lib/sensors-utils";
import {defaultTheme} from "lib/theme";
import {Link} from "react-router";
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
    renderOperator: function (operator, index, last) {
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
                    display: "inline-block",
                    width: "36px",
                    height: "36px",
                    overflow: "hidden",
                    textAlign: "center",
                    margin: "3px",
                    borderRadius: "100%",
                    backgroundColor: theme.colors.iconOperator,
                    color: theme.colors.white
                }}
                >
                    <Icon
                        color={theme.colors.white}
                        icon={operator}
                        size={"28px"}
                        style={{lineHeight: "42px"}}
                    />
                </p>
                {last ? (
                    <Link
                        to="/"
                        style={{
                            display: "block",
                            float: "right",
                            border: "1px solid " + theme.colors.white,
                            width: "20px",
                            height: "20px",
                            overflow: "hidden",
                            lineHeight: "18px",
                            borderRadius: "30px",
                            textAlign: "center",
                            textDecoration: "none",
                            margin: "10px 10px 0px 10px",
                            color: theme.colors.white
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
                    </Link>) :
                    undefined
                }
            </div>
        );
    },
    renderSensor: function (sensor, index, last) {
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
                {last ? (
                    <Link
                        to="/"
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
                            verticalAlign: "text-bottom",
                            textDecoration: "none",
                            margin: "10px 0px 0px 20px",
                            color: theme.colors.white
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
                    </Link>) :
                    undefined
                }
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
