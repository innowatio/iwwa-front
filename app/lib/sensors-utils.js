import Immutable from "immutable";
import R from "ramda";
import {allSensorsDecorator} from "lib/sensors-decorators";
import * as f from "iwwa-formula-resolver";

const operatorMapping = {
    "+" : "add",
    "-" : "minus",
    "*" : "multiply",
    "/" : "divide",
    "(" : "open-braket",
    ")" : "close-braket",
    "^" : "circumflex",
    "sqrt" : "square-root",
    [f.TOTALIZATOR]: "delta",
    [f.A_1Y_FORWARD_SHIFT]: "add-1y",
    [f.A_1M_FORWARD_SHIFT]: "add-1m",
    [f.A_1W_FORWARD_SHIFT]: "add-1w",
    [f.A_1D_FORWARD_SHIFT]: "add-1d",
    [f.A_15MIN_FORWARD_SHIFT]: "add-15m",
    [f.A_1Y_BACKWARD_SHIFT]: "remove-1y",
    [f.A_1M_BACKWARD_SHIFT]: "remove-1m",
    [f.A_1W_BACKWARD_SHIFT]: "remove-1w",
    [f.A_1D_BACKWARD_SHIFT]: "remove-1d",
    [f.A_15MIN_BACKWARD_SHIFT]: "remove-15m"
};

export const potentialUnitsOfMeasurement = [
    {value: "#", label: "#"},
    {value: "%", label: "%"},
    {value: "€", label: "€"},
    {value: "€/kSm³", label: "€/kSm³"},
    {value: "€/kWh", label: "€/kWh"},
    {value: "€/MWh", label: "€/MWh"},
    {value: "€/Sm³", label: "€/Sm³"},
    {value: "°C", label: "°C"},
    {value: "°F", label: "°F"},
    {value: "µg", label: "µg"},
    {value: "A", label: "A"},
    {value: "atm", label: "atm"},
    {value: "bar", label: "bar"},
    {value: "barg", label: "barg"},
    {value: "BTU", label: "BTU"},
    {value: "cal", label: "cal"},
    {value: "cm²", label: "cm²"},
    {value: "g", label: "g"},
    {value: "GW", label: "GW"},
    {value: "GWh", label: "GWh"},
    {value: "hPa", label: "hPa"},
    {value: "Hz", label: "Hz"},
    {value: "J", label: "J"},
    {value: "K", label: "K"},
    {value: "kcal", label: "kcal"},
    {value: "kg", label: "kg"},
    {value: "kg/m³", label: "kg/m³"},
    {value: "kg/s", label: "kg/s"},
    {value: "KHz", label: "KHz"},
    {value: "KJ", label: "KJ"},
    {value: "km/h", label: "km/h"},
    {value: "km²", label: "km²"},
    {value: "kSm³", label: "kSm³"},
    {value: "kV", label: "kV"},
    {value: "kW", label: "kW"},
    {value: "kWh", label: "kWh"},
    {value: "l", label: "l"},
    {value: "l/h", label: "l/h"},
    {value: "l/s", label: "l/s"},
    {value: "lm", label: "lm"},
    {value: "lx", label: "lx"},
    {value: "m/s", label: "m/s"},
    {value: "m/s2", label: "m/s2"},
    {value: "m²", label: "m²"},
    {value: "m³", label: "m³"},
    {value: "m³/h", label: "m³/h"},
    {value: "mbar", label: "mbar"},
    {value: "mg", label: "mg"},
    {value: "mg/Nm³", label: "mg/Nm³"},
    {value: "MHz", label: "MHz"},
    {value: "min", label: "min"},
    {value: "mm²", label: "mm²"},
    {value: "MW", label: "MW"},
    {value: "MWh", label: "MWh"},
    {value: "Nm³", label: "Nm³"},
    {value: "ora", label: "ora"},
    {value: "Pa", label: "Pa"},
    {value: "ppm", label: "ppm"},
    {value: "Psi", label: "Psi"},
    {value: "s", label: "s"},
    {value: "Sm³", label: "Sm³"},
    {value: "Sm³/h", label: "Sm³/h"},
    {value: "ton", label: "ton"},
    {value: "Torr", label: "Torr"},
    {value: "V", label: "V"},
    {value: "W", label: "W"},
    {value: "Wh", label: "Wh"}
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
    let sensors = [];
    if (formula) {
        formula.get("variables").forEach(item => {
            sensors.push(allSensors.get(item));
        });
    }
    return sensors;
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