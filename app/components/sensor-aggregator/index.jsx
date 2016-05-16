import React, {PropTypes} from "react";
import {Col} from "react-bootstrap";
import IPropTypes from "react-immutable-proptypes";

import {DraggableOperator, DraggableSensor, FormulaDropArea} from "components";

import {findSensor} from "lib/sensors-utils";
import {styles} from "lib/styles_restyling";
import {defaultTheme} from "lib/theme";

var SensorAggregator = React.createClass({
    propTypes: {
        addItemToFormula: PropTypes.func.isRequired,
        allSensors: IPropTypes.map,
        formulaItems: PropTypes.array,
<<<<<<< Updated upstream
        operators: PropTypes.array,
        removeItemFromFormula: PropTypes.func.isRequired,
=======
        operators: PropTypes.arrayOf(PropTypes.shape({
            type: PropTypes.string.isRequired,
            key: PropTypes.string.isRequired,
            backgroundColor: PropTypes.string
        })),
>>>>>>> Stashed changes
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
                    <label style={{
                        color: theme.colors.mainFontColor,
                        fontSize: "16px",
                        fontWeight: "400",
                        marginBottom: "20px"
                    }}
                    >
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
                </Col>
            </div>
        );
    }
});

module.exports = SensorAggregator;
