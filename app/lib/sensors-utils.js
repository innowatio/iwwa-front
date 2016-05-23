import Immutable from "immutable";
import R from "ramda";
import {allSensorsDecorator} from "lib/sensors-decorators";

const operatorMapping = {
    "+" : "add",
    "-" : "minus",
    "*" : "multiply",
    "/" : "divide",
    "(" : "open-braket",
    ")" : "close-braket",
    "^" : "circumflex",
    "sqrt" : "square-root",
    "TODO1" : "delta",
    "TODO2" : "add-1y",
    "TODO3" : "add-1m",
    "TODO4" : "add-1w",
    "TODO5" : "add-1d",
    "TODO6" : "add-15m",
    "TODO7" : "remove-1y",
    "TODO8" : "remove-1m",
    "TODO9" : "remove-1w",
    "TODO10" : "remove-1d",
    "TODO11" : "remove-15m"
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

export function getSensorLabel (sensor) {
    return sensor.get("name") ? sensor.get("name") : getSensorId(sensor);
}

export function getSensorId (sensor) {
    return sensor.get("_id") + (sensor.get("measurementType") ? "-" + sensor.get("measurementType") : "");
}

//TODO capire se dev'essere ricorsiva....
export function extractSensorsFromFormula (formula, allSensors) {
    let sensorsIds = [];
    if (formula) {
        formula.split("|").forEach((item) => {
            if (!formulaToOperator[item]) {
                sensorsIds.push(allSensors.get(item));
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
    return decorateWithMeasurementType(sensorsCollection.filter(
        sensor => !sensor.get("isDeleted") &&
        sensor.get("type") !== "pod"
    ), originalToHide);
}

function decorateWithMeasurementType (sensors, originalToHide) {
    let items = {};
    let fakeTheme = {
        colors: {}
    };
    sensors.forEach(sensor => {
        let types = R.filter(R.propEq("type", sensor.get("type")))(allSensorsDecorator(fakeTheme));
        if (types.length > 0) {
            types.forEach(type => {
                let measurementType = type.key;
                let itemKey = sensor.get("_id") + "-" + measurementType;
                if (originalToHide.indexOf(itemKey) < 0) {
                    items[itemKey] = sensor.set("measurementType", measurementType);
                }
            });
        } else {
            items[sensor.get("_id")] = sensor;
        }
    });
    return Immutable.fromJS(items);
}