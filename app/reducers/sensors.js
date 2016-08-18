import {decomposeFormula} from "iwwa-formula-resolver";
import R from "ramda";

import {
    ADD_ITEM_TO_FORMULA,
    ADD_SENSOR_TO_WORK_AREA,
    FILTER_SENSORS,
    GET_FORMULA_ITEMS,
    REMOVE_ITEM_FROM_FORMULA,
    REMOVE_SENSOR_FROM_WORK_AREA,
    RESET_FORMULA_ITEMS,
    RESET_WORK_AREA_SENSORS,
    SELECT_SENSOR,
    SENSOR_CREATION_SUCCESS,
    SENSOR_DELETE_SUCCESS
} from "../actions/sensors";

import {Types} from "lib/dnd-utils";
import {formulaToOperator, getSensorId} from "lib/sensors-utils";
import {addOrRemove, remove} from "./utils";

const defaultState = {
    current: {
        formulaItems: []
    },
    primaryTagsToFilter: [],
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
        primaryTagsToFilter: state.primaryTagsToFilter.slice(),
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
        const formulaObj = sensorFormulas.first();
        const formula = {formula: formulaObj.get("formula")};
        result.sensors = formulaObj.get("variables").toArray();
        const sensors = R.map(v => {
            return {sensorId: v};
        }, result.sensors);
        result.formulaItems = populateFormulaItems(formula, sensors);
    }
    return result;
}

function populateFormulaItems (formula, sensors) {
    let decomposed = decomposeFormula(formula, sensors);
    return R.map(el => {
        if (formulaToOperator[el]) {
            return {
                operator: formulaToOperator[el],
                type: Types.OPERATOR
            };
        }
        if (!isNaN(el)) {
            return {
                number: el,
                type: Types.NUMBER
            };
        }
        return {
            sensor: el,
            type: Types.SENSOR
        };
    }, decomposed);
}

function removeFromSelected (selectedSensors, sensorId) {
    return remove(selectedSensors, it => {
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
            newState.primaryTagsToFilter = action.payload.primaryTagsToFilter;
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
        case RESET_WORK_AREA_SENSORS: {
            newState.workAreaSensors = [];
            break;
        }
        case SELECT_SENSOR: {
            const sensor = action.payload;
            newState.selectedSensors = addOrRemove(sensor, newState.selectedSensors, it => {
                return getSensorId(it) === getSensorId(sensor);
            });
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
