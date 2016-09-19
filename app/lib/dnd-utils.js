import {DragDropContext} from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
// import {default as TouchBackend} from "react-dnd-touch-backend";

export const Types = {
    NUMBER: "number",
    OPERATOR: "operator",
    ROLE: "role",
    SENSOR: "sensor",
    SENSOR_ROW: "sensor-row",
    USER_ROW: "user-row"
};

export function getDragDropContext (ReactClass) {
    // module.exports = DragDropContext(TouchBackend({enableMouseEvents: true}))(SensorAggregator);
    return DragDropContext(HTML5Backend)(ReactClass);
}
