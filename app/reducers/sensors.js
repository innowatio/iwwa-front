import R from "ramda";

import {
    ADD_ITEM_TO_FORMULA,
    ADD_SENSOR_TO_WORK_AREA,
    FILTER_SENSORS,
    GET_FORMULA_ITEMS,
    REMOVE_ITEM_FROM_FORMULA,
    REMOVE_SENSOR_FROM_WORK_AREA,
    RESET_FORMULA_ITEMS,
    SELECT_SENSOR,
    SENSOR_CREATION_SUCCESS,
    SENSOR_DELETE_SUCCESS
} from "../actions/sensors";

import {formulaToOperator, getSensorId} from "lib/sensors-utils";

let defaultState = {
    current: {
        formulaItems: []
    },
    selectedSensors: [],
    tagsToFilter: [],
    wordsToFilter: [],
    workAreaSensors: []
};

function cloneState (state) {
    return {
        current: {
            formulaItems: state.current.formulaItems.slice()
        },
        selectedSensors: state.selectedSensors.slice(),
        tagsToFilter: state.tagsToFilter.slice(),
        wordsToFilter: state.wordsToFilter.slice(),
        workAreaSensors: state.workAreaSensors.slice()
    };
}

function parseSensorFormula (sensor) {
    let result = {
        formulaItems: [],
        sensors: []
    };
    let sensorFormulas = sensor.get("formulas");
    if (!R.isNil(sensorFormulas) && sensorFormulas.size == 1) {
        let formula = sensorFormulas.first();
        result.formulaItems = populateFormulaItems(formula.get("formula"), formula.get("variables"), []);
        result.sensors = formula.get("variables").toArray();
    }
    return result;
}

function populateFormulaItems (formula, variables, formulaItems) {
    variables.forEach(sensor => {
        if (formula.indexOf(sensor) == 0) {
            formulaItems.push({sensor: sensor, type: "sensor"});
            populateFormulaItems(formula.replace(sensor, ""), variables, formulaItems);
        }
    });
    R.keys(formulaToOperator).forEach(key => {
        if (formula.indexOf(key) == 0) {
            formulaItems.push({operator: formulaToOperator[key], type: "operator"});
            populateFormulaItems(formula.replace(key, ""), variables, formulaItems);
        }
    });
    return formulaItems;
}


function removeFromSelected (selectedSensors, sensorId) {
    return selectedSensors.filter(it => {
        return getSensorId(it) !== sensorId;
    });
}

export function sensors (state = defaultState, action) {
    var newState = cloneState(state);
    switch (action.type) {
        case ADD_ITEM_TO_FORMULA: {
            newState.current.formulaItems.push(action.payload);
            break;
        }
        case ADD_SENSOR_TO_WORK_AREA: {
            newState.workAreaSensors.push(getSensorId(action.payload));
            break;
        }
        case FILTER_SENSORS: {
            newState.tagsToFilter = action.payload.tagsToFilter;
            newState.wordsToFilter = action.payload.wordsToFilter;
            break;
        }
        case GET_FORMULA_ITEMS: {
            let result = parseSensorFormula(state.selectedSensors[0]);
            newState.current.formulaItems = result.formulaItems;
            newState.workAreaSensors = result.sensors;
            break;
        }
        case REMOVE_ITEM_FROM_FORMULA: {
            newState.current.formulaItems.splice(action.payload, 1);
            break;
        }
        case REMOVE_SENSOR_FROM_WORK_AREA: {
            newState.workAreaSensors.splice(action.payload, 1);
            break;
        }
        case RESET_FORMULA_ITEMS: {
            newState.current.formulaItems = [];
            if (action.payload) {
                newState.workAreaSensors = [];
            }
            break;
        }
        case SELECT_SENSOR: {
            let sensor = action.payload;
            if (newState.selectedSensors.find((it) => {
                return getSensorId(it) === getSensorId(sensor);
            })) {
                newState.selectedSensors = removeFromSelected(newState.selectedSensors, getSensorId(sensor));
            } else {
                newState.selectedSensors.push(sensor);
            }
            break;
        }
        case SENSOR_CREATION_SUCCESS: {
            newState.selectedSensors = removeFromSelected(newState.selectedSensors, action.payload.parentSensorId);
            break;
        }
        case SENSOR_DELETE_SUCCESS: {
            newState.selectedSensors = removeFromSelected(newState.selectedSensors, action.payload);
            break;
        }
    }
    return newState;
}
