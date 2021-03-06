import Immutable from "immutable";
import R from "ramda";
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

export const sensorOptions = {
    unitOfMeasurement: [
        {value: "#", label: "#"},
        {value: "%", label: "%"},
        {value: "%RH", label: "%RH"},
        {value: "€", label: "€"},
        {value: "€/kSm3", label: "€/kSm³"},
        {value: "€/kWh", label: "€/kWh"},
        {value: "€/MWh", label: "€/MWh"},
        {value: "€/Sm3", label: "€/Sm³"},
        {value: "°C", label: "°C"},
        {value: "°F", label: "°F"},
        {value: "micg", label: "µg"},
        {value: "A", label: "A"},
        {value: "atm", label: "atm"},
        {value: "bar", label: "bar"},
        {value: "barg", label: "barg"},
        {value: "Barg", label: "barg"},
        {value: "Binary", label: "Binary"},
        {value: "BTU", label: "BTU"},
        {value: "cal", label: "cal"},
        {value: "cm2", label: "cm²"},
        {value: "db", label: "dB"},
        {value: "g", label: "g"},
        {value: "gH20/kgAir", label: "gH20/kgAir"},
        {value: "GW", label: "GW"},
        {value: "GWh", label: "GWh"},
        {value: "h", label: "h"},
        {value: "hours", label: "hours"},
        {value: "hr", label: "hr"},
        {value: "hPa", label: "hPa"},
        {value: "Hz", label: "Hz"},
        {value: "J", label: "J"},
        {value: "K", label: "K"},
        {value: "kcal", label: "kcal"},
        {value: "kg", label: "kg"},
        {value: "kg/m3", label: "kg/m³"},
        {value: "kg/s", label: "kg/s"},
        {value: "kh", label: "kh"},
        {value: "KHz", label: "KHz"},
        {value: "KJ", label: "KJ"},
        {value: "kJ/Kg", label: "kJ/Kg"},
        {value: "km/h", label: "km/h"},
        {value: "km2", label: "km²"},
        {value: "kSm3", label: "kSm³"},
        {value: "kV", label: "kV"},
        {value: "kVarh", label: "kVarh"},
        {value: "kW", label: "kW"},
        {value: "kWh", label: "kWh"},
        {value: "l", label: "l"},
        {value: "l/h", label: "l/h"},
        {value: "l/s", label: "l/s"},
        {value: "lm", label: "lm"},
        {value: "Lt", label: "Lt"},
        {value: "lux", label: "lux"},
        {value: "lx", label: "lx"},
        {value: "m/s", label: "m/s"},
        {value: "m/s2", label: "m/s²"},
        {value: "m2", label: "m²"},
        {value: "m3", label: "m³"},
        {value: "m3/h", label: "m³/h"},
        {value: "mbar", label: "mbar"},
        {value: "mg", label: "mg"},
        {value: "mg/Nm3", label: "mg/Nm³"},
        {value: "MHz", label: "MHz"},
        {value: "min", label: "min"},
        {value: "mm2", label: "mm²"},
        {value: "mv", label: "mV"},
        {value: "MW", label: "MW"},
        {value: "MWh", label: "MWh"},
        {value: "Nm3", label: "Nm³"},
        {value: "ora", label: "ora"},
        {value: "Pa", label: "Pa"},
        {value: "ppm", label: "ppm"},
        {value: "PPM", label: "PPM"},
        {value: "Psi", label: "Psi"},
        {value: "rpm", label: "rpm"},
        {value: "s", label: "s"},
        {value: "sec", label: "sec"},
        {value: "Sm3", label: "Sm³"},
        {value: "Sm3/h", label: "Sm³/h"},
        {value: "ton", label: "ton"},
        {value: "Torr", label: "Torr"},
        {value: "V", label: "V"},
        {value: "W", label: "W"},
        {value: "Wh", label: "Wh"}
    ],
    aggregationType: [
        {value: "average", label: "Media dei valori"},
        {value: "sum", label: "Somma dei valori"},
        {value: "newest", label: "Ultimo valore"}
    ]
};

export function getAggregationFunction (aggregationType) {
    switch (aggregationType) {
        case "newest":
            return (values) => {
                if (values && values.length > 0) {
                    return values[values.length - 1];
                }
                return null;
            };
        case "sum":
            return "sum";
        default:
            return "average";
    }
}

export function getUnitOfMeasurementLabel (val) {
    const foundedUnit = R.find(R.propEq("value", val))(sensorOptions.unitOfMeasurement);
    return foundedUnit ? foundedUnit.label : val;
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

export function getVariableSensorId (variable) {
    return variable.get("sensorId") + (variable.get("measurementType") ? "-" + variable.get("measurementType") : "");
}

export function getReadableSensorFormula (sensor) {
    const formulaObj = getRightFormula(sensor);
    if (formulaObj) {
        const variables = formulaObj.get("variables");
        const decomposed = f.decomposeFormula({formula: formulaObj.get("formula")}, variables.toJS());
        return R.join("", R.map(el => {
            if (formulaToOperator[el] || !isNaN(el)) {
                return el;
            } else {
                const v = variables.find(v => v.get("symbol") === el);
                return v ? getVariableSensorId(v) : el;
            }
        }, decomposed));
    }
    return null;
}

export function isValidFormula (formulaObj) {
    const formula = formulaObj.get("formula");
    let isValid = true;
    formulaObj.get("variables").forEach(v => {
        isValid = isValid && formula.indexOf(v.symbol) >= 0;
    });
    return isValid;
}

export function getRightFormula (sensor) {
    const sensorFormulas = sensor.get("formulas");
    if (!R.isNil(sensorFormulas) && sensorFormulas.size > 0) {
        return sensor.get("measurementType") ? sensorFormulas.find(f => f.get("measurementType") === sensor.get("measurementType")) : sensorFormulas.first();
    }
    return null;
}

export function extractSensorsFromFormula (sensor, allSensors, extractedSensors = []) {
    if (sensor) {
        const formulaObj = getRightFormula(sensor);
        if (formulaObj) {
            formulaObj.get("variables").forEach(v => {
                const sensorId = getVariableSensorId(v);
                extractSensorsFromFormula(allSensors.get(sensorId), allSensors, extractedSensors);
            });
        } else {
            extractedSensors.push(sensor);
        }
    }
    return extractedSensors;
}

export function reduceFormula (sensor, allSensors) {
    if (!sensor.get("formulas") || !sensor.get("formulas").size > 0) {
        return null;
    }
    const result = reduceFormulaData(sensor, allSensors);
    const formula = getRightFormula(sensor);
    return Immutable.Map({
        formula: result.formula,
        variables: result.variables,
        start: formula.get("start"),
        end: formula.get("end"),
        measurementType: formula.get("measurementType")
    });
}

function reduceFormulaData (sensor, allSensors, variables = [], formula, symbol) {
    if (sensor) {
        const formulaObj = getRightFormula(sensor);
        if (formulaObj) {
            formula = formulaObj.get("formula");
            formulaObj.get("variables").forEach(v => {
                const sensorId = getVariableSensorId(v);
                const sensorSymbol = v.get("symbol");
                const reduced = reduceFormulaData(allSensors.get(sensorId), allSensors, variables, formula, sensorSymbol);
                if (reduced.formula) {
                    formula = formulaObj.get("formula").replace(new RegExp(sensorSymbol, "g"), reduced.formula);
                }
            });
        } else {
            formula = null;
            variables.push({
                sensorId: getSensorId(sensor),
                symbol: symbol
            });
        }
    }
    return {
        variables,
        formula
    };
}

export function getAllSensors (sensorsCollection) {
    if (!sensorsCollection) {
        return Immutable.Map();
    }
    return decorateWithMeasurementInfo(sensorsCollection, []);
}

export function getMonitoringSensors (sensorsCollection, viewAll, userSensors) {
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
    const complete = decorateWithMeasurementInfo(sensorsCollection.filter(
        sensor => !sensor.get("isDeleted")
    ), originalToHide);
    return viewAll ? complete : complete.filter(
        sensor => userSensors && userSensors.indexOf(getSensorId(sensor)) >= 0
    );
}

function decorateWithMeasurementInfo (sensors, originalToHide) {
    let items = {};
    sensors.forEach(sensor => {
        const types = sensor.get("measurementTypes");
        if (types && types.size > 0) {
            types.forEach(measurementType => {
                const itemKey = sensor.get("_id") + "-" + measurementType;
                if (originalToHide.indexOf(itemKey) < 0) {
                    items[itemKey] = getSensorInfo(sensor, measurementType);
                }
            });
        } else if (sensor.get("virtual")) {
            const itemKey = sensor.get("_id");
            if (originalToHide.indexOf(itemKey) < 0) {
                items[itemKey] = sensor;
            }
        }
    });
    return Immutable.fromJS(items);
}

function getSensorInfo (sensor, measurementType) {
    const measurementsInfo = sensor.get("measurementsInfo");
    let updatedSensor = sensor.set("measurementType", measurementType);
    if (measurementsInfo && measurementsInfo.size > 0) {
        measurementsInfo.forEach(info => {
            if (info.get("type") === measurementType) {
                info.keySeq().forEach(key => {
                    if (key !== "type") {
                        updatedSensor = updatedSensor.set(key, info.get(key));
                    }
                });
                return false;
            }
        });
    }
    return updatedSensor;
}

export function getSensorsTags (sensors, tagField) {
    return R.compose(
        R.map(tag => {
            return {value: tag, label: tag};
        }),
        R.sortBy(R.compose(R.toLower, R.identity)),
        R.filter(R.identity),
        R.uniq,
        R.flatten,
        R.values,
        R.map(R.prop(tagField))
    )(sensors.toJS());
}
