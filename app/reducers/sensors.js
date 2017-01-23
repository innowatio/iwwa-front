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
    SENSOR_DELETE_SUCCESS,
    SENSOR_UPDATE_SUCCESS
} from "../actions/sensors";

import {Types} from "lib/dnd-utils";
import {formulaToOperator, getRightFormula, getSensorId, getVariableSensorId} from "lib/sensors-utils";
import {addOrRemove, remove} from "./utils";

const defaultState = {
    current: {
        formulaItems: []
    },
    primaryTagsToFilter: [],
    selectedSensors: [],
    sensorsCreated: [],
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
        sensorsCreated: state.sensorsCreated.slice(),
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
    const formulaObj = getRightFormula(sensor);
    if (formulaObj) {
        result.sensors = formulaObj.get("variables").map(v => getVariableSensorId(v)).toArray();
        result.formulaItems = populateFormulaItems(formulaObj);
    }
    return result;
}

function populateFormulaItems (formulaObj) {
    const variables = formulaObj.get("variables");
    const decomposed = decomposeFormula({formula: formulaObj.get("formula")}, variables.toJS());
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
        const v = variables.find(v => v.get("symbol") === el);
        return {
            sensor: v ? getVariableSensorId(v) : el,
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
            newState.workAreaSensors.push(typeof action.payload === "string" ? action.payload : getSensorId(action.payload));
            newState.selectedSensors = [];
            break;
        }
        case FILTER_SENSORS: {
            newState.primaryTagsToFilter = action.payload.primaryTagsToFilter;
            newState.tagsToFilter = action.payload.tagsToFilter;
            newState.wordsToFilter = action.payload.wordsToFilter;
            break;
        }
        case GET_FORMULA_ITEMS: {
            const result = parseSensorFormula(state.selectedSensors[0]);
            newState.current.formulaItems = result.formulaItems;
            newState.workAreaSensors = result.sensors;
            break;
        }
        case REMOVE_ITEM_FROM_FORMULA: {
            newState.current.formulaItems.splice(action.payload, 1);
            break;
        }
        case REMOVE_SENSOR_FROM_WORK_AREA: {
            newState.workAreaSensors.splice(newState.workAreaSensors.indexOf(action.payload), 1);
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
            newState.selectedSensors = [];
            newState.workAreaSensors = [];
            newState.primaryTagsToFilter = [];
            newState.tagsToFilter = [];
            newState.wordsToFilter = [];
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
            newState.sensorsCreated.push(action.payload.id);
            break;
        }
        case SENSOR_DELETE_SUCCESS: {
            newState.selectedSensors = removeFromSelected(newState.selectedSensors, action.payload);
            break;
        }
        case SENSOR_UPDATE_SUCCESS: {
            newState.selectedSensors = [];
            break;
        }
        case "ASSIGNING_SENSORS_TO_USERS": {
            newState.sensorsCreated = [];
            break;
        }
    }
    return newState;
}
