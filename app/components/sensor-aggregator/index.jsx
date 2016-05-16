import React, {PropTypes} from "react";
import {Col} from "react-bootstrap";
import IPropTypes from "react-immutable-proptypes";
import {Input} from "react-bootstrap";

import {DraggableOperator, DraggableSensor, FormulaDropArea} from "components";

import {findSensor} from "lib/sensors-utils";
import {styles} from "lib/styles_restyling";
import {defaultTheme} from "lib/theme";
import {Icon} from "components";

var SensorAggregator = React.createClass({
    propTypes: {
        addItemToFormula: PropTypes.func.isRequired,
        allSensors: IPropTypes.map,
        formulaItems: PropTypes.array,
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
    getTheme: function () {
        return this.context.theme || defaultTheme;
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
                        removeItemFromFormula={this.props.removeItemFromFormula}
                        style={{...styles(theme).titlePageMonitoring,
                            borderRadius: "20px",
                            minHeight: "250px",
                            padding: "10px"
                        }}
                    />
                </Col>
                <Col md={6} style={{textAlign: "center", marginTop: "20px"}}>
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


                    <Input
                        addonAfter={
                            <Icon
                                color={theme.colors.white}
                                icon={"add"}
                                onClick={""}
                                size={"20px"}
                                style={{
                                    lineHeight: "10px",
                                    verticalAlign: "middle"
                                }}
                            />
                        }
                        className="input-search"
                        onChange={(input) => self.setState({addNumber: input.target.value})}
                        placeholder="Aggiungi numero all'area"
                        type="text"
                        value={self.state.addNumber}
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
                </Col>
            </div>
        );
    }
});

module.exports = SensorAggregator;
