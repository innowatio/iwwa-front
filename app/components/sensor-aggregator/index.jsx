import React, {PropTypes} from "react";
import Radium from "radium";
import {FormGroup, FormControl, InputGroup, Col} from "react-bootstrap";
import IPropTypes from "react-immutable-proptypes";
import {DraggableOperator, DraggableSensor, FormulaDropArea, Icon} from "components";

import {findSensor} from "lib/sensors-utils";
import {styles} from "lib/styles";
import {defaultTheme} from "lib/theme";

var SensorAggregator = React.createClass({
    propTypes: {
        addItemToFormula: PropTypes.func.isRequired,
        allSensors: IPropTypes.map,
        formulaItems: PropTypes.array,
        operators: PropTypes.arrayOf(PropTypes.shape({
            type: PropTypes.string.isRequired,
            key: PropTypes.string.isRequired,
            backgroundColor: PropTypes.string
        })).isRequired,
        removeItemFromFormula: PropTypes.func.isRequired,
        sensors: PropTypes.array.isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getInitialState: function () {
        return {
            addNumber: ""
        };
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
                borderTopRightRadius: "0px",
                borderBottomRightRadius: "0px",
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
    addNumberToFormula: function () {
        if (this.state.addNumber) {
            this.props.addItemToFormula({type: "number", number: this.state.addNumber});
        }
    },
    render: function () {
        let theme = this.getTheme();
        return (
            <div style={{clear: "both", minHeight: "250px"}}>
                <Col md={6} style={{marginTop: "20px"}}>
                    <FormulaDropArea
                        addItemToFormula={this.props.addItemToFormula}
                        allSensors={this.props.allSensors}
                        formulaItems={this.props.formulaItems}
                        operators={this.props.operators}
                        removeItemFromFormula={this.props.removeItemFromFormula}
                        style={{...styles(theme).titlePageMonitoring,
                            borderRadius: "20px",
                            minHeight: "250px",
                            padding: "10px"
                        }}
                    />
                </Col>
                <Col md={6} style={{marginTop: "20px"}}>
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
                    <div className="row">
                        <Col md={7}>
                            <div className="add-container">
                                <Radium.Style
                                    rules={this.getInputAddStyle()}
                                    scopeSelector=".add-container"
                                />
                                <FormGroup style={{display: "inline-table"}}>
                                    <FormControl
                                        className="input-add"
                                        onChange={(event) => this.setState({addNumber: event.target.value})}
                                        onKeyPress={(event) =>{
                                            if (event.key === "Enter") {
                                                this.addNumberToFormula();
                                            }
                                        }}
                                        placeholder="Aggiungi numero all'area"
                                        type="number"
                                        value={this.state.addNumber}
                                    />
                                    <InputGroup.Addon>
                                        <Icon
                                            color={theme.colors.white}
                                            icon={"add"}
                                            onClick={this.addNumberToFormula}
                                            size={"20px"}
                                            style={{
                                                lineHeight: "10px",
                                                verticalAlign: "middle"
                                            }}
                                        />
                                    </InputGroup.Addon>
                                </FormGroup>
                            </div>
                        </Col>
                    </div>
                </Col>
            </div>
        );
    }
});

module.exports = SensorAggregator;
