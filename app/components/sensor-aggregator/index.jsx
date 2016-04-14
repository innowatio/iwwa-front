import React, {PropTypes} from "react";
import {Col} from "react-bootstrap";
import {DragDropContext} from "react-dnd";
// import {default as TouchBackend} from "react-dnd-touch-backend";
import HTML5Backend from "react-dnd-html5-backend";

import {DraggableOperator, DraggableSensor, FormulaDropArea} from "components";

import {styles} from "lib/styles_restyling";
import {defaultTheme} from "lib/theme";

var SensorAggregator = React.createClass({
    propTypes: {
        addItemToFormula: PropTypes.func.isRequired,
        formulaItems: PropTypes.array,
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
            <div style={{minHeight: "450px"}}>
                <Col md={6}>
                    <FormulaDropArea
                        addItemToFormula={this.props.addItemToFormula}
                        formulaItems={this.props.formulaItems}
                        style={{...styles(theme).titlePage, borderRadius: "20px", height: "250px", padding: "10px"}}
                    />
                </Col>
                <Col md={6} style={{textAlign: "center"}}>
                    <label style={{color: theme.colors.navText, marginBottom: "20px"}}>
                        {"Trascina sensori ed operatori nello spazio blu per scegliere come aggregarli"}
                    </label>
                    {this.props.sensors.map(item => {
                        return (
                            <DraggableSensor key={item.get("_id")} sensor={item} />
                        );
                    })}
                    <DraggableOperator type="add" />
                    <DraggableOperator type="minus" />
                    <DraggableOperator type="delete" />
                    <DraggableOperator type="divide" />
                </Col>
            </div>
        );
    }
});

// module.exports = DragDropContext(TouchBackend({enableMouseEvents: true}))(SensorAggregator);
module.exports = DragDropContext(HTML5Backend)(SensorAggregator);