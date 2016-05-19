import {DragDropContext} from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
// import {default as TouchBackend} from "react-dnd-touch-backend";

export const Types = {
    NUMBER: "number",
    OPERATOR: "operator",
    SENSOR: "sensor",
    SENSOR_ROW: "sensor-row"
};

export function getDragDropContext (ReactClass) {
    // module.exports = DragDropContext(TouchBackend({enableMouseEvents: true}))(SensorAggregator);
    return DragDropContext(HTML5Backend)(ReactClass);
}
