import React, {PropTypes} from "react";
import Radium from "radium";
import {Input, Col} from "react-bootstrap";
import IPropTypes from "react-immutable-proptypes";
<<<<<<< HEAD
import {DraggableOperator, DraggableSensor, FormulaDropArea, Icon} from "components";
=======
import {Input} from "react-bootstrap";

import {DraggableOperator, DraggableSensor, FormulaDropArea} from "components";
>>>>>>> d0d1098ff2e62cac6d3a719f1db9ca098b684eb7

import {findSensor} from "lib/sensors-utils";
import {styles} from "lib/styles_restyling";
import {defaultTheme} from "lib/theme";
import {Icon} from "components";

var SensorAggregator = React.createClass({
    propTypes: {
        addItemToFormula: PropTypes.func.isRequired,
        allSensors: IPropTypes.map,
        formulaItems: PropTypes.array,
<<<<<<< HEAD
        numbers: PropTypes.string,
=======
>>>>>>> d0d1098ff2e62cac6d3a719f1db9ca098b684eb7
        operators: PropTypes.arrayOf(PropTypes.shape({
            type: PropTypes.string.isRequired,
            key: PropTypes.string.isRequired,
            backgroundColor: PropTypes.string
        })),
        removeItemFromFormula: PropTypes.func.isRequired,
        sensors: PropTypes.array.isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getInitialState: function () {
        return {};
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getInputAddStyle: function () {
        let theme = this.getTheme();
        return {
            ".input-add:focus": {
                boxShadow: "none",
                WebkitBoxShadow: "none",
                borderColor: theme.colors.white
            },
            ".input-add": {
                fontSize: "15px",
                color: theme.colors.white,
                width: "100%",
                height: "40px",
                lineHeight: "40px",
                padding: "0px 10px",
                margin: "0px",
                border: "1px solid " + theme.colors.white,
                borderTopLeftRadius: "10px",
                borderBottomLeftRadius: "10px",
                backgroundColor: theme.colors.backgroundContentModal,
                outline: "0px",
                outlineStyle: "none",
                outlineWidth: "0px"
            },
            ".input-group-addon:last-child": {
                backgroundColor: theme.colors.buttonPrimary,
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px",
                cursor: "pointer"
            }
        };
    },
    render: function () {
        let self = this;
        let theme = self.getTheme();
        return (
            <div style={{clear: "both", minHeight: "250px"}}>
                <Col md={6} style={{marginTop: "20px"}}>
                    <FormulaDropArea
                        addItemToFormula={this.props.addItemToFormula}
                        allSensors={this.props.allSensors}
                        formulaItems={this.props.formulaItems}
                        removeItemFromFormula={this.props.removeItemFromFormula}
                        style={{...styles(theme).titlePageMonitoring,
                            borderRadius: "20px",
                            minHeight: "250px",
                            padding: "10px"
                        }}
                    />
                </Col>
<<<<<<< HEAD
                <Col md={6} style={{marginTop: "20px"}}>
=======
                <Col md={6} style={{textAlign: "center", marginTop: "20px"}}>
>>>>>>> d0d1098ff2e62cac6d3a719f1db9ca098b684eb7
                    <label style={styles(theme).labelStyle}>
                        {"Trascina sensori ed operatori nello spazio blu per scegliere come aggregarli"}
                    </label>
                    {this.props.sensors.map(sensorId => {
                        return (
                            <DraggableSensor
                                key={sensorId}
                                sensor={findSensor(this.props.allSensors, sensorId)}
                            />
                        );
                    })}
                    {this.props.operators.map(operator => {
                        return (
                            <DraggableOperator
                                {...operator}
                            />
                        );
                    })}
                    <label style={styles(theme).labelStyle}>
                        {"Inserisci la cifra e aggiungila tra gli operatori:"}
                    </label>
<<<<<<< HEAD
                    <div className="row">
                        <Col md={7}>
                            <div className="add-container">
                                <Radium.Style
                                    rules={self.getInputAddStyle()}
                                    scopeSelector=".add-container"
                                />
                                <Input
                                    addonAfter={
                                        <Icon
                                            color={theme.colors.white}
                                            icon={"add"}
                                            size={"20px"}
                                            style={{
                                                lineHeight: "10px",
                                                verticalAlign: "middle"
                                            }}
                                        />
                                    }
                                    className="input-add"
                                    placeholder="Aggiungi numero all'area"
                                    type="text"
                                />
                            </div>
                        </Col>
                    </div>
=======


                    <Input
                        addonAfter={
                            <Icon
                                color={theme.colors.white}
                                icon={"add"}
                                size={"20px"}
                                style={{
                                    lineHeight: "10px",
                                    verticalAlign: "middle"
                                }}
                            />
                        }
                        className="input-search"
                        onChange={(input) => this.setState({addNumber: input.target.value})}
                        placeholder="Aggiungi numero all'area"
                        type="text"
                        value={this.state.addNumber}
                        style={{
                            fontSize: "12px",
                            color: theme.colors.white,
                            height: "44px",
                            padding: "0px 10px",
                            margin: "0px",
                            border: "1px solid " + theme.colors.white,
                            borderTopLeftRadius: "10px",
                            borderBottomLeftRadius: "10px",
                            backgroundColor: theme.colors.backgroundContentModal
                        }}
                    />
>>>>>>> d0d1098ff2e62cac6d3a719f1db9ca098b684eb7
                </Col>
            </div>
        );
    }
});

module.exports = SensorAggregator;
