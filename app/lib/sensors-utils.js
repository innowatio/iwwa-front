import Immutable from "immutable";
import R from "ramda";

const operatorMapping = {
    "+" : "add",
    "-" : "minus",
    "x" : "multiply",
    "/" : "divide"
};

export const potentialUnitsOfMeasurement = [
    {value: "cls", label: "Celsius"},
    {value: "far", label: "Fahrenheit"},
    {value: "wtt", label: "Watt"}
];

export function getUnitOfMeasurementLabel (val) {
    return R.find(R.propEq("value", val))(potentialUnitsOfMeasurement).label;
}

function swap (json) {
    var ret = {};
    for (var key in json) {
        ret[json[key]] = key;
    }
    return ret;
}

export const formulaToOperator = operatorMapping;
export const operatorToFormula = swap(operatorMapping);

export function findSensor (sensors, sensorId) {
    return sensors.get(sensorId);
}

//TODO capire se dev'essere ricorsiva....
export function extractSensorsIdsFromFormula (formula) {
    let sensorsIds = [];
    if (formula) {
        formula.split("|").forEach((item) => {
            if (!formulaToOperator[item]) {
                sensorsIds.push(item);
            }
        });
    }
    return sensorsIds;
}

export function getAllSensors (sensorsCollection) {
    if (!sensorsCollection) {
        return Immutable.Map();
    }
    let originalToHide = [];
    sensorsCollection.forEach(sensor => {
        let parentId = sensor.get("parentSensorId");
        if (!sensor.get("isDeleted") && parentId) {
            originalToHide.push(parentId);
        }
    });
    return sensorsCollection.filter(
        sensor => !sensor.get("isDeleted") &&
        originalToHide.indexOf(sensor.get("_id")) < 0 &&
        sensor.get("type") !== "pod"
    );
}